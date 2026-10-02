import { Brain, TrendingUp, Plus } from 'lucide-react';
import { useState } from 'react';

const MOODS = [
  { id: 'great', label: 'ممتاز', emoji: '😄', color: 'bg-success-500', text: 'text-success-600' },
  { id: 'good', label: 'جيد', emoji: '🙂', color: 'bg-brand-500', text: 'text-brand-600' },
  { id: 'neutral', label: 'محايد', emoji: '😐', color: 'bg-slate-400', text: 'text-slate-500' },
  { id: 'down', label: 'متعب', emoji: '😕', color: 'bg-warning-500', text: 'text-warning-600' },
  { id: 'bad', label: 'سيء', emoji: '😣', color: 'bg-error-500', text: 'text-error-600' },
] as const;

const WEEK_DATA = [
  { day: 'السبت', mood: 'great' },
  { day: 'الأحد', mood: 'good' },
  { day: 'الإثنين', mood: 'neutral' },
  { day: 'الثلاثاء', mood: 'good' },
  { day: 'الأربعاء', mood: 'down' },
  { day: 'الخميس', mood: 'good' },
  { day: 'الجمعة', mood: 'great' },
];

const REFLECTIONS = [
  { id: '1', date: 'اليوم', situation: 'شعرت بالتوتر قبل الامتحان', thought: 'لن أنجح', emotion: 'قلق', reframed: 'التوتر طبيعي، ولقد درست بجد' },
  { id: '2', date: 'أمس', situation: 'خلاف مع صديق', thought: 'الجميع يكرهني', emotion: 'حزن', reframed: 'هو موقف واحد، وليس حكماً على الجميع' },
];

export default function CBTPage() {
  const [selectedMood, setSelectedMood] = useState<string>('good');

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-accent-500/10 flex items-center justify-center text-accent-500">
            <Brain size={26} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold">النفسية والتتبع</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">تتبع مزاجك وتأملاتك المعرفية السلوكية</p>
          </div>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-accent-500 hover:bg-accent-600 text-white font-semibold text-sm px-4 py-2.5 transition shadow-md">
          <Plus size={18} />
          <span className="hidden sm:inline">تأمل جديد</span>
        </button>
      </div>

      {/* Mood selector */}
      <div className="card p-5 animate-fade-up">
        <h2 className="font-bold text-lg mb-1">كيف تشعر اليوم؟</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">اختر مزاجك الحالي</p>
        <div className="flex justify-between gap-2">
          {MOODS.map((mood) => (
            <button
              key={mood.id}
              onClick={() => setSelectedMood(mood.id)}
              className={`flex flex-col items-center gap-1.5 flex-1 p-3 rounded-2xl transition-all duration-200 ${
                selectedMood === mood.id
                  ? `${mood.color} text-white shadow-md scale-105`
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span className="text-2xl sm:text-3xl">{mood.emoji}</span>
              <span className={`text-[10px] sm:text-xs font-semibold ${selectedMood === mood.id ? 'text-white' : mood.text}`}>{mood.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Week chart */}
      <div className="card p-5 animate-fade-up">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-accent-500" />
          <h2 className="font-bold text-lg">مزاج الأسبوع</h2>
        </div>
        <div className="flex items-end justify-between gap-2 h-32">
          {WEEK_DATA.map((d, i) => {
            const mood = MOODS.find((m) => m.id === d.mood)!;
            const heights: Record<string, string> = { great: 'h-full', good: 'h-4/5', neutral: 'h-3/5', down: 'h-2/5', bad: 'h-1/5' };
            return (
              <div key={d.day} className="flex flex-col items-center gap-2 flex-1 animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="w-full flex items-end h-24">
                  <div className={`w-full ${heights[d.mood]} ${mood.color} rounded-t-lg transition-all duration-500`} />
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">{d.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* CBT Reflections */}
      <div>
        <h2 className="font-bold text-lg mb-3 px-1">تأملات CBT الأخيرة</h2>
        <div className="space-y-2.5">
          {REFLECTIONS.map((r, i) => (
            <div key={r.id} className="card p-4 animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-accent-500/10 text-accent-600 dark:text-accent-400">{r.date}</span>
                <span className="text-xs text-slate-400 dark:text-slate-500">{r.emotion}</span>
              </div>
              <div className="space-y-1.5 text-sm">
                <p className="text-slate-600 dark:text-slate-300"><span className="font-semibold">الموقف:</span> {r.situation}</p>
                <p className="text-error-600 dark:text-error-400"><span className="font-semibold">الفكرة:</span> {r.thought}</p>
                <p className="text-success-600 dark:text-success-400"><span className="font-semibold">الإعادة:</span> {r.reframed}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
