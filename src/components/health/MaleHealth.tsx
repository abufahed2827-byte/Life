import { useState } from 'react';
import { Dumbbell, HeartPulse, BatteryCharging, Zap, Moon, Sparkles, Clock, Weight, Activity, Flame, Beef, Pill } from 'lucide-react';

export default function MaleHealth() {
  const [intensity, setIntensity] = useState(75);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Physical Performance */}
      <div className="card p-5 animate-fade-up bg-gradient-to-br from-brand-500/5 to-transparent">
        <div className="flex items-center gap-2 mb-4">
          <Dumbbell size={20} className="text-brand-500" />
          <h2 className="font-bold text-lg">الأداء البدني وشدة التمارين</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {[
            { label: 'تمارين/أسبوع', value: '5', icon: Dumbbell },
            { label: 'المدة', value: '4.5س', icon: Clock },
            { label: 'أقصى رفع', value: '85kg', icon: Weight },
            { label: 'النشاط', value: 'عالي', icon: Activity },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                <Icon size={16} className="text-brand-500 mb-1.5" />
                <p className="text-xl font-extrabold">{s.value}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">{s.label}</p>
              </div>
            );
          })}
        </div>
        {/* Intensity slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">شدة التمرين اليوم</p>
            <span className="text-sm font-bold text-brand-600 dark:text-brand-400">{intensity}%</span>
          </div>
          <input
            type="range" min="0" max="100" value={intensity}
            onChange={(e) => setIntensity(parseInt(e.target.value))}
            className="w-full accent-brand-500"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>راحة</span>
            <span>متوسط</span>
            <span>مكثف</span>
          </div>
        </div>
      </div>

      {/* Muscle Recovery */}
      <div className="card p-5 animate-fade-up">
        <div className="flex items-center gap-2 mb-4">
          <HeartPulse size={18} className="text-error-500" />
          <h2 className="font-bold text-base">تعافي العضلات</h2>
        </div>
        <div className="space-y-3">
          {[
            { label: 'الصدر', value: 'متعافي', pct: 90, color: 'bg-success-500' },
            { label: 'الظهر', value: 'متعب قليلاً', pct: 55, color: 'bg-warning-500' },
            { label: 'الأرجل', value: 'بحاجة لراحة', pct: 30, color: 'bg-error-500' },
            { label: 'الأكتاف', value: 'متعافي', pct: 85, color: 'bg-success-500' },
          ].map((m, i) => (
            <div key={m.label} className="animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-sm font-semibold">{m.label}</p>
                <span className="text-xs text-slate-500 dark:text-slate-400">{m.value}</span>
              </div>
              <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className={`h-full rounded-full ${m.color} transition-all duration-700`} style={{ width: `${m.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testosterone & Stamina Support */}
      <div className="card p-5 animate-fade-up">
        <div className="flex items-center gap-2 mb-4">
          <Zap size={18} className="text-brand-500" />
          <h2 className="font-bold text-base">دعم التستوستيرون والقدرة</h2>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: 'مستوى الطاقة', value: '82%', icon: Zap, color: 'text-accent-500' },
            { label: 'جودة النوم', value: '7.5س', icon: Moon, color: 'text-brand-500' },
            { label: 'التركيز', value: 'عالي', icon: Sparkles, color: 'text-warning-500' },
          ].map((m, i) => {
            const Icon = m.icon;
            return (
              <div key={m.label} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                <Icon size={22} className={`mx-auto mb-2 ${m.color}`} />
                <p className="text-xl font-extrabold">{m.value}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">{m.label}</p>
              </div>
            );
          })}
        </div>
        {/* Recommendations */}
        <div className="space-y-2.5">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">توصيات مخصصة:</p>
          {[
            { icon: Beef, text: 'زيادة البروتين 1.6غ/كغ من وزن الجسم', color: 'text-error-500' },
            { icon: Moon, text: 'النوم 7-9 ساعات لرفع التستوستيرون', color: 'text-brand-500' },
            { icon: Pill, text: 'فيتامين د وزنك السيلينيوم — استشر طبيبك', color: 'text-warning-500' },
            { icon: Flame, text: 'تمارين مركبة (squats, deadlifts) 3x/أسبوع', color: 'text-accent-500' },
          ].map((rec, i) => {
            const Icon = rec.icon;
            return (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 animate-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
                <div className={`w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 ${rec.color}`}>
                  <Icon size={16} />
                </div>
                <p className="text-sm font-medium pt-1">{rec.text}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Energy & Vitality */}
      <div className="card p-5 animate-fade-up bg-gradient-to-br from-accent-500/5 to-transparent">
        <div className="flex items-center gap-2 mb-4">
          <BatteryCharging size={18} className="text-accent-500" />
          <h2 className="font-bold text-base">الطاقة والحيوية</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'السعرات المحروقة', value: '440', sub: 'كالوري', icon: Flame, color: 'text-error-500' },
            { label: 'الترطيب', value: '1.5L', sub: 'ماء', icon: Moon, color: 'text-brand-500' },
          ].map((m, i) => {
            const Icon = m.icon;
            return (
              <div key={m.label} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                <Icon size={20} className={`mb-2 ${m.color}`} />
                <p className="text-xl font-extrabold">{m.value} <span className="text-xs font-normal text-slate-400">{m.sub}</span></p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">{m.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
