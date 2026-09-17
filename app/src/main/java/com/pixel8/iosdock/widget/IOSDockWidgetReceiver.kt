package com.pixel8.iosdock.widget

import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.GlanceAppWidgetReceiver

/**
 * مستقبل برودكاست نظام أندرويد لودجت الشاشة الرئيسية
 * يربط الودجت بـ AppWidgetManager في Pixel Launcher
 */
class IOSDockWidgetReceiver : GlanceAppWidgetReceiver() {
    override val glanceAppWidget: GlanceAppWidget = IOSDockGlanceWidget()
}
