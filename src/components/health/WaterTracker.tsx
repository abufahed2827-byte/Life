import { useState } from 'react';
import { Droplets, Plus, Minus, RotateCcw } from 'lucide-react';

const CUP_ML = 250;
const GOAL_ML = 2000;

export default function WaterTracker() {
  const [cups, setCups] = useState(6);
  const totalMl = cups * CUP_ML;
  const pct = Math.min(Math.round((totalMl / GOAL_ML) * 100), 100);
  const fillHeight = Math.min((totalMl / GOAL_ML) * 100, 100);

  const add = () => setCups((c) => Math.min(c + 1, 12));
  const sub = () => setCups((c) => Math.max(c - 1, 0));
  const reset = () => setCups(0);

  return (
    <div className="card p-5 animate-fade-up bg-gradient-to-br from-brand-500/5 to-transparent">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Droplets size={20} className="text-brand-500" />
          <h2 className="font-bold text-lg">تتبع شرب الماء</h2>
        </div>
        <button onClick={reset} className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition" aria-label="إعادة">
          <RotateCcw size={16} />
        </button>
      </div>

      <div className="flex items-center gap-5">
        {/* Water bottle with wave */}
        <div className="relative w-24 h-32 rounded-2xl border-2 border-brand-300 dark:border-brand-700 overflow-hidden shrink-0 bg-brand-50 dark:bg-brand-950/30">
          {/* Wave fill */}
          <div
            className="absolute bottom-0 left-0 w-full transition-all duration-700"
            style={{ height: `${fillHeight}%` }}
          >
            <div className="relative w-full h-full overflow-hidden">
              {/* Wave layers */}
              <svg
                className="absolute -top-3 left-0 w-[200%] h-6 wave-anim"
                viewBox="0 0 1200 40"
                preserveAspectRatio="none"
              >
                <path d="M0,20 C150,40 350,0 600,20 C850,40 1050,0 1200,20 L1200,40 L0,40 Z" fill="rgba(56,189,248,0.7)" />
              </svg>
              <svg
                className="absolute -top-1 left-0 w-[200%] h-5 wave-anim-slow"
                viewBox="0 0 1200 30"
                preserveAspectRatio="none"
              >
                <path d="M0,15 C200,30 400,0 600,15 C800,30 1000,0 1200,15 L1200,30 L0,30 Z" fill="rgba(14,165,233,0.8)" />
              </svg>
              <div className="absolute inset-0 bg-brand-400/80" style={{ top: '12px' }} />
            </div>
          </div>
          {/* Bubbles */}
          {cups > 0 && [...Array(Math.min(cups, 5))].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/30 animate-pulse-soft"
              style={{
                width: `${6 + i * 2}px`,
                height: `${6 + i * 2}px`,
                bottom: `${15 + i * 18}%`,
                left: `${20 + (i * 17) % 60}%`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
          {/* Cup count overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            <span className="text-2xl font-extrabold text-brand-700 dark:text-brand-200 drop-shadow-sm">{cups}</span>
            <span className="text-[9px] text-brand-600 dark:text-brand-300 font-semibold">أكواب</span>
          </div>
        </div>

        {/* Stats + controls */}
        <div className="flex-1 space-y-3">
          <div>
            <p className="text-2xl font-extrabold">{totalMl} <span className="text-sm font-normal text-slate-400">مل</span></p>
            <p className="text-xs text-slate-500 dark:text-slate-400">الهدف: {GOAL_ML} مل ({pct}%)</p>
          </div>
          {/* Progress bar */}
          <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 transition-all duration-700" style={{ width: `${pct}%` }} />
          </div>
          {/* Quick add */}
          <div className="flex items-center gap-2">
            <button onClick={sub} className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition shrink-0">
              <Minus size={18} />
            </button>
            <button onClick={add} className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm py-2.5 transition shadow-md">
              <Plus size={18} />
              كوب ({CUP_ML} مل)
            </button>
            <button onClick={add} className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition shrink-0">
              <Plus size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
