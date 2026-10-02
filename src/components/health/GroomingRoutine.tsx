import { useState } from 'react';
import { Sparkles, Check, Droplets, Sun, Moon, Scissors, Wind, Brush } from 'lucide-react';

interface GroomingStep {
  id: string;
  name: string;
  icon: typeof Droplets;
  time: string;
  done: boolean;
}

const MORNING_STEPS: Omit<GroomingStep, 'done'>[] = [
  { id: 'm1', name: 'غسل الوجه', icon: Droplets, time: 'صباحاً' },
  { id: 'm2', name: 'المرطب اليومي', icon: Sun, time: 'صباحاً' },
  { id: 'm3', name: 'واقي الشمس', icon: Wind, time: 'صباحاً' },
  { id: 'm4', name: 'ترتيب الشعر', icon: Brush, time: 'صباحاً' },
];

const EVENING_STEPS: Omit<GroomingStep, 'done'>[] = [
  { id: 'e1', name: 'تنظيف عميق', icon: Droplets, time: 'مساءً' },
  { id: 'e2', name: 'المرطب الليلي', icon: Moon, time: 'مساءً' },
  { id: 'e3', name: 'العناية بالأظافر', icon: Scissors, time: 'مساءً' },
];

const WEEKLY_TASKS = [
  { id: 'w1', name: 'قص الشعر', emoji: '✂️', lastDone: 'قبل 5 أيام' },
  { id: 'w2', name: 'تقشير البشرة', emoji: '🧴', lastDone: 'قبل 3 أيام' },
  { id: 'w3', name: 'العناية باللحية', emoji: '🪒', lastDone: 'قبل 2 يوم' },
];

export default function GroomingRoutine() {
  const [morning, setMorning] = useState<Record<string, boolean>>({});
  const [evening, setEvening] = useState<Record<string, boolean>>({});

  const morningDone = MORNING_STEPS.filter((s) => morning[s.id]).length;
  const eveningDone = EVENING_STEPS.filter((s) => evening[s.id]).length;
  const totalSteps = MORNING_STEPS.length + EVENING_STEPS.length;
  const totalDone = morningDone + eveningDone;
  const progress = Math.round((totalDone / totalSteps) * 100);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Overall progress */}
      <div className="card p-5 bg-gradient-to-br from-accent-500/5 to-transparent">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={20} className="text-accent-500" />
          <h2 className="font-bold text-base">روتين العناية الشخصية</h2>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-500 dark:text-slate-400">تقدم اليوم</span>
          <span className="text-2xl font-extrabold text-accent-500">{progress}%</span>
        </div>
        <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-accent-500 to-brand-500 transition-all duration-700" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-[10px] text-slate-400 mt-1.5">{totalDone} من {totalSteps} خطوات مكتملة</p>
      </div>

      {/* Morning routine */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sun size={18} className="text-warning-500" />
          <h3 className="font-bold text-sm">روتين الصباح</h3>
          <span className="text-[10px] text-slate-400 mr-auto">{morningDone}/{MORNING_STEPS.length}</span>
        </div>
        <div className="space-y-2">
          {MORNING_STEPS.map((step, i) => {
            const Icon = step.icon;
            const isDone = morning[step.id];
            return (
              <button
                key={step.id}
                onClick={() => setMorning((m) => ({ ...m, [step.id]: !m[step.id] }))}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition animate-fade-up ${isDone ? 'bg-success-500/10' : 'bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isDone ? 'bg-success-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>
                  {isDone ? <Check size={16} /> : <Icon size={16} />}
                </div>
                <span className={`text-sm font-semibold flex-1 text-right ${isDone ? 'line-through opacity-60' : ''}`}>{step.name}</span>
                <span className="text-[9px] text-slate-400">{step.time}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Evening routine */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Moon size={18} className="text-brand-500" />
          <h3 className="font-bold text-sm">روتين المساء</h3>
          <span className="text-[10px] text-slate-400 mr-auto">{eveningDone}/{EVENING_STEPS.length}</span>
        </div>
        <div className="space-y-2">
          {EVENING_STEPS.map((step, i) => {
            const Icon = step.icon;
            const isDone = evening[step.id];
            return (
              <button
                key={step.id}
                onClick={() => setEvening((e) => ({ ...e, [step.id]: !e[step.id] }))}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition animate-fade-up ${isDone ? 'bg-success-500/10' : 'bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isDone ? 'bg-success-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>
                  {isDone ? <Check size={16} /> : <Icon size={16} />}
                </div>
                <span className={`text-sm font-semibold flex-1 text-right ${isDone ? 'line-through opacity-60' : ''}`}>{step.name}</span>
                <span className="text-[9px] text-slate-400">{step.time}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Weekly tasks */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Scissors size={18} className="text-accent-500" />
          <h3 className="font-bold text-sm">مهام أسبوعية</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {WEEKLY_TASKS.map((task, i) => (
            <div key={task.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{task.emoji}</span>
                <p className="text-xs font-bold">{task.name}</p>
              </div>
              <p className="text-[9px] text-slate-400">{task.lastDone}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
