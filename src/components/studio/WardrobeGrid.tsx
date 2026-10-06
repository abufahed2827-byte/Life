import { useState, useRef } from 'react';
import { Plus, Camera, X, Shirt, Calendar, Repeat, Tag, Sparkles, Info, type LucideIcon } from 'lucide-react';

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
  secondaryColors?: string[];
  season: string;
  wearCount: number;
  outfitTag: string;
  emoji: string;
  careStatus: CareStatus;
  brand?: string;
  fabric?: string;
  photo?: string;
}

export type WardrobeCategory = 'tops' | 'bottoms' | 'footwear' | 'outerwear' | 'accessories';

export const CATEGORY_META: { id: WardrobeCategory; label: string; emoji: string; fabricLabel: string }[] = [
  { id: 'tops', label: 'قمصان وتيشيرتات', emoji: '👕', fabricLabel: 'قطن' },
  { id: 'bottoms', label: 'بنطال/شورت', emoji: '👖', fabricLabel: 'دينم' },
  { id: 'footwear', label: 'أحذية', emoji: '👟', fabricLabel: 'جلد' },
  { id: 'outerwear', label: 'جواكيت', emoji: '🧥', fabricLabel: 'بوليستر' },
  { id: 'accessories', label: 'إكسسوارات', emoji: '⌚', fabricLabel: 'معدن' },
];

const FABRIC_OPTIONS = ['قطن', 'دينم', 'جلد', 'بوليستر', 'صوف', 'كتان', 'حرير', 'معدن', 'بلاستيك'];

const SEASONS = ['ربيع', 'صيف', 'خريف', 'شتاء', 'كل المواسم'];
const OUTFIT_TAGS = ['يومي', 'رسمي', 'رياضي', 'كاجوال', 'مناسب'];

export const COLOR_SWATCHES = [
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
  { id: '1', name: 'تيشيرت أبيض', category: 'tops', colors: ['أبيض'], secondaryColors: ['رمادي'], season: 'صيف', wearCount: 24, outfitTag: 'كاجوال', emoji: '👕', careStatus: 'clean_ironed', brand: 'Zara', fabric: 'قطن' },
  { id: '2', name: 'جينز أزرق', category: 'bottoms', colors: ['أزرق'], secondaryColors: ['أبيض'], season: 'كل المواسم', wearCount: 42, outfitTag: 'كاجوال', emoji: '👖', careStatus: 'clean_ironed', brand: 'Levis', fabric: 'دينم' },
  { id: '3', name: 'حذاء رياضي', category: 'footwear', colors: ['أسود', 'أبيض'], season: 'كل المواسم', wearCount: 56, outfitTag: 'رياضي', emoji: '👟', careStatus: 'needs_laundry', brand: 'Nike', fabric: 'بلاستيك' },
  { id: '4', name: 'جاكيت شتوي', category: 'outerwear', colors: ['أسود'], season: 'شتاء', wearCount: 18, outfitTag: 'يومي', emoji: '🧥', careStatus: 'clean_unironed', brand: 'H&M', fabric: 'بوليستر' },
  { id: '5', name: 'ساعة يد', category: 'accessories', colors: ['بني'], secondaryColors: ['ذهبي'], season: 'كل المواسم', wearCount: 120, outfitTag: 'رسمي', emoji: '⌚', careStatus: 'clean_ironed', brand: 'Casio', fabric: 'معدن' },
  { id: '6', name: 'قميص كحلي', category: 'tops', colors: ['كحلي'], season: 'كل المواسم', wearCount: 12, outfitTag: 'رسمي', emoji: '👔', careStatus: 'clean_ironed', brand: 'Pull&Bear', fabric: 'قطن' },
  { id: '7', name: 'شورت بيج', category: 'bottoms', colors: ['بيج'], season: 'صيف', wearCount: 8, outfitTag: 'كاجوال', emoji: '🩳', careStatus: 'at_laundry', brand: 'Uniqlo', fabric: 'كتان' },
  { id: '8', name: 'حذاء جلدي', category: 'footwear', colors: ['بني'], season: 'كل المواسم', wearCount: 15, outfitTag: 'رسمي', emoji: '👞', careStatus: 'clean_ironed', brand: 'Clarks', fabric: 'جلد' },
];

export default function WardrobeGrid() {
  const [items, setItems] = useState<WardrobeItem[]>(INITIAL_ITEMS);
  const [filter, setFilter] = useState<WardrobeCategory | 'all'>('all');
  const [careFilter, setCareFilter] = useState<CareStatus | 'all'>('all');
  const [showAdd, setShowAdd] = useState(false);
  const [detailItem, setDetailItem] = useState<WardrobeItem | null>(null);
  const [autoIron, setAutoIron] = useState(true);

  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [cat, setCat] = useState<WardrobeCategory>('tops');
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSecondary, setSelectedSecondary] = useState<string[]>([]);
  const [fabric, setFabric] = useState('قطن');
  const [season, setSeason] = useState('كل المواسم');
  const [outfitTag, setOutfitTag] = useState('كاجوال');
  const [careStatus, setCareStatus] = useState<CareStatus>('clean_ironed');
  const [itemPhoto, setItemPhoto] = useState<string | null>(null);
  const photoRef = useRef<HTMLInputElement>(null);

  const filtered = items.filter((i) => {
    const matchCat = filter === 'all' || i.category === filter;
    const matchCare = careFilter === 'all' || i.careStatus === careFilter;
    return matchCat && matchCare;
  });

  const toggleColor = (c: string) => {
    setSelectedColors((cs) => (cs.includes(c) ? cs.filter((x) => x !== c) : [...cs, c]));
  };

  const toggleSecondary = (c: string) => {
    setSelectedSecondary((cs) => (cs.includes(c) ? cs.filter((x) => x !== c) : [...cs, c]));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setItemPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const add = () => {
    if (!name.trim()) return;
    const emoji = CATEGORY_META.find((c) => c.id === cat)?.emoji || '👕';
    setItems((is) => [{
      id: Date.now().toString(),
      name,
      category: cat,
      colors: selectedColors.length ? selectedColors : ['أسود'],
      secondaryColors: selectedSecondary,
      season,
      wearCount: 0,
      outfitTag,
      emoji,
      careStatus,
      brand: brand.trim() || undefined,
      fabric,
      photo: itemPhoto || undefined,
    }, ...is]);
    setName(''); setBrand(''); setSelectedColors([]); setSelectedSecondary([]); setSeason('كل المواسم');
    setOutfitTag('كاجوال'); setCat('tops'); setCareStatus('clean_ironed'); setFabric('قطن'); setItemPhoto(null);
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
      {/* Auto-ironing filter toggle */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-accent-500" />
          <p className="text-xs font-bold">تصفية وتنعيم تلقائي (AI)</p>
        </div>
        <button
          onClick={() => setAutoIron(!autoIron)}
          className={`relative w-11 h-6 rounded-full transition ${autoIron ? 'bg-accent-500' : 'bg-slate-300 dark:bg-slate-700'}`}
        >
          <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${autoIron ? 'left-0.5' : 'right-0.5'}`} />
        </button>
      </div>

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
            <div key={item.id} className="card card-hover overflow-hidden animate-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
              {/* Clean white product area */}
              <div
                className="relative h-32 flex items-center justify-center cursor-pointer"
                style={{ backgroundColor: '#ffffff' }}
                onClick={() => setDetailItem(item)}
              >
                {item.photo ? (
                  <img
                    src={item.photo}
                    alt={item.name}
                    className={`w-full h-full object-contain p-2 transition-all duration-300 ${autoIron ? 'contrast-110 saturate-150 brightness-105' : ''}`}
                    style={autoIron ? { filter: 'contrast(1.1) saturate(1.4) brightness(1.05) smooth(1)' } : undefined}
                  />
                ) : (
                  <div className={`text-4xl transition-all duration-300 ${autoIron ? 'drop-shadow-sm' : 'opacity-80'}`}>
                    {item.emoji}
                  </div>
                )}
                {autoIron && (
                  <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 bg-accent-500/90 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                    <Sparkles size={8} />
                    مكوي
                  </div>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); setDetailItem(item); }}
                  className="absolute top-1.5 left-1.5 p-1.5 rounded-lg bg-white/80 shadow-sm hover:bg-white transition"
                  title="تفاصيل القطعة"
                >
                  <Info size={12} className="text-slate-500" />
                </button>
              </div>

              {/* Item info */}
              <div className="p-3">
                <div className="flex items-start justify-between mb-1.5">
                  <p className="font-semibold text-sm truncate flex-1">{item.name}</p>
                  <button
                    onClick={() => cycleCareStatus(item.id)}
                    className={`text-[9px] font-semibold px-2 py-1 rounded-full ${care.bg} ${care.color} flex items-center gap-1 transition hover:scale-105 shrink-0 mr-1`}
                    title="اضغط لتغيير الحالة"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${care.dot}`} />
                    {care.label}
                  </button>
                </div>
                {item.brand && (
                  <p className="text-[10px] font-semibold text-slate-400 mb-1">{item.brand}</p>
                )}
                <div className="flex items-center gap-1 mb-2">
                  {item.colors.map((c) => {
                    const sw = COLOR_SWATCHES.find((s) => s.name === c);
                    return (
                      <div key={c} className="w-4 h-4 rounded-full border border-slate-200 dark:border-slate-700" style={{ backgroundColor: sw?.hex || '#888' }} title={c} />
                    );
                  })}
                  {item.secondaryColors?.map((c) => {
                    const sw = COLOR_SWATCHES.find((s) => s.name === c);
                    return (
                      <div key={c} className="w-3 h-3 rounded-full border border-slate-200 dark:border-slate-700 opacity-60" style={{ backgroundColor: sw?.hex || '#888' }} title={`ثانوي: ${c}`} />
                    );
                  })}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Tag2 icon={Calendar} label={item.season} />
                  <Tag2 icon={Repeat} label={`${item.wearCount}×`} />
                  <Tag2 icon={Tag} label={item.outfitTag} />
                  {item.fabric && <Tag2 icon={Shirt} label={item.fabric} />}
                </div>
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

      {/* Detail / Metadata card modal */}
      {detailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setDetailItem(null)}>
          <div className="card p-0 w-full max-w-sm overflow-hidden animate-scale-in" onClick={(e) => e.stopPropagation()}>
            {/* Clean white product showcase */}
            <div className="relative h-48 flex items-center justify-center" style={{ backgroundColor: '#ffffff' }}>
              {detailItem.photo ? (
                <img src={detailItem.photo} alt={detailItem.name} className="w-full h-full object-contain p-4" style={{ filter: autoIron ? 'contrast(1.1) saturate(1.4) brightness(1.05)' : undefined }} />
              ) : (
                <div className="text-6xl">{detailItem.emoji}</div>
              )}
              <button onClick={() => setDetailItem(null)} className="absolute top-2 left-2 p-2 rounded-xl bg-white/80 shadow-sm hover:bg-white transition">
                <X size={16} />
              </button>
              {autoIron && (
                <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-accent-500/90 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                  <Sparkles size={10} />
                  تصفية AI مفعّلة
                </div>
              )}
            </div>

            {/* Metadata */}
            <div className="p-5 space-y-3">
              <div>
                <h3 className="font-bold text-base">{detailItem.name}</h3>
                {detailItem.brand && (
                  <p className="text-xs text-slate-400 mt-0.5">العلامة التجارية: <span className="font-semibold text-slate-600 dark:text-slate-300">{detailItem.brand}</span></p>
                )}
              </div>

              {/* Color palette badge */}
              <div>
                <p className="text-[10px] font-bold text-slate-400 mb-1.5">لوحة الألوان</p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400">أساسي:</span>
                    {detailItem.colors.map((c) => {
                      const sw = COLOR_SWATCHES.find((s) => s.name === c);
                      return (
                        <div key={c} className="w-5 h-5 rounded-lg border-2 border-slate-200 dark:border-slate-700" style={{ backgroundColor: sw?.hex || '#888' }} title={c} />
                      );
                    })}
                  </div>
                  {detailItem.secondaryColors && detailItem.secondaryColors.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-400">ثانوي:</span>
                      {detailItem.secondaryColors.map((c) => {
                        const sw = COLOR_SWATCHES.find((s) => s.name === c);
                        return (
                          <div key={c} className="w-4 h-4 rounded-lg border border-slate-200 dark:border-slate-700 opacity-70" style={{ backgroundColor: sw?.hex || '#888' }} title={c} />
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Fabric + Category + Occasion tags */}
              <div className="flex flex-wrap gap-2">
                {detailItem.fabric && (
                  <span className="text-[10px] font-semibold px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-1">
                    <Shirt size={11} />
                    {detailItem.fabric}
                  </span>
                )}
                <span className="text-[10px] font-semibold px-2.5 py-1.5 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400">
                  {CATEGORY_META.find((c) => c.id === detailItem.category)?.label}
                </span>
                <span className="text-[10px] font-semibold px-2.5 py-1.5 rounded-lg bg-accent-500/10 text-accent-600 dark:text-accent-400 flex items-center gap-1">
                  <Tag size={11} />
                  {detailItem.outfitTag}
                </span>
              </div>

              {/* Extra info grid */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <div className="text-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <p className="text-[9px] text-slate-400">الموسم</p>
                  <p className="text-xs font-bold">{detailItem.season}</p>
                </div>
                <div className="text-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <p className="text-[9px] text-slate-400">الارتداء</p>
                  <p className="text-xs font-bold">{detailItem.wearCount}×</p>
                </div>
                <div className="text-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <p className="text-[9px] text-slate-400">الحالة</p>
                  <p className={`text-xs font-bold ${CARE_STATUS_META.find((c) => c.id === detailItem.careStatus)?.color}`}>
                    {CARE_STATUS_META.find((c) => c.id === detailItem.careStatus)?.label}
                  </p>
                </div>
              </div>
            </div>
          </div>
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
              <button
                onClick={() => photoRef.current?.click()}
                className="w-full border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center hover:border-warning-400 transition cursor-pointer overflow-hidden"
              >
                {itemPhoto ? (
                  <img src={itemPhoto} alt="Item" className="w-full h-32 object-contain" style={{ backgroundColor: '#ffffff', borderRadius: '0.5rem' }} />
                ) : (
                  <>
                    <Camera size={28} className="mx-auto mb-2 text-slate-400" />
                    <p className="text-xs text-slate-500 dark:text-slate-400">التقط صورة أو ارفع صورة للقطعة</p>
                  </>
                )}
              </button>
              <input ref={photoRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">اسم القطعة</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="مثال: قميص أزرق" className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 outline-none px-4 py-2.5 text-sm focus:ring-2 focus:ring-warning-400" />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">العلامة التجارية (Brand)</label>
                <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="مثال: Zara, Nike, Levis" className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 outline-none px-4 py-2.5 text-sm focus:ring-2 focus:ring-warning-400" />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">الفئة</label>
                <div className="grid grid-cols-3 gap-2">
                  {CATEGORY_META.map((c) => (
                    <button key={c.id} onClick={() => { setCat(c.id); setFabric(c.fabricLabel); }} className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 transition ${cat === c.id ? 'border-warning-500 bg-warning-500/10' : 'border-slate-200 dark:border-slate-700'}`}>
                      <span className="text-lg">{c.emoji}</span>
                      <span className="text-[10px] font-semibold">{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">اللون الأساسي</label>
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
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">اللون الثانوي</label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_SWATCHES.map((s) => (
                    <button key={s.name} onClick={() => toggleSecondary(s.name)} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border-2 transition ${selectedSecondary.includes(s.name) ? 'border-accent-500 bg-accent-500/10' : 'border-slate-200 dark:border-slate-700'}`}>
                      <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600" style={{ backgroundColor: s.hex }} />
                      <span className="text-[10px] font-semibold">{s.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">الخامة / Fabric</label>
                <div className="flex flex-wrap gap-2">
                  {FABRIC_OPTIONS.map((f) => (
                    <button key={f} onClick={() => setFabric(f)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border-2 transition ${fabric === f ? 'border-warning-500 bg-warning-500/10 text-warning-600 dark:text-warning-400' : 'border-slate-200 dark:border-slate-700 text-slate-500'}`}>{f}</button>
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
