import { Footprints, Flame, Heart } from 'lucide-react';

interface RingProps {
  pct: number;
  size: number;
  stroke: number;
  color: string;
  label: string;
  value: string;
  icon: React.ReactNode;
}

function ProgressRing({ pct, size, stroke, color, label, value, icon }: RingProps) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none" stroke="currentColor" strokeWidth={stroke}
            className="text-slate-100 dark:text-slate-800"
          />
          <circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="mb-0.5">{icon}</div>
          <span className="text-sm font-extrabold">{value}</span>
        </div>
      </div>
      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</span>
    </div>
  );
}

export default function ActivityRings() {
  return (
    <div className="card p-5 animate-fade-up">
      <div className="flex items-center gap-2 mb-5">
        <Flame size={20} className="text-error-500" />
        <h2 className="font-bold text-lg">النشاط البدني اليومي</h2>
      </div>
      <div className="flex items-center justify-around gap-4">
        <ProgressRing
          pct={72}
          size={100}
          stroke={9}
          color="#0ea5e9"
          label="الخطوات"
          value="7,200"
          icon={<Footprints size={18} className="text-brand-500" />}
        />
        <ProgressRing
          pct={55}
          size={100}
          stroke={9}
          color="#ef4444"
          label="السعرات"
          value="440"
          icon={<Flame size={18} className="text-error-500" />}
        />
        <ProgressRing
          pct={85}
          size={100}
          stroke={9}
          color="#14b8a6"
          label="نبضات/د"
          value="72"
          icon={<Heart size={18} className="text-accent-500" />}
        />
      </div>
      {/* Goal summary */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-xs text-slate-400">الهدف اليومي</p>
          <p className="font-bold text-sm">10,000 خطوة</p>
        </div>
        <div>
          <p className="text-xs text-slate-400">المسافة</p>
          <p className="font-bold text-sm">5.2 كم</p>
        </div>
        <div>
          <p className="text-xs text-slate-400">مدة النشاط</p>
          <p className="font-bold text-sm">42 دقيقة</p>
        </div>
      </div>
    </div>
  );
}
