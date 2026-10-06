import { useState, useRef, useEffect } from 'react';
import {
  Sparkles, Cloud, CloudRain, Sun, CloudSnow, Wind, Check, Shuffle, RefreshCw,
  Palette, X, RotateCw, Camera, User, LayoutGrid, Eye, SlidersHorizontal, Tag,
} from 'lucide-react';
import { CARE_STATUS_META, type WardrobeItem } from '@/components/studio/WardrobeGrid';

type Occasion = 'university' | 'sport' | 'casual' | 'work' | 'formal';
type Weather = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy';
type PreviewMode = 'tryon' | 'flatlay';

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

const CLEAN_POOL: Record<string, WardrobeItem[]> = {
  tops: [
    { id: 'p1', name: 'قميص كحلي', category: 'tops', colors: ['كحلي'], season: 'كل المواسم', wearCount: 12, outfitTag: 'رسمي', emoji: '', careStatus: 'clean_ironed', brand: 'Pull&Bear', fabric: 'قطن', photo: 'https://images.pexels.com/photos/8146450/pexels-photo-8146450.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 'p2', name: 'تيشيرت أبيض', category: 'tops', colors: ['أبيض'], season: 'صيف', wearCount: 24, outfitTag: 'كاجوال', emoji: '', careStatus: 'clean_ironed', brand: 'Zara', fabric: 'قطن', photo: 'https://images.pexels.com/photos/28967487/pexels-photo-28967487.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 'p3', name: 'قميص رسمي', category: 'tops', colors: ['أبيض'], secondaryColors: ['كحلي'], season: 'كل المواسم', wearCount: 8, outfitTag: 'رسمي', emoji: '', careStatus: 'clean_ironed', brand: 'H&M', fabric: 'قطن', photo: 'https://images.pexels.com/photos/3214788/pexels-photo-3214788.jpeg?auto=compress&cs=tinysrgb&w=400' },
  ],
  bottoms: [
    { id: 'p4', name: 'جينز أزرق', category: 'bottoms', colors: ['أزرق'], season: 'كل المواسم', wearCount: 42, outfitTag: 'كاجوال', emoji: '', careStatus: 'clean_ironed', brand: 'Levis', fabric: 'دينم', photo: 'https://images.pexels.com/photos/18533669/pexels-photo-18533669.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 'p5', name: 'بنطال رسمي', category: 'bottoms', colors: ['أسود'], season: 'كل المواسم', wearCount: 10, outfitTag: 'رسمي', emoji: '', careStatus: 'clean_ironed', brand: 'Zara', fabric: 'بوليستر', photo: 'https://images.pexels.com/photos/18533668/pexels-photo-18533668.jpeg?auto=compress&cs=tinysrgb&w=400' },
  ],
  footwear: [
    { id: 'p6', name: 'حذاء رياضي', category: 'footwear', colors: ['أسود', 'أبيض'], season: 'كل المواسم', wearCount: 56, outfitTag: 'رياضي', emoji: '', careStatus: 'clean_ironed', brand: 'Nike', fabric: 'بلاستيك', photo: 'https://images.pexels.com/photos/1461048/pexels-photo-1461048.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 'p7', name: 'حذاء جلدي', category: 'footwear', colors: ['بني'], season: 'كل المواسم', wearCount: 15, outfitTag: 'رسمي', emoji: '', careStatus: 'clean_ironed', brand: 'Clarks', fabric: 'جلد', photo: 'https://images.pexels.com/photos/27609337/pexels-photo-27609337.jpeg?auto=compress&cs=tinysrgb&w=400' },
  ],
  outerwear: [
    { id: 'p8', name: 'جاكيت شتوي', category: 'outerwear', colors: ['أسود'], season: 'شتاء', wearCount: 18, outfitTag: 'يومي', emoji: '', careStatus: 'clean_ironed', brand: 'H&M', fabric: 'بوليستر', photo: 'https://images.pexels.com/photos/234575/pexels-photo-234575.jpeg?auto=compress&cs=tinysrgb&w=400' },
  ],
  accessories: [
    { id: 'p9', name: 'ساعة يد', category: 'accessories', colors: ['بني'], secondaryColors: ['ذهبي'], season: 'كل المواسم', wearCount: 120, outfitTag: 'رسمي', emoji: '', careStatus: 'clean_ironed', brand: 'Casio', fabric: 'معدن', photo: 'https://images.pexels.com/photos/8839887/pexels-photo-8839887.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: 'p10', name: 'نظارة شمسية', category: 'accessories', colors: ['أسود'], season: 'صيف', wearCount: 30, outfitTag: 'كاجوال', emoji: '', careStatus: 'clean_ironed', brand: 'Ray-Ban', fabric: 'بلاستيك', photo: 'https://images.pexels.com/photos/32677231/pexels-photo-32677231.jpeg?auto=compress&cs=tinysrgb&w=400' },
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

/* ---- Canvas rendering helpers ---- */

const CANVAS_W = 400;
const TRYON_H = 560;
const FLATLAY_H = 580;

const TRYON_LAYOUT = {
  top:       { x: 75,  y: 130, w: 250, h: 185 },
  bottom:    { x: 85,  y: 300, w: 230, h: 200 },
  shoes:     { x: 105, y: 478, w: 190, h: 72  },
  glasses:   { x: 140, y: 80,  w: 120, h: 42  },
  watch:     { x: 305, y: 215, w: 55,  h: 55  },
  outerwear: { x: 60,  y: 118, w: 280, h: 230 },
};

const FLATLAY_LAYOUT = {
  top:       { x: 100, y: 10,  w: 200, h: 115 },
  bottom:    { x: 110, y: 150, w: 180, h: 135 },
  shoes:     { x: 30,  y: 315, w: 150, h: 95  },
  accessory: { x: 215, y: 315, w: 150, h: 95  },
  outerwear: { x: 80,  y: 440, w: 240, h: 100 },
};

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) {
  if (img.width === 0 || img.height === 0) return;
  const scale = Math.max(w / img.width, h / img.height);
  const iw = img.width * scale;
  const ih = img.height * scale;
  const ix = x + (w - iw) / 2;
  const iy = y + (h - ih) / 2;
  ctx.drawImage(img, ix, iy, iw, ih);
}

function drawContain(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) {
  if (img.width === 0 || img.height === 0) return;
  const scale = Math.min(w / img.width, h / img.height);
  const iw = img.width * scale;
  const ih = img.height * scale;
  const ix = x + (w - iw) / 2;
  const iy = y + (h - ih) / 2;
  ctx.drawImage(img, ix, iy, iw, ih);
}

function drawGrid(ctx: CanvasRenderingContext2D, W: number, H: number) {
  ctx.strokeStyle = 'rgba(100,100,100,0.06)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 24) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let y = 0; y <= H; y += 24) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
}

function drawSilhouette(ctx: CanvasRenderingContext2D, W: number) {
  const cx = W / 2;
  ctx.fillStyle = '#f1f5f9';
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.arc(cx, 48, 26, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillRect(cx - 9, 74, 18, 14);

  ctx.beginPath();
  ctx.rect(cx - 55, 88, 110, 170);
  ctx.fill();
  ctx.stroke();

  ctx.lineWidth = 14;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - 55, 98);
  ctx.lineTo(cx - 88, 205);
  ctx.moveTo(cx + 55, 98);
  ctx.lineTo(cx + 88, 205);
  ctx.stroke();

  ctx.lineWidth = 16;
  ctx.beginPath();
  ctx.moveTo(cx - 32, 258);
  ctx.lineTo(cx - 38, 430);
  ctx.moveTo(cx + 32, 258);
  ctx.lineTo(cx + 38, 430);
  ctx.stroke();

  ctx.lineWidth = 1;
  ctx.lineCap = 'butt';
}

function drawLabel(ctx: CanvasRenderingContext2D, text: string, subtext: string | undefined, cx: number, y: number) {
  ctx.direction = 'rtl';
  ctx.textAlign = 'center';
  ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#475569';
  ctx.fillText(text, cx, y);
  if (subtext) {
    ctx.font = '10px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(subtext, cx, y + 14);
  }
}

function FittingCanvas({
  mode,
  pieces,
  avatarPhoto,
  rotation,
  yOffset,
  scale,
}: {
  mode: PreviewMode;
  pieces: WardrobeItem[];
  avatarPhoto: string | null;
  rotation: number;
  yOffset: number;
  scale: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let cancelled = false;
    const W = canvas.width;
    const H = canvas.height;

    const drawPiece = async (piece: WardrobeItem | undefined, layout: { x: number; y: number; w: number; h: number }, contain: boolean) => {
      if (!piece?.photo) return;
      const img = await loadImage(piece.photo);
      if (cancelled || !img) return;
      ctx.save();
      ctx.filter = 'contrast(1.1) saturate(1.4) brightness(1.05)';
      ctx.shadowColor = 'rgba(0,0,0,0.12)';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetY = 2;
      if (contain) drawContain(ctx, img, layout.x, layout.y, layout.w, layout.h);
      else drawCover(ctx, img, layout.x, layout.y, layout.w, layout.h);
      ctx.restore();
    };

    (async () => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, W, H);

      if (mode === 'tryon') {
        const top = pieces.find((p) => p.category === 'tops');
        const bottom = pieces.find((p) => p.category === 'bottoms');
        const shoes = pieces.find((p) => p.category === 'footwear');
        const accessory = pieces.find((p) => p.category === 'accessories');
        const outer = pieces.find((p) => p.category === 'outerwear');
        const isGlasses = accessory?.name.includes('نظارة');
        const isWatch = accessory?.name.includes('ساعة');

        if (avatarPhoto) {
          const avatar = await loadImage(avatarPhoto);
          if (cancelled) return;
          if (avatar) drawCover(ctx, avatar, 0, 0, W, H);
        } else {
          drawSilhouette(ctx, W);
        }

        drawGrid(ctx, W, H);

        ctx.save();
        ctx.translate(W / 2, H / 2 + yOffset);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(scale, scale);
        ctx.translate(-W / 2, -H / 2);

        await drawPiece(top, TRYON_LAYOUT.top, true);
        if (cancelled) return;
        await drawPiece(bottom, TRYON_LAYOUT.bottom, true);
        if (cancelled) return;
        await drawPiece(shoes, TRYON_LAYOUT.shoes, true);
        if (cancelled) return;
        await drawPiece(outer, TRYON_LAYOUT.outerwear, true);
        if (cancelled) return;
        if (isGlasses) await drawPiece(accessory, TRYON_LAYOUT.glasses, true);
        if (cancelled) return;
        if (isWatch) await drawPiece(accessory, TRYON_LAYOUT.watch, true);
        if (cancelled) return;
        if (accessory && !isGlasses && !isWatch) await drawPiece(accessory, TRYON_LAYOUT.watch, true);

        ctx.restore();
        if (cancelled) return;

        const label = rotation === 0 ? 'الجبهة' : rotation === 90 || rotation === -270 ? 'الجانب' : rotation === 180 || rotation === -180 ? 'الخلف' : rotation === 270 || rotation === -90 ? 'الجانب' : `${rotation}°`;
        ctx.direction = 'rtl';
        ctx.font = 'bold 11px system-ui, sans-serif';
        ctx.textAlign = 'right';
        const labelW = ctx.measureText(label).width + 20;
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.fillRect(W - labelW - 8, 8, labelW, 22);
        ctx.fillStyle = '#64748b';
        ctx.textAlign = 'center';
        ctx.fillText(label, W - labelW / 2 - 8, 23);

        ctx.font = '10px system-ui, sans-serif';
        ctx.fillStyle = '#94a3b8';
        ctx.textAlign = 'left';
        ctx.fillText(`${rotation}°`, 12, H - 12);
      } else {
        const top = pieces.find((p) => p.category === 'tops');
        const bottom = pieces.find((p) => p.category === 'bottoms');
        const shoes = pieces.find((p) => p.category === 'footwear');
        const accessory = pieces.find((p) => p.category === 'accessories');
        const outer = pieces.find((p) => p.category === 'outerwear');

        const slots = [
          { piece: top, layout: FLATLAY_LAYOUT.top, cx: W / 2 },
          { piece: bottom, layout: FLATLAY_LAYOUT.bottom, cx: W / 2 },
          { piece: shoes, layout: FLATLAY_LAYOUT.shoes, cx: FLATLAY_LAYOUT.shoes.x + FLATLAY_LAYOUT.shoes.w / 2 },
          { piece: accessory, layout: FLATLAY_LAYOUT.accessory, cx: FLATLAY_LAYOUT.accessory.x + FLATLAY_LAYOUT.accessory.w / 2 },
          { piece: outer, layout: FLATLAY_LAYOUT.outerwear, cx: W / 2 },
        ];

        for (const slot of slots) {
          if (!slot.piece) continue;

          ctx.fillStyle = '#fafafa';
          ctx.strokeStyle = '#f1f5f9';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.rect(slot.layout.x - 4, slot.layout.y - 4, slot.layout.w + 8, slot.layout.h + 8);
          ctx.fill();
          ctx.stroke();

          await drawPiece(slot.piece, slot.layout, true);
          if (cancelled) return;

          drawLabel(ctx, slot.piece.name, slot.piece.brand, slot.cx, slot.layout.y + slot.layout.h + 18);
        }
      }
    })();

    return () => { cancelled = true; };
  }, [mode, pieces, avatarPhoto, rotation, yOffset, scale]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_W}
      height={mode === 'flatlay' ? FLATLAY_H : TRYON_H}
      className="w-full h-auto block"
    />
  );
}

export default function AIStylist() {
  const [occasion, setOccasion] = useState<Occasion>('university');
  const [weather, setWeather] = useState<Weather>('sunny');
  const [result, setResult] = useState<OutfitResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewMode, setPreviewMode] = useState<PreviewMode>('tryon');
  const [rotation, setRotation] = useState(0);
  const [avatarPhoto, setAvatarPhoto] = useState<string | null>(null);
  const [yOffset, setYOffset] = useState(0);
  const [scale, setScale] = useState(1);
  const [showSliders, setShowSliders] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // localStorage sync for avatar and slider preferences
  useEffect(() => {
    const saved = localStorage.getItem('aistylist_prefs');
    if (saved) {
      try {
        const p = JSON.parse(saved);
        if (p.avatarPhoto) setAvatarPhoto(p.avatarPhoto);
        if (typeof p.yOffset === 'number') setYOffset(p.yOffset);
        if (typeof p.scale === 'number') setScale(p.scale);
      } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('aistylist_prefs', JSON.stringify({ avatarPhoto, yOffset, scale }));
  }, [avatarPhoto, yOffset, scale]);

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
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
            {avatarPhoto ? (
              <img src={avatarPhoto} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User size={28} className="text-slate-300" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold">صورتك الشخصية / الأفاتار</p>
            <p className="text-[10px] text-slate-400 mb-1.5">ارفع صورتك لمعاينة القياس الواقعي على Canvas</p>
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
          التنسيقات تُقترح من القطع <span className="font-bold text-success-600 dark:text-success-400">النظيفة والمكوية</span> فقط — مع تصفية وتنعيم تلقائي للصور على Canvas
        </p>
      </div>

      {/* Selector card */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={20} className="text-accent-500" />
          <h2 className="font-bold text-lg">اقترح لي طقم اليوم</h2>
        </div>

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
            <><Shuffle size={18} className="animate-spin" /> جاري التوليد...</>
          ) : (
            <><Sparkles size={18} /> توليد التنسيق</>
          )}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="card p-5 animate-scale-in bg-gradient-to-br from-accent-500/5 to-brand-500/5">
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

          <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mb-4">
            <div className="h-full rounded-full bg-gradient-to-r from-success-500 to-accent-500 transition-all duration-700" style={{ width: `${result.confidence}%` }} />
          </div>

          {/* Pieces with swapper — real photo thumbnails on white */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
            {result.pieces.map((p, i) => {
              const care = CARE_STATUS_META.find((c) => c.id === p.careStatus)!;
              return (
                <div key={i} className="rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 animate-fade-up relative group" style={{ animationDelay: `${i * 80}ms` }}>
                  <div className="relative h-20 flex items-center justify-center" style={{ backgroundColor: '#ffffff' }}>
                    <button
                      onClick={() => swapPiece(i)}
                      className="absolute top-1 left-1 p-1.5 rounded-lg bg-white/80 shadow-sm opacity-0 group-hover:opacity-100 transition hover:text-accent-500 z-10"
                      title="استبدل القطعة"
                    >
                      <RefreshCw size={12} />
                    </button>
                    {p.photo ? (
                      <img
                        src={p.photo}
                        alt={p.name}
                        className="w-full h-full object-contain p-1"
                        style={{ filter: 'contrast(1.1) saturate(1.4) brightness(1.05)' }}
                      />
                    ) : (
                      <span className="text-[10px] text-slate-300">{p.name}</span>
                    )}
                  </div>
                  <div className="p-2 bg-slate-50 dark:bg-slate-800/50 text-center">
                    <p className="text-xs font-bold truncate">{p.name}</p>
                    {p.brand && <p className="text-[9px] text-slate-400">{p.brand}</p>}
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-0.5 justify-center">
                      <Tag size={8} />
                      {p.category === 'tops' ? 'أعلى' : p.category === 'bottoms' ? 'أسفل' : p.category === 'footwear' ? 'حذاء' : p.category === 'outerwear' ? 'إضافي' : 'إكسسوار'}
                    </p>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${care.dot}`} />
                      <span className="text-[8px] text-slate-400">نظيف</span>
                    </div>
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
                const sw = [{ name: 'أسود', hex: '#1e293b' }, { name: 'أبيض', hex: '#f8fafc' }, { name: 'أزرق', hex: '#3b82f6' }, { name: 'كحلي', hex: '#1e3a5f' }, { name: 'بني', hex: '#92400e' }, { name: 'بيج', hex: '#d4b896' }, { name: 'رمادي', hex: '#94a3b8' }, { name: 'وردي', hex: '#f472b6' }].find((s) => s.name === c);
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
          <div className="bg-accent-500/10 rounded-xl p-3.5 mb-4">
            <p className="text-xs font-semibold text-accent-600 dark:text-accent-400 mb-1">نصيحة الأناقة</p>
            <p className="text-sm">{result.advice}</p>
          </div>

          {/* Preview mode buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => { setPreviewMode('tryon'); setShowPreview(true); }}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 hover:from-brand-600 hover:to-accent-600 text-white font-bold text-sm py-3 transition shadow-md"
            >
              <Eye size={18} />
              تجربة افتراضية
            </button>
            <button
              onClick={() => { setPreviewMode('flatlay'); setShowPreview(true); }}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-slate-950 text-white font-bold text-sm py-3 transition shadow-md"
            >
              <LayoutGrid size={18} />
              عرض فلات-لاي
            </button>
          </div>
        </div>
      )}

      {/* Preview modal — Canvas-based Virtual Try-On & Flat-Lay */}
      {showPreview && result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setShowPreview(false)}>
          <div className="card p-0 w-full max-w-md max-h-[92vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
              <div className="flex items-center gap-2">
                {previewMode === 'tryon' ? <Eye size={20} className="text-accent-500" /> : <LayoutGrid size={20} className="text-accent-500" />}
                <h3 className="font-bold text-base">{previewMode === 'tryon' ? 'تجربة افتراضية — Canvas' : 'عرض فلات-لاي — Canvas'}</h3>
              </div>
              <button onClick={() => setShowPreview(false)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                <X size={18} />
              </button>
            </div>

            {/* Mode toggle */}
            <div className="flex gap-1 p-2 bg-slate-50 dark:bg-slate-800/50">
              <button
                onClick={() => setPreviewMode('tryon')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition ${previewMode === 'tryon' ? 'bg-white dark:bg-slate-900 shadow-sm text-accent-500' : 'text-slate-400'}`}
              >
                <Eye size={14} /> تجربة على الجسم
              </button>
              <button
                onClick={() => setPreviewMode('flatlay')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition ${previewMode === 'flatlay' ? 'bg-white dark:bg-slate-900 shadow-sm text-accent-500' : 'text-slate-400'}`}
              >
                <LayoutGrid size={14} /> فلات-لاي
              </button>
            </div>

            {/* Canvas preview area */}
            <div className="overflow-hidden" style={{ backgroundColor: '#ffffff' }}>
              <FittingCanvas
                mode={previewMode}
                pieces={result.pieces}
                avatarPhoto={avatarPhoto}
                rotation={rotation}
                yOffset={yOffset}
                scale={scale}
              />
            </div>

            {/* Controls area */}
            <div className="p-4 space-y-3">
              {previewMode === 'tryon' && (
                <>
                  {/* Fine-tuning sliders */}
                  <button
                    onClick={() => setShowSliders(!showSliders)}
                    className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition ${showSliders ? 'bg-accent-500/10 text-accent-600 dark:text-accent-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}
                  >
                    <SlidersHorizontal size={16} />
                    ضبط دقيق للتنسيق
                  </button>

                  {showSliders && (
                    <div className="space-y-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 animate-scale-in">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">إزاحة عمودية (Y)</label>
                          <span className="text-[10px] font-bold text-accent-500">{yOffset}px</span>
                        </div>
                        <input
                          type="range"
                          min={-80}
                          max={80}
                          value={yOffset}
                          onChange={(e) => setYOffset(Number(e.target.value))}
                          className="w-full accent-accent-500"
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">تكبير/تصغير</label>
                          <span className="text-[10px] font-bold text-accent-500">{scale.toFixed(2)}x</span>
                        </div>
                        <input
                          type="range"
                          min={0.6}
                          max={1.4}
                          step={0.02}
                          value={scale}
                          onChange={(e) => setScale(Number(e.target.value))}
                          className="w-full accent-accent-500"
                        />
                      </div>
                      <button
                        onClick={() => { setYOffset(0); setScale(1); }}
                        className="w-full text-[10px] font-semibold text-slate-400 hover:text-accent-500 transition py-1"
                      >
                        إعادة ضبط
                      </button>
                    </div>
                  )}

                  <div className="flex gap-2">
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

                  <div className="flex items-center justify-between gap-2">
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
                </>
              )}

              <div className="grid grid-cols-2 gap-2">
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
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {previewMode === 'tryon'
                    ? 'القطع مرسومة بدقة على صورتك عبر HTML5 Canvas — مع تصفية وتنعيم تلقائي'
                    : 'عرض فلات-لاي عالي الدقة على Canvas بخلفية بيضاء نظيفة'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
