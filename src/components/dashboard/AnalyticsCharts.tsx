import { TrendingUp, Flame, Zap, Battery, CheckCircle2 } from 'lucide-react';

const WEEK_DAYS = ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
const TASK_DATA = [5, 7, 4, 8, 6, 9, 7];
const MAX_TASKS = 10;

const HABITS = [
  { name: 'شرب الماء', streak: 12, emoji: '💧', color: 'from-brand-500 to-cyan-500' },
  { name: 'الرياضة', streak: 5, emoji: '💪', color: 'from-accent-500 to-teal-500' },
  { name: 'القراءة', streak: 8, emoji: '📚', color: 'from-warning-500 to-orange-500' },
  { name: 'النوم المبكر', streak: 3, emoji: '😴', color: 'from-purple-500 to-indigo-500' },
];

const ENERGY_DATA = [
  { label: 'الطاقة', value: 78, icon: Zap, color: 'text-warning-500', bg: 'from-warning-500 to-orange-500' },
  { label: 'التعافي', value: 65, icon: Battery, color: 'text-success-500', bg: 'from-success-500 to-teal-500' },
];

export default function AnalyticsCharts() {
  return (
    <div className="space-y-4 animate-fade-in">
      {/* Weekly task completion chart */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={20} className="text-brand-500" />
          <h2 className="font-bold text-base">إكمال المهام الأسبوعي</h2>
        </div>
        <div className="flex items-end justify-between gap-2 h-40">
          {TASK_DATA.map((v, i) => {
            const height = (v / MAX_TASKS) * 100;
            const isToday = i === 5;
            return (
              <div key={i} className="flex flex-col items-center gap-1.5 flex-1 animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">{v}</span>
                <div className="w-full flex items-end h-full">
                  <div
                    className={`w-full rounded-t-lg transition-all duration-700 ${isToday ? 'bg-gradient-to-t from-brand-600 to-accent-500' : 'bg-gradient-to-t from-brand-500/60 to-brand-400/60'}`}
                    style={{ height: `${height}%` }}
                  />
                </div>
                <span className={`text-[10px] font-semibold ${isToday ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 dark:text-slate-500'}`}>{WEEK_DAYS[i].slice(0, 3)}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400">المتوسط: 6.6 مهام/يوم</span>
          <span className="flex items-center gap-1 text-success-500 font-semibold">
            <TrendingUp size={12} />
            +12% عن الأسبوع الماضي
          </span>
        </div>
      </div>

      {/* Habit streaks */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Flame size={20} className="text-error-500" />
          <h2 className="font-bold text-base">الالتزام بالعادات</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {HABITS.map((h, i) => (
            <div key={h.name} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 animate-fade-up" style={{ animationDelay: `${i * 70}ms` }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{h.emoji}</span>
                <div className="flex items-center gap-1">
                  <Flame size={14} className="text-error-500" />
                  <span className="text-sm font-extrabold text-error-500">{h.streak}</span>
                </div>
              </div>
              <p className="text-xs font-semibold mb-1.5">{h.name}</p>
              <div className="flex gap-0.5">
                {Array.from({ length: 7 }, (_, d) => (
                  <div
                    key={d}
                    className={`h-1.5 flex-1 rounded-full ${d < Math.min(h.streak, 7) ? `bg-gradient-to-r ${h.color}` : 'bg-slate-200 dark:bg-slate-700'}`}
                  />
                ))}
              </div>
              <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-1">{h.streak} يوم متتالي</p>
            </div>
          ))}
        </div>
      </div>

      {/* Energy & Recovery levels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {ENERGY_DATA.map((e, i) => {
          const Icon = e.icon;
          return (
            <div key={e.label} className="card p-5 animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${e.bg} flex items-center justify-center text-white`}>
                    <Icon size={18} />
                  </div>
                  <h3 className="font-bold text-sm">{e.label}</h3>
                </div>
                <span className={`text-2xl font-extrabold ${e.color}`}>{e.value}%</span>
              </div>
              {/* Radial gauge */}
              <div className="relative h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className={`h-full rounded-full bg-gradient-to-r ${e.bg} transition-all duration-1000`} style={{ width: `${e.value}%` }} />
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500 dark:text-slate-400">
                <CheckCircle2 size={12} className="text-success-500" />
                {e.value >= 70 ? 'مستوى ممتاز' : e.value >= 50 ? 'مستوى جيد' : 'يحتاج راحة'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
