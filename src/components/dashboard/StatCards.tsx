import { CheckCircle2, Brain, Smile, Package } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Stat {
  label: string;
  value: string | number;
  hint: string;
  icon: LucideIcon;
  gradient: string;
  iconBg: string;
}

const STATS: Stat[] = [
  {
    label: 'المهام اليومية',
    value: '5',
    hint: '3 مكتملة',
    icon: CheckCircle2,
    gradient: 'from-brand-500/10 to-brand-500/5',
    iconBg: 'bg-brand-500',
  },
  {
    label: 'تتبع المزاج',
    value: '7',
    hint: 'أيام متتالية',
    icon: Brain,
    gradient: 'from-accent-500/10 to-accent-500/5',
    iconBg: 'bg-accent-500',
  },
  {
    label: 'حالة المزاج اليوم',
    value: 'جيد',
    hint: 'مستقر',
    icon: Smile,
    gradient: 'from-success-500/10 to-success-500/5',
    iconBg: 'bg-success-500',
  },
  {
    label: 'المقتنيات المسجلة',
    value: '128',
    hint: 'في 6 فئات',
    icon: Package,
    gradient: 'from-warning-500/10 to-warning-500/5',
    iconBg: 'bg-warning-500',
  },
];

export default function StatCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {STATS.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className={`card card-hover p-4 sm:p-5 bg-gradient-to-br ${stat.gradient} animate-fade-up`}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-11 h-11 rounded-xl ${stat.iconBg} flex items-center justify-center text-white shadow-md`}>
                <Icon size={22} />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold mb-0.5">{stat.value}</p>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{stat.label}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{stat.hint}</p>
          </div>
        );
      })}
    </div>
  );
}
