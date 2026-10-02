import { useState } from 'react';
import { ShoppingBag, Scan, Check, ExternalLink, Sparkles, TrendingUp } from 'lucide-react';

interface Suggestion {
  id: string;
  name: string;
  category: string;
  reason: string;
  emoji: string;
  priority: 'high' | 'medium' | 'low';
  priceRange: string;
}

const SUGGESTIONS: Suggestion[] = [
  {
    id: '1',
    name: 'حذاء كلاسيكي أسود',
    category: 'أحذية',
    reason: 'لا تملك حذاءً رسمياً أسود — ضروري للمناسبات الرسمية',
    emoji: '👞',
    priority: 'high',
    priceRange: '200-400 ريال',
  },
  {
    id: '2',
    name: 'جاكيت دنيم',
    category: 'جواكيت',
    reason: 'قطعة متعددة الاستخدامات تكمل إطلالات الكاجوال',
    emoji: '🧥',
    priority: 'medium',
    priceRange: '150-300 ريال',
  },
  {
    id: '3',
    name: 'حزام جلدي بني',
    category: 'إكسسوارات',
    reason: 'يفتقر خزانتك لإكسسوار أساسي يكمل الإطلالات الرسمية',
    emoji: '👔',
    priority: 'medium',
    priceRange: '50-120 ريال',
  },
];

const PRIORITY_META = {
  high: { label: 'عالية', color: 'text-error-600 dark:text-error-400', bg: 'bg-error-500/10' },
  medium: { label: 'متوسطة', color: 'text-warning-600 dark:text-warning-400', bg: 'bg-warning-500/10' },
  low: { label: 'منخفضة', color: 'text-brand-600 dark:text-brand-400', bg: 'bg-brand-500/10' },
};

export default function MissingEssentials() {
  const [scanning, setScanning] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const analyze = () => {
    setScanning(true);
    setShowResults(false);
    setTimeout(() => {
      setScanning(false);
      setShowResults(true);
    }, 1800);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Analyzer */}
      <div className="card p-5 bg-gradient-to-br from-warning-500/5 to-transparent">
        <div className="flex items-center gap-2 mb-4">
          <ShoppingBag size={20} className="text-warning-500" />
          <h2 className="font-bold text-lg">اقترح قطعة ناقصة</h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">محلل الخزانة الذكي يفحص قطعك الحالية ويقترح ما ينقصها</p>

        {/* Scan visualization */}
        <div className="relative rounded-2xl overflow-hidden mb-4 bg-slate-50 dark:bg-slate-800/50">
          <div className="aspect-[16/5] flex items-center justify-center">
            {scanning ? (
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-700" />
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-warning-500 animate-spin" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-warning-500">جاري تحليل الخزانة...</p>
                  <p className="text-[10px] text-slate-400">فحص 8 قطع · مطابقة التنسيقات</p>
                </div>
              </div>
            ) : showResults ? (
              <div className="flex items-center gap-2 text-success-500">
                <Check size={20} />
                <span className="text-sm font-semibold">اكتمل التحليل — 3 قطع مقترحة</span>
              </div>
            ) : (
              <div className="text-center">
                <Scan size={28} className="mx-auto mb-1 text-slate-400" />
                <p className="text-xs text-slate-400">اضغط لبدء التحليل</p>
              </div>
            )}
          </div>
          {scanning && <div className="absolute left-0 right-0 h-0.5 bg-warning-400 shadow-glow animate-pulse" style={{ top: '50%' }} />}
        </div>

        <button
          onClick={analyze}
          disabled={scanning}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-warning-500 hover:bg-warning-600 text-white font-bold text-sm py-3 transition shadow-md disabled:opacity-60"
        >
          <Scan size={18} />
          {scanning ? 'جاري التحليل...' : 'تحليل الخزانة'}
        </button>
      </div>

      {/* Results */}
      {showResults && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <TrendingUp size={16} className="text-warning-500" />
            <p className="text-sm font-bold">قطع مقترحة لإكمال خزانتك</p>
          </div>
          {SUGGESTIONS.map((s, i) => {
            const meta = PRIORITY_META[s.priority];
            return (
              <div key={s.id} className="card p-4 animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-warning-500/10 to-brand-500/10 flex items-center justify-center text-2xl shrink-0">
                    {s.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-sm">{s.name}</p>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${meta.bg} ${meta.color}`}>{meta.label}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{s.reason}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">{s.category}</span>
                      <span className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-success-500/10 text-success-600 dark:text-success-400">{s.priceRange}</span>
                      <button className="flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 hover:bg-brand-500/20 transition">
                        <ExternalLink size={10} />
                        تصفح
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="card p-4 bg-accent-500/5 flex items-start gap-3 animate-fade-up">
            <Sparkles size={18} className="text-accent-500 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-600 dark:text-slate-300">
              نصيحة: خزانة الكبسولة (Capsule Wardrobe) المثالية تحتوي على 30 قطعة. أنت تملك 8 قطع — أضف هذه القطع الثلاث لتبلغ 11 قطعة أساسية تغطي معظم المناسبات.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
