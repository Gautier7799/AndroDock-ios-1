package com.pixel8.iosdock.ui

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
}