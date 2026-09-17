import React, { useState, useRef } from 'react';
import { motion, useMotionValue } from 'motion/react';
import {
  Phone,
  MessageSquare,
  Compass,
  Camera,
  Music,
  Settings,
  X,
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
  apps,
  settings,
  onAppClick,
  onCloseDock,
  isServiceRunning,
  hasPermission
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const constraintsRef = useRef<HTMLDivElement>(null);

  if (!isServiceRunning || !hasPermission) {
    return null;
  }

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Phone': return Phone;
      case 'MessageSquare': return MessageSquare;
      case 'Compass': return Compass;
      case 'Camera': return Camera;
      case 'Music': return Music;
      case 'Settings': return Settings;
      default: return Compass;
    }
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.1}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      initial={{ y: 60, opacity: 0, scale: 0.9 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 80, opacity: 0, scale: 0.85 }}
      transition={{
        type: 'spring',
        stiffness: settings.springStiffness,
        damping: settings.springDamping * 40
      }}
      className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 select-none touch-none"
      id="floating-dock-container"
    >
      {/* iOS Frosted Glass Capsule */}
      <div
        style={{
          backdropFilter: `blur(${settings.blurRadius}px)`,
          WebkitBackdropFilter: `blur(${settings.blurRadius}px)`,
          backgroundColor: `rgba(255, 255, 255, ${settings.dockOpacity})`,
          boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.4), 0 0 0 0.5px rgba(255, 255, 255, 0.45) inset'
        }}
        className="relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-[32px] border border-white/30 transition-shadow duration-300"
      >
        {/* Subtle drag handle for Android overlay */}
        <div
          className="cursor-grab active:cursor-grabbing text-white/50 hover:text-white/80 p-0.5"
          title="اسحب الـ Dock لأي مكان في الشاشة"
        >
          <GripVertical size={14} />
        </div>

        {/* Icons row with iOS magnification spring curve */}
        <div className="flex items-center gap-2">
          {apps.map((app, index) => {
            const Icon = getIconComponent(app.iconName);
            const isHovered = hoveredIndex === index;
            const isAdjacent =
              hoveredIndex !== null &&
              (hoveredIndex === index - 1 || hoveredIndex === index + 1);

            // Scale calculations (120Hz spring physics)
            let scale = 1.0;
            let translateY = 0;
            if (isHovered) {
              scale = 1.28;
              translateY = -8;
            } else if (isAdjacent) {
              scale = 1.12;
              translateY = -4;
            }

            return (
              <motion.div
                key={app.id}
                className="relative group"
                onHoverStart={() => {
                  setHoveredIndex(index);
                  if (settings.showLabels) setShowTooltip(app.nameAr);
                }}
                onHoverEnd={() => {
                  setHoveredIndex(null);
                  setShowTooltip(null);
                }}
                onTouchStart={() => setHoveredIndex(index)}
                onTouchEnd={() => setHoveredIndex(null)}
                animate={{
                  scale,
                  y: translateY
                }}
                transition={{
                  type: 'spring',
                  stiffness: settings.springStiffness,
                  damping: settings.springDamping * 35,
                  mass: 0.8
                }}
                whileTap={{ scale: 0.92 }}
                onClick={() => {
                  if (!isDragging) {
                    onAppClick(app);
                  }
                }}
                id={`dock-app-${app.id}`}
              >
                {/* App Icon Capsule */}
                <div
                  className={`w-11 h-11 rounded-[14px] bg-gradient-to-br ${app.gradient} flex items-center justify-center text-white shadow-md shadow-black/25 relative cursor-pointer overflow-hidden border border-white/20`}
                >
                  {/* Subtle top-light glare */}
                  <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none rounded-t-[14px]" />
                  <Icon size={22} className="relative z-10 drop-shadow-sm" />

                  {/* Notification badge simulation */}
                  {app.badge && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-slate-900 shadow">
                      {app.badge}
                    </span>
                  )}
                </div>

                {/* Floating app title tooltip */}
                {settings.showLabels && showTooltip === app.nameAr && (
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.85 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.85 }}
                    className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-black/80 backdrop-blur-md rounded-md text-[10px] text-white whitespace-nowrap pointer-events-none z-30 font-medium border border-white/10"
                  >
                    {app.nameAr}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Small subtle close action */}
        <button
          onClick={onCloseDock}
          className="text-white/40 hover:text-white/90 hover:bg-white/10 p-1 rounded-full transition-colors ml-0.5"
          title="إخفاء مؤقت"
          id="btn-close-dock-overlay"
        >
          <X size={13} />
        </button>
      </div>
    </motion.div>
  );
};
