import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Lock,
  LockOpen,
  Check,
  GripVertical,
  Phone,
  MessageSquare,
  Camera
} from 'lucide-react';
import { DockApp, DockSettings } from '../types';

interface FloatingDockOverlayProps {
  apps: DockApp[];
  settings: DockSettings;
  onAppClick: (app: DockApp) => void;
  onCloseDock: () => void;
  isServiceRunning: boolean;
  hasPermission: boolean;
  isHomeScreen?: boolean;
}

export const FloatingDockOverlay: React.FC<FloatingDockOverlayProps> = ({
  apps,
  settings,
  onAppClick,
  isServiceRunning,
  hasPermission,
  isHomeScreen = true
}) => {
  const [isLocked, setIsLocked] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  if (!isServiceRunning || !hasPermission) {
    return null;
  }

  const showIcons = settings.dockStyle === 'ios_launcher_circles';
  const shouldRetract = (settings.hideInApps !== false) && !isHomeScreen;
  const dockWidth = settings.dockWidth || 356;
  const dockHeight = settings.dockHeight || 78;
  const cornerRadius = settings.dockCornerRadius || 30;

  return (
    <motion.div
      drag={!isLocked}
      dragMomentum={false}
      dragElastic={0.08}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      initial={{ y: 0, opacity: 1 }}
      animate={{
        y: shouldRetract ? 140 : 0,
        opacity: shouldRetract ? 0 : 1
      }}
      transition={{
        type: 'spring',
        damping: 26,
        stiffness: 300
      }}
      className={`absolute bottom-[66px] left-1/2 -translate-x-1/2 z-20 select-none flex flex-col items-center ${
        !showIcons && isLocked ? 'pointer-events-none' : 'pointer-events-auto'
      }`}
      id="floating-dock-container"
    >
      {/* شريط التحكم السريع (يظهر فقط في وضع الضبط والتحريك) */}
      {!isLocked && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2 flex items-center gap-2 bg-slate-950/90 text-white border border-white/20 px-3 py-1 rounded-full text-[11px] shadow-xl backdrop-blur-md pointer-events-auto"
        >
          <GripVertical size={12} className="text-white/60" />
          <span>اسحب لضبط مكان شريط الـ Dock</span>
          <button
            onClick={() => setIsLocked(true)}
            className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2 py-0.5 rounded-full text-[10px] shadow"
          >
            <Check size={12} />
            <span>قفل وتثبيت</span>
          </button>
        </motion.div>
      )}

      {/* لوح الـ Dock الزجاجي المستوحى بنسبة 100% من صورة الـ iOS Launcher */}
      <div
        style={{
          width: `${dockWidth}px`,
          height: `${dockHeight}px`,
          backdropFilter: `blur(${settings.blurRadius || 28}px)`,
          WebkitBackdropFilter: `blur(${settings.blurRadius || 28}px)`,
          backgroundColor: `rgba(255, 255, 255, ${settings.dockOpacity || 0.52})`,
          boxShadow: '0 12px 32px -4px rgba(0, 0, 0, 0.35), 0 0 0 1.2px rgba(255, 255, 255, 0.75) inset',
          borderRadius: `${cornerRadius}px`
        }}
        className={`relative flex items-center justify-around px-3 border border-white/40 transition-all ${
          !isLocked ? 'cursor-grab active:cursor-grabbing ring-2 ring-cyan-400/80 shadow-cyan-500/20' : ''
        }`}
        title="iOS Dock Shelf"
      >
        {/* زر صغير للتبديل بين القفل والتحريك */}
        <button
          onClick={() => setIsLocked(!isLocked)}
          className={`absolute -top-3 right-3 text-[10px] flex items-center gap-1 px-2 py-0.5 rounded-full border shadow-md transition-all pointer-events-auto z-40 ${
            isLocked
              ? 'bg-slate-900/80 hover:bg-slate-900 text-white/80 border-white/20'
              : 'bg-emerald-600 text-white border-emerald-400'
          }`}
          title={isLocked ? 'انقر لفك القفل وتحريك الـ Dock' : 'انقر للقفل والتثبيت'}
        >
          {isLocked ? (
            <>
              <Lock size={10} className="text-emerald-400" />
              <span className="text-[9px]">مقفول</span>
            </>
          ) : (
            <>
              <LockOpen size={10} className="text-amber-300" />
              <span className="text-[9px]">وضع التحريك</span>
            </>
          )}
        </button>

        {showIcons ? (
          // الأيقونات الدائرية الأربعة المطابقة تماماً للصورة
          <div className="w-full flex items-center justify-around relative z-10">
            {/* 1. الهاتف */}
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={() => onAppClick(apps.find(a => a.id === 'phone') || apps[0])}
              className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-md border border-black/5 active:scale-90 transition-transform relative group"
              title="الهاتف"
            >
              <Phone size={26} className="text-blue-500 fill-blue-500/20" />
            </motion.button>

            {/* 2. الرسائل مع الشارة الحمراء "1" */}
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={() => onAppClick(apps.find(a => a.id === 'messages') || apps[1])}
              className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-md border border-black/5 active:scale-90 transition-transform relative group"
              title="الرسائل"
            >
              <MessageSquare size={26} className="text-blue-500 fill-blue-500/20" />
              {settings.showNotificationBadge && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#FF3B30] text-white font-bold text-[11px] flex items-center justify-center border-2 border-white shadow-sm">
                  1
                </span>
              )}
            </motion.button>

            {/* 3. Chrome Beta / المتصفح الدائري */}
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={() => onAppClick(apps.find(a => a.id === 'chrome') || apps[3])}
              className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-md border border-black/5 active:scale-90 transition-transform relative group overflow-hidden"
              title="Chrome Beta"
            >
              <div className="w-9 h-9 rounded-full relative flex items-center justify-center border border-black/5 overflow-hidden shadow-inner">
                {/* خلفية تدرج ألوان Chrome */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'conic-gradient(from 0deg, #EA4335 0deg 90deg, #FBBC05 90deg 210deg, #34A853 210deg 300deg, #4285F4 300deg 360deg)'
                  }}
                />
                {/* المركز الأزرق مع إطار أبيض */}
                <div className="w-4 h-4 rounded-full bg-[#1A73E8] border-2 border-white z-10 shadow-sm" />
                {/* شارة Beta السوداء في الأسفل تماماً مثل لقطة الشاشة */}
                <div className="absolute bottom-0 inset-x-0 bg-slate-900/90 text-white text-[7px] font-black text-center py-[1px] tracking-tight z-20">
                  Beta
                </div>
              </div>
            </motion.button>

            {/* 4. الكاميرا */}
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={() => onAppClick(apps.find(a => a.id === 'camera') || apps[2])}
              className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-md border border-black/5 active:scale-90 transition-transform relative group"
              title="الكاميرا"
            >
              <div className="relative flex items-center justify-center">
                <Camera size={26} className="text-slate-700" />
                <div className="absolute w-2 h-2 rounded-full bg-blue-500/70" />
              </div>
            </motion.button>
          </div>
        ) : (
          /* وضع الرف الزجاجي الشفاف فقط */
          !isLocked && (
            <div className="w-10 h-1 rounded-full bg-slate-900/30 pointer-events-none" />
          )
        )}
      </div>
    </motion.div>
  );
};
