import { useState } from 'react';
import { Plus, Camera, X, Shirt, Calendar, Repeat, Tag, type LucideIcon } from 'lucide-react';

export type CareStatus = 'clean_ironed' | 'clean_unironed' | 'needs_laundry' | 'at_laundry';

export const CARE_STATUS_META: { id: CareStatus; label: string; color: string; bg: string; dot: string }[] = [
  { id: 'clean_ironed', label: 'نظيف ومكوي', color: 'text-success-600 dark:text-success-400', bg: 'bg-success-500/10', dot: 'bg-success-500' },
  { id: 'clean_unironed', label: 'نظيف غير مكوي', color: 'text-warning-600 dark:text-warning-400', bg: 'bg-warning-500/10', dot: 'bg-warning-500' },
  { id: 'needs_laundry', label: 'يحتاج غسيل/متسخ', color: 'text-error-600 dark:text-error-400', bg: 'bg-error-500/10', dot: 'bg-error-500' },
  { id: 'at_laundry', label: 'في المغسلة', color: 'text-brand-600 dark:text-brand-400', bg: 'bg-brand-500/10', dot: 'bg-brand-500' },
];

export interface WardrobeItem {
  id: string;
  name: string;
  category: WardrobeCategory;
  colors: string[];
  season: string;
  wearCount: number;
  outfitTag: string;
  emoji: string;
  careStatus: CareStatus;
}

export type WardrobeCategory = 'tops' | 'bottoms' | 'footwear' | 'outerwear' | 'accessories';

export const CATEGORY_META: { id: WardrobeCategory; label: string; emoji: string }[] = [
  { id: 'tops', label: 'قمصان وتيشيرتات', emoji: '👕' },
  { id: 'bottoms', label: 'بنطال/شورت', emoji: '👖' },
  { id: 'footwear', label: 'أحذية', emoji: '👟' },
  { id: 'outerwear', label: 'جواكيت', emoji: '🧥' },
  { id: 'accessories', label: 'إكسسوارات', emoji: '⌚' },
];

const SEASONS = ['ربيع', 'صيف', 'خريف', 'شتاء', 'كل المواسم'];
const OUTFIT_TAGS = ['يومي', 'رسمي', 'رياضي', 'كاجوال', 'مناسب'];

const COLOR_SWATCHES = [
  { name: 'أسود', hex: '#1e293b' },
  { name: 'أبيض', hex: '#f8fafc' },
  { name: 'أزرق', hex: '#3b82f6' },
  { name: 'أحمر', hex: '#ef4444' },
  { name: 'أخضر', hex: '#22c55e' },
  { name: 'بيج', hex: '#d4b896' },
  { name: 'رمادي', hex: '#94a3b8' },
  { name: 'بني', hex: '#92400e' },
  { name: 'كحلي', hex: '#1e3a5f' },
  { name: 'وردي', hex: '#f472b6' },
];

const INITIAL_ITEMS: WardrobeItem[] = [
  { id: '1', name: 'تيشيرت أبيض', category: 'tops', colors: ['أبيض'], season: 'صيف', wearCount: 24, outfitTag: 'كاجوال', emoji: '👕', careStatus: 'clean_ironed' },
  { id: '2', name: 'جينز أزرق', category: 'bottoms', colors: ['أزرق'], season: 'كل المواسم', wearCount: 42, outfitTag: 'كاجوال', emoji: '👖', careStatus: 'clean_ironed' },
  { id: '3', name: 'حذاء رياضي', category: 'footwear', colors: ['أسود', 'أبيض'], season: 'كل المواسم', wearCount: 56, outfitTag: 'رياضي', emoji: '👟', careStatus: 'needs_laundry' },
  { id: '4', name: 'جاكيت شتوي', category: 'outerwear', colors: ['أسود'], season: 'شتاء', wearCount: 18, outfitTag: 'يومي', emoji: '🧥', careStatus: 'clean_unironed' },
  { id: '5', name: 'ساعة يد', category: 'accessories', colors: ['بني'], season: 'كل المواسم', wearCount: 120, outfitTag: 'رسمي', emoji: '⌚', careStatus: 'clean_ironed' },
  { id: '6', name: 'قميص كحلي', category: 'tops', colors: ['كحلي'], season: 'كل المواسم', wearCount: 12, outfitTag: 'رسمي', emoji: '👔', careStatus: 'clean_ironed' },
  { id: '7', name: 'شورت بيج', category: 'bottoms', colors: ['بيج'], season: 'صيف', wearCount: 8, outfitTag: 'كاجوال', emoji: '🩳', careStatus: 'at_laundry' },
  { id: '8', name: 'حذاء جلدي', category: 'footwear', colors: ['بني'], season: 'كل المواسم', wearCount: 15, outfitTag: 'رسمي', emoji: '👞', careStatus: 'clean_ironed' },
];

export default function WardrobeGrid() {
  const [items, setItems] = useState<WardrobeItem[]>(INITIAL_ITEMS);
  const [filter, setFilter] = useState<WardrobeCategory | 'all'>('all');
  const [careFilter, setCareFilter] = useState<CareStatus | 'all'>('all');
  const [showAdd, setShowAdd] = useState(false);

  const [name, setName] = useState('');
  const [cat, setCat] = useState<WardrobeCategory>('tops');
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [season, setSeason] = useState('كل المواسم');
  const [outfitTag, setOutfitTag] = useState('كاجوال');
  const [careStatus, setCareStatus] = useState<CareStatus>('clean_ironed');

  const filtered = items.filter((i) => {
    const matchCat = filter === 'all' || i.category === filter;
    const matchCare = careFilter === 'all' || i.careStatus === careFilter;
    return matchCat && matchCare;
  });

  const toggleColor = (c: string) => {
    setSelectedColors((cs) => (cs.includes(c) ? cs.filter((x) => x !== c) : [...cs, c]));
  };

  const add = () => {
    if (!name.trim()) return;
    const emoji = CATEGORY_META.find((c) => c.id === cat)?.emoji || '👕';
    setItems((is) => [{ id: Date.now().toString(), name, category: cat, colors: selectedColors.length ? selectedColors : ['أسود'], season, wearCount: 0, outfitTag, emoji, careStatus }, ...is]);
    setName(''); setSelectedColors([]); setSeason('كل المواسم'); setOutfitTag('كاجوال'); setCat('tops'); setCareStatus('clean_ironed');
    setShowAdd(false);
  };

  const cycleCareStatus = (id: string) => {
    setItems((is) => is.map((i) => {
      if (i.id !== id) return i;
      const statuses: CareStatus[] = ['clean_ironed', 'clean_unironed', 'needs_laundry', 'at_laundry'];
      const next = statuses[(statuses.indexOf(i.careStatus) + 1) % 4];
      return { ...i, careStatus: next };
    }));
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Care status filter row */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setCareFilter('all')}
          className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${careFilter === 'all' ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}
        >
          كل الحالات
        </button>
        {CARE_STATUS_META.map((s) => (
          <button
            key={s.id}
            onClick={() => setCareFilter(s.id)}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${careFilter === s.id ? `${s.bg} ${s.color}` : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}
          >
            <span className={`w-2 h-2 rounded-full ${s.dot}`} />
            {s.label}
          </button>
        ))}
      </div>

      {/* Add button + category filter row */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setFilter('all')}
            className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition ${filter === 'all' ? 'bg-warning-500 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}
          >
            الكل
          </button>
          {CATEGORY_META.map((c) => (
            <button
              key={c.id}
              onClick={() => setFilter(c.id)}
              className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition ${filter === c.id ? 'bg-warning-500 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}
            >
              <span>{c.emoji}</span>
              {c.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 rounded-xl bg-warning-500 hover:bg-warning-600 text-white font-semibold text-sm px-4 py-2.5 transition shadow-md shrink-0"
        >
          <Plus size={18} />
          إضافة قطعة
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {filtered.map((item, i) => {
          const care = CARE_STATUS_META.find((c) => c.id === item.careStatus)!;
          return (
            <div key={item.id} className="card card-hover p-4 animate-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="flex items-start justify-between mb-2">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-warning-500/10 to-brand-500/10 flex items-center justify-center text-2xl">
                  {item.emoji}
                </div>
                <button
                  onClick={() => cycleCareStatus(item.id)}
                  className={`text-[9px] font-semibold px-2 py-1 rounded-full ${care.bg} ${care.color} flex items-center gap-1 transition hover:scale-105`}
                  title="اضغط لتغيير الحالة"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${care.dot}`} />
                  {care.label}
                </button>
              </div>
              <p className="font-semibold text-sm mb-1 truncate">{item.name}</p>
              <div className="flex items-center gap-1 mb-2">
                {item.colors.map((c) => {
                  const sw = COLOR_SWATCHES.find((s) => s.name === c);
                  return (
                    <div key={c} className="w-4 h-4 rounded-full border border-slate-200 dark:border-slate-700" style={{ backgroundColor: sw?.hex || '#888' }} title={c} />
                  );
                })}
              </div>
              <div className="flex flex-wrap gap-1.5">
                <Tag2 icon={Calendar} label={item.season} />
                <Tag2 icon={Repeat} label={`${item.wearCount}×`} />
                <Tag2 icon={Tag} label={item.outfitTag} />
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-slate-400 dark:text-slate-500">
          <Shirt size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">لا توجد قطع مطابقة</p>
        </div>
      )}

      {/* Add modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setShowAdd(false)}>
          <div className="card p-6 w-full max-w-md max-h-[90vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">إضافة قطعة جديدة</h3>
              <button onClick={() => setShowAdd(false)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                <X size={18} />
              </button>
            </div>

            <div className="mb-4">
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center hover:border-warning-400 transition cursor-pointer">
                <Camera size={28} className="mx-auto mb-2 text-slate-400" />
                <p className="text-xs text-slate-500 dark:text-slate-400">التقط صورة أو ارفع صورة للقطعة</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">اسم القطعة</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="مثال: قميص أزرق" className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 outline-none px-4 py-2.5 text-sm focus:ring-2 focus:ring-warning-400" />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">الفئة</label>
                <div className="grid grid-cols-3 gap-2">
                  {CATEGORY_META.map((c) => (
                    <button key={c.id} onClick={() => setCat(c.id)} className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 transition ${cat === c.id ? 'border-warning-500 bg-warning-500/10' : 'border-slate-200 dark:border-slate-700'}`}>
                      <span className="text-lg">{c.emoji}</span>
                      <span className="text-[10px] font-semibold">{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">الألوان</label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_SWATCHES.map((s) => (
                    <button key={s.name} onClick={() => toggleColor(s.name)} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border-2 transition ${selectedColors.includes(s.name) ? 'border-warning-500 bg-warning-500/10' : 'border-slate-200 dark:border-slate-700'}`}>
                      <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600" style={{ backgroundColor: s.hex }} />
                      <span className="text-[10px] font-semibold">{s.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">حالة العناية</label>
                <div className="flex flex-wrap gap-2">
                  {CARE_STATUS_META.map((s) => (
                    <button key={s.id} onClick={() => setCareStatus(s.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border-2 transition ${careStatus === s.id ? `${s.bg} ${s.color} border-current` : 'border-slate-200 dark:border-slate-700 text-slate-500'}`}>
                      <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">الموسم المناسب</label>
                <div className="flex flex-wrap gap-2">
                  {SEASONS.map((s) => (
                    <button key={s} onClick={() => setSeason(s)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border-2 transition ${season === s ? 'border-warning-500 bg-warning-500/10 text-warning-600 dark:text-warning-400' : 'border-slate-200 dark:border-slate-700 text-slate-500'}`}>{s}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">وسم التنسيق</label>
                <div className="flex flex-wrap gap-2">
                  {OUTFIT_TAGS.map((t) => (
                    <button key={t} onClick={() => setOutfitTag(t)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border-2 transition ${outfitTag === t ? 'border-warning-500 bg-warning-500/10 text-warning-600 dark:text-warning-400' : 'border-slate-200 dark:border-slate-700 text-slate-500'}`}>{t}</button>
                  ))}
                </div>
              </div>

              <button onClick={add} className="w-full rounded-xl bg-warning-500 hover:bg-warning-600 text-white font-semibold py-2.5 text-sm transition">إضافة للخزانة</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Tag2({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center gap-0.5">
      <Icon size={9} />
      {label}
    </span>
  );
}
