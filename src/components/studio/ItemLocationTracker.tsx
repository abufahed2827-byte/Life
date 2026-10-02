import { useState } from 'react';
import { Search, MapPin, Plus, Package, X, Camera } from 'lucide-react';

interface Belonging {
  id: string;
  name: string;
  location: string;
  category: string;
  emoji: string;
}

const CATEGORIES = ['الكل', 'مفاتيح', 'إلكترونيات', 'مستندات', 'أدوات', 'أخرى'];

const INITIAL: Belonging[] = [
  { id: '1', name: 'مفاتيح السيارة', location: 'الدرج بجانب التلفاز', category: 'مفاتيح', emoji: '🔑' },
  { id: '2', name: 'شاحن المحمول', location: 'حقيبة السفر', category: 'إلكترونيات', emoji: '🔌' },
  { id: '3', name: 'بطاقة الهوية', location: 'المحفظة', category: 'مستندات', emoji: '🪪' },
  { id: '4', name: 'مفك الصيانة', location: 'صندوق الأدوات', category: 'أدوات', emoji: '🔧' },
  { id: '5', name: 'نظارة طبية', location: 'حقيبة اليد', category: 'أخرى', emoji: '👓' },
  { id: '6', name: 'سماعة بلوتوث', location: 'درج المكتب', category: 'إلكترونيات', emoji: '🎧' },
];

const EMOJI_OPTIONS = ['🔑', '🔌', '🪪', '🔧', '👓', '🎧', '📚', '💊', '💳', '📦'];

export default function ItemLocationTracker() {
  const [items, setItems] = useState<Belonging[]>(INITIAL);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('الكل');
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newCat, setNewCat] = useState('أخرى');
  const [newEmoji, setNewEmoji] = useState('📦');

  const filtered = items.filter((item) => {
    const matchCat = category === 'الكل' || item.category === category;
    const matchQuery = !query || item.name.includes(query) || item.location.includes(query);
    return matchCat && matchQuery;
  });

  const add = () => {
    if (!newName.trim() || !newLocation.trim()) return;
    setItems((is) => [{ id: Date.now().toString(), name: newName, location: newLocation, category: newCat, emoji: newEmoji }, ...is]);
    setNewName(''); setNewLocation(''); setNewCat('أخرى'); setNewEmoji('📦');
    setShowAdd(false);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Search size={20} className="text-brand-500" />
          <h2 className="font-bold text-lg">أين وضعتها؟</h2>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm px-3.5 py-2 transition shadow-md"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">تسجيل مقتنى</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث عن أي مقتنى..."
          className="w-full rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-transparent focus:border-brand-400 outline-none py-3 pr-11 pl-4 text-sm transition"
        />
      </div>

      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${category === cat ? 'bg-brand-500 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="space-y-2.5">
        {filtered.map((item, i) => (
          <div key={item.id} className="card p-3.5 flex items-center gap-3 animate-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500/10 to-accent-500/10 flex items-center justify-center text-2xl shrink-0">
              {item.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{item.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <MapPin size={12} />
                {item.location}
              </p>
            </div>
            <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 shrink-0">
              {item.category}
            </span>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-10 text-slate-400 dark:text-slate-500">
          <Package size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">لا توجد مقتنيات مطابقة</p>
        </div>
      )}

      {/* Add modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setShowAdd(false)}>
          <div className="card p-6 w-full max-w-md animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">تسجيل مقتنى جديد</h3>
              <button onClick={() => setShowAdd(false)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3">
              {/* Photo capture */}
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-4 text-center hover:border-brand-400 transition cursor-pointer mb-2">
                <Camera size={22} className="mx-auto mb-1 text-slate-400" />
                <p className="text-[10px] text-slate-500 dark:text-slate-400">التقط صورة للمقتنى (اختياري)</p>
              </div>

              <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="اسم المقتنى" className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 outline-none px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-400" />
              <input type="text" value={newLocation} onChange={(e) => setNewLocation(e.target.value)} placeholder="المكان (مثال: درج المكتب)" className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 outline-none px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-400" />

              {/* Category */}
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">الفئة</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.filter((c) => c !== 'الكل').map((c) => (
                    <button key={c} onClick={() => setNewCat(c)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border-2 transition ${newCat === c ? 'border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400' : 'border-slate-200 dark:border-slate-700 text-slate-500'}`}>{c}</button>
                  ))}
                </div>
              </div>

              {/* Emoji */}
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">الأيقونة</label>
                <div className="flex flex-wrap gap-2">
                  {EMOJI_OPTIONS.map((e) => (
                    <button key={e} onClick={() => setNewEmoji(e)} className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center border-2 transition ${newEmoji === e ? 'border-brand-500 bg-brand-500/10' : 'border-slate-200 dark:border-slate-700'}`}>{e}</button>
                  ))}
                </div>
              </div>

              <button onClick={add} className="w-full rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold py-2.5 text-sm transition">حفظ المقتنى</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
