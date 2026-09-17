import React from 'react';
import {
  Phone,
  MessageCircle,
  Compass,
  Camera,
  Music,
  Grid,
  Sparkles,
  Info
} from 'lucide-react';
import { DockApp } from '../types';

interface NativeSystemTaskbarProps {
  apps: DockApp[];
  onAppLaunch: (app: DockApp) => void;
  onOpenAppDrawer?: () => void;
}

export const NativeSystemTaskbar: React.FC<NativeSystemTaskbarProps> = ({
  apps,
  onAppLaunch,
  onOpenAppDrawer
}) => {
  return (
    <div className="absolute bottom-0 inset-x-0 h-14 bg-slate-950/90 backdrop-blur-2xl border-t border-white/10 px-4 flex items-center justify-between z-40">
      {/* App Drawer button (Stock Android 14/15 Taskbar standard) */}
      <button
        onClick={onOpenAppDrawer}
        className="w-10 h-10 rounded-full bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition-colors"
        title="قائمة كل التطبيقات (App Drawer)"
      >
        <Grid size={18} />
      </button>

      {/* Pinned Taskbar Apps */}
      <div className="flex items-center gap-2">
        {apps.slice(0, 5).map((app) => (
          <button
            key={app.id}
            onClick={() => onAppLaunch(app)}
            className="w-10 h-10 rounded-[14px] bg-gradient-to-tr flex items-center justify-center text-white shadow hover:scale-105 active:scale-95 transition-transform"
            style={{
              backgroundImage: `linear-gradient(to top right, ${app.gradient.replace('from-', '').replace('to-', '')})`
            }}
            title={app.nameAr}
          >
            {app.id === 'phone' && <Phone size={17} />}
            {app.id === 'messages' && <MessageCircle size={17} />}
            {app.id === 'chrome' && <Compass size={17} />}
            {app.id === 'camera' && <Camera size={17} />}
            {app.id === 'spotify' && <Music size={17} />}
          </button>
        ))}
      </div>

      {/* Navigation gesture bar / recents */}
      <div className="w-16 h-1 bg-white/40 rounded-full my-auto" />
    </div>
  );
};
