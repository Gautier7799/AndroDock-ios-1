package com.pixel8.iosdock.ui

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Check
import androidx.compose.material.icons.rounded.DragIndicator
import androidx.compose.material.icons.rounded.Lock
import androidx.compose.material.icons.rounded.LockOpen
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

/**
 * الطبقة الزجاجية الشفافة بنمط iOS Dock Shelf
 * مصممة لتلتصق بالـ Dock الأصلي لنظام أندرويد وتمنحه مظهر زجاج iOS
 * بدون أيقونات مكررة، وبخاصية تمرير اللمسات للتطبيقات الأصلية بنسبة 100%
 */
@Composable
fun FloatingDockView(
    widthDp: Int = 340,
    heightDp: Int = 86,
    cornerRadius: Int = 28,
    glassOpacity: Float = 0.42f,
    isLocked: Boolean = true,
    onDragDelta: (dx: Float, dy: Float) -> Unit,
    onLockRequested: () -> Unit = {}
) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // شريط أدوات الضبط السريع يظهر فقط عندما يكون وضع التعديل مفتوحاً (غير مقفول)
        AnimatedVisibility(
            visible = !isLocked,
            enter = fadeIn(),
            exit = fadeOut()
        ) {
            Row(
                modifier = Modifier
                    .padding(bottom = 8.dp)
                    .shadow(8.dp, RoundedCornerShape(20.dp))
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
                    text = "اسحب لوضعها على الـ Dock الأصلي",
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
                    Text("قفل وتمرير اللمس", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                }
            }
        }

        // الطبقة الزجاجية الشفافة الفاخرة (iOS Dock Shelf)
        Box(
            modifier = Modifier
                .width(widthDp.dp)
                .height(heightDp.dp)
                .shadow(
                    elevation = 16.dp,
                    shape = RoundedCornerShape(cornerRadius.dp),
                    spotColor = Color(0x35000000),
                    ambientColor = Color(0x20000000)
                )
                .clip(RoundedCornerShape(cornerRadius.dp))
                // زجاج iOS الشفاف الذي يسمح برؤية أيقونات Dock أندرويد الأصلية وخلفية الشاشة
                .background(
                    Brush.verticalGradient(
                        colors = listOf(
                            Color.White.copy(alpha = glassOpacity),
                            Color(0xFFE5E5EA).copy(alpha = glassOpacity * 0.75f)
                        )
                    )
                )
                // إطار خارجي أبيض لامع يحاكي انعكاس الضوء على زجاج شريط iOS
                .border(
                    width = 1.2.dp,
                    brush = Brush.verticalGradient(
                        colors = listOf(
                            Color.White.copy(alpha = 0.85f),
                            Color.White.copy(alpha = 0.25f)
                        )
                    ),
                    shape = RoundedCornerShape(cornerRadius.dp)
                )
                // مستشعر السحب فقط في حال كان غير مقفول
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
            // مؤشر خفيف جداً يظهر فقط عند الضبط للمساعدة في المحاذاة
            if (!isLocked) {
                Box(
                    modifier = Modifier
                        .size(width = 36.dp, height = 4.dp)
                        .clip(CircleShape)
                        .background(Color.Black.copy(alpha = 0.2f))
                )
            }
        }
    }
}
