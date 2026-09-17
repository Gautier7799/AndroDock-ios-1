import React, { useState } from 'react';
import {
  Smartphone,
  Code2,
  Sliders,
  BookOpen,
  Download,
  Sparkles,
  Layers,
  Zap,
  CheckCircle2,
  Terminal,
  Cpu
} from 'lucide-react';
import { Pixel8Simulator } from './components/Pixel8Simulator';
import { AndroidCodeViewer } from './components/AndroidCodeViewer';
import { SettingsPanel } from './components/SettingsPanel';
import { ArchitectureGuide } from './components/ArchitectureGuide';
import { PermissionModal } from './components/PermissionModal';
import { DEFAULT_DOCK_APPS } from './data/mockApps';
import { DockSettings } from './types';
import { exportAndroidStudioProject } from './utils/zipExporter';

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'code' | 'guide'>('simulator');
  const [apps, setApps] = useState(DEFAULT_DOCK_APPS);
  const [isServiceRunning, setIsServiceRunning] = useState(true);
  const [hasPermission, setHasPermission] = useState(true);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);

  const [settings, setSettings] = useState<DockSettings>({
    integrationMode: 'system_widget',
    blurRadius: 28,
    springStiffness: 300,
    springDamping: 0.6,
    enable120Hz: true,
    dockOpacity: 0.52,
    dockScale: 1.0,
    snapToEdge: true,
    hapticFeedback: true,
    showLabels: true,
    autoHide: false,
    widgetColumns: 4,
    widgetTheme: 'frosted_glass',
    dockStyle: 'ios_launcher_circles',
    showNotificationBadge: true,
    dockWidth: 350,
    dockHeight: 88,
    dockCornerRadius: 32
  });

  const handleUpdateSettings = (newSettings: Partial<DockSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const handleToggleService = () => {
    if (!hasPermission) {
      setShowPermissionModal(true);
      return;
    }
    setIsServiceRunning((prev) => !prev);
  };

  const handleTogglePermission = () => {
    if (hasPermission) {
      setHasPermission(false);
      setIsServiceRunning(false);
    } else {
      setShowPermissionModal(true);
    }
  };

  const handleQuickDownload = async () => {
    setIsDownloadingZip(true);
    try {
      await exportAndroidStudioProject();
    } finally {
      setIsDownloadingZip(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Cairo',sans-serif]">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-900/30">
              <Layers size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Pixel 8 iOS Floating Dock
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] px-2 py-0.5 rounded-full font-mono">
                  Kotlin + Compose BOM
                </span>
              </div>
              <p className="text-xs text-slate-400">
                مشروع Android Studio كامل • استقرار 100% • شاشة 120Hz
              </p>
            </div>
          </div>

          {/* Navigation and Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* View Switcher on smaller screens / general toggle */}
            <div className="flex items-center bg-slate-900 p-1 rounded-2xl border border-slate-800 text-xs">
              <button
                onClick={() => setActiveTab('simulator')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                  activeTab === 'simulator'
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone size={14} />
                <span>المحاكي المباشر</span>
              </button>

              <button
                onClick={() => setActiveTab('code')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                  activeTab === 'code'
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Code2 size={14} />
                <span>أكواد المشروع</span>
              </button>

              <button
                onClick={() => setActiveTab('guide')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                  activeTab === 'guide'
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BookOpen size={14} />
                <span className="hidden sm:inline">دليل المعمارية</span>
              </button>
            </div>

            {/* Quick Export ZIP Button */}
            <button
              onClick={handleQuickDownload}
              disabled={isDownloadingZip}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-950/40 active:scale-95 transition-all disabled:opacity-50"
              title="تحميل مشروع Android Studio كملف مضغوط"
              id="header-btn-download-zip"
            >
              <Download size={14} />
              <span className="hidden sm:inline">تحميل كـ ZIP</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {/* Partnership Welcome Banner */}
        <div className="mb-6 p-4 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/30 border border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Sparkles size={18} />
            </div>
            <div>
              <span className="text-xs font-bold text-cyan-300">أهلاً بك يا شريك في مشروعنا الجديد!</span>
              <p className="text-xs text-slate-300">
                تم بناء كود أندرويد متكامل ونظيف 100% يشمل الـ Foreground Service، وتأثير RenderEffect Frosted Glass، وفيزياء النوابض 120Hz، ونافذة TYPE_APPLICATION_OVERLAY.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 size={12} /> Android 14/15 Ready
            </span>
            <span>•</span>
            <span className="text-cyan-400">Google Pixel 8 Tuned</span>
          </div>
        </div>

        {/* Tab 1: Simulator View (Device + Customizer + Live Preview) */}
        {activeTab === 'simulator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Pixel 8 Phone Simulator */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <Pixel8Simulator
                apps={apps}
                settings={settings}
                isServiceRunning={isServiceRunning}
                hasPermission={hasPermission}
                integrationMode={settings.integrationMode}
                onSelectIntegrationMode={(mode) =>
                  handleUpdateSettings({ integrationMode: mode })
                }
                onToggleService={handleToggleService}
                onRequestPermission={() => setShowPermissionModal(true)}
              />
            </div>

            {/* Right Column: Settings + Live Controls + Architecture Summary */}
            <div className="lg:col-span-7 space-y-6">
              <SettingsPanel
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
                hasPermission={hasPermission}
                isServiceRunning={isServiceRunning}
                onTogglePermission={handleTogglePermission}
                onToggleService={handleToggleService}
              />

              {/* Quick Code Preview snippet */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <Terminal size={16} className="text-cyan-400" />
                    <span>كود RenderEffect الفعلي المستخدم في Jetpack Compose</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('code')}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
                  >
                    عرض كل الملفات ←
                  </button>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 font-mono text-xs text-slate-300 ltr text-left overflow-x-auto">
                  <span className="text-purple-400">Modifier</span>.<span className="text-blue-400">graphicsLayer</span> {'{\n'}
                  {'  '}<span className="text-amber-400">if</span> (Build.VERSION.SDK_INT &gt;= Build.VERSION_CODES.S) {'{\n'}
                  {'    '}renderEffect = RenderEffect.<span className="text-emerald-400">createBlurEffect</span>({settings.blurRadius}.dp.toPx(), {settings.blurRadius}.dp.toPx(), Shader.TileMode.CLAMP).<span className="text-cyan-400">asComposeRenderEffect</span>(){'\n'}
                  {'  }\n'}
                  {'}'}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  هذا الكود ينفذ معالجة الضبابية مباشرة على بطاقة الرسوميات GPU بدون أي بطء في معدل الإطارات 120fps على شاشة Pixel 8.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Full Code Viewer */}
        {activeTab === 'code' && (
          <div className="h-[750px]">
            <AndroidCodeViewer />
          </div>
        )}

        {/* Tab 3: Architecture Guide */}
        {activeTab === 'guide' && (
          <div className="space-y-6">
            <ArchitectureGuide />
          </div>
        )}
      </main>

      {/* Permission Request Modal Simulation */}
      <PermissionModal
        isOpen={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
        onGrant={() => {
          setHasPermission(true);
          setIsServiceRunning(true);
        }}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500">
        مشروع Pixel 8 iOS Floating Dock • مصمم بشراكة احترافية وأكواد Kotlin & Jetpack Compose نظيفة 100%
      </footer>
    </div>
  );
}
