package com.pixel8.iosdock

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
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.BatteryAlert
import androidx.compose.material.icons.rounded.CheckCircle
import androidx.compose.material.icons.rounded.Layers
import androidx.compose.material.icons.rounded.Lock
import androidx.compose.material.icons.rounded.LockOpen
import androidx.compose.material.icons.rounded.PlayArrow
import androidx.compose.material.icons.rounded.RestartAlt
import androidx.compose.material.icons.rounded.Stop
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Slider
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.ContextCompat
import com.pixel8.iosdock.utils.DockPreferences

class MainActivity : ComponentActivity() {

    private lateinit var prefs: DockPreferences
    private var hasOverlayPermission by mutableStateOf(false)
    private var isBatteryOptIgnored by mutableStateOf(false)
    private var isServiceRunning by mutableStateOf(false)

    private val overlayPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) {
        checkAllPermissions()
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        prefs = DockPreferences(this)
        checkAllPermissions()

        setContent {
            Pixel8DockControlScreen(
                hasOverlayPermission = hasOverlayPermission,
                isBatteryOptIgnored = isBatteryOptIgnored,
                isServiceRunning = isServiceRunning,
                prefs = prefs,
                onRequestOverlay = { requestOverlayPermission() },
                onRequestBatteryOpt = { requestIgnoreBatteryOptimizations() },
                onToggleService = { toggleDockService() },
                onPrefsChanged = { notifyServicePrefsChanged() },
                onResetDefaults = {
                    prefs.yOffset = 180
                    prefs.xOffset = 0
                    prefs.widthDp = 340
                    prefs.heightDp = 86
                    prefs.cornerRadius = 28
                    prefs.glassOpacity = 0.45f
                    prefs.isLocked = true
                    notifyServicePrefsChanged()
                    Toast.makeText(this, "تمت استعادة الإعدادات الافتراضية لـ Pixel 8", Toast.LENGTH_SHORT).show()
                }
            )
        }
    }

    override fun onResume() {
        super.onResume()
        checkAllPermissions()
    }

    private fun checkAllPermissions() {
        hasOverlayPermission = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            Settings.canDrawOverlays(this)
        } else {
            true
        }

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
            Toast.makeText(this, "تم إيقاف طبقة الـ Dock", Toast.LENGTH_SHORT).show()
        } else {
            ContextCompat.startForegroundService(this, serviceIntent)
            isServiceRunning = true
            Toast.makeText(this, "تم دمج طبقة زجاج iOS مع الـ Dock الأصلي!", Toast.LENGTH_SHORT).show()
        }
    }

    private fun notifyServicePrefsChanged() {
        val intent = Intent(FloatingDockService.ACTION_UPDATE_PREFS)
        sendBroadcast(intent)
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun Pixel8DockControlScreen(
    hasOverlayPermission: Boolean,
    isBatteryOptIgnored: Boolean,
    isServiceRunning: Boolean,
    prefs: DockPreferences,
    onRequestOverlay: () -> Unit,
    onRequestBatteryOpt: () -> Unit,
    onToggleService: () -> Unit,
    onPrefsChanged: () -> Unit,
    onResetDefaults: () -> Unit
) {
    var yOffset by remember { mutableIntStateOf(prefs.yOffset) }
    var widthDp by remember { mutableIntStateOf(prefs.widthDp) }
    var heightDp by remember { mutableIntStateOf(prefs.heightDp) }
    var cornerRadius by remember { mutableIntStateOf(prefs.cornerRadius) }
    var glassOpacity by remember { mutableFloatStateOf(prefs.glassOpacity) }
    var isLocked by remember { mutableStateOf(prefs.isLocked) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Pixel 8 iOS Glass Dock", fontWeight = FontWeight.Bold) },
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
                .padding(18.dp)
                .verticalScroll(rememberScrollState()),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Text(
                text = "طبقة زجاجية شفافة بنمط iOS تلتصق بالـ Dock الأصلي لأندرويد وتمرر اللمسات مباشرة للتطبيقات بنسبة 100%.",
                fontSize = 14.sp,
                textAlign = TextAlign.Center,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )

            // بطاقات الأذونات
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(
                    containerColor = if (hasOverlayPermission) Color(0xFFE8F5E9) else Color(0xFFFFEBEE)
                )
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(14.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Rounded.Layers,
                            contentDescription = null,
                            tint = if (hasOverlayPermission) Color(0xFF2E7D32) else Color(0xFFC62828)
                        )
                        Column {
                            Text("إذن العرض فوق الشاشة (Overlay)", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                            Text(
                                if (hasOverlayPermission) "ممنوح (جاهز)" else "غير ممنوح (مطلوب)",
                                fontSize = 12.sp,
                                color = Color.Gray
                            )
                        }
                    }
                    if (!hasOverlayPermission) {
                        Button(onClick = onRequestOverlay) { Text("منح") }
                    } else {
                        Icon(Icons.Rounded.CheckCircle, contentDescription = null, tint = Color(0xFF2E7D32))
                    }
                }
            }

            // زر التشغيل والإيقاف الكبير
            Button(
                onClick = onToggleService,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(54.dp),
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
                    text = if (isServiceRunning) "إيقاف طبقة الـ Dock" else "تفعيل طبقة زجاج iOS على الـ Dock",
                    fontWeight = FontWeight.Bold,
                    fontSize = 16.sp
                )
            }

            // بطاقة وضع القفل وتمرير اللمسات
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(
                    containerColor = if (isLocked) Color(0xFFE8F5E9) else Color(0xFFFFF3E0)
                )
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            Icon(
                                imageVector = if (isLocked) Icons.Rounded.Lock else Icons.Rounded.LockOpen,
                                contentDescription = null,
                                tint = if (isLocked) Color(0xFF2E7D32) else Color(0xFFE65100)
                            )
                            Column {
                                Text(
                                    text = if (isLocked) "اللمس ممرر 100% للتطبيقات (مقفول)" else "وضع السحب والمحاذاة باليد",
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 14.sp
                                )
                                Text(
                                    text = if (isLocked) "انقر أيقونات أندرويد الأصلية لتفتح فوراً" else "يمكنك سحب الشريط بأصبعك ووضعه فوق الـ Dock",
                                    fontSize = 12.sp,
                                    color = Color.Gray
                                )
                            }
                        }
                        Button(
                            onClick = {
                                isLocked = !isLocked
                                prefs.isLocked = isLocked
                                onPrefsChanged()
                            },
                            colors = ButtonDefaults.buttonColors(
                                containerColor = if (isLocked) Color(0xFFE65100) else Color(0xFF2E7D32)
                            )
                        ) {
                            Text(if (isLocked) "فك القفل للتحريك" else "قفل وتمرير اللمس")
                        }
                    }
                }
            }

            // لوحة ضبط القياسات والأبعاد بالمليمتر
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f))
            ) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Text("ضبط موضع وحجم زجاج الـ Dock:", fontWeight = FontWeight.Bold, fontSize = 15.sp)

                    // الارتفاع الرأسي عن أسفل الشاشة
                    Column {
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Text("الارتفاع عن الأسفل (Y Offset):", fontSize = 13.sp)
                            Text("${yOffset}px", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                        }
                        Slider(
                            value = yOffset.toFloat(),
                            onValueChange = {
                                yOffset = it.toInt()
                                prefs.yOffset = yOffset
                                onPrefsChanged()
                            },
                            valueRange = 0f..400f
                        )
                    }

                    // العرض
                    Column {
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Text("عرض الشريط (Width):", fontSize = 13.sp)
                            Text("${widthDp}dp", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                        }
                        Slider(
                            value = widthDp.toFloat(),
                            onValueChange = {
                                widthDp = it.toInt()
                                prefs.widthDp = widthDp
                                onPrefsChanged()
                            },
                            valueRange = 260f..400f
                        )
                    }

                    // الارتفاع
                    Column {
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Text("ارتفاع الشريط (Height):", fontSize = 13.sp)
                            Text("${heightDp}dp", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                        }
                        Slider(
                            value = heightDp.toFloat(),
                            onValueChange = {
                                heightDp = it.toInt()
                                prefs.heightDp = heightDp
                                onPrefsChanged()
                            },
                            valueRange = 60f..120f
                        )
                    }

                    // شفافية الزجاج
                    Column {
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Text("شفافية الزجاج (Opacity):", fontSize = 13.sp)
                            Text("${(glassOpacity * 100).toInt()}%", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                        }
                        Slider(
                            value = glassOpacity,
                            onValueChange = {
                                glassOpacity = it
                                prefs.glassOpacity = glassOpacity
                                onPrefsChanged()
                            },
                            valueRange = 0.15f..0.85f
                        )
                    }

                    OutlinedButton(
                        onClick = {
                            onResetDefaults()
                            yOffset = prefs.yOffset
                            widthDp = prefs.widthDp
                            heightDp = prefs.heightDp
                            cornerRadius = prefs.cornerRadius
                            glassOpacity = prefs.glassOpacity
                            isLocked = prefs.isLocked
                        },
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Icon(Icons.Rounded.RestartAlt, contentDescription = null)
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("استعادة الموضع التلقائي لـ Pixel 8")
                    }
                }
            }

            // معاينة شكل زجاج الـ iOS بدون أيقونات
            Text("معاينة مظهر الزجاج الفاخر:", fontWeight = FontWeight.Bold, fontSize = 14.sp)
            Box(
                modifier = Modifier
                    .width(widthDp.dp)
                    .height(heightDp.dp)
                    .shadow(16.dp, RoundedCornerShape(cornerRadius.dp))
                    .clip(RoundedCornerShape(cornerRadius.dp))
                    .background(
                        Brush.verticalGradient(
                            listOf(
                                Color.White.copy(alpha = glassOpacity),
                                Color(0xFFE5E5EA).copy(alpha = glassOpacity * 0.75f)
                            )
                        )
                    )
                    .border(
                        1.2.dp,
                        Brush.verticalGradient(
                            listOf(Color.White.copy(alpha = 0.85f), Color.White.copy(alpha = 0.25f))
                        ),
                        RoundedCornerShape(cornerRadius.dp)
                    ),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "طبقة زجاجية شفافة تلتصق فوق الـ Dock الأصلي",
                    fontSize = 11.sp,
                    color = Color.DarkGray.copy(alpha = 0.6f)
                )
            }
        }
    }
}
