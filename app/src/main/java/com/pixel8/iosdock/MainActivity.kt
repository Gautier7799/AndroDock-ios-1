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
}