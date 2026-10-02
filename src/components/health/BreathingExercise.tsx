import { useState, useEffect, useRef } from 'react';
import { Wind, Play, Pause } from 'lucide-react';

type Phase = 'idle' | 'inhale' | 'hold' | 'exhale';

const PHASE_LABELS: Record<Phase, string> = {
  idle: 'جاهز للبدء',
  inhale: 'شهيق',
  hold: 'احبس النفس',
  exhale: 'زفير',
};

const PHASE_DURATION = 4; // seconds per phase (box breathing: 4-4-4-4)

export default function BreathingExercise() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [cycles, setCycles] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (phase === 'idle') return;

    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s > 1) return s - 1;
        // Move to next phase
        setPhase((p) => {
          if (p === 'inhale') return 'hold';
          if (p === 'hold') return 'exhale';
          if (p === 'exhale') {
            setCycles((c) => c + 1);
            return 'inhale';
          }
          return p;
        });
        return PHASE_DURATION;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== 'idle') setSecondsLeft(PHASE_DURATION);
  }, [phase]);

  const start = () => {
    setCycles(0);
    setPhase('inhale');
  };

  const stop = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase('idle');
    setSecondsLeft(0);
  };

  const isRunning = phase !== 'idle';
  const circleScale = phase === 'inhale' ? 'scale-150' : phase === 'exhale' ? 'scale-100' : phase === 'hold' ? 'scale-125' : 'scale-100';
  const circleColor = phase === 'inhale' ? 'bg-accent-400/30' : phase === 'exhale' ? 'bg-brand-400/20' : phase === 'hold' ? 'bg-accent-500/25' : 'bg-slate-300/20';

  return (
    <div className="card p-5 animate-fade-up bg-gradient-to-br from-accent-500/5 to-transparent">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Wind size={20} className="text-accent-500" />
          <h2 className="font-bold text-lg">تمرين التنفس الموجه</h2>
        </div>
        {cycles > 0 && <span className="text-xs text-slate-400">دورات: {cycles}</span>}
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 text-center">تنفس الصندوق — 4 ثوان شهيق، 4 ثوان حبس، 4 ثوان زفير</p>

      {/* Breathing circle */}
      <div className="relative h-48 flex items-center justify-center mb-4">
        <div
          className={`w-28 h-28 rounded-full ${circleColor} flex items-center justify-center transition-all duration-[4000ms] ease-in-out ${circleScale}`}
        >
          <div className="text-center">
            <p className="text-lg font-extrabold">{PHASE_LABELS[phase]}</p>
            {isRunning && <p className="text-3xl font-extrabold tabular-nums">{secondsLeft}</p>}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3">
        {!isRunning ? (
          <button onClick={start} className="flex items-center gap-2 rounded-xl bg-accent-500 hover:bg-accent-600 text-white font-semibold text-sm px-6 py-2.5 transition shadow-md">
            <Play size={18} />
            ابدأ التنفس
          </button>
        ) : (
          <button onClick={stop} className="flex items-center gap-2 rounded-xl bg-slate-500 hover:bg-slate-600 text-white font-semibold text-sm px-6 py-2.5 transition shadow-md">
            <Pause size={18} />
            إيقاف
          </button>
        )}
      </div>

      {/* Phase indicators */}
      {isRunning && (
        <div className="flex justify-center gap-2 mt-4">
          {(['inhale', 'hold', 'exhale'] as Phase[]).map((p) => (
            <div
              key={p}
              className={`h-1.5 w-12 rounded-full transition-all ${phase === p ? 'bg-accent-500' : 'bg-slate-200 dark:bg-slate-700'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
