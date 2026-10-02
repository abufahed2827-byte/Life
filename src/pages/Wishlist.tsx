import { useState } from 'react';
import { Heart, Plus, X, Car, UtensilsCrossed, Cpu, Shirt, Sparkles, Wallet, Check } from 'lucide-react';

type WishCategory = 'cars' | 'food' | 'tech' | 'fashion' | 'personal';
type Priority = 'high' | 'medium' | 'low';

interface WishItem {
  id: string;
  name: string;
  category: WishCategory;
  price: number;
  saved: number;
  priority: Priority;
  emoji: string;
}

const CATEGORY_META: { id: WishCategory; label: string; icon: typeof Car; emoji: string }[] = [
  { id: 'cars', label: 'سيارة', icon: Car, emoji: '🚗' },
  { id: 'food', label: 'أكلة / وجبة', icon: UtensilsCrossed, emoji: '🍽️' },
  { id: 'tech', label: 'أجهزة وتقنيات', icon: Cpu, emoji: '📱' },
  { id: 'fashion', label: 'ملابس وأحذية', icon: Shirt, emoji: '👟' },
  { id: 'personal', label: 'مقتنيات شخصية أخرى', icon: Sparkles, emoji: '✨' },
];

const PRIORITY_META: Record<Priority, { label: string; color: string; bg: string }> = {
  high: { label: 'عالية', color: 'text-error-600 dark:text-error-400', bg: 'bg-error-500/10' },
  medium: { label: 'متوسطة', color: 'text-warning-600 dark:text-warning-400', bg: 'bg-warning-500/10' },
  low: { label: 'منخفضة', color: 'text-brand-600 dark:text-brand-400', bg: 'bg-brand-500/10' },
};

const INITIAL_ITEMS: WishItem[] = [
  { id: '1', name: 'ساعة Apple Watch', category: 'tech', price: 1500, saved: 800, priority: 'high', emoji: '⌚' },
  { id: '2', name: 'وجبة في مطعم فاخر', category: 'food', price: 300, saved: 300, priority: 'medium', emoji: '🍽️' },
  { id: '3', name: 'حذاء Nike جديد', category: 'fashion', price: 600, saved: 200, priority: 'medium', emoji: '👟' },
  { id: '4', name: 'جاكيت جلد', category: 'fashion', price: 800, saved: 150, priority: 'low', emoji: '🧥' },
  { id: '5', name: 'آيباد برو', category: 'tech', price: 2500, saved: 1200, priority: 'high', emoji: '📱' },
];

const EMOJI_OPTIONS = ['🚗', '🍽️', '📱', '👟', '🧥', '⌚', '💻', '🎮', '🎧', '✨', '📷', '💎'];

export default function WishlistPage() {
  const [items, setItems] = useState<WishItem[]>(INITIAL_ITEMS);
  const [filter, setFilter] = useState<WishCategory | 'all'>('all');
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [cat, setCat] = useState<WishCategory>('tech');
  const [price, setPrice] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [emoji, setEmoji] = useState('✨');

  const filtered = filter === 'all' ? items : items.filter((i) => i.category === filter);

  const add = () => {
    if (!name.trim() || !price.trim()) return;
    setItems((is) => [{ id: Date.now().toString(), name, category: cat, price: Number(price), saved: 0, priority, emoji }, ...is]);
    setName(''); setPrice(''); setCat('tech'); setPriority('medium'); setEmoji('✨');
    setShowAdd(false);
  };

  const addSavings = (id: string, amount: number) => {
    setItems((is) => is.map((i) => (i.id === id ? { ...i, saved: Math.min(i.saved + amount, i.price) } : i)));
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-500">
            <Heart size={26} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold">أشياء في خاطري</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">قائمة الأمنيات والرغبات</p>
          </div>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-semibold text-sm px-4 py-2.5 transition shadow-md shrink-0"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">إضافة أمنية</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setFilter('all')}
          className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition ${filter === 'all' ? 'bg-pink-500 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}
        >
          الكل
        </button>
        {CATEGORY_META.map((c) => {
          const Icon = c.icon;
          return (
            <button
              key={c.id}
              onClick={() => setFilter(c.id)}
              className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition ${filter === c.id ? 'bg-pink-500 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}
            >
              <Icon size={14} />
              {c.label}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((item, i) => {
          const meta = PRIORITY_META[item.priority];
          const progress = Math.round((item.saved / item.price) * 100);
          const isComplete = item.saved >= item.price;
          return (
            <div key={item.id} className="card p-4 animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/10 to-purple-500/10 flex items-center justify-center text-2xl shrink-0">
                  {item.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{item.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${meta.bg} ${meta.color}`}>{meta.label}</span>
                    <span className="text-[10px] text-slate-400">{CATEGORY_META.find((c) => c.id === item.category)?.label}</span>
                  </div>
                </div>
                {isComplete && <Check size={18} className="text-success-500 shrink-0" />}
              </div>

              {/* Price */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Wallet size={12} />
                  {item.price} ريال
                </span>
                <span className="text-xs font-bold text-success-500">{item.saved} ريال</span>
              </div>

              {/* Progress bar */}
              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${isComplete ? 'bg-success-500' : 'bg-gradient-to-r from-pink-500 to-purple-500'}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mb-2">{progress}% مكتمل</p>

              {/* Quick savings buttons */}
              {!isComplete && (
                <div className="flex gap-1.5">
                  {[50, 100, 200].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => addSavings(item.id, amt)}
                      className="flex-1 text-[10px] font-semibold py-1.5 rounded-lg bg-pink-500/10 text-pink-600 dark:text-pink-400 hover:bg-pink-500/20 transition"
                    >
                      +{amt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-slate-400 dark:text-slate-500">
          <Heart size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">لا توجد أمنيات في هذه الفئة</p>
        </div>
      )}

      {/* Add modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setShowAdd(false)}>
          <div className="card p-6 w-full max-w-md animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">إضافة أمنية جديدة</h3>
              <button onClick={() => setShowAdd(false)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3">
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="اسم الأمنية" className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 outline-none px-4 py-2.5 text-sm focus:ring-2 focus:ring-pink-400" />
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="السعر (ريال)" className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 outline-none px-4 py-2.5 text-sm focus:ring-2 focus:ring-pink-400" />

              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">الفئة</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORY_META.map((c) => (
                    <button key={c.id} onClick={() => { setCat(c.id); setEmoji(c.emoji); }} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border-2 transition ${cat === c.id ? 'border-pink-500 bg-pink-500/10 text-pink-600 dark:text-pink-400' : 'border-slate-200 dark:border-slate-700 text-slate-500'}`}>
                      <c.icon size={12} />
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">الأولوية</label>
                <div className="flex gap-2">
                  {(Object.keys(PRIORITY_META) as Priority[]).map((p) => (
                    <button key={p} onClick={() => setPriority(p)} className={`flex-1 py-2 rounded-lg text-xs font-semibold border-2 transition ${priority === p ? 'border-pink-500 bg-pink-500/10 text-pink-600 dark:text-pink-400' : 'border-slate-200 dark:border-slate-700 text-slate-500'}`}>
                      {PRIORITY_META[p].label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">الأيقونة</label>
                <div className="flex flex-wrap gap-2">
                  {EMOJI_OPTIONS.map((e) => (
                    <button key={e} onClick={() => setEmoji(e)} className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center border-2 transition ${emoji === e ? 'border-pink-500 bg-pink-500/10' : 'border-slate-200 dark:border-slate-700'}`}>{e}</button>
                  ))}
                </div>
              </div>

              <button onClick={add} className="w-full rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2.5 text-sm transition">إضافة للأمنيات</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
