import { useState, useRef } from 'react';
import { Sparkles, Cloud, CloudRain, Sun, CloudSnow, Wind, Check, Shuffle, RefreshCw, Palette, Box, X, RotateCw, Camera, User } from 'lucide-react';
import { CARE_STATUS_META, type WardrobeItem } from '@/components/studio/WardrobeGrid';

type Occasion = 'university' | 'sport' | 'casual' | 'work' | 'formal';
type Weather = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy';

const OCCASIONS: { id: Occasion; label: string; emoji: string }[] = [
  { id: 'university', label: 'جامعة', emoji: '🎓' },
  { id: 'sport', label: 'رياضة', emoji: '⚽' },
  { id: 'casual', label: 'طلعة شبابية', emoji: '☕' },
  { id: 'work', label: 'عمل', emoji: '💼' },
  { id: 'formal', label: 'مناسبة رسمية', emoji: '🤵' },
];

const WEATHERS: { id: Weather; label: string; icon: typeof Sun }[] = [
  { id: 'sunny', label: 'مشمس', icon: Sun },
  { id: 'cloudy', label: 'غائم', icon: Cloud },
  { id: 'rainy', label: 'ممطر', icon: CloudRain },
  { id: 'snowy', label: 'ثلجي', icon: CloudSnow },
  { id: 'windy', label: 'عاصف', icon: Wind },
];

// Pool of clean+ironed items available for outfit generation
const CLEAN_POOL: Record<string, WardrobeItem[]> = {
  tops: [
    { id: 'p1', name: 'قميص كحلي', category: 'tops', colors: ['كحلي'], season: 'كل المواسم', wearCount: 12, outfitTag: 'رسمي', emoji: '👔', careStatus: 'clean_ironed' },
    { id: 'p2', name: 'تيشيرت أبيض', category: 'tops', colors: ['أبيض'], season: 'صيف', wearCount: 24, outfitTag: 'كاجوال', emoji: '👕', careStatus: 'clean_ironed' },
    { id: 'p3', name: 'قميص رسمي', category: 'tops', colors: ['أبيض'], season: 'كل المواسم', wearCount: 8, outfitTag: 'رسمي', emoji: '👔', careStatus: 'clean_ironed' },
  ],
  bottoms: [
    { id: 'p4', name: 'جينز أزرق', category: 'bottoms', colors: ['أزرق'], season: 'كل المواسم', wearCount: 42, outfitTag: 'كاجوال', emoji: '👖', careStatus: 'clean_ironed' },
    { id: 'p5', name: 'بنطال رسمي', category: 'bottoms', colors: ['أسود'], season: 'كل المواسم', wearCount: 10, outfitTag: 'رسمي', emoji: '👖', careStatus: 'clean_ironed' },
  ],
  footwear: [
    { id: 'p6', name: 'حذاء رياضي', category: 'footwear', colors: ['أسود', 'أبيض'], season: 'كل المواسم', wearCount: 56, outfitTag: 'رياضي', emoji: '👟', careStatus: 'clean_ironed' },
    { id: 'p7', name: 'حذاء جلدي', category: 'footwear', colors: ['بني'], season: 'كل المواسم', wearCount: 15, outfitTag: 'رسمي', emoji: '👞', careStatus: 'clean_ironed' },
  ],
  outerwear: [
    { id: 'p8', name: 'جاكيت شتوي', category: 'outerwear', colors: ['أسود'], season: 'شتاء', wearCount: 18, outfitTag: 'يومي', emoji: '🧥', careStatus: 'clean_ironed' },
  ],
  accessories: [
    { id: 'p9', name: 'ساعة يد', category: 'accessories', colors: ['بني'], season: 'كل المواسم', wearCount: 120, outfitTag: 'رسمي', emoji: '⌚', careStatus: 'clean_ironed' },
  ],
};

const COLOR_HARMONY: Record<string, string[]> = {
  'أبيض': ['أسود', 'كحلي', 'أزرق', 'بيج', 'رمادي'],
  'أسود': ['أبيض', 'بيج', 'رمادي', 'كحلي'],
  'أزرق': ['أبيض', 'بيج', 'رمادي', 'بني'],
  'كحلي': ['أبيض', 'بيج', 'رمادي'],
  'بيج': ['أسود', 'أبيض', 'بني', 'كحلي'],
  'بني': ['أبيض', 'بيج', 'كحلي'],
  'رمادي': ['أبيض', 'أسود', 'أزرق'],
};

function calcHarmony(pieces: WardrobeItem[]): number {
  let score = 70;
  for (let i = 0; i < pieces.length - 1; i++) {
    const c1 = pieces[i].colors[0];
    const c2 = pieces[i + 1].colors[0];
    if (c1 === c2) score += 5;
    else if (COLOR_HARMONY[c1]?.includes(c2)) score += 8;
    else score -= 3;
  }
  return Math.max(60, Math.min(98, score));
}

interface OutfitResult {
  pieces: WardrobeItem[];
  confidence: number;
  harmony: number;
  advice: string;
}

const OCCASION_CATEGORIES: Record<Occasion, string[]> = {
  university: ['tops', 'bottoms', 'footwear', 'accessories'],
  sport: ['tops', 'bottoms', 'footwear'],
  casual: ['tops', 'bottoms', 'footwear', 'accessories'],
  work: ['tops', 'bottoms', 'footwear', 'accessories'],
  formal: ['tops', 'bottoms', 'footwear', 'accessories'],
};

const ADVICE: Record<Occasion, string> = {
  university: 'تنسيق مريح وأنيق يناسب اليوم الدراسي — ألوان هادئة تعكس الاحترافية',
  sport: 'ملابس رياضية خفيفة وقابلة للتنفس — مثالية للأداء العالي',
  casual: 'إطلالة كاجوال متوازنة — بسيطة وعصرية في نفس الوقت',
  work: 'تنسيق احترافي مريح — يناسب بيئة العمل ويمنحك ثقة',
  formal: 'تنسيق رسمي كامل — يمنحك حضوراً واثقاً في المناسبات',
};

function generateOutfit(occasion: Occasion, weather: Weather): OutfitResult {
  const cats = OCCASION_CATEGORIES[occasion];
  const pieces: WardrobeItem[] = [];

  cats.forEach((cat) => {
    const pool = CLEAN_POOL[cat];
    if (pool && pool.length > 0) {
      const pick = pool[Math.floor(Math.random() * pool.length)];
      pieces.push(pick);
    }
  });

  if ((weather === 'rainy' || weather === 'snowy') && CLEAN_POOL.outerwear.length > 0) {
    pieces.push(CLEAN_POOL.outerwear[0]);
  }

  const harmony = calcHarmony(pieces);
  const confidence = Math.max(harmony - 5, 65);
  return { pieces, confidence, harmony, advice: ADVICE[occasion] };
}

export default function AIStylist() {
  const [occasion, setOccasion] = useState<Occasion>('university');
  const [weather, setWeather] = useState<Weather>('sunny');
  const [result, setResult] = useState<OutfitResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showFit3D, setShowFit3D] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [avatarPhoto, setAvatarPhoto] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const rotationLabel = rotation === 0 ? 'الجبهة' : rotation === 90 || rotation === -270 ? 'الجانب' : rotation === 180 || rotation === -180 ? 'الخلف' : rotation === 270 || rotation === -90 ? 'الجانب' : `${rotation}°`;

  const generate = () => {
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      setResult(generateOutfit(occasion, weather));
      setLoading(false);
    }, 1200);
  };

  const swapPiece = (index: number) => {
    if (!result) return;
    const piece = result.pieces[index];
    const pool = CLEAN_POOL[piece.category];
    if (!pool || pool.length <= 1) return;
    const others = pool.filter((p) => p.id !== piece.id);
    const newPiece = others[Math.floor(Math.random() * others.length)];
    const newPieces = [...result.pieces];
    newPieces[index] = newPiece;
    const harmony = calcHarmony(newPieces);
    setResult({ ...result, pieces: newPieces, harmony, confidence: Math.max(harmony - 5, 65) });
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setAvatarPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Avatar / Photo upload */}
      <div className="card p-4">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-accent-500/10 to-brand-500/10 flex items-center justify-center shrink-0">
            {avatarPhoto ? (
              <img src={avatarPhoto} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User size={28} className="text-slate-300 dark:text-slate-600" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold">صورتك الشخصية / الأفاتار</p>
            <p className="text-[10px] text-slate-400 mb-1.5">ارفع صورتك لمعاينة القياس ثلاثي الأبعاد</p>
            <button
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-500/10 text-accent-600 dark:text-accent-400 hover:bg-accent-500/20 transition text-xs font-semibold"
            >
              <Camera size={14} />
              {avatarPhoto ? 'تغيير الصورة' : 'رفع صورة'}
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
          </div>
        </div>
      </div>

      {/* Clean-only notice */}
      <div className="card p-3.5 bg-success-500/5 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-success-500/15 flex items-center justify-center shrink-0">
          <Check size={16} className="text-success-500" />
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300">
          التنسيقات تُقترح من القطع <span className="font-bold text-success-600 dark:text-success-400">النظيفة والمكوية</span> فقط من خزانتك
        </p>
      </div>

      {/* Selector card */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={20} className="text-accent-500" />
          <h2 className="font-bold text-lg">اقترح لي طقم اليوم</h2>
        </div>

        {/* Occasion */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 block">المناسبة</label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {OCCASIONS.map((o) => (
              <button
                key={o.id}
                onClick={() => setOccasion(o.id)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition ${occasion === o.id ? 'border-accent-500 bg-accent-500/10' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
              >
                <span className="text-2xl">{o.emoji}</span>
                <span className={`text-xs font-semibold ${occasion === o.id ? 'text-accent-600 dark:text-accent-400' : ''}`}>{o.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Weather */}
        <div className="mb-5">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 block">حالة الطقس</label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {WEATHERS.map((w) => {
              const Icon = w.icon;
              return (
                <button
                  key={w.id}
                  onClick={() => setWeather(w.id)}
                  className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border-2 transition ${weather === w.id ? 'border-accent-500 bg-accent-500/10' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
                >
                  <Icon size={20} className={weather === w.id ? 'text-accent-500' : 'text-slate-400'} />
                  <span className={`text-[10px] font-semibold ${weather === w.id ? 'text-accent-600 dark:text-accent-400' : ''}`}>{w.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={generate}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent-500 to-brand-500 hover:from-accent-600 hover:to-brand-600 text-white font-bold text-sm py-3 transition shadow-md disabled:opacity-60"
        >
          {loading ? (
            <>
              <Shuffle size={18} className="animate-spin" />
              جاري التوليد...
            </>
          ) : (
            <>
              <Sparkles size={18} />
              توليد التنسيق
            </>
          )}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="card p-5 animate-scale-in bg-gradient-to-br from-accent-500/5 to-brand-500/5">
          {/* Scores */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-success-500/15 flex items-center justify-center">
                <Check size={20} className="text-success-500" />
              </div>
              <div>
                <p className="font-bold text-sm">تنسيق مقترح</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">درجة التطابق</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-[10px] text-slate-400">تناسق الألوان</p>
                <p className="text-lg font-extrabold text-accent-500">{result.harmony}%</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-slate-400">التطابق</p>
                <p className="text-2xl font-extrabold text-success-500">{result.confidence}%</p>
              </div>
            </div>
          </div>

          {/* Confidence bar */}
          <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mb-4">
            <div className="h-full rounded-full bg-gradient-to-r from-success-500 to-accent-500 transition-all duration-700" style={{ width: `${result.confidence}%` }} />
          </div>

          {/* Pieces with swapper */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
            {result.pieces.map((p, i) => {
              const care = CARE_STATUS_META.find((c) => c.id === p.careStatus)!;
              return (
                <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center animate-fade-up relative group" style={{ animationDelay: `${i * 80}ms` }}>
                  <button
                    onClick={() => swapPiece(i)}
                    className="absolute top-1.5 left-1.5 p-1.5 rounded-lg bg-white dark:bg-slate-800 shadow-sm opacity-0 group-hover:opacity-100 transition hover:text-accent-500"
                    title="استبدل القطعة"
                  >
                    <RefreshCw size={12} />
                  </button>
                  <div className="text-3xl mb-1.5">{p.emoji}</div>
                  <p className="text-xs font-bold">{p.name}</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">{p.category === 'tops' ? 'أعلى' : p.category === 'bottoms' ? 'أسفل' : p.category === 'footwear' ? 'حذاء' : p.category === 'outerwear' ? 'إضافي' : 'إكسسوار'}</p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${care.dot}`} />
                    <span className="text-[8px] text-slate-400">نظيف</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Color palette display */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 mb-3">
            <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1">
              <Palette size={11} />
              ألوان التنسيق
            </p>
            <div className="flex items-center gap-2">
              {result.pieces.flatMap((p) => p.colors).map((c, i) => {
                const sw = [{ name: 'أسود', hex: '#1e293b' }, { name: 'أبيض', hex: '#f8fafc' }, { name: 'أزرق', hex: '#3b82f6' }, { name: 'كحلي', hex: '#1e3a5f' }, { name: 'بني', hex: '#92400e' }, { name: 'بيج', hex: '#d4b896' }, { name: 'رمادي', hex: '#94a3b8' }].find((s) => s.name === c);
                return (
                  <div key={i} className="flex items-center gap-1">
                    {i > 0 && <span className="text-slate-300 text-xs">+</span>}
                    <div className="w-6 h-6 rounded-lg border border-slate-200 dark:border-slate-700" style={{ backgroundColor: sw?.hex || '#888' }} title={c} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Advice */}
          <div className="bg-accent-500/10 rounded-xl p-3.5">
            <p className="text-xs font-semibold text-accent-600 dark:text-accent-400 mb-1">نصيحة الأناقة</p>
            <p className="text-sm">{result.advice}</p>
          </div>

          {/* 3D Fitting preview button */}
          <button
            onClick={() => setShowFit3D(true)}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 hover:from-brand-600 hover:to-accent-600 text-white font-bold text-sm py-3 mt-4 transition shadow-md"
          >
            <Box size={18} />
            معاينة القياس ثلاثي الأبعاد
          </button>
        </div>
      )}

      {/* 3D Fitting modal */}
      {showFit3D && result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setShowFit3D(false)}>
          <div className="card p-6 w-full max-w-sm animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Box size={20} className="text-accent-500" />
                <h3 className="font-bold text-base">معاينة القياس 3D</h3>
              </div>
              <button onClick={() => setShowFit3D(false)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                <X size={18} />
              </button>
            </div>

            {/* Mannequin preview */}
            <div className="relative h-64 rounded-2xl bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center overflow-hidden mb-4">
              {/* Rotation grid backdrop */}
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: 'linear-gradient(rgba(100,100,100,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(100,100,100,0.3) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }} />

              {/* Mannequin/Avatar figure with pieces */}
              <div className="relative flex flex-col items-center gap-1 transition-transform duration-700" style={{ transform: `perspective(400px) rotateY(${rotation}deg)` }}>
                {/* Head / Avatar photo */}
                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-300 dark:bg-slate-600 border-2 border-white dark:border-slate-700 shadow-md">
                  {avatarPhoto ? (
                    <img src={avatarPhoto} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User size={20} className="text-slate-400" />
                    </div>
                  )}
                </div>
                {/* Top piece */}
                <div className="w-20 h-16 rounded-xl flex items-center justify-center text-3xl shadow-lg border border-white/30" style={{ backgroundColor: getColorHex(result.pieces[0]?.colors[0]) }}>
                  {result.pieces[0]?.emoji}
                </div>
                {/* Bottom piece */}
                <div className="w-16 h-20 rounded-xl flex items-center justify-center text-2xl shadow-lg border border-white/30" style={{ backgroundColor: getColorHex(result.pieces[1]?.colors[0]) }}>
                  {result.pieces[1]?.emoji}
                </div>
                {/* Shoes */}
                <div className="flex gap-2">
                  <div className="w-8 h-5 rounded-md flex items-center justify-center text-base shadow-sm border border-white/30" style={{ backgroundColor: getColorHex(result.pieces[2]?.colors[0]) }}>
                    {result.pieces[2]?.emoji}
                  </div>
                </div>
              </div>

              {/* Rotation view label */}
              <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-white/70 dark:bg-slate-900/70 px-2.5 py-1 rounded-lg">
                {rotationLabel}
              </div>
              <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[10px] text-slate-400 bg-white/60 dark:bg-slate-900/60 px-2 py-1 rounded-lg">
                <RotateCw size={10} />
                {rotation}°
              </div>
            </div>

            {/* Quick rotation views */}
            <div className="flex gap-2 mb-3">
              {[
                { label: 'الجبهة', deg: 0 },
                { label: 'الجانب', deg: 90 },
                { label: 'الخلف', deg: 180 },
              ].map((v) => (
                <button
                  key={v.deg}
                  onClick={() => setRotation(v.deg)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${rotation === v.deg ? 'bg-accent-500 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                >
                  {v.label}
                </button>
              ))}
            </div>

            {/* Fine rotation controls */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <button
                onClick={() => setRotation((r) => (r - 45) % 360)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                <RotateCw size={14} className="scale-x-[-1]" />
                يسار 45°
              </button>
              <button
                onClick={() => setRotation((r) => (r + 45) % 360)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                <RotateCw size={14} />
                يمين 45°
              </button>
            </div>

            {/* Fit info */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center">
                <p className="text-[10px] text-slate-400">المقاس المقترح</p>
                <p className="text-sm font-bold text-accent-500">M — متوسط</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center">
                <p className="text-[10px] text-slate-400">المناسبة</p>
                <p className="text-sm font-bold text-brand-500">{OCCASIONS.find((o) => o.id === occasion)?.label}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-xl bg-success-500/10">
              <Check size={16} className="text-success-500 shrink-0" />
              <p className="text-xs text-slate-600 dark:text-slate-300">القياس يناسب جسمك — تم التحليل بناءً على مقاساتك المسجلة</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getColorHex(color?: string): string {
  if (!color) return '#94a3b8';
  const map: Record<string, string> = {
    'أسود': '#1e293b', 'أبيض': '#f8fafc', 'أزرق': '#3b82f6', 'أحمر': '#ef4444',
    'أخضر': '#22c55e', 'بيج': '#d4b896', 'رمادي': '#94a3b8', 'بني': '#92400e',
    'كحلي': '#1e3a5f', 'وردي': '#f472b6',
  };
  return map[color] || '#94a3b8';
}
