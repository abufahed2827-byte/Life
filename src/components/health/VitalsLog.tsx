import { useState } from 'react';
import { Activity, Gauge, Droplet, Heart, Plus, X, type LucideIcon } from 'lucide-react';

type VitalType = 'bp' | 'sugar' | 'hr';

interface Vital {
  id: string;
  type: VitalType;
  value: string;
  time: string;
}

const META: Record<VitalType, { icon: LucideIcon; color: string; bg: string; unit: string; label: string; placeholder: string }> = {
  bp: { icon: Gauge, color: 'text-error-500', bg: 'bg-error-500/10', unit: 'mmHg', label: 'ضغط الدم', placeholder: '120/80' },
  sugar: { icon: Droplet, color: 'text-brand-500', bg: 'bg-brand-500/10', unit: 'mg/dL', label: 'سكر الدم', placeholder: '95' },
  hr: { icon: Heart, color: 'text-error-400', bg: 'bg-error-400/10', unit: 'bpm', label: 'نبضات القلب', placeholder: '72' },
};

const INITIAL: Vital[] = [
  { id: '1', type: 'bp', value: '120/80', time: 'اليوم 9:30 ص' },
  { id: '2', type: 'sugar', value: '95', time: 'اليوم 10:00 ص' },
  { id: '3', type: 'hr', value: '72', time: 'اليوم 10:00 ص' },
];

export default function VitalsLog() {
  const [vitals, setVitals] = useState<Vital[]>(INITIAL);
  const [showAdd, setShowAdd] = useState(false);
  const [type, setType] = useState<VitalType>('bp');
  const [value, setValue] = useState('');

  const add = () => {
    if (!value.trim()) return;
    setVitals((vs) => [{ id: Date.now().toString(), type, value, time: 'الآن' }, ...vs]);
    setValue('');
    setShowAdd(false);
  };

  return (
    <div className="animate-fade-up">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <Activity size={18} className="text-brand-500" />
          <h2 className="font-bold text-lg">سجل القياسات الحيوية</h2>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 bg-brand-500/10 hover:bg-brand-500/20 px-3 py-1.5 rounded-lg transition">
          <Plus size={14} />
          قياس جديد
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {(Object.keys(META) as VitalType[]).map((vt) => {
          const latest = vitals.find((v) => v.type === vt);
          const m = META[vt];
          const Icon = m.icon;
          return (
            <div key={vt} className="card p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-9 h-9 rounded-lg ${m.bg} ${m.color} flex items-center justify-center`}>
                  <Icon size={18} />
                </div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{m.label}</p>
              </div>
              {latest ? (
                <>
                  <p className="text-xl font-extrabold">{latest.value} <span className="text-xs font-normal text-slate-400">{m.unit}</span></p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{latest.time}</p>
                </>
              ) : (
                <p className="text-sm text-slate-400 mt-1">لا يوجد قياس</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Add modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setShowAdd(false)}>
          <div className="card p-6 w-full max-w-md animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">إضافة قياس جديد</h3>
              <button onClick={() => setShowAdd(false)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3">
              {/* Type selector */}
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(META) as VitalType[]).map((vt) => {
                  const m = META[vt];
                  const Icon = m.icon;
                  return (
                    <button
                      key={vt}
                      onClick={() => setType(vt)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition ${type === vt ? 'border-brand-500 bg-brand-500/10' : 'border-slate-200 dark:border-slate-700'}`}
                    >
                      <Icon size={20} className={m.color} />
                      <span className="text-[10px] font-semibold">{m.label}</span>
                    </button>
                  );
                })}
              </div>
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={META[type].placeholder}
                className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 outline-none px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-400"
              />
              <button onClick={add} className="w-full rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold py-2.5 text-sm transition">حفظ القياس</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
