package com.pixel8.iosdock

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.graphics.PixelFormat
import android.os.Build
import android.os.Bundle
import android.os.IBinder
import android.view.Gravity
import android.view.View
import android.view.WindowManager
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

/**
 * خدمة الطفو الأمامية (Foreground Service)
 * مصممة خصيصاً لهواتف Pixel 8 بنظام Android 14/15
 * تستخدم WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
 */
class FloatingDockService : Service() {

    private var windowManager: WindowManager? = null
    private var floatingView: ComposeView? = null
    private lateinit var windowLayoutParams: WindowManager.LayoutParams

    // متحكم دورة الحياة للـ ComposeView داخل الـ Service لمنع Exception
    private val serviceLifecycleOwner = CustomServiceLifecycleOwner()

    companion object {
        const val CHANNEL_ID = "pixel8_dock_foreground_channel"
        const val NOTIFICATION_ID = 8008
        const val ACTION_STOP_SERVICE = "ACTION_STOP_SERVICE"
    }

    override fun onCreate() {
        super.onCreate()
        serviceLifecycleOwner.onCreate()
        windowManager = getSystemService(Context.WINDOW_SERVICE) as WindowManager
        startDockForegroundService()
        initDockOverlay()
    }

    private fun startDockForegroundService() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Pixel 8 Floating Dock",
                NotificationManager.IMPORTANCE_MIN // هادئ جداً بدون إزعاج
            ).apply {
                description = "الـ Dock يطفو بنجاح فوق جميع التطبيقات"
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
            .setContentTitle("Pixel 8 iOS Dock نشط")
            .setContentText("المس الأيقونات للتنقل السريع بين التطبيقات")
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setContentIntent(pendingIntent)
            .setOngoing(true)
            .setPriority(NotificationCompat.PRIORITY_MIN)
            .setCategory(NotificationCompat.CATEGORY_SERVICE)
            .build()

        startForeground(NOTIFICATION_ID, notification)
    }

    private fun initDockOverlay() {
        // إعدادات النافذة العائمة فوق كافة الشاشات
        val layoutType = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
        } else {
            @Suppress("DEPRECATION")
            WindowManager.LayoutParams.TYPE_PHONE
        }

        windowLayoutParams = WindowManager.LayoutParams(
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.WRAP_CONTENT,
            layoutType,
            // علامات تضمن عدم حجب لمسات الشاشة خلف الـ Dock وتسريع العتاد 120Hz
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or
                    WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS or
                    WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED,
            PixelFormat.TRANSLUCENT
        ).apply {
            gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL
            x = 0
            y = 80 // المسافة من أسفل الشاشة لشريط إيماءات Pixel 8
        }

        // إنشاء الـ ComposeView وربط الـ LifecycleOwners لمنع كراش Compose
        floatingView = ComposeView(this).apply {
            setViewTreeLifecycleOwner(serviceLifecycleOwner)
            setViewTreeSavedStateRegistryOwner(serviceLifecycleOwner)
            setViewTreeViewModelStoreOwner(serviceLifecycleOwner)

            setContent {
                FloatingDockView(
                    onDragDelta = { dx, dy ->
                        windowLayoutParams.x += dx.toInt()
                        windowLayoutParams.y -= dy.toInt() // العكس لأن الإحداثيات من الأسفل
                        windowManager?.updateViewLayout(this@apply, windowLayoutParams)
                    },
                    onCloseDock = {
                        stopSelf()
                    }
                )
            }
        }

        windowManager?.addView(floatingView, windowLayoutParams)
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        if (intent?.action == ACTION_STOP_SERVICE) {
            stopSelf()
            return START_NOT_STICKY
        }
        return START_STICKY // يعيد تشغيل الخدمة تلقائياً إذا أُغلقت قسراً
    }

    override fun onDestroy() {
        super.onDestroy()
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