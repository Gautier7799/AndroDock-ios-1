import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Search,
  Check,
  Plus,
  Sparkles,
  Layers,
  Smartphone,
  MoveHorizontal,
  Info
} from 'lucide-react';

interface AndroidWidgetsPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWidget: (size: '4x1' | '5x1') => void;
}

export const AndroidWidgetsPickerModal: React.FC<AndroidWidgetsPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectWidget
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="w-full max-h-[85%] bg-slate-900 border-t border-slate-700 rounded-t-[32px] p-4 text-slate-100 flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Header Drag Handle */}
            <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-3" />

            {/* Header Title */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                  <Layers size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">ودجات Pixel Launcher</h3>
                  <p className="text-[10px] text-slate-400">قائمة ودجات نظام أندرويد 15 الرسمية</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            {/* Android Widgets Search */}
            <div className="my-3 bg-slate-950 border border-slate-800 rounded-full px-3 py-1.5 flex items-center gap-2 text-xs text-slate-400">
              <Search size={14} className="text-slate-500" />
              <span>بحث في ودجات النظام (AppWidgets)...</span>
            </div>

            {/* Widgets List */}
            <div className="flex-1 overflow-y-auto space-y-4 py-1 pr-1">
              {/* App Section: iOS Dock */}
              <div className="bg-slate-950/70 border border-cyan-500/30 rounded-2xl p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                      D
                    </div>
                    <span className="text-xs font-bold text-white">iOS Dock (Jetpack Glance)</span>
                  </div>
                  <span className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded-full font-mono">
                    2 ويدجات متاحة
                  </span>
                </div>

                {/* Widget Variant 1: 5x1 */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-slate-200">iOS Dock الكامل (5x1)</div>
                      <div className="text-[10px] text-slate-400">5 تطبيقات سريعة مع تأثير زجاجي وشارات</div>
                    </div>
                    <button
                      onClick={() => {
                        onSelectWidget('5x1');
                        onClose();
                      }}
                      className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-md transition-all active:scale-95"
                    >
                      <Plus size={13} />
                      <span>إضافة للشاشة</span>
                    </button>
                  </div>

                  {/* Visual preview */}
                  <div className="w-full h-12 bg-slate-950/80 border border-white/10 rounded-2xl flex items-center justify-around px-3">
                    {['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'].map((color, i) => (
                      <div
                        key={i}
                        className="w-7 h-7 rounded-xl flex items-center justify-center text-white text-[9px] font-bold shadow-sm"
                        style={{ backgroundColor: color }}
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Widget Variant 2: 4x1 */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-slate-200">iOS Dock المدمج (4x1)</div>
                      <div className="text-[10px] text-slate-400">4 تطبيقات أساسية متناسقة مع شبكة Pixel 8</div>
                    </div>
                    <button
                      onClick={() => {
                        onSelectWidget('4x1');
                        onClose();
                      }}
                      className="bg-slate-800 hover:bg-slate-700 text-cyan-400 font-semibold text-xs px-3 py-1 rounded-full flex items-center gap-1 border border-cyan-500/20 transition-all active:scale-95"
                    >
                      <Plus size={13} />
                      <span>إضافة</span>
                    </button>
                  </div>

                  {/* Visual preview */}
                  <div className="w-full h-12 bg-slate-950/80 border border-white/10 rounded-2xl flex items-center justify-around px-6">
                    {['#3b82f6', '#10b981', '#f59e0b', '#ec4899'].map((color, i) => (
                      <div
                        key={i}
                        className="w-7 h-7 rounded-xl flex items-center justify-center text-white text-[9px] font-bold shadow-sm"
                        style={{ backgroundColor: color }}
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Informative Note */}
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2 text-[10px] text-slate-400">
                <Info size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  ودجات الشاشة الرئيسية المبنية بـ <strong className="text-slate-200">Jetpack Glance</strong> تدمج مباشرة في لانشر Pixel وتستهلك 0% بطارية وتفتح التطبيقات بنقرة واحدة دون الحاجة لأي صلاحيات.
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
