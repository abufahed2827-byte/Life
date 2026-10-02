import { useState, useEffect } from 'react';
import { PenLine, Send, Sparkles } from 'lucide-react';

const PROMPTS = [
  'ما الذي تشعر بالامتنان له اليوم؟',
  'ما هو أكبر تحدٍّ واجهته هذا الأسبوع وكيف تعاملت معه؟',
  'صف شعورك الحالي بثلاث كلمات.',
  'ما هو إنجاز صغير جعلك فخوراً اليوم؟',
  'ما الذي تريد التخلص منه ذهنياً؟',
  'ما هو هدفك غداً؟',
  'متى شعرت بالهدوء آخر مرة؟ ما الذي أحدثه؟',
  'ما هي عادة تريد بناءها؟ ولماذا؟',
];

const INITIAL_ENTRIES = [
  { id: '1', date: 'اليوم', prompt: 'ما الذي تشعر بالامتنان له اليوم؟', text: 'أمتن لعائلتي وصحتي، وللوقت الذي أمضيته في القراءة اليوم.' },
  { id: '2', date: 'أمس', prompt: 'صف شعورك الحالي بثلاث كلمات.', text: 'هادئ، متفائل، ممتن.' },
];

export default function JournalCard() {
  const [prompt, setPrompt] = useState('');
  const [text, setText] = useState('');
  const [entries, setEntries] = useState(INITIAL_ENTRIES);

  useEffect(() => {
    setPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
  }, []);

  const submit = () => {
    if (!text.trim()) return;
    setEntries((es) => [{ id: Date.now().toString(), date: 'الآن', prompt, text }, ...es]);
    setText('');
    setPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
  };

  const newPrompt = () => {
    setPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
    setText('');
  };

  return (
    <div className="card p-5 animate-fade-up bg-gradient-to-br from-purple-500/5 to-transparent">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <PenLine size={20} className="text-purple-500" />
          <h2 className="font-bold text-lg">اليوميات والتأمل</h2>
        </div>
        <button onClick={newPrompt} className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 px-3 py-1.5 rounded-lg transition">
          <Sparkles size={14} />
          سؤال جديد
        </button>
      </div>

      {/* Daily prompt */}
      <div className="bg-purple-500/10 rounded-xl p-4 mb-4">
        <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold mb-1">سؤال اليوم</p>
        <p className="text-sm font-bold">{prompt}</p>
      </div>

      {/* Input */}
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="اكتب أفكارك هنا..."
          rows={3}
          className="w-full rounded-xl bg-slate-100 dark:bg-slate-800/80 outline-none px-4 py-3 text-sm focus:ring-2 focus:ring-purple-400 resize-none transition"
        />
        <button
          onClick={submit}
          className="absolute bottom-3 left-3 p-2 rounded-lg bg-purple-500 hover:bg-purple-600 text-white transition"
          aria-label="إرسال"
        >
          <Send size={16} />
        </button>
      </div>

      {/* Recent entries */}
      {entries.length > 0 && (
        <div className="mt-4 space-y-2.5">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">مدخلات حديثة</p>
          {entries.slice(0, 2).map((entry, i) => (
            <div key={entry.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 animate-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
              <p className="text-[10px] text-slate-400 mb-1">{entry.date} — {entry.prompt}</p>
              <p className="text-sm">{entry.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
