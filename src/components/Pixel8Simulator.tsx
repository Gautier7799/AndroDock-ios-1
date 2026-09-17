import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wifi,
  Signal,
  Battery,
  Layers,
  ChevronDown,
  Search,
  Mic,
  Camera,
  RotateCcw,
  Volume2,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Sliders,
  ShieldCheck,
  Check,
  Zap,
  Globe,
  Sparkles,
  LayoutGrid,
  Phone,
  MessageSquare
} from 'lucide-react';
import { DockApp, DockSettings, SimulatedAppType, IntegrationMode } from '../types';
import { FloatingDockOverlay } from './FloatingDockOverlay';
import { AndroidSystemWidget } from './AndroidSystemWidget';
import { NativeSystemTaskbar } from './NativeSystemTaskbar';
import { AndroidWidgetsPickerModal } from './AndroidWidgetsPickerModal';

interface Pixel8SimulatorProps {
  apps: DockApp[];
  settings: DockSettings;
  isServiceRunning: boolean;
  hasPermission: boolean;
  integrationMode: IntegrationMode;
  onSelectIntegrationMode: (mode: IntegrationMode) => void;
  onToggleService: () => void;
  onRequestPermission: () => void;
}

export const Pixel8Simulator: React.FC<Pixel8SimulatorProps> = ({
  apps,
  settings,
  isServiceRunning,
  hasPermission,
  integrationMode,
  onSelectIntegrationMode,
  onToggleService,
  onRequestPermission
}) => {
  const [activeApp, setActiveApp] = useState<SimulatedAppType>('home');
  const [showNotificationShade, setShowNotificationShade] = useState(false);
  const [showWidgetsPicker, setShowWidgetsPicker] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(true);
  const [dialedNumber, setDialedNumber] = useState('088-PIXEL-8');

  const handleAppLaunch = (app: DockApp) => {
    switch (app.id) {
      case 'phone': setActiveApp('phone'); break;
      case 'messages': setActiveApp('messages'); break;
      case 'chrome': setActiveApp('chrome'); break;
      case 'camera': setActiveApp('camera'); break;
      case 'spotify': setActiveApp('spotify'); break;
      case 'settings': setActiveApp('settings'); break;
      default: setActiveApp('home');
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Integration Mode Switcher Tabs */}
      <div className="w-full max-w-[380px] mb-2.5 bg-slate-900/90 border border-slate-800 rounded-2xl p-1 flex items-center gap-1 shadow-lg">
        <button
          onClick={() => onSelectIntegrationMode('system_widget')}
          className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            integrationMode === 'system_widget'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles size={13} />
          <span>ودجت النظام (Glance)</span>
        </button>

        <button
          onClick={() => onSelectIntegrationMode('native_taskbar')}
          className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            integrationMode === 'native_taskbar'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutGrid size={13} />
          <span>دوك النظام (600dp)</span>
        </button>

        <button
          onClick={() => onSelectIntegrationMode('floating_overlay')}
          className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            integrationMode === 'floating_overlay'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers size={13} />
          <span>النافذة العائمة</span>
        </button>
      </div>

      {/* Mode Subtitle Description */}
      <div className="mb-2 text-center">
        {integrationMode === 'system_widget' && (
          <span className="text-[11px] text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-3 py-0.5 rounded-full inline-flex items-center gap-1">
            <Check size={12} className="text-cyan-400" />
            ودجت شاشة رئيسية مدمج بالنظام • استهلاك 0% بطارية • بدون أذونات طفو
          </span>
        )}
        {integrationMode === 'native_taskbar' && (
          <span className="text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-0.5 rounded-full inline-flex items-center gap-1">
            <Check size={12} className="text-emerald-400" />
            ميزة النظام المخفية في Pixel 8 (أصغر عرض = 600dp في خيارات المطورين)
          </span>
        )}
        {integrationMode === 'floating_overlay' && (
          <span className="text-[11px] text-purple-400 bg-purple-950/60 border border-purple-500/30 px-3 py-0.5 rounded-full inline-flex items-center gap-1">
            <Layers size={12} className="text-purple-400" />
            نافذة عائمة مستمرة فوق كل التطبيقات عبر WindowManager و Foreground Service
          </span>
        )}
      </div>

      {/* The Physical Pixel 8 Phone Outer Shell */}
      <div className="relative w-[340px] sm:w-[360px] h-[700px] bg-slate-900 rounded-[50px] p-3 shadow-2xl shadow-cyan-950/40 border-4 border-slate-700/80 ring-1 ring-white/10 select-none">
        
        {/* Subtle camera punch hole at top */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full z-40 ring-1 ring-slate-800/80 flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-blue-950/60 rounded-full" />
        </div>

        {/* Screen Display Area */}
        <div className="relative w-full h-full rounded-[40px] overflow-hidden bg-slate-950 flex flex-col">
          
          {/* Status Bar */}
          <div
            onClick={() => setShowNotificationShade(!showNotificationShade)}
            className="h-9 px-6 flex items-center justify-between text-xs text-white z-30 cursor-pointer bg-gradient-to-b from-black/50 to-transparent"
            title="انقر لفتح لوحة الإشعارات والتحقق من حالة النظام"
          >
            <span className="font-semibold text-[13px] tracking-tight">12:00</span>

            <div className="flex items-center gap-1.5">
              {/* Status Bar Indicators */}
              {integrationMode === 'floating_overlay' && isServiceRunning && (
                <span className="flex items-center gap-0.5 text-cyan-400 bg-cyan-950/80 px-1 py-0.5 rounded text-[10px]">
                  <Layers size={10} />
                  <span>Overlay</span>
                </span>
              )}

              {integrationMode === 'system_widget' && (
                <span className="flex items-center gap-0.5 text-emerald-400 bg-emerald-950/80 px-1 py-0.5 rounded text-[10px]">
                  <Sparkles size={10} />
                  <span>Widget</span>
                </span>
              )}

              {integrationMode === 'native_taskbar' && (
                <span className="flex items-center gap-0.5 text-teal-400 bg-teal-950/80 px-1 py-0.5 rounded text-[10px]">
                  <LayoutGrid size={10} />
                  <span>Taskbar</span>
                </span>
              )}
              <Wifi size={13} className="text-white" />
              <Signal size={13} className="text-white" />
              <div className="flex items-center gap-0.5">
                <span className="text-[11px] font-mono">98%</span>
                <Battery size={14} className="text-emerald-400 fill-emerald-400" />
              </div>
            </div>
          </div>

          {/* Main Display Viewport Content */}
          <div className="relative flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              {activeApp === 'home' && (
                <motion.div
                  key="home"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full relative p-4 flex flex-col justify-between"
                  style={{
                    background: 'radial-gradient(circle at 50% 20%, #1e293b 0%, #0f172a 60%, #020617 100%)'
                  }}
                >
                  {/* Decorative background wallpaper elements */}
                  <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute -top-10 -right-10 w-64 h-64 bg-cyan-500 rounded-full blur-3xl" />
                    <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-emerald-500 rounded-full blur-3xl" />
                  </div>

                  {/* Top Widgets: Matching User's Screenshot (Weather 32° + Gemini) */}
                  <div className="grid grid-cols-2 gap-2 mt-2 px-1 relative z-10">
                    {/* 1. Weather Widget (32° with sun/cloud) */}
                    <div className="bg-white/90 text-slate-900 rounded-3xl p-3 shadow-lg flex items-center justify-between border border-white/40">
                      <div>
                        <div className="text-3xl font-black tracking-tight">32°</div>
                        <div className="text-[10px] text-slate-600 font-medium">الرياض • مشمس</div>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-500 shadow-inner">
                        <Sparkles size={22} className="fill-amber-400" />
                      </div>
                    </div>

                    {/* 2. Gemini Widget (Gemini, Vidéo, Live) */}
                    <div className="bg-slate-900/90 text-white rounded-3xl p-3 shadow-lg border border-white/10 flex flex-col justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300">
                        <Sparkles size={14} className="text-cyan-400" />
                        <span>Gemini AI</span>
                      </div>
                      <div className="flex items-center gap-1 mt-2">
                        <button
                          onClick={() => handleAppLaunch({ id: 'camera', name: 'Vidéo', nameAr: 'فيديو', packageName: 'com.google.gemini.video', iconName: 'Camera', color: 'rose', gradient: 'from-rose-500 to-red-600' })}
                          className="flex-1 bg-slate-800 hover:bg-slate-700 text-[9px] py-1 px-1.5 rounded-xl text-center text-slate-300 font-medium transition-colors"
                        >
                          Vidéo
                        </button>
                        <button
                          onClick={() => handleAppLaunch({ id: 'chrome', name: 'Live', nameAr: 'مباشر', packageName: 'com.google.gemini.live', iconName: 'Compass', color: 'amber', gradient: 'from-amber-500 to-orange-600' })}
                          className="flex-1 bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-[9px] py-1 px-1.5 rounded-xl text-center font-bold"
                        >
                          Live
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Homescreen Apps Row (Play Store, Gmail, Photos, YouTube Pro - from Screenshot) */}
                  <div className="grid grid-cols-4 gap-2.5 px-2 my-auto relative z-10">
                    {[
                      { id: 'chrome', name: 'Play Store', icon: '▶', gradient: 'from-cyan-400 via-emerald-400 to-blue-500' },
                      { id: 'messages', name: 'Gmail', icon: 'M', gradient: 'from-red-500 to-rose-600' },
                      { id: 'camera', name: 'Photos', icon: '✤', gradient: 'from-amber-400 via-rose-500 to-blue-600' },
                      { id: 'spotify', name: 'YouTube Pro', icon: '▶', gradient: 'from-red-600 to-red-700' }
                    ].map((app, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAppLaunch({ id: app.id as any, name: app.name, nameAr: app.name, packageName: 'com.android.app', iconName: 'Grid', color: 'blue', gradient: app.gradient })}
                        className="flex flex-col items-center gap-1 active:scale-90 transition-transform group"
                      >
                        <div className={`w-13 h-13 rounded-2xl bg-gradient-to-tr ${app.gradient} shadow-md border border-white/20 flex items-center justify-center text-white text-base font-black group-hover:shadow-lg transition-all`}>
                          {app.icon}
                        </div>
                        <span className="text-[10px] text-slate-200 font-medium">{app.name}</span>
                      </button>
                    ))}
                  </div>

                  {/* SYSTEM APPWIDGET (Rendered directly on the home screen as a Glance AppWidget) */}
                  {integrationMode === 'system_widget' && (
                    <AndroidSystemWidget
                      apps={apps}
                      settings={settings}
                      onAppLaunch={handleAppLaunch}
                      onOpenWidgetPicker={() => setShowWidgetsPicker(true)}
                    />
                  )}

                  {/* 🌟 IOS FROSTED GLASS DOCK (الرف الزجاجي الشفاف iOS كما في لقطة شاشتك تماماً) 🌟 */}
                  {/* يلتف الرف الزجاجي الشفاف حول أيقوناتك الحالية (الهاتف، الرسائل، كروم بيتا، الكاميرا) */}
                  <motion.div
                    initial={{ y: 0, opacity: 1 }}
                    animate={{
                      y: (settings.hideInApps && activeApp !== 'home') ? 140 : 0,
                      opacity: (settings.hideInApps && activeApp !== 'home') ? 0 : 1
                    }}
                    transition={{
                      type: 'spring',
                      damping: 24,
                      stiffness: 320
                    }}
                    style={{
                      backdropFilter: `blur(${settings.blurRadius || 28}px)`,
                      WebkitBackdropFilter: `blur(${settings.blurRadius || 28}px)`,
                      backgroundColor: `rgba(255, 255, 255, ${settings.dockOpacity || 0.45})`,
                      borderRadius: `${settings.dockCornerRadius || 30}px`,
                      boxShadow: '0 12px 32px -4px rgba(0, 0, 0, 0.35), 0 0 0 1.2px rgba(255, 255, 255, 0.75) inset',
                      width: '100%',
                      maxWidth: `${settings.dockWidth || 356}px`,
                      height: `${settings.dockHeight || 78}px`
                    }}
                    className="relative mx-auto mb-1 flex items-center justify-around px-2 border border-white/40 z-30 select-none shadow-2xl"
                    title="الرف الزجاجي الشفاف iOS (AndroDock v2.0)"
                  >
                    {/* 1. الهاتف الأصلي */}
                    <button
                      onClick={() => handleAppLaunch({ id: 'phone', name: 'Phone', nameAr: 'الهاتف', packageName: 'com.google.android.dialer', iconName: 'Phone', color: 'blue', gradient: 'from-blue-500 to-indigo-600' })}
                      className="w-13 h-13 rounded-full bg-white text-blue-500 flex items-center justify-center shadow-md border border-black/5 active:scale-90 transition-transform"
                      title="الهاتف الأصلي"
                    >
                      <Phone size={24} className="fill-blue-500/20" />
                    </button>

                    {/* 2. الرسائل الأصلية مع شارة "1" */}
                    <button
                      onClick={() => handleAppLaunch({ id: 'messages', name: 'Messages', nameAr: 'الرسائل', packageName: 'com.google.android.apps.messaging', iconName: 'MessageSquare', color: 'blue', gradient: 'from-blue-500 to-indigo-600' })}
                      className="w-13 h-13 rounded-full bg-white text-blue-500 flex items-center justify-center shadow-md border border-black/5 active:scale-90 transition-transform relative"
                      title="الرسائل الأصلية"
                    >
                      <MessageSquare size={24} className="fill-blue-500/20" />
                      <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#FF3B30] text-white font-bold text-[11px] flex items-center justify-center border-2 border-white shadow-sm">
                        1
                      </span>
                    </button>

                    {/* 3. Chrome Beta الأصلي (مطابق للقطة الشاشة) */}
                    <button
                      onClick={() => handleAppLaunch({ id: 'chrome', name: 'Chrome Beta', nameAr: 'Chrome Beta', packageName: 'com.chrome.beta', iconName: 'Compass', color: 'amber', gradient: 'from-amber-500 to-orange-600' })}
                      className="w-13 h-13 rounded-full bg-white flex items-center justify-center shadow-md border border-black/5 active:scale-90 transition-transform relative overflow-hidden"
                      title="Chrome Beta الأصلي"
                    >
                      <div className="w-8 h-8 rounded-full relative flex items-center justify-center border border-black/5 overflow-hidden shadow-inner">
                        <div
                          className="absolute inset-0 rounded-full"
                          style={{
                            background: 'conic-gradient(from 0deg, #EA4335 0deg 90deg, #FBBC05 90deg 210deg, #34A853 210deg 300deg, #4285F4 300deg 360deg)'
                          }}
                        />
                        <div className="w-3.5 h-3.5 rounded-full bg-[#1A73E8] border-2 border-white z-10 shadow-sm" />
                        <div className="absolute bottom-0 inset-x-0 bg-slate-900/90 text-white text-[6.5px] font-black text-center py-[0.5px] tracking-tight z-20">
                          Beta
                        </div>
                      </div>
                    </button>

                    {/* 4. الكاميرا الأصلية */}
                    <button
                      onClick={() => handleAppLaunch({ id: 'camera', name: 'Camera', nameAr: 'الكاميرا', packageName: 'com.google.android.GoogleCamera', iconName: 'Camera', color: 'rose', gradient: 'from-rose-500 to-red-600' })}
                      className="w-13 h-13 rounded-full bg-white flex items-center justify-center shadow-md border border-black/5 active:scale-90 transition-transform relative text-slate-700"
                      title="الكاميرا الأصلية"
                    >
                      <div className="relative flex items-center justify-center">
                        <Camera size={24} />
                        <div className="absolute w-2 h-2 rounded-full bg-blue-500/70" />
                      </div>
                    </button>
                  </motion.div>

                  {/* Pixel Search Bar */}
                  <div className="w-full bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 flex items-center justify-between text-slate-400 mb-2 shadow-lg relative z-10">
                    <div className="flex items-center gap-2">
                      <Search size={15} className="text-cyan-400" />
                      <span className="text-[11px] text-slate-400">ابحث في هاتفك وتطبيقاتك...</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mic size={14} className="text-slate-400 hover:text-white" />
                      <Camera size={14} className="text-slate-400 hover:text-white" />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeApp === 'phone' && (
                <motion.div
                  key="phone"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full h-full bg-slate-950 p-4 flex flex-col justify-between"
                >
                  <div className="text-center pt-6">
                    <span className="text-xs text-slate-400">Google Phone Dialer</span>
                    <div className="text-2xl font-mono text-cyan-400 font-bold mt-2">
                      {dialedNumber}
                    </div>
                  </div>

                  {/* Dialer Keypad */}
                  <div className="grid grid-cols-3 gap-3 px-4 max-w-[260px] mx-auto mb-16">
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((digit) => (
                      <button
                        key={digit}
                        onClick={() => setDialedNumber((prev) => prev.slice(0, 14) + digit)}
                        className="w-14 h-14 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xl font-medium flex items-center justify-center border border-slate-800 active:scale-95 transition-all"
                      >
                        {digit}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeApp === 'messages' && (
                <motion.div
                  key="messages"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="w-full h-full bg-slate-950 p-4 flex flex-col"
                >
                  <div className="border-b border-slate-800 pb-3 mb-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                      ش
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">الشريك المطور</div>
                      <div className="text-[11px] text-emerald-400">متصل الآن • Pixel 8</div>
                    </div>
                  </div>

                  <div className="flex-1 space-y-3 overflow-y-auto text-xs pb-16">
                    <div className="bg-slate-900 border border-slate-800 text-slate-200 p-3 rounded-2xl rounded-tr-none max-w-[85%] self-start">
                      مرحباً يا بطل! هل تم تطبيق الـ Floating Dock بـ RenderEffect و 120Hz؟
                    </div>
                    <div className="bg-blue-600 text-white p-3 rounded-2xl rounded-tl-none max-w-[85%] mr-auto">
                      نعم يا شريك! الـ Dock يطفو الآن بنجاح فوق هذه المحادثة وفوق كافة شاشات أندرويد عبر WindowManager.
                    </div>
                    <div className="bg-slate-900 border border-slate-800 text-slate-200 p-3 rounded-2xl rounded-tr-none max-w-[85%] self-start">
                      ما شاء الله، وتأثير الزجاج البلوري مع حركة النوابض رائع جداً!
                    </div>
                  </div>
                </motion.div>
              )}

              {activeApp === 'camera' && (
                <motion.div
                  key="camera"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full bg-black relative flex flex-col justify-between p-4"
                >
                  {/* Viewfinder simulation */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />
                  <div className="flex items-center justify-between text-white text-xs z-10">
                    <span>Pixel Camera 50MP</span>
                    <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full border border-red-500/30">
                      RAW+
                    </span>
                  </div>

                  <div className="w-full h-48 border border-white/20 rounded-2xl my-auto flex items-center justify-center relative overflow-hidden bg-slate-900">
                    <div className="w-24 h-24 border border-dashed border-cyan-400/60 rounded-full animate-pulse flex items-center justify-center">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                    </div>
                    <span className="absolute bottom-2 text-[10px] text-slate-400">
                      مستشعر Pixel 8 Actua جاهز
                    </span>
                  </div>

                  <div className="flex items-center justify-around z-10 mb-16">
                    <span className="text-xs text-slate-400">0.5x</span>
                    <span className="text-xs font-bold text-amber-400 border border-amber-400/40 px-2 py-0.5 rounded-full">
                      1x
                    </span>
                    <span className="text-xs text-slate-400">2x</span>
                  </div>
                </motion.div>
              )}

              {activeApp === 'chrome' && (
                <motion.div
                  key="chrome"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full bg-slate-900 flex flex-col"
                >
                  <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center gap-2">
                    <Globe size={14} className="text-cyan-400" />
                    <div className="flex-1 bg-slate-900 rounded-full px-3 py-1 text-[11px] text-slate-300 border border-slate-800 flex items-center justify-between">
                      <span>https://developer.android.com</span>
                      <RotateCcw size={11} className="text-slate-500" />
                    </div>
                  </div>

                  <div className="p-4 text-xs space-y-3 overflow-y-auto pb-16">
                    <h3 className="font-bold text-white text-sm">Android 14+ WindowManager Guides</h3>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      استخدام TYPE_APPLICATION_OVERLAY مع RenderEffect يوفر تجربة غامرة لفتح النوافذ العائمة مع المحافظة على معدل تحديث 120Hz.
                    </p>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[10px] text-cyan-300">
                      WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS
                    </div>
                  </div>
                </motion.div>
              )}

              {activeApp === 'spotify' && (
                <motion.div
                  key="spotify"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full bg-gradient-to-b from-emerald-950/80 to-slate-950 p-4 flex flex-col justify-between pb-16"
                >
                  <div className="text-center text-xs text-slate-300 pt-2">تشغيل من الموسيقى</div>
                  
                  <div className="w-40 h-40 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 shadow-xl flex items-center justify-center border border-white/20">
                    <Volume2 size={48} className="text-white" />
                  </div>

                  <div className="text-center">
                    <div className="text-base font-bold text-white">Pixel Sound Experience</div>
                    <div className="text-xs text-slate-400">120Hz Audio Visualizer</div>
                  </div>

                  <div className="flex items-center justify-center gap-6 text-white">
                    <SkipBack size={20} className="text-slate-400 hover:text-white cursor-pointer" />
                    <button
                      onClick={() => setIsPlayingMusic(!isPlayingMusic)}
                      className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-lg active:scale-95 transition-all"
                    >
                      {isPlayingMusic ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
                    </button>
                    <SkipForward size={20} className="text-slate-400 hover:text-white cursor-pointer" />
                  </div>
                </motion.div>
              )}

              {activeApp === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full bg-slate-950 p-4 overflow-y-auto pb-16 text-xs space-y-3"
                >
                  <div className="text-base font-bold text-white mb-2">إعدادات Pixel 8</div>

                  {/* Permission item */}
                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white text-xs">الظهور فوق التطبيقات</div>
                      <div className="text-[10px] text-slate-400">Display over other apps</div>
                    </div>
                    <button
                      onClick={onRequestPermission}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                        hasPermission ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                      }`}
                    >
                      {hasPermission ? 'مسموح به' : 'منح الإذن'}
                    </button>
                  </div>

                  {/* Foreground Service item */}
                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white text-xs">خدمة الـ Dock الأمامية</div>
                      <div className="text-[10px] text-slate-400">Foreground Service RAM Guard</div>
                    </div>
                    <button
                      onClick={onToggleService}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                        isServiceRunning ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {isServiceRunning ? 'نشط' : 'معطل'}
                    </button>
                  </div>

                  {/* Display 120Hz */}
                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white text-xs">شاشة سلسة (Smooth Display)</div>
                      <div className="text-[10px] text-slate-400">120Hz Actua OLED</div>
                    </div>
                    <span className="text-cyan-400 font-bold text-[11px]">مفعلة</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* THE FLOATING IOS DOCK OVERLAY! */}
            {/* يظهر فقط عند تفعيل وضع الأيقونات الدائرية البديلة؛ أما في وضع الرف الشفاف فهو مدمج مباشرة حول أيقونات الشاشة الرئيسية */}
            {integrationMode === 'floating_overlay' && settings.dockStyle === 'ios_launcher_circles' && (
              <FloatingDockOverlay
                apps={apps}
                settings={settings}
                onAppClick={handleAppLaunch}
                onCloseDock={onToggleService}
                isServiceRunning={isServiceRunning}
                hasPermission={hasPermission}
                isHomeScreen={activeApp === 'home'}
              />
            )}

            {/* NATIVE SYSTEM TASKBAR (When in native_taskbar mode) */}
            {integrationMode === 'native_taskbar' && (
              <NativeSystemTaskbar
                apps={apps}
                onAppLaunch={handleAppLaunch}
                onOpenAppDrawer={() => setActiveApp('home')}
              />
            )}

            {/* Android Widgets Picker Modal */}
            <AndroidWidgetsPickerModal
              isOpen={showWidgetsPicker}
              onClose={() => setShowWidgetsPicker(false)}
              onSelectWidget={() => setActiveApp('home')}
            />

            {/* Simulated Notification Shade (Pulled down) */}
            <AnimatePresence>
              {showNotificationShade && (
                <motion.div
                  initial={{ y: -300, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -300, opacity: 0 }}
                  className="absolute inset-x-0 top-0 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 p-4 z-50 rounded-b-3xl shadow-2xl"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3 border-b border-slate-800 pb-2">
                    <span className="font-bold text-white">إشعارات النظام (System Notifications)</span>
                    <button
                      onClick={() => setShowNotificationShade(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      <ChevronDown size={18} />
                    </button>
                  </div>

                  {/* Persistent Foreground Service Notification Card */}
                  {isServiceRunning ? (
                    <div className="bg-slate-950 border border-cyan-500/40 rounded-2xl p-3 shadow-lg">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-md bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                            <Layers size={12} />
                          </div>
                          <span className="text-xs font-bold text-white">Pixel 8 iOS Dock</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">الآن • صامت</span>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        الخدمة الأمامية نشطة ومحمية من إغلاق النظام بواسطة Foreground Service.
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={onToggleService}
                          className="px-2.5 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 rounded-lg text-[10px] font-bold"
                        >
                          إيقاف الـ Dock
                        </button>
                        <button
                          onClick={() => {
                            setActiveApp('settings');
                            setShowNotificationShade(false);
                          }}
                          className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-lg text-[10px]"
                        >
                          الإعدادات
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-xs text-slate-400">
                      لا توجد خدمات أمامية قيد التشغيل حالياً
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Android Gesture Navigation Pill at Bottom */}
          <div className="relative w-full flex flex-col items-center justify-center bg-transparent z-40 pb-2">
            {activeApp !== 'home' && settings.hideInApps && (
              <motion.div
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mb-1 bg-slate-950/90 border border-cyan-500/50 text-cyan-300 text-[10px] px-3 py-0.5 rounded-full shadow-lg backdrop-blur-md flex items-center gap-1.5 pointer-events-none"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span>انسحب الـ Dock تلقائياً • اضغط الشريط الأبيض للرجوع</span>
              </motion.div>
            )}

            <button
              onClick={() => setActiveApp('home')}
              className="w-28 h-1 bg-white/50 hover:bg-white rounded-full cursor-pointer transition-all active:scale-95 hover:h-1.5"
              title="انقر للرجوع للشاشة الرئيسية وعودة شريط الـ Dock"
              id="android-gesture-pill"
            />
          </div>

        </div>
      </div>

      {/* Quick device shortcut controls */}
      <div className="flex items-center gap-2 mt-3">
        <button
          onClick={() => setActiveApp('home')}
          className={`text-xs px-3 py-1 rounded-full border transition-all ${
            activeApp === 'home'
              ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          الرئيسية
        </button>
        <button
          onClick={() => setActiveApp('phone')}
          className={`text-xs px-3 py-1 rounded-full border transition-all ${
            activeApp === 'phone'
              ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          الهاتف
        </button>
        <button
          onClick={() => setActiveApp('messages')}
          className={`text-xs px-3 py-1 rounded-full border transition-all ${
            activeApp === 'messages'
              ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          الرسائل
        </button>
        <button
          onClick={() => setActiveApp('camera')}
          className={`text-xs px-3 py-1 rounded-full border transition-all ${
            activeApp === 'camera'
              ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          الكاميرا
        </button>
        <button
          onClick={() => setShowWidgetsPicker(true)}
          className="text-xs px-3 py-1 rounded-full border bg-cyan-950/40 border-cyan-500/30 text-cyan-300 hover:text-white flex items-center gap-1 transition-all"
        >
          <Sparkles size={12} />
          <span>ودجات النظام</span>
        </button>
        <button
          onClick={() => setShowNotificationShade(!showNotificationShade)}
          className="text-xs px-3 py-1 rounded-full border bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
        >
          لوحة الإشعارات
        </button>
      </div>
    </div>
  );
};
