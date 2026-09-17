package com.pixel8.iosdock

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.graphics.PixelFormat
import android.os.Build
import android.os.Bundle
import android.os.IBinder
import android.view.Gravity
import android.view.WindowManager
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.ui.platform.ComposeView
import androidx.core.app.NotificationCompat
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleOwner
import androidx.lifecycle.LifecycleRegistry
import androidx.lifecycle.ViewModelStore
import androidx.lifecycle.ViewModelStoreOwner
import androidx.lifecycle.setViewTreeLifecycleOwner
import androidx.lifecycle.setViewTreeViewModelStoreOwner
import androidx.savedstate.SavedStateRegistry
import androidx.savedstate.SavedStateRegistryController
import androidx.savedstate.SavedStateRegistryOwner
import androidx.savedstate.setViewTreeSavedStateRegistryOwner
import com.pixel8.iosdock.ui.FloatingDockView
import com.pixel8.iosdock.utils.DockPreferences

/**
 * خدمة طبقة زجاج iOS الشفافة للـ Dock الأصلي (Foreground Service)
 * مصممة خصيصاً لهواتف Pixel 8 بنظام Android 14/15
 * تتيح تمرير اللمسات للتطبيقات الأصلية بنسبة 100% عبر FLAG_NOT_TOUCHABLE
 */
class FloatingDockService : Service() {

    private var windowManager: WindowManager? = null
    private var floatingView: ComposeView? = null
    private lateinit var windowLayoutParams: WindowManager.LayoutParams
    private lateinit var prefs: DockPreferences

    private val isLockedState = mutableStateOf(true)
    private val showIconsState = mutableStateOf(true)
    private val showBadgeState = mutableStateOf(true)
    private val widthDpState = mutableIntStateOf(356)
    private val heightDpState = mutableIntStateOf(92)
    private val cornerRadiusState = mutableIntStateOf(34)
    private val glassOpacityState = mutableFloatStateOf(0.52f)

    // متحكم دورة الحياة للـ ComposeView داخل الـ Service لمنع Exception
    private val serviceLifecycleOwner = CustomServiceLifecycleOwner()

    companion object {
        const val CHANNEL_ID = "pixel8_dock_foreground_channel"
        const val NOTIFICATION_ID = 8008
        const val ACTION_STOP_SERVICE = "ACTION_STOP_SERVICE"
        const val ACTION_UPDATE_PREFS = "com.pixel8.iosdock.ACTION_UPDATE_PREFS"
        const val ACTION_TOGGLE_LOCK = "com.pixel8.iosdock.ACTION_TOGGLE_LOCK"
    }

    private val prefsReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            when (intent?.action) {
                ACTION_UPDATE_PREFS -> refreshFromPrefs()
                ACTION_TOGGLE_LOCK -> {
                    prefs.isLocked = !prefs.isLocked
                    refreshFromPrefs()
                }
            }
        }
    }

    override fun onCreate() {
        super.onCreate()
        prefs = DockPreferences(this)
        serviceLifecycleOwner.onCreate()
        windowManager = getSystemService(Context.WINDOW_SERVICE) as WindowManager
        startDockForegroundService()
        initDockOverlay()

        val filter = IntentFilter().apply {
            addAction(ACTION_UPDATE_PREFS)
            addAction(ACTION_TOGGLE_LOCK)
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            registerReceiver(prefsReceiver, filter, Context.RECEIVER_NOT_EXPORTED)
        } else {
            registerReceiver(prefsReceiver, filter)
        }
    }

    private fun startDockForegroundService() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "iOS Dock Shelf Overlay",
                NotificationManager.IMPORTANCE_MIN
            ).apply {
                description = "الطبقة الزجاجية الشفافة للـ Dock الأصلي"
                setShowBadge(false)
            }
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(channel)
        }

        val openIntent = Intent(this, MainActivity::class.java)
        val pendingIntent = PendingIntent.getActivity(
            this, 0, openIntent,
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )

        val notification: Notification = NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("iOS Glass Dock Shelf نشط")
            .setContentText("طبقة الزجاج الشفافة مدمجة مع الـ Dock الأصلي")
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setContentIntent(pendingIntent)
            .setOngoing(true)
            .setPriority(NotificationCompat.PRIORITY_MIN)
            .setCategory(NotificationCompat.CATEGORY_SERVICE)
            .build()

        startForeground(NOTIFICATION_ID, notification)
    }

    private fun initDockOverlay() {
        val layoutType = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
        } else {
            @Suppress("DEPRECATION")
            WindowManager.LayoutParams.TYPE_PHONE
        }

        readStateFromPrefs()

        var baseFlags = WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or
                WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS or
                WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED

        // إذا كان المستخدم قد اختار فقط الرف الزجاجي الشفاف (بدون أيقونات داخلية) وهو مقفول، نمرر اللمسات للتطبيقات بالأسفل
        if (!showIconsState.value && isLockedState.value) {
            baseFlags = baseFlags or WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE
        }

        windowLayoutParams = WindowManager.LayoutParams(
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.WRAP_CONTENT,
            layoutType,
            baseFlags,
            PixelFormat.TRANSLUCENT
        ).apply {
            gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL
            x = prefs.xOffset
            y = prefs.yOffset
        }

        floatingView = ComposeView(this).apply {
            setViewTreeLifecycleOwner(serviceLifecycleOwner)
            setViewTreeSavedStateRegistryOwner(serviceLifecycleOwner)
            setViewTreeViewModelStoreOwner(serviceLifecycleOwner)

            setContent {
                FloatingDockView(
                    widthDp = widthDpState.intValue,
                    heightDp = heightDpState.intValue,
                    cornerRadius = cornerRadiusState.intValue,
                    glassOpacity = glassOpacityState.floatValue,
                    showIcons = showIconsState.value,
                    showBadge = showBadgeState.value,
                    isLocked = isLockedState.value,
                    onDragDelta = { dx, dy ->
                        windowLayoutParams.x += dx.toInt()
                        windowLayoutParams.y -= dy.toInt()
                        prefs.xOffset = windowLayoutParams.x
                        prefs.yOffset = windowLayoutParams.y
                        windowManager?.updateViewLayout(this@apply, windowLayoutParams)
                    },
                    onLockRequested = {
                        prefs.isLocked = true
                        refreshFromPrefs()
                    }
                )
            }
        }

        windowManager?.addView(floatingView, windowLayoutParams)
    }

    private fun readStateFromPrefs() {
        isLockedState.value = prefs.isLocked
        showIconsState.value = prefs.showIcons
        showBadgeState.value = prefs.showBadge
        widthDpState.intValue = prefs.widthDp
        heightDpState.intValue = prefs.heightDp
        cornerRadiusState.intValue = prefs.cornerRadius
        glassOpacityState.floatValue = prefs.glassOpacity
    }

    fun refreshFromPrefs() {
        readStateFromPrefs()
        if (::windowLayoutParams.isInitialized && floatingView != null) {
            var flags = WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or
                    WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS or
                    WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED

            if (!showIconsState.value && isLockedState.value) {
                flags = flags or WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE
            }

            windowLayoutParams.flags = flags
            windowLayoutParams.x = prefs.xOffset
            windowLayoutParams.y = prefs.yOffset
            windowManager?.updateViewLayout(floatingView, windowLayoutParams)
        }
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        if (intent?.action == ACTION_STOP_SERVICE) {
            stopSelf()
            return START_NOT_STICKY
        }
        refreshFromPrefs()
        return START_STICKY
    }

    override fun onDestroy() {
        super.onDestroy()
        try {
            unregisterReceiver(prefsReceiver)
        } catch (_: Exception) {}
        serviceLifecycleOwner.onDestroy()
        if (floatingView != null) {
            windowManager?.removeView(floatingView)
            floatingView = null
        }
    }

    override fun onBind(intent: Intent?): IBinder? = null
}

/**
 * مالك دورة حياة مخصص للـ Service لتمكين Jetpack Compose من العمل بسلاسة خارج الـ Activity
 */
class CustomServiceLifecycleOwner : LifecycleOwner, SavedStateRegistryOwner, ViewModelStoreOwner {
    private val lifecycleRegistry = LifecycleRegistry(this)
    private val savedStateRegistryController = SavedStateRegistryController.create(this)
    private val localViewModelStore = ViewModelStore()

    override val lifecycle: Lifecycle get() = lifecycleRegistry
    override val savedStateRegistry: SavedStateRegistry get() = savedStateRegistryController.savedStateRegistry
    override val viewModelStore: ViewModelStore get() = localViewModelStore

    fun onCreate() {
        savedStateRegistryController.performRestore(Bundle())
        lifecycleRegistry.handleLifecycleEvent(Lifecycle.Event.ON_CREATE)
        lifecycleRegistry.handleLifecycleEvent(Lifecycle.Event.ON_START)
        lifecycleRegistry.handleLifecycleEvent(Lifecycle.Event.ON_RESUME)
    }

    fun onDestroy() {
        lifecycleRegistry.handleLifecycleEvent(Lifecycle.Event.ON_PAUSE)
        lifecycleRegistry.handleLifecycleEvent(Lifecycle.Event.ON_STOP)
        lifecycleRegistry.handleLifecycleEvent(Lifecycle.Event.ON_DESTROY)
        localViewModelStore.clear()
    }
}
