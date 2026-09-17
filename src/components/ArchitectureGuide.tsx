import React from 'react';
import {
  Layers,
  Shield,
  Sparkles,
  Zap,
  Activity,
  Cpu,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const ArchitectureGuide: React.FC = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
          <Cpu size={22} />
        </div>
        <div>
          <h2 className="text-base font-bold text-white">دليل الهندسة المعمارية وأسرار التنفيذ لـ Pixel 8</h2>
          <p className="text-xs text-slate-400">
            أفضل الممارسات البرمجية المعتمدة لضمان استقرار 100% وأداء فائق
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: WindowManager Overlay */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
            <Layers size={16} />
            <span>1. تقنية الطفو العائم (WindowManager Overlay)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            تم ضبط نافذة الـ Dock بنوع <code className="text-cyan-300 font-mono text-[11px]">TYPE_APPLICATION_OVERLAY</code> المخصص لنظام أندرويد 8+ وحتى أندرويد 15، مع تفعيل الرايات:
          </p>
          <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside">
            <li><span className="text-slate-200">FLAG_NOT_FOCUSABLE:</span> للسماح للمستخدم بلمس واستخدام التطبيقات الواقعة خلف الـ Dock دون حجبها.</li>
            <li><span className="text-slate-200">FLAG_LAYOUT_NO_LIMITS:</span> ليتجاوز حدود الشاشة وشريط الإيماءات في Pixel 8 بانسيابية.</li>
            <li><span className="text-slate-200">FLAG_HARDWARE_ACCELERATED:</span> لاستخدام معالج الرسوميات (GPU) لتحقيق 120 إطاراً في الثانية.</li>
          </ul>
        </div>

        {/* Card 2: RenderEffect Frosted Glass */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
            <Sparkles size={16} />
            <span>2. تأثير الزجاج الضبابي (iOS Blur عبر RenderEffect)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            بدءاً من Android 12 (API 31+)، وفرت جوجل محرك <code className="text-amber-300 font-mono text-[11px]">RenderEffect.createBlurEffect</code> المدمج مع Skia HW Engine:
          </p>
          <div className="bg-slate-900 p-2.5 rounded-xl font-mono text-[10px] text-amber-200 ltr text-left">
            renderEffect = RenderEffect.createBlurEffect(radiusX, radiusY, Shader.TileMode.CLAMP)
          </div>
          <p className="text-[11px] text-slate-400">
            يتم تطبيق التأثير مباشرة على الـ GraphicsLayer داخل Jetpack Compose دون هدر الذاكرة أو بطء الرسم القديم.
          </p>
        </div>

        {/* Card 3: 120Hz Spring Physics */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
            <Zap size={16} />
            <span>3. فيزياء النوابض وسلاسة 120Hz (Pixel 8 Actua)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            تتم مزامنة الانتقالات باستخدام <code className="text-emerald-300 font-mono text-[11px]">spring(DampingRatioMediumBouncy, StiffnessLow)</code>:
          </p>
          <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside">
            <li>تكبير الأيقونة الملموسة بنسبة 130% مع تأثير Magnification للأيقونات المجاورة بنسبة 112%.</li>
            <li>مزامنة كاملة مع معدل تحديث شاشة Pixel 8 بتردد 120Hz لتجربة تشبه شريط أجهزة Mac و iOS تماماً.</li>
          </ul>
        </div>

        {/* Card 4: Foreground Service & Battery Optimization */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
            <Shield size={16} />
            <span>4. حماية الذاكرة (RAM Guard) وطلب الأذونات</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            لضمان عدم إغلاق النظام للـ Dock عند فتح ألعاب ثقيلة أو تطبيقات متعددة:
          </p>
          <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside">
            <li>تعمل كـ <span className="text-slate-200">Foreground Service</span> مع إشعار صامت ذي أولوية منخفضة <code className="text-purple-300 font-mono text-[10px]">PRIORITY_MIN</code>.</li>
            <li>إضافة كود فحص <code className="text-purple-300 font-mono text-[10px]">ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS</code> لمنع وضع السبات (Doze Mode).</li>
            <li>طلب إذن <code className="text-purple-300 font-mono text-[10px]">SYSTEM_ALERT_WINDOW</code> عبر <code className="text-purple-300 font-mono text-[10px]">ActivityResultContracts</code> النظيفة.</li>
          </ul>
        </div>
      </div>

      {/* Critical Pro Tip */}
      <div className="bg-cyan-950/40 border border-cyan-500/30 rounded-2xl p-4 flex items-start gap-3">
        <div className="text-cyan-400 mt-0.5">
          <CheckCircle2 size={18} />
        </div>
        <div className="text-xs space-y-1">
          <div className="font-bold text-cyan-200">
            حل المشكلة الشهيرة: تشغيل ComposeView داخل Service بدون Activity
          </div>
          <p className="text-slate-300 leading-relaxed">
            في أندرويد العادي، يفشل Jetpack Compose داخل الخدمة بسبب غياب <code className="text-cyan-300 font-mono text-[10px]">ViewTreeLifecycleOwner</code>. قمنا بإنشاء <code className="text-cyan-300 font-mono text-[10px]">CustomServiceLifecycleOwner</code> مخصص يتولى تسجيل وإدارة دورة حياة الـ ComposeView بنجاح وبدون أي انهيار!
          </p>
        </div>
      </div>
    </div>
  );
};
