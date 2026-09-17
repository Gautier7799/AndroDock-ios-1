import React from 'react';
import {
  Sliders,
  Sparkles,
  Layers,
  ShieldCheck,
  ShieldAlert,
  Zap,
  RotateCcw,
  Eye,
  Activity,
  BatteryCharging
} from 'lucide-react';
import { DockSettings } from '../types';

interface SettingsPanelProps {
  settings: DockSettings;
  onUpdateSettings: (newSettings: Partial<DockSettings>) => void;
  hasPermission: boolean;
  isServiceRunning: boolean;
  onTogglePermission: () => void;
  onToggleService: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onUpdateSettings,
  hasPermission,
  isServiceRunning,
  onTogglePermission,
  onToggleService
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-5">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <Sliders size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">لوحة تخصيص محاكي Pixel 8</h3>
            <p className="text-[11px] text-slate-400">تحكم بفيزياء النوابض وتأثير RenderEffect</p>
          </div>
        </div>

        <button
          onClick={() =>
            onUpdateSettings({
              blurRadius: 24,
              springStiffness: 300,
              springDamping: 0.6,
              enable120Hz: true,
              dockOpacity: 0.35,
              showLabels: true
            })
          }
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          title="استعادة الإعدادات الافتراضية"
        >
          <RotateCcw size={13} />
          <span>افتراضي</span>
        </button>
      </div>

      {/* Integration Mode Switcher */}
      <div className="space-y-2 bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-white flex items-center gap-1.5">
            <Sparkles size={14} className="text-cyan-400" />
            <span>طريقة الدمج في نظام أندرويد (Integration Architecture)</span>
          </span>
          <span className="text-[10px] text-cyan-400 font-mono">Pixel 8 Native</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
          <button
            onClick={() => onUpdateSettings({ integrationMode: 'system_widget' })}
            className={`p-2.5 rounded-xl border text-right transition-all flex flex-col gap-1 ${
              settings.integrationMode === 'system_widget'
                ? 'bg-cyan-950/50 border-cyan-500/80 text-cyan-200 shadow-md ring-1 ring-cyan-500/40'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="text-xs font-bold text-white flex items-center gap-1">
              <span>ودجت نظام (Glance)</span>
            </div>
            <div className="text-[10px] text-slate-400">ودجت أندرويد رسمي على الشاشة الرئيسية بدون أذونات</div>
          </button>

          <button
            onClick={() => onUpdateSettings({ integrationMode: 'native_taskbar' })}
            className={`p-2.5 rounded-xl border text-right transition-all flex flex-col gap-1 ${
              settings.integrationMode === 'native_taskbar'
                ? 'bg-emerald-950/50 border-emerald-500/80 text-emerald-200 shadow-md ring-1 ring-emerald-500/40'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="text-xs font-bold text-white flex items-center gap-1">
              <span>دوك أندرويد (600dp)</span>
            </div>
            <div className="text-[10px] text-slate-400">ميزة النظام المدمجة في Pixel 8 بدون برامج</div>
          </button>

          <button
            onClick={() => onUpdateSettings({ integrationMode: 'floating_overlay' })}
            className={`p-2.5 rounded-xl border text-right transition-all flex flex-col gap-1 ${
              settings.integrationMode === 'floating_overlay'
                ? 'bg-purple-950/50 border-purple-500/80 text-purple-200 shadow-md ring-1 ring-purple-500/40'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="text-xs font-bold text-white flex items-center gap-1">
              <span>النافذة العائمة</span>
            </div>
            <div className="text-[10px] text-slate-400">يطفو فوق كافة البرامج بواسطة WindowManager</div>
          </button>
        </div>
      </div>

      {/* Permissions and Service State Switches (Relevant for Floating Overlay) */}
      {settings.integrationMode === 'floating_overlay' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Permission Card */}
          <div
            onClick={onTogglePermission}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
              hasPermission
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {hasPermission ? <ShieldCheck size={18} /> : <ShieldAlert size={18} />}
              <div>
                <div className="text-xs font-bold text-white">إذن الظهور فوق التطبيقات</div>
                <div className="text-[10px] opacity-80">SYSTEM_ALERT_WINDOW</div>
              </div>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                hasPermission ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
              }`}
            >
              {hasPermission ? 'ممنوح' : 'ممنوع'}
            </span>
          </div>

          {/* Foreground Service Card */}
          <div
            onClick={onToggleService}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
              isServiceRunning
                ? 'bg-cyan-950/30 border-cyan-500/40 text-cyan-300'
                : 'bg-slate-800/40 border-slate-700 text-slate-400'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Layers size={18} className={isServiceRunning ? 'text-cyan-400' : 'text-slate-500'} />
              <div>
                <div className="text-xs font-bold text-white">الخدمة الأمامية (Foreground)</div>
                <div className="text-[10px] opacity-80">RAM Guard Overlay</div>
              </div>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isServiceRunning ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-700 text-slate-300'
              }`}
            >
              {isServiceRunning ? 'قيد العمل' : 'متوقفة'}
            </span>
          </div>
        </div>
      )}

      {/* Widget Specific Customizations when in system_widget mode */}
      {settings.integrationMode === 'system_widget' && (
        <div className="p-3.5 bg-cyan-950/20 border border-cyan-500/30 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
              <Sparkles size={14} />
              <span>إعدادات ودجت النظام (Glance AppWidget Settings)</span>
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
              0% استهلاك بطارية
            </span>
          </div>

          {/* Columns selection */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 text-[11px]">عدد التطبيقات بالودجت:</span>
            <div className="flex items-center gap-1.5">
              {[4, 5, 6].map((num) => (
                <button
                  key={num}
                  onClick={() => onUpdateSettings({ widgetColumns: num })}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                    settings.widgetColumns === num
                      ? 'bg-cyan-500 text-slate-950 shadow'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Theme selection */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 text-[11px]">سمة وتصميم الودجت:</span>
            <div className="flex items-center gap-1.5">
              {[
                { id: 'frosted_glass', name: 'iOS Glass' },
                { id: 'material_you', name: 'Material You' },
                { id: 'dark_oled', name: 'Dark OLED' }
              ].map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => onUpdateSettings({ widgetTheme: theme.id as any })}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                    settings.widgetTheme === theme.id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white border border-transparent'
                  }`}
                >
                  {theme.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* RenderEffect Blur Radius Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 text-slate-300">
            <Sparkles size={14} className="text-amber-400" />
            <span>قوة تأثير الزجاج البلوري (RenderEffect Blur)</span>
          </span>
          <span className="font-mono text-cyan-400 font-bold">{settings.blurRadius} px</span>
        </div>
        <input
          type="range"
          min="0"
          max="50"
          value={settings.blurRadius}
          onChange={(e) => onUpdateSettings({ blurRadius: Number(e.target.value) })}
          className="w-full accent-cyan-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>0px (شفاف نقي)</span>
          <span>24px (iOS Frosted Glass)</span>
          <span>50px (ضباب كثيف)</span>
        </div>
      </div>

      {/* Spring Stiffness (Physics Animation) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 text-slate-300">
            <Activity size={14} className="text-cyan-400" />
            <span>فيزياء ارتداد النوابض (Spring Stiffness)</span>
          </span>
          <span className="font-mono text-cyan-400 font-bold">{settings.springStiffness}</span>
        </div>
        <input
          type="range"
          min="100"
          max="600"
          step="20"
          value={settings.springStiffness}
          onChange={(e) => onUpdateSettings({ springStiffness: Number(e.target.value) })}
          className="w-full accent-cyan-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>مرن وناعم (100)</span>
          <span>متوازن (300)</span>
          <span>سريع واستجابي (600)</span>
        </div>
      </div>

      {/* Dock Opacity */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 text-slate-300">
            <Eye size={14} className="text-purple-400" />
            <span>شفافية كبسولة الـ Dock</span>
          </span>
          <span className="font-mono text-cyan-400 font-bold">
            {Math.round(settings.dockOpacity * 100)}%
          </span>
        </div>
        <input
          type="range"
          min="0.10"
          max="0.80"
          step="0.05"
          value={settings.dockOpacity}
          onChange={(e) => onUpdateSettings({ dockOpacity: Number(e.target.value) })}
          className="w-full accent-cyan-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
        />
      </div>

      {/* 120Hz Smooth Display Switch */}
      <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-2xl border border-slate-800/80">
        <div className="flex items-center gap-2">
          <Zap size={16} className={settings.enable120Hz ? 'text-amber-400' : 'text-slate-500'} />
          <div>
            <div className="text-xs font-bold text-white">معدل التحديث 120Hz (Smooth Display)</div>
            <div className="text-[10px] text-slate-400">مزامنة الإطارات مع عتاد Pixel 8</div>
          </div>
        </div>
        <button
          onClick={() => onUpdateSettings({ enable120Hz: !settings.enable120Hz })}
          className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
            settings.enable120Hz ? 'bg-cyan-600' : 'bg-slate-700'
          }`}
        >
          <div
            className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
              settings.enable120Hz ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Show Labels Switch */}
      <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-2xl border border-slate-800/80">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-cyan-400" />
          <div>
            <div className="text-xs font-bold text-white">إظهار تسمية التطبيق عند التمرير</div>
            <div className="text-[10px] text-slate-400">تلميح أنيق فوق الأيقونة</div>
          </div>
        </div>
        <button
          onClick={() => onUpdateSettings({ showLabels: !settings.showLabels })}
          className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
            settings.showLabels ? 'bg-cyan-600' : 'bg-slate-700'
          }`}
        >
          <div
            className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
              settings.showLabels ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

    </div>
  );
};
