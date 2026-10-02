import { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, Zap, Calendar, Heart, Brain, Mic, Square } from 'lucide-react';
import { generateGeminiResponse } from '@/config/gemini';

interface Message {
  role: 'user' | 'ai';
  text: string;
}

interface Suggestion {
  icon: typeof Zap;
  label: string;
  response: string;
}

const SUGGESTIONS: Suggestion[] = [
  {
    icon: Zap,
    label: 'اقترح مهام لليوم',
    response: 'بناءً على طاقتك اليوم (78%) وجدولك، أقترح:\n• مراجعة محاضرة القلب (عالية — الصباح)\n• حل واجب الكيمياء (عالية — قبل الظهر)\n• 30 دقيقة رياضة (مساءً)\n• قراءة فصل النفسية (مساءً قبل النوم)\n\nابدأ بالمهام عالية الأولوية بينما طاقتك في ذروتها!',
  },
  {
    icon: Calendar,
    label: 'نظم جدولي',
    response: 'إليك جدول مقترح لليوم:\n\n🌅 7:00 — الاستيقاظ وروتين الصباح\n📚 8:00 — مراجعة محاضرة القلب\n📝 10:00 — حل واجب الكيمياء\n🍽️ 12:30 — الغداء وراحة\n🏃 16:00 — تمارين رياضية\n📖 20:00 — قراءة فصل النفسية\n😴 22:30 — النوم\n\nهل تريد تعديل أي موعد؟',
  },
  {
    icon: Heart,
    label: 'حلل صحتي',
    response: 'تحليل صحي سريع:\n\n💧 شرب الماء: 1.2 لتر — يحتاج زيادة (الهدف 2 لتر)\n😴 النوم: 7.5 ساعة — جيد\n🏃 النشاط: 3 أيام هذا الأسبوع — فوق المتوسط\n🧘 المزاج: جيد — استمر على التأمل اليومي\n\nنصيحة: ركّز على شرب الماء أكثر اليوم!',
  },
  {
    icon: Brain,
    label: 'كيف أرتاح؟',
    response: 'بناءً على مستوى تعافيك (65%)، أقترح:\n\n🫁 تمرين تنفس 4-7-8 (3 دقائق)\n🚶 مشي خفيف 15 دقيقة\n📵 فترة راحة من الهاتف (30 دقيقة)\n🎵 استماع لموسيقى هادئة\n\nطاقتك جيدة لكن تعافيك يحتاج دفعة — خذ راحة قصيرة!',
  },
];

const INITIAL_MESSAGE: Message = {
  role: 'ai',
  text: 'مرحباً! أنا مساعدك الذكي في Life OS. كيف أساعدك اليوم؟ يمكنك طلب اقتراح مهام، تنظيم جدولك، تحليل صحتك، أو نصائح للراحة.',
};

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [recording, setRecording] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<{ stop: () => void } | null>(null);

  useEffect(() => {
    setVoiceSupported('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const send = async (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: 'user', text }]);
    setInput('');
    setTyping(true);

    try {
      const response = await generateGeminiResponse(text);
      setMessages((m) => [...m, { role: 'ai', text: response }]);
    } catch {
      setMessages((m) => [...m, { role: 'ai', text: 'عذراً، حدث خطأ. حاول مرة أخرى.' }]);
    }
    setTyping(false);
  };

  const toggleRecording = () => {
    if (!voiceSupported) return;
    if (recording) {
      recognitionRef.current?.stop();
      setRecording(false);
      return;
    }
    const SR = (window as unknown as { webkitSpeechRecognition?: new () => unknown; SpeechRecognition?: new () => unknown }).webkitSpeechRecognition || (window as unknown as { SpeechRecognition?: new () => unknown }).SpeechRecognition;
    if (!SR) return;
    const recognition = new SR() as { lang: string; continuous: boolean; interimResults: boolean; start: () => void; stop: () => void; onresult: (e: { results: { 0: { 0: { transcript: string } } } }) => void; onend: () => void; onerror: () => void };
    recognition.lang = 'ar-SA';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      send(transcript);
    };
    recognition.onend = () => setRecording(false);
    recognition.onerror = () => setRecording(false);
    recognition.start();
    recognitionRef.current = { stop: () => recognition.stop() };
    setRecording(true);
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-20 lg:bottom-6 left-4 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-accent-500 to-brand-500 text-white shadow-xl flex items-center justify-center hover:scale-110 transition-all duration-300 animate-pulse-soft"
          aria-label="المساعد الذكي"
        >
          <Sparkles size={24} />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-success-500 rounded-full ring-2 ring-white dark:ring-slate-950" />
        </button>
      )}

      {/* Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center p-0 sm:p-4 animate-fade-in" onClick={() => setOpen(false)}>
          <div
            className="glass border border-slate-200/60 dark:border-slate-800/60 w-full sm:max-w-md h-[80vh] sm:h-[600px] rounded-t-3xl sm:rounded-3xl flex flex-col shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200/60 dark:border-slate-800/60">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-brand-500 flex items-center justify-center text-white">
                  <Bot size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm">المساعد الذكي</p>
                  <p className="text-[10px] text-success-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-success-500" />
                    متصل
                  </p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                <X size={18} />
              </button>
            </div>

            {/* Quick suggestions */}
            <div className="flex gap-2 p-3 overflow-x-auto no-scrollbar border-b border-slate-200/40 dark:border-slate-800/40">
              {SUGGESTIONS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <button
                    key={i}
                    onClick={() => send(s.label)}
                    className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold hover:bg-accent-500/10 hover:text-accent-600 dark:hover:text-accent-400 transition"
                  >
                    <Icon size={13} />
                    {s.label}
                  </button>
                );
              })}
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl p-3 text-sm whitespace-pre-line animate-fade-up ${
                      msg.role === 'user'
                        ? 'bg-brand-500 text-white rounded-bl-md'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-br-md'
                    }`}
                    style={{ animationDelay: `${i * 30}ms` }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-end">
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-br-md p-3 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-slate-200/60 dark:border-slate-800/60">
              <div className="flex items-center gap-2">
                {voiceSupported && (
                  <button
                    onClick={toggleRecording}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition shrink-0 ${recording ? 'bg-error-500 text-white animate-pulse' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-accent-500'}`}
                    title="تسجيل صوتي"
                  >
                    {recording ? <Square size={16} /> : <Mic size={18} />}
                  </button>
                )}
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && send(input)}
                  placeholder={recording ? 'جاري التسجيل...' : 'اكتب أو سجّل رسالتك...'}
                  disabled={recording}
                  className="flex-1 rounded-xl bg-slate-100 dark:bg-slate-800 outline-none px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent-400 disabled:opacity-50"
                />
                <button
                  onClick={() => send(input)}
                  disabled={recording}
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-brand-500 text-white flex items-center justify-center hover:scale-105 transition shrink-0 disabled:opacity-50"
                >
                  <Send size={18} />
                </button>
              </div>
              {recording && (
                <p className="text-[10px] text-error-500 mt-1.5 text-center animate-pulse">🎤 جاري الاستماع... اضغط للإيقاف</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
