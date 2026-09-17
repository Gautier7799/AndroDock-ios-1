package com.pixel8.iosdock.utils

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
            Toast.makeText(context, "تعذر فتح التطبيق: ${e.localizedMessage}", Toast.LENGTH_SHORT).show()
        }
    }
}