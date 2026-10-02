import { useState } from 'react';
import { Pill, Clock, BellRing, Check, Plus, X } from 'lucide-react';

interface Med {
  id: string;
  name: string;
  dose: string;
  time: string;
  taken: boolean;
}

const INITIAL: Med[] = [
  { id: '1', name: 'فيتامين د', dose: '1000 IU', time: '08:00', taken: true },
  { id: '2', name: 'أوميغا 3', dose: '500 mg', time: '13:00', taken: false },
  { id: '3', name: 'مكمل حديد', dose: '30 mg', time: '21:00', taken: false },
];

export default function MedicationTracker() {
  const [meds, setMeds] = useState<Med[]>(INITIAL);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDose, setNewDose] = useState('');
  const [newTime, setNewTime] = useState('');

  const toggle = (id: string) => setMeds((ms) => ms.map((m) => (m.id === id ? { ...m, taken: !m.taken } : m)));
  const taken = meds.filter((m) => m.taken).length;

  const add = () => {
    if (!newName.trim()) return;
    setMeds((ms) => [...ms, { id: Date.now().toString(), name: newName, dose: newDose || '—', time: newTime || '12:00', taken: false }].sort((a, b) => a.time.localeCompare(b.time)));
    setNewName(''); setNewDose(''); setNewTime('');
    setShowAdd(false);
  };

  return (
    <div className="animate-fade-up">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <Pill size={18} className="text-error-500" />
          <h2 className="font-bold text-lg">متتبع الأدوية والجرعات</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 dark:text-slate-500">{taken}/{meds.length} مكتمل</span>
          <button onClick={() => setShowAdd(true)} className="p-2 rounded-lg bg-error-500/10 text-error-500 hover:bg-error-500/20 transition" aria-label="إضافة">
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="card p-5">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute right-5 top-2 bottom-2 w-0.5 bg-slate-100 dark:bg-slate-800" />

          <div className="space-y-4">
            {meds.map((med, i) => (
              <div key={med.id} className="relative flex items-start gap-4 animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                {/* Timeline dot */}
                <button
                  onClick={() => toggle(med.id)}
                  className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                    med.taken
                      ? 'bg-success-500 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-2 border-dashed border-slate-300 dark:border-slate-600'
                  }`}
                >
                  {med.taken ? <Check size={18} /> : <Clock size={16} />}
                </button>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <div className="flex items-center gap-2">
                    <p className={`font-semibold text-sm ${med.taken ? 'line-through opacity-50' : ''}`}>{med.name}</p>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-error-500/10 text-error-600 dark:text-error-400">{med.dose}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Clock size={12} />
                      {med.time}
                    </span>
                    {!med.taken && (
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <BellRing size={11} />
                        تذكير مفعّل
                      </span>
                    )}
                  </div>
                </div>

                {/* Status badge */}
                <span className={`text-[10px] font-semibold px-2 py-1 rounded-full shrink-0 ${
                  med.taken ? 'bg-success-500/10 text-success-600 dark:text-success-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}>
                  {med.taken ? 'تم الأخذ' : 'بانتظار'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setShowAdd(false)}>
          <div className="card p-6 w-full max-w-md animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">إضافة دواء جديد</h3>
              <button onClick={() => setShowAdd(false)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3">
              <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="اسم الدواء" className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 outline-none px-4 py-2.5 text-sm focus:ring-2 focus:ring-error-400" />
              <input type="text" value={newDose} onChange={(e) => setNewDose(e.target.value)} placeholder="الجرعة (مثال: 500 mg)" className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 outline-none px-4 py-2.5 text-sm focus:ring-2 focus:ring-error-400" />
              <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 outline-none px-4 py-2.5 text-sm focus:ring-2 focus:ring-error-400" />
              <button onClick={add} className="w-full rounded-xl bg-error-500 hover:bg-error-600 text-white font-semibold py-2.5 text-sm transition">إضافة</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
