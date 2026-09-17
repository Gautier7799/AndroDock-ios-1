package com.pixel8.iosdock.utils

import android.content.Context
import android.content.SharedPreferences

/**
 * مدير إعدادات الـ iOS Dock Shelf لحفظ موقع وشفافية وحجم الطبقة الزجاجية
 */
class DockPreferences(context: Context) {
    private val prefs: SharedPreferences = context.getSharedPreferences("pixel8_dock_shelf_prefs", Context.MODE_PRIVATE)

    companion object {
        const val KEY_Y_OFFSET = "key_y_offset"
        const val KEY_X_OFFSET = "key_x_offset"
        const val KEY_WIDTH_DP = "key_width_dp"
        const val KEY_HEIGHT_DP = "key_height_dp"
        const val KEY_CORNER_RADIUS = "key_corner_radius"
        const val KEY_GLASS_OPACITY = "key_glass_opacity"
        const val KEY_IS_LOCKED = "key_is_locked"
        const val KEY_SHOW_ICONS = "key_show_icons"
        const val KEY_SHOW_BADGE = "key_show_badge"
        const val ACTION_PREFS_UPDATED = "com.pixel8.iosdock.PREFS_UPDATED"
    }

    var showIcons: Boolean
        get() = prefs.getBoolean(KEY_SHOW_ICONS, true) // تفعيل الأيقونات الأربعة مثل صورة iOS Launcher
        set(value) = prefs.edit().putBoolean(KEY_SHOW_ICONS, value).apply()

    var showBadge: Boolean
        get() = prefs.getBoolean(KEY_SHOW_BADGE, true) // إظهار شارة الإشعارات الحمراء (مثل رقم 1 على الرسائل)
        set(value) = prefs.edit().putBoolean(KEY_SHOW_BADGE, value).apply()

    var yOffset: Int
        get() = prefs.getInt(KEY_Y_OFFSET, 180) // القيمة الافتراضية المثالية لـ Pixel 8 فوق شريط البحث
        set(value) = prefs.edit().putInt(KEY_Y_OFFSET, value).apply()

    var xOffset: Int
        get() = prefs.getInt(KEY_X_OFFSET, 0)
        set(value) = prefs.edit().putInt(KEY_X_OFFSET, value).apply()

    var widthDp: Int
        get() = prefs.getInt(KEY_WIDTH_DP, 340) // عرض يغطي 4-5 أيقونات على شاشة Pixel 8
        set(value) = prefs.edit().putInt(KEY_WIDTH_DP, value).apply()

    var heightDp: Int
        get() = prefs.getInt(KEY_HEIGHT_DP, 86) // ارتفاع قياسي يحيط بالأيقونات بنعومة
        set(value) = prefs.edit().putInt(KEY_HEIGHT_DP, value).apply()

    var cornerRadius: Int
        get() = prefs.getInt(KEY_CORNER_RADIUS, 28) // انحناء حواف iOS الكلاسيكي
        set(value) = prefs.edit().putInt(KEY_CORNER_RADIUS, value).apply()

    var glassOpacity: Float
        get() = prefs.getFloat(KEY_GLASS_OPACITY, 0.45f) // زجاج نصف شفاف يسمح برؤية الخلفية الأصلية
        set(value) = prefs.edit().putFloat(KEY_GLASS_OPACITY, value).apply()

    var isLocked: Boolean
        get() = prefs.getBoolean(KEY_IS_LOCKED, true) // القفل الافتراضي لتمرير اللمسات فوراً للتطبيقات
        set(value) = prefs.edit().putBoolean(KEY_IS_LOCKED, value).apply()
}
