import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Phone,
  MessageCircle,
  Compass,
  Camera,
  Music,
  Settings,
  MoveHorizontal,
  Sparkles,
  Info,
  Check
} from 'lucide-react';
import { DockApp, DockSettings } from '../types';

interface AndroidSystemWidgetProps {
  apps: DockApp[];
  settings: DockSettings;
  onAppLaunch: (app: DockApp) => void;
  onOpenWidgetPicker?: () => void;
}

export const AndroidSystemWidget: React.FC<AndroidSystemWidgetProps> = ({
  apps,
  settings,
  onAppLaunch,
  onOpenWidgetPicker
}) => {
  const [isHoveredOrFocused, setIsHoveredOrFocused] = useState(false);
  const [widgetSize, setWidgetSize] = useState<'4x1' | '5x1'>('5x1');
  const [pressedAppId, setPressedAppId] = useState<string | null>(null);

  const displayedApps = widgetSize === '4x1' ? apps.slice(0, 4) : apps.slice(0, 5);

  const getWidgetBgStyle = () => {
    switch (settings.widgetTheme) {
      case 'material_you':
        return 'bg-gradient-to-r from-cyan-900/60 via-blue-900/50 to-slate-900/70 border-cyan-500/30';
      case 'dark_oled':
        return 'bg-black/85 border-white/10';
      case 'frosted_glass':
      default:
        return 'bg-slate-900/65 backdrop-blur-xl border-white/20';
    }
  };

  return (
    <div className="relative w-full px-2 z-20 my-2">
      {/* System Widget Container */}
      <div
        onMouseEnter={() => setIsHoveredOrFocused(true)}
        onMouseLeave={() => setIsHoveredOrFocused(false)}
        className="relative group"
      >
        {/* Widget Size indicator tag & resize button */}
        <div className="flex items-center justify-between px-2 mb-1">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-[10px] px-2 py-0.5 rounded-full font-mono">
              <Sparkles size={10} className="text-cyan-400" />
              Android AppWidget (Glance) • {widgetSize}
            </span>
          </div>

          <button
            onClick={() => setWidgetSize(prev => (prev === '4x1' ? '5x1' : '4x1'))}
            className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white bg-slate-900/80 border border-white/10 px-2 py-0.5 rounded-full transition-colors"
            title="تغيير أبعاد الودجت في لانشر أندرويد"
          >
            <MoveHorizontal size={11} />
            <span>{widgetSize === '4x1' ? 'تكبير لـ 5x1' : 'تصغير لـ 4x1'}</span>
          </button>
        </div>

        {/* The AppWidget Surface */}
        <div
          className={`w-full rounded-[26px] p-2.5 border shadow-xl transition-all duration-300 ${getWidgetBgStyle()} relative overflow-hidden`}
        >
          {/* Subtle frosted glass gradient line at top */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

          {/* App Icons Row */}
          <div className="flex items-center justify-around gap-1">
            {displayedApps.map((app) => {
              const isPressed = pressedAppId === app.id;

              return (
                <button
                  key={app.id}
                  onClick={() => {
                    setPressedAppId(app.id);
                    setTimeout(() => {
                      setPressedAppId(null);
                      onAppLaunch(app);
                    }, 120);
                  }}
                  className="flex flex-col items-center gap-1 focus:outline-none group/item relative py-1 px-1 rounded-2xl hover:bg-white/5 active:scale-90 transition-transform duration-150"
                >
                  {/* App Icon Tile */}
                  <div
                    className={`relative w-12 h-12 rounded-[16px] bg-gradient-to-tr ${app.gradient} flex items-center justify-center text-white shadow-md border border-white/20 transition-all ${
                      isPressed ? 'scale-90 ring-2 ring-white/50' : 'group-hover/item:scale-105'
                    }`}
                  >
                    {/* Icon mapping */}
                    {app.id === 'phone' && <Phone size={22} className="drop-shadow-sm" />}
                    {app.id === 'messages' && <MessageCircle size={22} className="drop-shadow-sm" />}
                    {app.id === 'chrome' && <Compass size={22} className="drop-shadow-sm" />}
                    {app.id === 'camera' && <Camera size={22} className="drop-shadow-sm" />}
                    {app.id === 'spotify' && <Music size={22} className="drop-shadow-sm" />}
                    {app.id === 'settings' && <Settings size={22} className="drop-shadow-sm" />}

                    {/* Unread badge */}
                    {app.badge && (
                      <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-slate-950 shadow-sm">
                        {app.badge}
                      </span>
                    )}
                  </div>

                  {/* App label if enabled */}
                  {settings.showLabels && (
                    <span className="text-[10px] text-slate-200 font-medium tracking-tight drop-shadow truncate max-w-[52px]">
                      {app.nameAr}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Home Screen AppWidget Helper info banner */}
        <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400 px-2">
          <span className="flex items-center gap-1 text-emerald-400">
            <Check size={11} />
            مدمج في الشاشة الرئيسية (بدون أذونات طفو)
          </span>
          {onOpenWidgetPicker && (
            <button
              onClick={onOpenWidgetPicker}
              className="text-cyan-400 hover:text-cyan-300 underline font-medium"
            >
              قائمة ودجات Pixel Launcher
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
