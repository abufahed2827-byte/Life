import { useState } from 'react';
import { Bookmark, Plus, X, Video, BookOpen, GraduationCap, Link, Lightbulb, Check, ExternalLink, Trash2 } from 'lucide-react';

type ContentType = 'video' | 'book' | 'course' | 'article' | 'project';

interface SavedItem {
  id: string;
  title: string;
  type: ContentType;
  source?: string;
  note?: string;
  done: boolean;
}

const TYPE_META: { id: ContentType; label: string; icon: typeof Video; color: string; bg: string }[] = [
  { id: 'video', label: 'فيديو مفيد', icon: Video, color: 'text-error-500', bg: 'bg-error-500/10' },
  { id: 'book', label: 'كتاب للمطالعة', icon: BookOpen, color: 'text-brand-500', bg: 'bg-brand-500/10' },
  { id: 'course', label: 'دورة تدريبية', icon: GraduationCap, color: 'text-accent-500', bg: 'bg-accent-500/10' },
  { id: 'article', label: 'مقال / رابط', icon: Link, color: 'text-warning-500', bg: 'bg-warning-500/10' },
  { id: 'project', label: 'مشروع مستقبلي', icon: Lightbulb, color: 'text-purple-500', bg: 'bg-purple-500/10' },
];

const INITIAL_ITEMS: SavedItem[] = [
  { id: '1', title: 'شرح مرض السكري - د. محمد', type: 'video', source: 'YouTube', done: false },
  { id: '2', title: 'كتاب عادات ذرية', type: 'book', source: 'للتطبيق', done: true },
  { id: '3', title: 'دورة React المتقدمة', type: 'course', source: 'Udemy', done: false },
  { id: '4', title: 'مقال: كيف تنظم وقتك', type: 'article', source: 'medium.com', done: false },
  { id: '5', title: 'فكرة تطبيق تتبع شخصي', type: 'project', note: 'فكرة تحتاج دراسة جدوى', done: false },
  { id: '6', title: 'كتاب فن اللامبالاة', type: 'book', done: false },
];

export default function SavedLaterPage() {
  const [items, setItems] = useState<SavedItem[]>(INITIAL_ITEMS);
  const [filter, setFilter] = useState<ContentType | 'all'>('all');
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ContentType>('video');
  const [source, setSource] = useState('');

  const filtered = filter === 'all' ? items : items.filter((i) => i.type === filter);

  const add = () => {
    if (!title.trim()) return;
    setItems((is) => [{ id: Date.now().toString(), title, type, source: source || undefined, done: false }, ...is]);
    setTitle(''); setSource(''); setType('video');
    setShowAdd(false);
  };

  const toggleDone = (id: string) => setItems((is) => is.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));
  const remove = (id: string) => setItems((is) => is.filter((i) => i.id !== id));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500">
            <Bookmark size={26} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold">للمشاهدة والقراءة لاحقاً</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">كل ما تريد العودة إليه في مكان واحد</p>
          </div>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-semibold text-sm px-4 py-2.5 transition shadow-md shrink-0"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">إضافة</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setFilter('all')}
          className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition ${filter === 'all' ? 'bg-purple-500 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}
        >
          الكل
        </button>
        {TYPE_META.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition ${filter === t.id ? 'bg-purple-500 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}
            >
              <Icon size={14} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* List */}
      <div className="space-y-2.5">
        {filtered.map((item, i) => {
          const meta = TYPE_META.find((t) => t.id === item.type)!;
          const Icon = meta.icon;
          return (
            <div key={item.id} className={`card p-4 flex items-center gap-3 animate-fade-up ${item.done ? 'opacity-60' : ''}`} style={{ animationDelay: `${i * 50}ms` }}>
              <div className={`w-10 h-10 rounded-xl ${meta.bg} flex items-center justify-center shrink-0`}>
                <Icon size={18} className={meta.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm ${item.done ? 'line-through' : ''}`}>{item.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${meta.bg} ${meta.color}`}>{meta.label}</span>
                  {item.source && <span className="text-[10px] text-slate-400">{item.source}</span>}
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {item.source && (
                  <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-brand-500 transition" title="فتح الرابط">
                    <ExternalLink size={16} />
                  </button>
                )}
                <button
                  onClick={() => toggleDone(item.id)}
                  className={`p-2 rounded-lg transition ${item.done ? 'text-success-500 bg-success-500/10' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                  title="تم"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={() => remove(item.id)}
                  className="p-2 rounded-lg text-slate-400 hover:text-error-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  title="حذف"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-slate-400 dark:text-slate-500">
          <Bookmark size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">لا يوجد محتوى محفوظ</p>
        </div>
      )}

      {/* Add modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setShowAdd(false)}>
          <div className="card p-6 w-full max-w-md animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">إضافة محتوى جديد</h3>
              <button onClick={() => setShowAdd(false)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3">
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="العنوان" className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 outline-none px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-400" />
              <input type="text" value={source} onChange={(e) => setSource(e.target.value)} placeholder="المصدر أو الرابط (اختياري)" className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 outline-none px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-400" />

              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">النوع</label>
                <div className="grid grid-cols-2 gap-2">
                  {TYPE_META.map((t) => {
                    const Icon = t.icon;
                    return (
                      <button key={t.id} onClick={() => setType(t.id)} className={`flex items-center gap-2 p-2.5 rounded-xl border-2 transition ${type === t.id ? 'border-purple-500 bg-purple-500/10' : 'border-slate-200 dark:border-slate-700'}`}>
                        <Icon size={16} className={t.color} />
                        <span className="text-xs font-semibold">{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button onClick={add} className="w-full rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2.5 text-sm transition">حفظ للمشاهدة لاحقاً</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
