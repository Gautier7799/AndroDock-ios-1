package com.pixel8.iosdock.widget

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
import androidx.glance.action.actionStartActivity
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
