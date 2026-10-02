import { useState } from 'react';
import { Scan, Camera, Sparkles, Check, Palette } from 'lucide-react';

type Undertone = 'warm' | 'cool' | 'neutral';
type BodyShape = 'triangle' | 'inverted' | 'rectangle' | 'hourglass' | 'oval';

const UNDERTONE_DATA: Record<Undertone, { label: string; description: string; colors: { name: string; hex: string }[] }> = {
  warm: {
    label: 'دافئ (Warm)',
    description: 'نغماتك تميل للأصفر والذهبي — الألوان الدافئة تناسبك',
    colors: [
      { name: 'بيج', hex: '#d4b896' },
      { name: 'أصفر خردلي', hex: '#facc15' },
      { name: 'أخضر زيتي', hex: '#84cc16' },
      { name: 'برتقالي', hex: '#fb923c' },
      { name: 'بني', hex: '#92400e' },
      { name: 'ذهبي', hex: '#eab308' },
    ],
  },
  cool: {
    label: 'بارد (Cool)',
    description: 'نغماتك تميل للأزرق والوردي — الألوان الباردة تناسبك',
    colors: [
      { name: 'كحلي', hex: '#1e3a5f' },
      { name: 'أزرق', hex: '#3b82f6' },
      { name: 'وردي', hex: '#f472b6' },
      { name: 'بنفسجي', hex: '#a855f7' },
      { name: 'أحمر بارد', hex: '#dc2626' },
      { name: 'فيروزي', hex: '#06b6d4' },
    ],
  },
  neutral: {
    label: 'محايد (Neutral)',
    description: 'نغماتك متوازنة — معظم الألوان تناسبك',
    colors: [
      { name: 'أسود', hex: '#1e293b' },
      { name: 'أبيض', hex: '#f8fafc' },
      { name: 'رمادي', hex: '#94a3b8' },
      { name: 'كحلي', hex: '#1e3a5f' },
      { name: 'أخضر داكن', hex: '#166534' },
      { name: 'خمري', hex: '#7f1d1d' },
    ],
  },
};

const BODY_DATA: Record<BodyShape, { label: string; advice: string; recommended: string[]; avoid: string[] }> = {
  triangle: {
    label: 'مثلث (Triangle)',
    advice: 'أكتاف أعرض من الخصر — ركّز على الجزء العلوي',
    recommended: ['قمصان بأكتاف عريضة', 'بنطال مستقيم', 'جواكيت بتفاصيل علوية'],
    avoid: ['بنطال ضيق جداً', 'ألوان فاتحة في الأسفل'],
  },
  inverted: {
    label: 'مثلث مقلوب (Inverted)',
    advice: 'أكتاف عريضة وخصر أضيق — وازن بالأسفل',
    recommended: ['بنطال بتفاصيل', 'ألوان فاتحة في الأسفل', 'قمصان بسيطة'],
    avoid: ['أكتاف مبالغ فيها', 'جواكيت عريضة'],
  },
  rectangle: {
    label: 'مستطيل (Rectangle)',
    advice: 'جسم متناسق — أضف انحناءات بالتنسيق',
    recommended: ['حزام عند الخصر', 'تنانير مطوية', 'طبقات متعددة'],
    avoid: ['ملابس مستقيمة جداً', 'خطوط أفقية'],
  },
  hourglass: {
    label: 'ساعة رملية (Hourglass)',
    advice: 'خصر محدد — أبرز خصرك',
    recommended: ['ملابس محسمة', 'أحزمة', 'فساتين محددة الخصر'],
    avoid: ['ملابس فضفاضة جداً', 'إخفاء الخصر'],
  },
  oval: {
    label: 'بيضاوي (Oval)',
    advice: 'وسط أعرض — ركّز على الأطراف',
    recommended: ['قمصان بطول مناسب', 'بنطال بقصة مستقيمة', 'جواكيت مفتوحة'],
    avoid: ['ملابس ضيقة على الوسط', 'أحزمة عريضة'],
  },
};

export default function ColorFitAnalysis() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<{ undertone: Undertone; bodyShape: BodyShape } | null>(null);

  const scan = () => {
    setScanning(true);
    setResult(null);
    setTimeout(() => {
      const undertones: Undertone[] = ['warm', 'cool', 'neutral'];
      const shapes: BodyShape[] = ['triangle', 'inverted', 'rectangle', 'hourglass', 'oval'];
      setResult({
        undertone: undertones[Math.floor(Math.random() * 3)],
        bodyShape: shapes[Math.floor(Math.random() * 5)],
      });
      setScanning(false);
    }, 2000);
  };

  const undertoneData = result ? UNDERTONE_DATA[result.undertone] : null;
  const bodyData = result ? BODY_DATA[result.bodyShape] : null;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Scan card */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Scan size={20} className="text-brand-500" />
          <h2 className="font-bold text-lg">تحليل الهيئة والألوان</h2>
        </div>

        {/* Camera area */}
        <div className={`relative rounded-2xl overflow-hidden mb-4 transition-all ${scanning ? 'border-2 border-brand-400' : 'border-2 border-dashed border-slate-300 dark:border-slate-700'}`}>
          <div className="aspect-[4/3] flex items-center justify-center bg-slate-50 dark:bg-slate-800/50">
            {scanning ? (
              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-3">
                  <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-700" />
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-500 animate-spin" />
                  <Camera size={28} className="absolute inset-0 m-auto text-brand-500" />
                </div>
                <p className="text-sm font-semibold text-brand-500">جاري التحليل...</p>
                <p className="text-[10px] text-slate-400 mt-1">مسح نبرة البشرة وهيئة الجسم</p>
              </div>
            ) : result ? (
              <div className="text-center py-4">
                <div className="w-14 h-14 rounded-full bg-success-500/15 flex items-center justify-center mx-auto mb-2">
                  <Check size={28} className="text-success-500" />
                </div>
                <p className="text-sm font-semibold">اكتمل التحليل</p>
              </div>
            ) : (
              <div className="text-center py-4">
                <Camera size={32} className="mx-auto mb-2 text-slate-400" />
                <p className="text-xs text-slate-500 dark:text-slate-400">اضغط لبدء المسح</p>
              </div>
            )}
          </div>
          {/* Scan line effect */}
          {scanning && (
            <div className="absolute left-0 right-0 h-0.5 bg-brand-400 shadow-glow animate-pulse" style={{ top: '50%' }} />
          )}
        </div>

        <button
          onClick={scan}
          disabled={scanning}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm py-3 transition shadow-md disabled:opacity-60"
        >
          <Scan size={18} />
          {scanning ? 'جاري المسح...' : result ? 'إعادة المسح' : 'بدء التحليل'}
        </button>
      </div>

      {/* Results */}
      {result && undertoneData && bodyData && (
        <>
          {/* Undertone */}
          <div className="card p-5 animate-scale-in">
            <div className="flex items-center gap-2 mb-3">
              <Palette size={18} className="text-pink-500" />
              <h3 className="font-bold text-base">نبرة البشرة</h3>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400">{undertoneData.label}</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{undertoneData.description}</p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">لوحة الألوان المناسبة:</p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {undertoneData.colors.map((c, i) => (
                <div key={c.name} className="flex flex-col items-center gap-1 animate-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
                  <div className="w-10 h-10 rounded-xl border-2 border-slate-200 dark:border-slate-700" style={{ backgroundColor: c.hex }} />
                  <span className="text-[9px] font-semibold">{c.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Body shape */}
          <div className="card p-5 animate-scale-in">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={18} className="text-accent-500" />
              <h3 className="font-bold text-base">هيئة الجسم</h3>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-accent-500/10 text-accent-600 dark:text-accent-400">{bodyData.label}</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{bodyData.advice}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-semibold text-success-600 dark:text-success-400 mb-2">ينصح بـ:</p>
                <div className="space-y-1.5">
                  {bodyData.recommended.map((r) => (
                    <div key={r} className="flex items-center gap-2 text-xs">
                      <Check size={12} className="text-success-500 shrink-0" />
                      {r}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-error-600 dark:text-error-400 mb-2">تجنّب:</p>
                <div className="space-y-1.5">
                  {bodyData.avoid.map((a) => (
                    <div key={a} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="w-3 h-0.5 bg-error-400 shrink-0" />
                      {a}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
