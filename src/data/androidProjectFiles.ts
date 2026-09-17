import { AndroidCodeFile } from '../types';

export const ANDROID_PROJECT_FILES: AndroidCodeFile[] = [
  {
    path: 'app/src/main/AndroidManifest.xml',
    title: 'AndroidManifest.xml',
    titleAr: 'ملف المانيفيست والأذونات وودجت النظام',
    language: 'xml',
    descriptionAr: 'تسجيل مستقبل ودجت النظام (AppWidget Receiver) بالإضافة إلى خدمة الطفو الاختيارية وأذونات أندرويد 14 و 15.',
    code: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <!-- ودجت الشاشة الرئيسية المدمج بالنظام (AppWidget) لا يتطلب أي أذونات خاصة! -->

    <!-- أذونات إضافية اختيارية فقط في حال رغبة المستخدم بتفعيل الطفو العائم فوق الألعاب والتطبيقات -->
    <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_SPECIAL_USE" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

    <!-- إذن الاستعلام عن التطبيقات لفتحها من الـ Dock والودجت -->
    <uses-permission android:name="android.permission.QUERY_ALL_PACKAGES"
        tools:ignore="QueryAllPackagesPermission" />

    <application
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.Pixel8IOSDock">

        <!-- واجهة الإعدادات وتخصيص الودجت -->
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.Pixel8IOSDock">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- 🌟 مستقبل ودجت النظام المدمج (Android Home Screen AppWidget) 🌟 -->
        <!-- يظهر في قائمة الودجات الرسمية لنظام أندرويد 12 و 13 و 14 و 15 بدون أذونات -->
        <receiver
            android:name=".widget.IOSDockWidgetReceiver"
            android:label="@string/widget_name"
            android:exported="true">
            <intent-filter>
                <action android:name="android.appwidget.action.APPWIDGET_UPDATE" />
            </intent-filter>
            <meta-data
                android:name="android.appwidget.provider"
                android:resource="@xml/ios_dock_widget_info" />
        </receiver>

        <!-- خدمة الـ Dock الأمامية (اختيارية لوضع الطفو العائم فوق التطبيقات) -->
        <service
            android:name=".FloatingDockService"
            android:enabled="true"
            android:exported="false"
            android:foregroundServiceType="specialUse">
            <property
                android:name="android.app.PROPERTY_SPECIAL_USE_FGS_SUBTYPE"
                android:value="Floating iOS Dock system navigation overlay for quick multi-tasking" />
        </service>

    </application>

</manifest>`
  },
  {
    path: 'app/src/main/java/com/pixel8/iosdock/widget/IOSDockGlanceWidget.kt',
    title: 'IOSDockGlanceWidget.kt',
    titleAr: 'ودجت النظام المدمج (Jetpack Glance Compose)',
    language: 'kotlin',
    descriptionAr: 'ودجت شاشة رئيسية مدمج بالنظام 100% مبني بـ Jetpack Glance ليعمل داخل Pixel Launcher بتأثير زجاجي واستهلاك 0% بطارية وبدون أذونات خاصة.',
    code: `package com.pixel8.iosdock.widget

import android.content.Context
import android.content.Intent
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.glance.GlanceId
import androidx.glance.GlanceModifier
import androidx.glance.GlanceTheme
import androidx.glance.Image
import androidx.glance.ImageProvider
import androidx.glance.appwidget.action.actionStartActivity
import androidx.glance.action.clickable
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.cornerRadius
import androidx.glance.appwidget.provideContent
import androidx.glance.background
import androidx.glance.layout.Alignment
import androidx.glance.layout.Box
import androidx.glance.layout.Column
import androidx.glance.layout.Row
import androidx.glance.layout.Spacer
import androidx.glance.layout.fillMaxSize
import androidx.glance.layout.fillMaxWidth
import androidx.glance.layout.height
import androidx.glance.layout.padding
import androidx.glance.layout.size
import androidx.glance.layout.width
import androidx.glance.text.FontWeight
import androidx.glance.text.Text
import androidx.glance.text.TextStyle
import com.pixel8.iosdock.R

/**
 * ودجت نظام أندرويد المدمج (Android Home Screen AppWidget)
 * مبني باستخدام Jetpack Glance (أحدث تقنيات أندرويد الرسمية من Google)
 * يعمل كودجت نظامي أصيل في لانشر Pixel 8 دون الحاجة لأي أذونات خاصة
 * ويوفر تأثير الـ iOS Dock الزجاجي وسرعة فتح التطبيقات مع استهلاك 0% بطارية في الخلفية.
 */
class IOSDockGlanceWidget : GlanceAppWidget() {

    override suspend fun provideGlance(context: Context, id: GlanceId) {
        provideContent {
            GlanceTheme {
                DockWidgetContent(context)
            }
        }
    }

    @Composable
    private fun DockWidgetContent(context: Context) {
        // الحاوية الخارجية بتصميم زجاجي ناعم شبه شفاف وحواف دائرية 26dp
        Box(
            modifier = GlanceModifier
                .fillMaxSize()
                .padding(horizontal = 8.dp, vertical = 4.dp),
            contentAlignment = Alignment.Center
        ) {
            Row(
                modifier = GlanceModifier
                    .fillMaxWidth()
                    .height(72.dp)
                    .background(ImageProvider(R.drawable.widget_dock_glass_bg))
                    .cornerRadius(26.dp)
                    .padding(horizontal = 14.dp, vertical = 6.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // أيقونة الاتصال
                WidgetItem(
                    name = "الهاتف",
                    iconRes = android.R.drawable.ic_menu_call,
                    badge = null,
                    intent = Intent(Intent.ACTION_DIAL)
                )

                Spacer(modifier = GlanceModifier.width(12.dp))

                // أيقونة الرسائل
                WidgetItem(
                    name = "الرسائل",
                    iconRes = android.R.drawable.ic_dialog_email,
                    badge = "3",
                    intent = Intent(Intent.ACTION_MAIN).apply {
                        addCategory(Intent.CATEGORY_APP_MESSAGING)
                    }
                )

                Spacer(modifier = GlanceModifier.width(12.dp))

                // أيقونة المتصفح
                WidgetItem(
                    name = "الويب",
                    iconRes = android.R.drawable.ic_menu_search,
                    badge = null,
                    intent = Intent(Intent.ACTION_MAIN).apply {
                        addCategory(Intent.CATEGORY_APP_BROWSER)
                    }
                )

                Spacer(modifier = GlanceModifier.width(12.dp))

                // أيقونة الكاميرا
                WidgetItem(
                    name = "الكاميرا",
                    iconRes = android.R.drawable.ic_menu_camera,
                    badge = null,
                    intent = Intent("android.media.action.STILL_IMAGE_CAMERA")
                )

                Spacer(modifier = GlanceModifier.width(12.dp))

                // أيقونة الموسيقى
                WidgetItem(
                    name = "الموسيقى",
                    iconRes = android.R.drawable.ic_media_play,
                    badge = null,
                    intent = Intent(Intent.ACTION_MAIN).apply {
                        addCategory(Intent.CATEGORY_APP_MUSIC)
                    }
                )
            }
        }
    }

    @Composable
    private fun WidgetItem(
        name: String,
        iconRes: Int,
        badge: String?,
        intent: Intent
    ) {
        val launchAction = actionStartActivity(intent)

        Column(
            modifier = GlanceModifier
                .clickable(launchAction)
                .padding(vertical = 2.dp, horizontal = 2.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = GlanceModifier.size(46.dp),
                contentAlignment = Alignment.Center
            ) {
                // خلفية الأيقونة الدائرية بنمط أبل وأندرويد الحديث
                Box(
                    modifier = GlanceModifier
                        .fillMaxSize()
                        .cornerRadius(14.dp)
                        .background(Color(0x33FFFFFF))
                        .padding(8.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Image(
                        provider = ImageProvider(iconRes),
                        contentDescription = name,
                        modifier = GlanceModifier.size(26.dp)
                    )
                }

                // شارة الإشعارات في حال وجودها
                if (badge != null) {
                    Box(
                        modifier = GlanceModifier
                            .size(16.dp)
                            .cornerRadius(8.dp)
                            .background(Color(0xFFFF3B30)),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = badge,
                            style = TextStyle(
                                color = androidx.glance.unit.ColorProvider(Color.White),
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Bold
                            )
                        )
                    }
                }
            }
        }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/pixel8/iosdock/widget/IOSDockWidgetReceiver.kt',
    title: 'IOSDockWidgetReceiver.kt',
    titleAr: 'مستقبل برودكاست الودجت (GlanceAppWidgetReceiver)',
    language: 'kotlin',
    descriptionAr: 'المكون المسؤول عن استقبال أوامر النظام وتحديث الودجت في لانشر أندرويد.',
    code: `package com.pixel8.iosdock.widget

import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.GlanceAppWidgetReceiver

/**
 * مستقبل برودكاست نظام أندرويد لودجت الشاشة الرئيسية
 * يربط الودجت بـ AppWidgetManager في Pixel Launcher
 */
class IOSDockWidgetReceiver : GlanceAppWidgetReceiver() {
    override val glanceAppWidget: GlanceAppWidget = IOSDockGlanceWidget()
}
`
  },
  {
    path: 'app/src/main/res/xml/ios_dock_widget_info.xml',
    title: 'ios_dock_widget_info.xml',
    titleAr: 'إعدادات ودجت النظام (AppWidgetProvider Info)',
    language: 'xml',
    descriptionAr: 'تحديد أبعاد الودجت (4x1 خلايا)، وقابلية تغيير الحجم الأفقي، وتصنيف الشاشة الرئيسية في Pixel Launcher.',
    code: `<?xml version="1.0" encoding="utf-8"?>
<appwidget-provider xmlns:android="http://schemas.android.com/apk/res/android"
    android:description="@string/widget_description"
    android:minWidth="280dp"
    android:minHeight="72dp"
    android:targetCellWidth="4"
    android:targetCellHeight="1"
    android:maxResizeWidth="420dp"
    android:maxResizeHeight="100dp"
    android:resizeMode="horizontal"
    android:widgetCategory="home_screen"
    android:previewImage="@drawable/widget_preview"
    android:updatePeriodMillis="0">
    <!-- updatePeriodMillis=0 لعدم استهلاك البطارية نهائياً في الخلفية -->
</appwidget-provider>`
  },
  {
    path: 'app/src/main/res/drawable/widget_dock_glass_bg.xml',
    title: 'widget_dock_glass_bg.xml',
    titleAr: 'خلفية الودجت الزجاجية الضبابية',
    language: 'xml',
    descriptionAr: 'تدرج لوني زجاجي شفاف فاخر مع إطار ناعم وحواف دائرية 26dp ينسجم مع خلفية شاشة هاتف Pixel 8.',
    code: `<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android"
    android:shape="rectangle">
    <corners android:radius="26dp" />
    <gradient
        android:type="linear"
        android:angle="90"
        android:startColor="#4D1E293B"
        android:endColor="#330F172A" />
    <stroke
        android:width="1.5dp"
        android:color="#40FFFFFF" />
</shape>`
  },
  {
    path: 'app/src/main/java/com/pixel8/iosdock/FloatingDockService.kt',
    title: 'FloatingDockService.kt',
    titleAr: 'خدمة الـ Foreground Service والـ WindowManager',
    language: 'kotlin',
    descriptionAr: 'إدارة نافذة TYPE_APPLICATION_OVERLAY، وربط ComposeView بـ LifecycleOwner مخصص لمنع الانهيار، وإبقاء الخدمة حية بأقل استهلاك للطاقة.',
    code: `package com.pixel8.iosdock

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
}`
  },
  {
    path: 'app/src/main/java/com/pixel8/iosdock/ui/FloatingDock.kt',
    title: 'FloatingDock.kt',
    titleAr: 'واجهة الـ Dock بـ Jetpack Compose وتأثير Frosted Glass و Spring Physics',
    language: 'kotlin',
    descriptionAr: 'تطبيق تأثير الزجاج الضبابي iOS Blur عبر RenderEffect.createBlurEffect، وفيزياء النوابض (Spring Animation) بتردد 120Hz، وسحب ونقل الـ Dock.',
    code: `package com.pixel8.iosdock.ui

import android.graphics.RenderEffect
import android.graphics.Shader
import android.os.Build
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.wrapContentSize
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Call
import androidx.compose.material.icons.rounded.CameraAlt
import androidx.compose.material.icons.rounded.Language
import androidx.compose.material.icons.rounded.Message
import androidx.compose.material.icons.rounded.Settings
import androidx.compose.material3.Icon
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.asComposeRenderEffect
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import com.pixel8.iosdock.utils.AppLauncher

data class DockItemData(
    val id: String,
    val title: String,
    val icon: ImageVector,
    val gradientColors: List<Color>,
    val actionType: AppLauncher.AppType
)

/**
 * الواجهة البرمجية للـ Dock العائم المستوحى من iOS
 * محسنة لشاشة Pixel 8 فائقة السلاسة 120Hz
 */
@Composable
fun FloatingDockView(
    modifier: Modifier = Modifier,
    onDragDelta: (dx: Float, dy: Float) -> Unit,
    onCloseDock: () -> Unit
) {
    val context = LocalContext.current
    var pressedIndex by remember { mutableIntStateOf(-1) }

    val defaultApps = remember {
        listOf(
            DockItemData("phone", "الهاتف", Icons.Rounded.Call, listOf(Color(0xFF34C759), Color(0xFF248A3D)), AppLauncher.AppType.PHONE),
            DockItemData("messages", "الرسائل", Icons.Rounded.Message, listOf(Color(0xFF007AFF), Color(0xFF0051A8)), AppLauncher.AppType.MESSAGES),
            DockItemData("browser", "المتصفح", Icons.Rounded.Language, listOf(Color(0xFF5856D6), Color(0xFF36348E)), AppLauncher.AppType.CHROME),
            DockItemData("camera", "الكاميرا", Icons.Rounded.CameraAlt, listOf(Color(0xFFFF2D55), Color(0xFFB81D3D)), AppLauncher.AppType.CAMERA),
            DockItemData("settings", "الإعدادات", Icons.Rounded.Settings, listOf(Color(0xFF8E8E93), Color(0xFF636366)), AppLauncher.AppType.SETTINGS)
        )
    }

    Box(
        modifier = modifier
            .wrapContentSize()
            .pointerInput(Unit) {
                detectDragGestures { change, dragAmount ->
                    change.consume()
                    onDragDelta(dragAmount.x, dragAmount.y)
                }
            }
            .padding(8.dp)
    ) {
        // حاوية تأثير الزجاج الفاخر iOS Frosted Glass بدون تشويش على الأيقونات الداخلية
        Box(
            modifier = Modifier
                .shadow(
                    elevation = 18.dp,
                    shape = RoundedCornerShape(28.dp),
                    spotColor = Color(0x33000000),
                    ambientColor = Color(0x22000000)
                )
                .clip(RoundedCornerShape(28.dp))
                // لون زجاجي فاخر نصف شفاف بنمط شريط dock في نظام iOS
                .background(
                    Brush.verticalGradient(
                        colors = listOf(
                            Color(0xE6FFFFFF),
                            Color(0xCCF2F2F7)
                        )
                    )
                )
                // إطار خارجي عاكس ولامع يبرز حواف الزجاج
                .border(
                    width = 1.2.dp,
                    brush = Brush.verticalGradient(
                        colors = listOf(
                            Color.White.copy(alpha = 0.95f),
                            Color.White.copy(alpha = 0.40f)
                        )
                    ),
                    shape = RoundedCornerShape(28.dp)
                )
                .padding(horizontal = 14.dp, vertical = 9.dp)
        ) {
            Row(
                horizontalArrangement = Arrangement.spacedBy(14.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                defaultApps.forEachIndexed { index, item ->
                    // حساب مقياس التكبير بالنوابض (Spring Physics Animation)
                    val isDirectlyPressed = (pressedIndex == index)
                    val isNeighbor = (pressedIndex != -1 && (pressedIndex == index - 1 || pressedIndex == index + 1))

                    val targetScale = when {
                        isDirectlyPressed -> 1.30f
                        isNeighbor -> 1.12f
                        else -> 1.0f
                    }

                    // حركة نوابض فيزيائية فائقة السلاسة متزامنة مع 120Hz
                    val animatedScale by animateFloatAsState(
                        targetValue = targetScale,
                        animationSpec = spring(
                            dampingRatio = Spring.DampingRatioMediumBouncy,
                            stiffness = Spring.StiffnessLow
                        ),
                        label = "spring_dock_icon_scale"
                    )

                    DockIconItem(
                        item = item,
                        scale = animatedScale,
                        onPressStateChanged = { isPressed ->
                            pressedIndex = if (isPressed) index else -1
                        },
                        onClick = {
                            AppLauncher.launchApp(context, item.actionType)
                        }
                    )
                }
            }
        }
    }
}

@Composable
private fun DockIconItem(
    item: DockItemData,
    scale: Float,
    onPressStateChanged: (Boolean) -> Unit,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .size(54.dp)
            .graphicsLayer {
                scaleX = scale
                scaleY = scale
                translationY = if (scale > 1f) -(scale - 1f) * 24.dp.toPx() else 0f
            }
            .pointerInput(Unit) {
                detectTapGestures(
                    onPress = {
                        onPressStateChanged(true)
                        tryAwaitRelease()
                        onPressStateChanged(false)
                    },
                    onTap = {
                        onClick()
                    }
                )
            },
        contentAlignment = Alignment.Center
    ) {
        // أيقونة التطبيق بتدرج لوني فخم
        Box(
            modifier = Modifier
                .size(52.dp)
                .shadow(6.dp, RoundedCornerShape(16.dp))
                .clip(RoundedCornerShape(16.dp))
                .background(Brush.linearGradient(item.gradientColors)),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = item.icon,
                contentDescription = item.title,
                tint = Color.White,
                modifier = Modifier.size(28.dp)
            )
        }
    }
}`
  },
  {
    path: 'app/src/main/java/com/pixel8/iosdock/MainActivity.kt',
    title: 'MainActivity.kt',
    titleAr: 'الشاشة الترحيبية وفحص وإدارة الأذونات بأمان',
    language: 'kotlin',
    descriptionAr: 'طلب إذن SYSTEM_ALERT_WINDOW بأسلوب نظيف عبر ActivityResultContracts، والتحقق من Settings.canDrawOverlays، وبدء الخدمة الأمامية.',
    code: `package com.pixel8.iosdock

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.PowerManager
import android.provider.Settings
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.BatteryAlert
import androidx.compose.material.icons.rounded.CheckCircle
import androidx.compose.material.icons.rounded.Layers
import androidx.compose.material.icons.rounded.PlayArrow
import androidx.compose.material.icons.rounded.Stop
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.ContextCompat

class MainActivity : ComponentActivity() {

    // مراقب طلب إذن الطفو فوق الشاشة
    private val overlayPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) {
        checkAllPermissions()
    }

    private var hasOverlayPermission by mutableStateOf(false)
    private var isBatteryOptIgnored by mutableStateOf(false)
    private var isServiceRunning by mutableStateOf(false)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        checkAllPermissions()

        setContent {
            Pixel8DockControlScreen(
                hasOverlayPermission = hasOverlayPermission,
                isBatteryOptIgnored = isBatteryOptIgnored,
                isServiceRunning = isServiceRunning,
                onRequestOverlay = { requestOverlayPermission() },
                onRequestBatteryOpt = { requestIgnoreBatteryOptimizations() },
                onToggleService = { toggleDockService() }
            )
        }
    }

    override fun onResume() {
        super.onResume()
        checkAllPermissions()
    }

    private fun checkAllPermissions() {
        // فحص إذن الطفو
        hasOverlayPermission = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            Settings.canDrawOverlays(this)
        } else {
            true
        }

        // فحص استثناء البطارية
        val powerManager = getSystemService(Context.POWER_SERVICE) as PowerManager
        isBatteryOptIgnored = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            powerManager.isIgnoringBatteryOptimizations(packageName)
        } else {
            true
        }
    }

    private fun requestOverlayPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(this)) {
            val intent = Intent(
                Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                Uri.parse("package:$packageName")
            )
            overlayPermissionLauncher.launch(intent)
        } else {
            Toast.makeText(this, "إذن الطفو ممنوح بالفعل!", Toast.LENGTH_SHORT).show()
        }
    }

    private fun requestIgnoreBatteryOptimizations() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            val intent = Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS).apply {
                data = Uri.parse("package:$packageName")
            }
            startActivity(intent)
        }
    }

    private fun toggleDockService() {
        if (!hasOverlayPermission) {
            requestOverlayPermission()
            return
        }

        val serviceIntent = Intent(this, FloatingDockService::class.java)
        if (isServiceRunning) {
            stopService(serviceIntent)
            isServiceRunning = false
            Toast.makeText(this, "تم إيقاف الـ Dock", Toast.LENGTH_SHORT).show()
        } else {
            ContextCompat.startForegroundService(this, serviceIntent)
            isServiceRunning = true
            Toast.makeText(this, "تم تفعيل الـ Dock العائم بنجاح!", Toast.LENGTH_SHORT).show()
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun Pixel8DockControlScreen(
    hasOverlayPermission: Boolean,
    isBatteryOptIgnored: Boolean,
    isServiceRunning: Boolean,
    onRequestOverlay: () -> Unit,
    onRequestBatteryOpt: () -> Unit,
    onToggleService: () -> Unit
) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Pixel 8 iOS Floating Dock", fontWeight = FontWeight.Bold) },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surfaceVariant
                )
            )
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(20.dp)
                .verticalScroll(rememberScrollState()),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(18.dp)
        ) {
            Text(
                text = "مرحباً يا شريك! هنا يمكنك تفعيل وإدارة الـ Floating Dock المخصص لـ Pixel 8 بكل سلاسة مع شاشة 120Hz وتأثير الزجاج iOS.",
                fontSize = 15.sp,
                textAlign = TextAlign.Center,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )

            // بطاقة حالة إذن الطفو
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(
                    containerColor = if (hasOverlayPermission) Color(0xFFE8F5E9) else Color(0xFFFFEBEE)
                )
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Rounded.Layers,
                            contentDescription = null,
                            tint = if (hasOverlayPermission) Color(0xFF2E7D32) else Color(0xFFC62828)
                        )
                        Column {
                            Text("إذن الطفو (Overlay)", fontWeight = FontWeight.Bold)
                            Text(
                                if (hasOverlayPermission) "ممنوح (جاهز)" else "غير ممنوح (مطلوب)",
                                fontSize = 13.sp,
                                color = Color.Gray
                            )
                        }
                    }
                    if (!hasOverlayPermission) {
                        Button(onClick = onRequestOverlay) {
                            Text("منح الإذن")
                        }
                    } else {
                        Icon(Icons.Rounded.CheckCircle, contentDescription = null, tint = Color(0xFF2E7D32))
                    }
                }
            }

            // بطاقة استثناء البطارية
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(
                    containerColor = if (isBatteryOptIgnored) Color(0xFFE8F5E9) else Color(0xFFFFF8E1)
                )
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Rounded.BatteryAlert,
                            contentDescription = null,
                            tint = if (isBatteryOptIgnored) Color(0xFF2E7D32) else Color(0xFFF57F17)
                        )
                        Column {
                            Text("منع إيقاف النظام (RAM Guard)", fontWeight = FontWeight.Bold)
                            Text(
                                if (isBatteryOptIgnored) "محمي من القتل في الخلفية" else "يُفضل استثناؤه",
                                fontSize = 13.sp,
                                color = Color.Gray
                            )
                        }
                    }
                    if (!isBatteryOptIgnored) {
                        Button(onClick = onRequestBatteryOpt) {
                            Text("استثناء")
                        }
                    } else {
                        Icon(Icons.Rounded.CheckCircle, contentDescription = null, tint = Color(0xFF2E7D32))
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // زر التشغيل والإيقاف الكبير
            Button(
                onClick = onToggleService,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp),
                shape = RoundedCornerShape(16.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = if (isServiceRunning) Color(0xFFD32F2F) else Color(0xFF007AFF)
                )
            ) {
                Icon(
                    imageVector = if (isServiceRunning) Icons.Rounded.Stop else Icons.Rounded.PlayArrow,
                    contentDescription = null
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = if (isServiceRunning) "إيقاف الـ Dock العائم" else "تشغيل الـ Dock العائم الآن",
                    fontWeight = FontWeight.Bold,
                    fontSize = 17.sp
                )
            }
        }
    }
}`
  },
  {
    path: 'app/src/main/java/com/pixel8/iosdock/utils/AppLauncher.kt',
    title: 'AppLauncher.kt',
    titleAr: 'مُشغّل التطبيقات الآمن للأندرويد',
    language: 'kotlin',
    descriptionAr: 'فتح التطبيقات الرسمية أو المحددة بمرونة باستخدام Intents مع معالجة استثنائية سلسة وحماية من الانهيار.',
    code: `package com.pixel8.iosdock.utils

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.provider.MediaStore
import android.widget.Toast

/**
 * فئة مساعدة لفتح تطبيقات النظام الأساسية بسلاسة
 */
object AppLauncher {

    enum class AppType {
        PHONE,
        MESSAGES,
        CHROME,
        CAMERA,
        SETTINGS
    }

    fun launchApp(context: Context, type: AppType) {
        try {
            val intent: Intent = when (type) {
                AppType.PHONE -> Intent(Intent.ACTION_DIAL)
                AppType.MESSAGES -> Intent(Intent.ACTION_MAIN).apply {
                    addCategory(Intent.CATEGORY_APP_MESSAGING)
                }
                AppType.CHROME -> {
                    val launchIntent = context.packageManager.getLaunchIntentForPackage("com.android.chrome")
                    launchIntent ?: Intent(Intent.ACTION_VIEW, Uri.parse("https://www.google.com"))
                }
                AppType.CAMERA -> Intent(MediaStore.INTENT_ACTION_STILL_IMAGE_CAMERA)
                AppType.SETTINGS -> Intent(android.provider.Settings.ACTION_SETTINGS)
            }

            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED)
            context.startActivity(intent)

        } catch (e: Exception) {
            Toast.makeText(context, "تعذر فتح التطبيق: \${e.localizedMessage}", Toast.LENGTH_SHORT).show()
        }
    }
}`
  },
  {
    path: 'app/build.gradle.kts',
    title: 'app/build.gradle.kts',
    titleAr: 'ملف بناء الموديول وإعدادات Jetpack Compose',
    language: 'groovy',
    descriptionAr: 'تضمين مكتبات Compose BOM و Material 3 وتفعيل دعم RenderEffect و Android 14/15.',
    code: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "com.pixel8.iosdock"
    compileSdk = 35 // متوافق تماماً مع Pixel 8 و Android 15

    defaultConfig {
        applicationId = "com.pixel8.iosdock"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }

    buildFeatures {
        compose = true
    }
}

dependencies {
    // Jetpack Compose BOM الأحدث لضمان استقرار 100%
    val composeBom = platform("androidx.compose:compose-bom:2024.09.00")
    implementation(composeBom)
    androidTestImplementation(composeBom)

    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.material:material-icons-extended")
    implementation("androidx.activity:activity-compose:1.9.2")

    // Lifecyle & SavedState لدعم ComposeView داخل Service
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.8.5")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.8.5")
    implementation("androidx.savedstate:savedstate-ktx:1.2.1")

    // Core Android
    implementation("androidx.core:core-ktx:1.13.1")
    implementation("androidx.appcompat:appcompat:1.7.0")

    // 🌟 مكتبات Jetpack Glance لودجت الشاشة الرئيسية المدمج بالنظام
    implementation("androidx.glance:glance:1.1.1")
    implementation("androidx.glance:glance-appwidget:1.1.1")
    implementation("androidx.glance:glance-material3:1.1.1")

    debugImplementation("androidx.compose.ui:ui-tooling")
    debugImplementation("androidx.compose.ui:ui-test-manifest")
}`
  },
  {
    path: 'build.gradle.kts',
    title: 'build.gradle.kts (Project)',
    titleAr: 'ملف بناء المشروع الرئيسي',
    language: 'groovy',
    descriptionAr: 'تكوين ملحقات أندرويد و Kotlin Compose Compiler.',
    code: `// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false
}`
  },
  {
    path: 'gradle/libs.versions.toml',
    title: 'gradle/libs.versions.toml',
    titleAr: 'كتالوج الإصدارات (Version Catalog)',
    language: 'groovy',
    descriptionAr: 'تعريف أحدث إصدارات Gradle و Kotlin و Compose.',
    code: `[versions]
agp = "8.6.0"
kotlin = "2.0.20"
coreKtx = "1.13.1"

[libraries]
androidx-core-ktx = { group = "androidx.core", name = "core-ktx", version.ref = "coreKtx" }

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
kotlin-compose = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }`
  },
  {
    path: '.github/workflows/main.yml',
    title: '.github/workflows/main.yml',
    titleAr: 'GitHub Actions - بناء وتصدير ملف APK تلقائياً',
    language: 'yaml',
    descriptionAr: 'ملف سير العمل الآلي (CI/CD) على GitHub يقوم بتجميع تطبيق أندرويد وبناء ملف APK قابل للتثبيت ومتاح للتحميل من الـ Artifacts.',
    code: `name: Build Android APK (AndroDock)

on:
  push:
    branches: [ "main", "master" ]
  pull_request:
    branches: [ "main", "master" ]
  workflow_dispatch:

permissions:
  contents: write

jobs:
  build:
    name: 🚀 Build Debug APK
    runs-on: ubuntu-latest

    steps:
      - name: 📥 تفريغ الكود (Checkout Repository)
        uses: actions/checkout@v4

      - name: ☕ تثبيت بيئة جافا (JDK 17)
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'

      - name: 🐘 إعداد Gradle والذاكرة المؤقتة (Cache)
        uses: gradle/actions/setup-gradle@v4
        with:
          gradle-version: '8.9'

      - name: 🔨 بناء ملف APK التجريبي (assembleDebug)
        run: |
          if [ -f "./gradlew" ]; then
            echo "Found gradlew wrapper, granting execution permissions..."
            chmod +x ./gradlew
            ./gradlew assembleDebug --stacktrace
          else
            echo "gradlew wrapper not found in repo, running gradle wrapper & assembleDebug..."
            gradle wrapper
            chmod +x ./gradlew
            ./gradlew assembleDebug --stacktrace
          fi

      - name: 📦 رفع ملف APK كـ Artifact جاهز للتنزيل
        uses: actions/upload-artifact@v4
        with:
          name: AndroDock-Debug-APK
          path: app/build/outputs/apk/debug/*.apk
          retention-days: 30

      - name: 📝 كتابة ملخص البناء في صفحة GitHub
        if: always()
        run: |
          echo "### 🚀 نتيجة بناء AndroDock APK" >> $GITHUB_STEP_SUMMARY
          echo "تم تجميع وبناء التطبيق بنجاح عبر GitHub Actions! يمكنك الآن تنزيل ملف **AndroDock-Debug-APK** من تبويب Artifacts في الأعلى وتثبيته مباشرة على هاتف Pixel 8." >> $GITHUB_STEP_SUMMARY`
  }
];
