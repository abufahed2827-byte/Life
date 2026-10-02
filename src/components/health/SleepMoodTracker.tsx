import { useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const MOOD_EMOJIS = [
  { id: 1, emoji: '😴', label: 'متعب جداً', color: 'bg-error-500' },
  { id: 2, emoji: '😪', label: 'مرهق', color: 'bg-warning-500' },
  { id: 3, emoji: '😐', label: 'عادي', color: 'bg-slate-400' },
  { id: 4, emoji: '🙂', label: 'جيد', color: 'bg-brand-500' },
  { id: 5, emoji: '😄', label: 'ممتاز', color: 'bg-success-500' },
];

const SLEEP_EMOJIS = [
  { id: 1, emoji: '😫', label: 'سيء جداً', color: 'bg-error-500' },
  { id: 2, emoji: '😕', label: 'ضعيف', color: 'bg-warning-500' },
  { id: 3, emoji: '😐', label: 'متوسط', color: 'bg-slate-400' },
  { id: 4, emoji: '😊', label: 'جيد', color: 'bg-brand-500' },
  { id: 5, emoji: '🤩', label: 'ممتاز', color: 'bg-success-500' },
];

export default function SleepMoodTracker() {
  const [mood, setMood] = useState(4);
  const [sleep, setSleep] = useState(3);
  const [sleepHours, setSleepHours] = useState(7.5);

  const currentMood = MOOD_EMOJIS.find((m) => m.id === mood)!;
  const currentSleep = SLEEP_EMOJIS.find((s) => s.id === sleep)!;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Sleep Quality */}
      <div className="card p-5 animate-fade-up">
        <div className="flex items-center gap-2 mb-4">
          <Moon size={20} className="text-brand-500" />
          <h2 className="font-bold text-base">جودة النوم</h2>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-4xl">
            {currentSleep.emoji}
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm">{currentSleep.label}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">ساعات النوم: {sleepHours} س</p>
          </div>
        </div>
        {/* Hours slider */}
        <div className="mb-4">
          <input
            type="range"
            min="0"
            max="12"
            step="0.5"
            value={sleepHours}
            onChange={(e) => setSleepHours(parseFloat(e.target.value))}
            className="w-full accent-brand-500"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>0 س</span>
            <span>6 س</span>
            <span>12 س</span>
          </div>
        </div>
        {/* Rating */}
        <div className="flex justify-between gap-1.5">
          {SLEEP_EMOJIS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSleep(s.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl transition-all ${
                sleep === s.id ? `${s.color} text-white shadow-md scale-105` : 'hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className="text-xl">{s.emoji}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mood Tracker */}
      <div className="card p-5 animate-fade-up" style={{ animationDelay: '60ms' }}>
        <div className="flex items-center gap-2 mb-4">
          <Sun size={20} className="text-warning-500" />
          <h2 className="font-bold text-base">تتبع المزاج اليومي</h2>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-4xl">
            {currentMood.emoji}
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm">{currentMood.label}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">شعورك العام اليوم</p>
          </div>
        </div>
        <div className="flex justify-between gap-1.5">
          {MOOD_EMOJIS.map((m) => (
            <button
              key={m.id}
              onClick={() => setMood(m.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl transition-all ${
                mood === m.id ? `${m.color} text-white shadow-md scale-105` : 'hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className="text-xl">{m.emoji}</span>
            </button>
          ))}
        </div>
        {/* Week mini chart */}
        <div className="mt-4 flex items-end justify-between gap-1 h-12">
          {[3, 4, 2, 4, 5, 3, 4].map((v, i) => {
            const m = MOOD_EMOJIS.find((e) => e.id === v)!;
            return (
              <div key={i} className="flex flex-col items-center gap-0.5 flex-1">
                <div className={`w-full rounded-t ${m.color}`} style={{ height: `${(v / 5) * 100}%`, opacity: i === 6 ? 1 : 0.5 }} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
