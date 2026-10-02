import { useState } from 'react';
import { Flower2, Moon, Sparkles, Heart, Droplet, Sun, Coffee, Dumbbell, Salad, Brain } from 'lucide-react';

const PHASES = [
  { id: 'menstrual', label: 'الحيض', days: '1-5', color: 'bg-error-500', emoji: '🌑' },
  { id: 'follicular', label: 'الجريبي', days: '6-13', color: 'bg-brand-500', emoji: '🌒' },
  { id: 'ovulation', label: 'التبويض', days: '14-16', color: 'bg-accent-500', emoji: '🌕' },
  { id: 'luteal', label: 'الأصفر', days: '17-28', color: 'bg-warning-500', emoji: '🌖' },
];

const TIPS: Record<string, { icon: typeof Sun; text: string; color: string }[]> = {
  ovulation: [
    { icon: Sun, text: 'طاقة عالية — وقت مثالي للتمارين المكثفة', color: 'text-accent-500' },
    { icon: Heart, text: 'استغل النشاط الاجتماعي والتواصل', color: 'text-pink-500' },
    { icon: Salad, text: 'ركّز على الأطعمة الغنية بالألياف', color: 'text-success-500' },
  ],
  luteal: [
    { icon: Coffee, text: 'قلل الكافيين لتخفيف التوتر', color: 'text-warning-500' },
    { icon: Moon, text: 'نم مبكراً وحافظ على روتين نوم', color: 'text-brand-500' },
    { icon: Brain, text: 'مارس التأمل لتهدئة تقلب المزاج', color: 'text-purple-500' },
  ],
  menstrual: [
    { icon: Droplet, text: 'اشرب ماء أكثر لتخفيف الانتفاخ', color: 'text-brand-500' },
    { icon: Moon, text: 'استرح أكثر وقلل النشاط البدني', color: 'text-error-500' },
    { icon: Salad, text: 'أطعمة غنية بالحديد وفيتامين C', color: 'text-accent-500' },
  ],
  follicular: [
    { icon: Dumbbell, text: 'ابدأ بتمارين القلب تدريجياً', color: 'text-brand-500' },
    { icon: Sun, text: 'اخرج للشمس لرفع فيتامين د', color: 'text-warning-500' },
    { icon: Sparkles, text: 'وقت جيد لمحاولة عادات جديدة', color: 'text-accent-500' },
  ],
};

export default function FemaleHealth() {
  const [cycleDay, setCycleDay] = useState(14);
  const cycleLength = 28;
  const progress = Math.round((cycleDay / cycleLength) * 100);

  const currentPhase = cycleDay <= 5 ? 'menstrual' : cycleDay <= 13 ? 'follicular' : cycleDay <= 16 ? 'ovulation' : 'luteal';
  const phaseInfo = PHASES.find((p) => p.id === currentPhase)!;
  const tips = TIPS[currentPhase] || [];

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Cycle Tracker */}
      <div className="card p-5 animate-fade-up bg-gradient-to-br from-pink-500/5 to-transparent">
        <div className="flex items-center gap-2 mb-4">
          <Flower2 size={20} className="text-pink-500" />
          <h2 className="font-bold text-lg">تتبع الدورة والمرحلة الهرمونية</h2>
        </div>

        <div className="flex items-center gap-5">
          {/* Cycle ring */}
          <div className="relative w-28 h-28 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-slate-800" />
              <circle
                cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round"
                className="text-pink-500 transition-all duration-700"
                strokeDasharray={`${(progress / 100) * 264} 264`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-extrabold">{cycleDay}</span>
              <span className="text-[10px] text-slate-400">يوم</span>
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">{phaseInfo.emoji}</span>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">المرحلة الحالية</p>
                <p className="font-bold text-sm text-pink-600 dark:text-pink-400">{phaseInfo.label} (يوم {phaseInfo.days})</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">الدورة القادمة</p>
              <p className="font-bold text-sm">بعد {cycleLength - cycleDay} يوماً</p>
            </div>
          </div>
        </div>

        {/* Day slider */}
        <div className="mt-4">
          <input
            type="range" min="1" max="28" value={cycleDay}
            onChange={(e) => setCycleDay(parseInt(e.target.value))}
            className="w-full accent-pink-500"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>اليوم 1</span>
            <span>اليوم 28</span>
          </div>
        </div>

        {/* Phase indicators */}
        <div className="flex gap-1.5 mt-3">
          {PHASES.map((p) => (
            <div key={p.id} className={`flex-1 h-2 rounded-full transition-all ${currentPhase === p.id ? p.color : 'bg-slate-100 dark:bg-slate-800'}`} />
          ))}
        </div>
      </div>

      {/* Phase-specific lifestyle tips */}
      <div className="card p-5 animate-fade-up">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={18} className="text-pink-500" />
          <h2 className="font-bold text-base">نصائح حسب المرحلة</h2>
        </div>
        <div className="space-y-2.5">
          {tips.map((tip, i) => {
            const Icon = tip.icon;
            return (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 animate-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
                <div className={`w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 ${tip.color}`}>
                  <Icon size={16} />
                </div>
                <p className="text-sm font-medium pt-1">{tip.text}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* PMS Symptoms */}
      <div className="card p-5 animate-fade-up">
        <div className="flex items-center gap-2 mb-4">
          <Moon size={18} className="text-purple-500" />
          <h2 className="font-bold text-base">سجل الأعراض والمزاج</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {[
            { label: 'تقلب المزاج', level: 'متوسط', color: 'text-warning-600 bg-warning-500/10' },
            { label: 'الإرهاق', level: 'خفيف', color: 'text-brand-600 bg-brand-500/10' },
            { label: 'الانتفاخ', level: 'خفيف', color: 'text-success-600 bg-success-500/10' },
            { label: 'الصداع', level: 'لا يوجد', color: 'text-slate-500 bg-slate-500/10' },
            { label: 'تشنجات', level: 'متوسط', color: 'text-error-600 bg-error-500/10' },
            { label: 'الرغبة الغذائية', level: 'خفيف', color: 'text-warning-600 bg-warning-500/10' },
          ].map((sym, i) => (
            <div key={sym.label} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 animate-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
              <p className="text-xs font-semibold mb-1">{sym.label}</p>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${sym.color}`}>{sym.level}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Hormonal Health */}
      <div className="card p-5 animate-fade-up">
        <div className="flex items-center gap-2 mb-4">
          <Heart size={18} className="text-pink-500" />
          <h2 className="font-bold text-base">مؤشرات الصحة الهرمونية</h2>
        </div>
        <div className="space-y-3">
          {[
            { label: 'الإستروجين', value: 'طبيعي', pct: 65, color: 'bg-pink-500' },
            { label: 'البروجسترون', value: 'طبيعي', pct: 50, color: 'bg-purple-500' },
            { label: 'الحديد (فيريتين)', value: 'منخفض قليلاً', pct: 35, color: 'bg-warning-500' },
          ].map((h, i) => (
            <div key={h.label} className="animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-sm font-semibold">{h.label}</p>
                <span className="text-xs text-slate-500 dark:text-slate-400">{h.value}</span>
              </div>
              <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className={`h-full rounded-full ${h.color} transition-all duration-700`} style={{ width: `${h.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
