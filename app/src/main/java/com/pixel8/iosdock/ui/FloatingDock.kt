package com.pixel8.iosdock.ui

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.provider.MediaStore
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Call
import androidx.compose.material.icons.rounded.Check
import androidx.compose.material.icons.rounded.DragIndicator
import androidx.compose.material.icons.rounded.Message
import androidx.compose.material.icons.rounded.PhotoCamera
import androidx.compose.material.icons.rounded.Public
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

/**
 * شريط الـ iOS Dock الفاخر - مطابق تماماً لصورة الـ iOS Launcher:
 * - رف زجاجي عريض مقوس الحواف (34dp)
 * - تدرج زجاجي ضبابي أبيض فخم (Frosted Glass) مع إطار علوي عاكس
 * - 4 أيقونات دائرية على خلفية بيضاء نقية (الهاتف، الرسائل مع شارة حمراء "1"، المتصفح، الكاميرا)
 * - استجابة لمس سلسة (Spring Haptic Animation) وتشغيل التطبيقات الحقيقية
 */
@Composable
fun FloatingDockView(
    widthDp: Int = 356,
    heightDp: Int = 92,
    cornerRadius: Int = 34,
    glassOpacity: Float = 0.52f,
    showIcons: Boolean = true,
    showBadge: Boolean = true,
    isLocked: Boolean = true,
    onDragDelta: (dx: Float, dy: Float) -> Unit,
    onLockRequested: () -> Unit = {}
) {
    val context = LocalContext.current

    Column(
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // شريط أدوات الضبط يظهر فقط عندما يكون وضع التعديل مفتوحاً (غير مقفول)
        AnimatedVisibility(
            visible = !isLocked,
            enter = fadeIn(),
            exit = fadeOut()
        ) {
            Row(
                modifier = Modifier
                    .padding(bottom = 10.dp)
                    .shadow(10.dp, RoundedCornerShape(20.dp))
                    .clip(RoundedCornerShape(20.dp))
                    .background(Color(0xE61C1C1E))
                    .padding(horizontal = 14.dp, vertical = 6.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Rounded.DragIndicator,
                    contentDescription = null,
                    tint = Color(0xFFAAAAAA),
                    modifier = Modifier.size(18.dp)
                )
                Text(
                    text = "اسحب لوضع الـ Dock في المكان المناسب",
                    color = Color.White,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Medium,
                    modifier = Modifier.padding(horizontal = 8.dp)
                )
                Button(
                    onClick = onLockRequested,
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF34C759)),
                    shape = RoundedCornerShape(12.dp),
                    contentPadding = ButtonDefaults.ContentPadding
                ) {
                    Icon(Icons.Rounded.Check, contentDescription = null, modifier = Modifier.size(16.dp))
                    Text("قفل وتثبيت", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                }
            }
        }

        // لوح الـ Dock الزجاجي المستوحى بنسبة 100% من صورة iOS Launcher
        Box(
            modifier = Modifier
                .width(widthDp.dp)
                .height(heightDp.dp)
                .shadow(
                    elevation = 20.dp,
                    shape = RoundedCornerShape(cornerRadius.dp),
                    spotColor = Color(0x4D000000),
                    ambientColor = Color(0x26000000)
                )
                .clip(RoundedCornerShape(cornerRadius.dp))
                // زجاج iOS شبه الشفاف (Frosted Milk Glass)
                .background(
                    Brush.verticalGradient(
                        colors = listOf(
                            Color.White.copy(alpha = glassOpacity),
                            Color(0xFFE5E5EA).copy(alpha = glassOpacity * 0.85f)
                        )
                    )
                )
                // إطار خارجي لامع ناعم
                .border(
                    width = 1.2.dp,
                    brush = Brush.verticalGradient(
                        colors = listOf(
                            Color.White.copy(alpha = 0.90f),
                            Color.White.copy(alpha = 0.35f)
                        )
                    ),
                    shape = RoundedCornerShape(cornerRadius.dp)
                )
                // السحب عند فك القفل فقط
                .then(
                    if (!isLocked) {
                        Modifier.pointerInput(Unit) {
                            detectDragGestures { change, dragAmount ->
                                change.consume()
                                onDragDelta(dragAmount.x, dragAmount.y)
                            }
                        }
                    } else {
                        Modifier
                    }
                ),
            contentAlignment = Alignment.Center
        ) {
            if (showIcons) {
                // صف الأيقونات الأربعة مثل الصورة تماماً
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 14.dp),
                    horizontalArrangement = Arrangement.SpaceEvenly,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // 1. أيقونة الهاتف (Phone)
                    IOSDockCircularItem(
                        icon = Icons.Rounded.Call,
                        iconTint = Color(0xFF007AFF),
                        contentDescription = "الهاتف",
                        onClick = { launchPhone(context) }
                    )

                    // 2. أيقونة الرسائل مع الشارة الحمراء "1" (Messages with Badge)
                    IOSDockCircularItem(
                        icon = Icons.Rounded.Message,
                        iconTint = Color(0xFF007AFF),
                        badgeCount = if (showBadge) 1 else 0,
                        contentDescription = "الرسائل",
                        onClick = { launchMessages(context) }
                    )

                    // 3. أيقونة المتصفح (Chrome / Web)
                    IOSDockChromeItem(
                        contentDescription = "المتصفح",
                        onClick = { launchBrowser(context) }
                    )

                    // 4. أيقونة الكاميرا (Camera)
                    IOSDockCircularItem(
                        icon = Icons.Rounded.PhotoCamera,
                        iconTint = Color(0xFF3A3A3C),
                        contentDescription = "الكاميرا",
                        onClick = { launchCamera(context) }
                    )
                }
            } else {
                // وضع الرف الزجاجي الشفاف فقط (بدون أيقونات داخلية)
                if (!isLocked) {
                    Box(
                        modifier = Modifier
                            .size(width = 42.dp, height = 5.dp)
                            .clip(CircleShape)
                            .background(Color.Black.copy(alpha = 0.25f))
                    )
                }
            }
        }
    }
}

/**
 * عنصر أيقونة دائري على قاعدة بيضاء نقية بنمط iOS مع تأثير ضغط ناعم وشارة إشعارات
 */
@Composable
private fun IOSDockCircularItem(
    icon: ImageVector,
    iconTint: Color,
    badgeCount: Int = 0,
    contentDescription: String,
    onClick: () -> Unit
) {
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()
    val scale by animateFloatAsState(
        targetValue = if (isPressed) 0.88f else 1.0f,
        animationSpec = spring(dampingRatio = 0.6f, stiffness = 400f),
        label = "iconScale"
    )

    Box(
        modifier = Modifier
            .size(58.dp)
            .scale(scale),
        contentAlignment = Alignment.Center
    ) {
        // القرص الأبيض الدائري الفاخر
        Box(
            modifier = Modifier
                .size(54.dp)
                .shadow(6.dp, CircleShape, spotColor = Color(0x33000000))
                .clip(CircleShape)
                .background(Color.White)
                .border(0.8.dp, Color(0x1A000000), CircleShape)
                .clickable(
                    interactionSource = interactionSource,
                    indication = null,
                    onClick = onClick
                ),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = icon,
                contentDescription = contentDescription,
                tint = iconTint,
                modifier = Modifier.size(28.dp)
            )
        }

        // شارة الإشعارات الحمراء مثل صورة الـ iOS Launcher تماماً (رقم 1)
        if (badgeCount > 0) {
            Box(
                modifier = Modifier
                    .align(Alignment.TopEnd)
                    .offset(x = 2.dp, y = (-2).dp)
                    .size(20.dp)
                    .shadow(3.dp, CircleShape)
                    .clip(CircleShape)
                    .background(Color(0xFFFF3B30)) // أحمر iOS الكلاسيكي
                    .border(1.5.dp, Color.White, CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = badgeCount.toString(),
                    color = Color.White,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold
                )
            }
        }
    }
}

/**
 * عنصر Chrome المتطابق مع لقطة الشاشة (حلقة دائرية ملوّنة مع شارة Beta/Web)
 */
@Composable
private fun IOSDockChromeItem(
    contentDescription: String,
    onClick: () -> Unit
) {
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()
    val scale by animateFloatAsState(
        targetValue = if (isPressed) 0.88f else 1.0f,
        animationSpec = spring(dampingRatio = 0.6f, stiffness = 400f),
        label = "chromeScale"
    )

    Box(
        modifier = Modifier
            .size(58.dp)
            .scale(scale),
        contentAlignment = Alignment.Center
    ) {
        Box(
            modifier = Modifier
                .size(54.dp)
                .shadow(6.dp, CircleShape, spotColor = Color(0x33000000))
                .clip(CircleShape)
                .background(Color.White)
                .border(0.8.dp, Color(0x1A000000), CircleShape)
                .clickable(
                    interactionSource = interactionSource,
                    indication = null,
                    onClick = onClick
                ),
            contentAlignment = Alignment.Center
        ) {
            // حلقة Chrome الملونة بنمط أندرويد و iOS
            Box(
                modifier = Modifier
                    .size(36.dp)
                    .clip(CircleShape)
                    .background(
                        Brush.sweepGradient(
                            listOf(
                                Color(0xFFEA4335), // أحمر
                                Color(0xFFFBBC05), // أصفر
                                Color(0xFF34A853), // أخضر
                                Color(0xFF4285F4), // أزرق
                                Color(0xFFEA4335)
                            )
                        )
                    ),
                contentAlignment = Alignment.Center
            ) {
                // النواة الداخلية الزرقاء
                Box(
                    modifier = Modifier
                        .size(16.dp)
                        .clip(CircleShape)
                        .background(Color(0xFF1A73E8))
                        .border(2.dp, Color.White, CircleShape)
                )
            }

            // شريط كلمة "Beta" الصغير مثل الأيقونة في صورة الشريك
            Box(
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .offset(y = (-4).dp)
                    .clip(RoundedCornerShape(4.dp))
                    .background(Color(0xFF1E293B))
                    .padding(horizontal = 4.dp, vertical = 0.5.dp)
            ) {
                Text(
                    text = "Beta",
                    color = Color.White,
                    fontSize = 7.sp,
                    fontWeight = FontWeight.Bold
                )
            }
        }
    }
}

// دالات تشغيل التطبيقات الأصلية بأمان
private fun launchPhone(context: Context) {
    try {
        val intent = Intent(Intent.ACTION_DIAL)
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        context.startActivity(intent)
    } catch (_: Exception) {
        val launch = context.packageManager.getLaunchIntentForPackage("com.google.android.dialer")
        launch?.let { context.startActivity(it) }
    }
}

private fun launchMessages(context: Context) {
    try {
        val intent = Intent(Intent.ACTION_MAIN).apply {
            addCategory(Intent.CATEGORY_APP_MESSAGING)
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        context.startActivity(intent)
    } catch (_: Exception) {
        val launch = context.packageManager.getLaunchIntentForPackage("com.google.android.apps.messaging")
        launch?.let { context.startActivity(it) }
    }
}

private fun launchBrowser(context: Context) {
    try {
        val intent = Intent(Intent.ACTION_VIEW, Uri.parse("https://www.google.com")).apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        context.startActivity(intent)
    } catch (_: Exception) {
        val launch = context.packageManager.getLaunchIntentForPackage("com.android.chrome")
            ?: context.packageManager.getLaunchIntentForPackage("com.chrome.beta")
        launch?.let { context.startActivity(it) }
    }
}

private fun launchCamera(context: Context) {
    try {
        val intent = Intent(MediaStore.INTENT_ACTION_STILL_IMAGE_CAMERA).apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        context.startActivity(intent)
    } catch (_: Exception) {
        val launch = context.packageManager.getLaunchIntentForPackage("com.google.android.GoogleCamera")
        launch?.let { context.startActivity(it) }
    }
}
