import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Layers, Check, X } from 'lucide-react';

interface PermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGrant: () => void;
}

export const PermissionModal: React.FC<PermissionModalProps> = ({
  isOpen,
  onClose,
  onGrant
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-right"
          >
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mb-4 mr-auto">
              <Layers size={24} />
            </div>

            <h3 className="text-lg font-bold text-white mb-2">
              السماح بالظهور فوق التطبيقات الأخرى؟
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              يحتاج تطبيق <span className="text-cyan-400 font-bold">Pixel 8 iOS Dock</span> إلى إذن <code className="text-cyan-300 font-mono text-[11px]">SYSTEM_ALERT_WINDOW</code> ليتمكن من عرض شريط الـ Dock العائم فوق جميع الشاشات والألعاب بسلاسة.
            </p>

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs text-slate-400 space-y-1.5 mb-6">
              <div className="flex items-center gap-2 text-slate-200 font-semibold">
                <Check size={14} className="text-emerald-400" />
                <span>الوصول السريع لتطبيقاتك المفضلة</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200 font-semibold">
                <Check size={14} className="text-emerald-400" />
                <span>حماية الخدمة من الإغلاق في الخلفية</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200 font-semibold">
                <Check size={14} className="text-emerald-400" />
                <span>عدم حجب اللمسات عن التطبيقات الأخرى</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  onGrant();
                  onClose();
                }}
                className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-lg shadow-cyan-950/50"
              >
                منح الإذن وتفعيل الـ Dock
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
