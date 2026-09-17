import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Lock,
  LockOpen,
  Check,
  GripVertical
} from 'lucide-react';
import { DockApp, DockSettings } from '../types';

interface FloatingDockOverlayProps {
  apps: DockApp[];
  settings: DockSettings;
  onAppClick: (app: DockApp) => void;
  onCloseDock: () => void;
  isServiceRunning: boolean;
  hasPermission: boolean;
}

export const FloatingDockOverlay: React.FC<FloatingDockOverlayProps> = ({
  settings,
  isServiceRunning,
  hasPermission
}) => {
  const [isLocked, setIsLocked] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  if (!isServiceRunning || !hasPermission) {
    return null;
  }

  return (
    <motion.div
      drag={!isLocked}
      dragMomentum={false}
      dragElastic={0.08}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      className={`absolute bottom-16 left-1/2 -translate-x-1/2 z-10 select-none flex flex-col items-center ${
        isLocked ? 'pointer-events-none' : 'pointer-events-auto'
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
          <span>اسحب لوضع الزجاج خلف أيقوناتك</span>
          <button
            onClick={() => setIsLocked(true)}
            className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2 py-0.5 rounded-full text-[10px] shadow"
          >
            <Check size={12} />
            <span>قفل وتمرير اللمس</span>
          </button>
        </motion.div>
      )}

      {/* الطبقة الزجاجية الشفافة للـ Dock الأصلي (iOS Glass Shelf) */}
      {/* بدون أيقونات مكررة - لكي تظهر أيقونات أندرويد الأصلية بداخلها */}
      <div
        style={{
          width: '320px',
          height: '76px',
          backdropFilter: `blur(${settings.blurRadius || 24}px)`,
          WebkitBackdropFilter: `blur(${settings.blurRadius || 24}px)`,
          backgroundColor: `rgba(255, 255, 255, ${settings.dockOpacity || 0.42})`,
          boxShadow: '0 16px 36px -8px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.6) inset',
          borderRadius: '28px'
        }}
        className={`relative flex items-center justify-center border border-white/40 transition-all ${
          !isLocked ? 'cursor-grab active:cursor-grabbing ring-2 ring-cyan-400/80 shadow-cyan-500/20 pointer-events-auto' : 'pointer-events-none'
        }`}
        title={isLocked ? 'طبقة زجاجية شفافة بنمط iOS (اللمس ممرر للتطبيقات الأصلية)' : 'وضع السحب والمحاذاة'}
      >
        {/* زر صغير للتبديل بين القفل والتحريك عند الحاجة */}
        <button
          onClick={() => setIsLocked(!isLocked)}
          className={`absolute -top-3 right-3 text-[10px] flex items-center gap-1 px-2 py-0.5 rounded-full border shadow-md transition-all pointer-events-auto ${
            isLocked
              ? 'bg-slate-900/80 hover:bg-slate-900 text-white/80 border-white/20'
              : 'bg-emerald-600 text-white border-emerald-400'
          }`}
          title={isLocked ? 'انقر لفك القفل وتحريك الطبقة الزجاجية' : 'انقر للقفل وتمرير اللمس'}
        >
          {isLocked ? (
            <>
              <Lock size={10} className="text-emerald-400" />
              <span className="text-[9px]">مقفول وممرر</span>
            </>
          ) : (
            <>
              <LockOpen size={10} className="text-amber-300" />
              <span className="text-[9px]">وضع التحريك</span>
            </>
          )}
        </button>

        {/* مؤشر محاذاة خفيف في وضع الضبط فقط */}
        {!isLocked && (
          <div className="w-10 h-1 rounded-full bg-slate-900/30 pointer-events-none" />
        )}
      </div>
    </motion.div>
  );
};
