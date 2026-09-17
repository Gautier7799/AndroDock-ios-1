import React, { useState } from 'react';
import {
  Copy,
  Check,
  Download,
  FileCode,
  Shield,
  Zap,
  Sparkles,
  Layers,
  FolderGit2
} from 'lucide-react';
import { ANDROID_PROJECT_FILES } from '../data/androidProjectFiles';
import { exportAndroidStudioProject } from '../utils/zipExporter';

export const AndroidCodeViewer: React.FC = () => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(1); // Default to FloatingDockService.kt
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const currentFile = ANDROID_PROJECT_FILES[selectedFileIndex];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentFile.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };

  const handleExportZip = async () => {
    setIsExporting(true);
    try {
      await exportAndroidStudioProject();
    } catch (err) {
      console.error('Error generating project ZIP:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-full">
      {/* Header bar with project stats and 1-click ZIP export */}
      <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <FolderGit2 size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">مشروع Android Studio الكامل</h2>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] px-2 py-0.5 rounded-full font-mono">
                Kotlin 2.0 + Compose
              </span>
            </div>
            <p className="text-xs text-slate-400">
              ملفات المشروع جاهزة ومطابقة 100% لمواصفات Pixel 8 و Android 14/15
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Quick Jump to GitHub Actions Workflow */}
          <button
            onClick={() => {
              const workflowIdx = ANDROID_PROJECT_FILES.findIndex(
                (f) => f.path === '.github/workflows/main.yml'
              );
              if (workflowIdx !== -1) setSelectedFileIndex(workflowIdx);
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 hover:text-white rounded-xl text-xs font-semibold border border-purple-500/30 active:scale-95 transition-all"
            title="فتح ملف GitHub Actions لبناء APK تلقائياً"
            id="btn-goto-workflow"
          >
            <Zap size={13} className="text-purple-400" />
            <span>ملف GitHub Actions (APK)</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold border border-slate-700 active:scale-95 transition-all"
            title="نسخ محتوى الملف المفتوح"
            id="btn-copy-current-file"
          >
            {copied ? (
              <>
                <Check size={14} className="text-emerald-400" />
                <span className="text-emerald-400">تم النسخ بنجاح</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>نسخ الملف الحالي</span>
              </>
            )}
          </button>

          <button
            onClick={handleExportZip}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-cyan-900/30 active:scale-95 transition-all disabled:opacity-50"
            id="btn-export-zip-project"
          >
            <Download size={14} />
            <span>{isExporting ? 'جارِ تجهيز ZIP...' : 'تحميل المشروع كاملاً (ZIP)'}</span>
          </button>
        </div>
      </div>

      {/* Tabs navigation for files */}
      <div className="flex items-center gap-1 px-4 py-2 bg-slate-950/80 border-b border-slate-800/80 overflow-x-auto text-xs scrollbar-thin">
        {ANDROID_PROJECT_FILES.map((file, idx) => {
          const isSelected = selectedFileIndex === idx;
          return (
            <button
              key={file.path}
              onClick={() => setSelectedFileIndex(idx)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-slate-800 text-cyan-400 font-semibold border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
              id={`tab-file-${idx}`}
            >
              <FileCode size={13} className={isSelected ? 'text-cyan-400' : 'text-slate-500'} />
              <span>{file.title}</span>
            </button>
          );
        })}
      </div>

      {/* File Description Banner */}
      <div className="bg-slate-900/60 px-5 py-2.5 border-b border-slate-800/60 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <span className="font-bold text-white">{currentFile.titleAr}:</span>
          <span className="text-slate-400">{currentFile.descriptionAr}</span>
        </div>
        <span className="text-slate-500 font-mono text-[11px] ltr">{currentFile.path}</span>
      </div>

      {/* Code Editor Container */}
      <div className="relative flex-1 p-4 overflow-auto font-mono text-xs text-slate-300 bg-slate-950/90 leading-relaxed selection:bg-cyan-500/30">
        <pre className="overflow-x-auto pb-8 ltr text-left font-['JetBrains_Mono',monospace]">
          <code>{currentFile.code}</code>
        </pre>
      </div>

      {/* Footer key points */}
      <div className="bg-slate-950 px-5 py-3 border-t border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-3">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-emerald-400">
            <Shield size={12} />
            خالٍ من أخطاء ViewTreeLifecycleOwner
          </span>
          <span className="flex items-center gap-1 text-cyan-400">
            <Zap size={12} />
            متوافق مع 120Hz Smooth Display
          </span>
          <span className="flex items-center gap-1 text-amber-400">
            <Sparkles size={12} />
            RenderEffect Frost Blur (API 31+)
          </span>
        </div>
        <span className="text-slate-500">
          Android Studio Koala / Ladybug Ready
        </span>
      </div>
    </div>
  );
};
