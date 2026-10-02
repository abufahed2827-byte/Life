import { createContext, useContext, useState, type ReactNode } from 'react';

export type AmbientId = 'standard' | 'space' | 'ocean' | 'forest' | 'sunset';

export type EffectType = 'blob' | 'star' | 'wave' | 'mist';

export interface AmbientEffect {
  type: EffectType;
  color?: string;
  size?: number;
  top?: string;
  left?: string;
  delay?: string;
  duration?: string;
  opacity?: number;
}

export interface AmbientTheme {
  id: AmbientId;
  label: string;
  description: string;
  emoji: string;
  effects: AmbientEffect[];
  starCount?: number;
  mistCount?: number;
  waveLayers?: { color: string; opacity: number; duration: string; offset: number }[];
}

export const AMBIENT_THEMES: AmbientTheme[] = [
  {
    id: 'standard',
    label: 'الوضع القياسي',
    description: 'خلفية سادة هادئة',
    emoji: '⚪',
    effects: [
      { type: 'blob', color: 'rgba(14,165,233,0.08)', size: 400, top: '-10%', left: '-5%', delay: '0s' },
      { type: 'blob', color: 'rgba(20,184,166,0.06)', size: 350, top: '60%', left: '70%', delay: '4s' },
    ],
  },
  {
    id: 'space',
    label: 'فضاء ونجوم متلألئة',
    description: 'تأثيرات ضوئية متحركة للاسترخاء العميق',
    emoji: '🌌',
    effects: [
      { type: 'blob', color: 'rgba(99,102,241,0.12)', size: 450, top: '-8%', left: '15%', delay: '0s' },
      { type: 'blob', color: 'rgba(139,92,246,0.10)', size: 380, top: '55%', left: '-5%', delay: '3s' },
      { type: 'blob', color: 'rgba(59,130,246,0.08)', size: 320, top: '70%', left: '75%', delay: '6s' },
    ],
    starCount: 60,
  },
  {
    id: 'ocean',
    label: 'أمواج محيط هادئة',
    description: 'تدرجات زرقاء زجاجية مريحة',
    emoji: '🌊',
    effects: [
      { type: 'blob', color: 'rgba(56,189,248,0.13)', size: 450, top: '-8%', left: '10%', delay: '0s' },
      { type: 'blob', color: 'rgba(14,165,233,0.10)', size: 380, top: '50%', left: '-5%', delay: '3s' },
    ],
    waveLayers: [
      { color: 'rgba(56,189,248,0.06)', opacity: 0.5, duration: '18s', offset: 0 },
      { color: 'rgba(14,165,233,0.05)', opacity: 0.4, duration: '22s', offset: 40 },
      { color: 'rgba(125,211,252,0.04)', opacity: 0.3, duration: '26s', offset: 80 },
    ],
  },
  {
    id: 'forest',
    label: 'ضباب غابة هادئ',
    description: 'ظلال خضراء مريحة للعين',
    emoji: '🌲',
    effects: [
      { type: 'blob', color: 'rgba(34,197,94,0.10)', size: 420, top: '-5%', left: '60%', delay: '0s' },
      { type: 'blob', color: 'rgba(20,184,166,0.08)', size: 360, top: '55%', left: '-8%', delay: '4s' },
    ],
    mistCount: 25,
  },
  {
    id: 'sunset',
    label: 'دفء الغروب',
    description: 'تدرجات برتقالية وأرجوانية ناعمة',
    emoji: '🌅',
    effects: [
      { type: 'blob', color: 'rgba(251,146,60,0.12)', size: 420, top: '-10%', left: '-5%', delay: '0s' },
      { type: 'blob', color: 'rgba(245,158,11,0.10)', size: 360, top: '55%', left: '65%', delay: '5s' },
      { type: 'blob', color: 'rgba(168,85,247,0.08)', size: 320, top: '70%', left: '30%', delay: '8s' },
    ],
  },
];

interface AmbientCtx {
  ambient: AmbientId;
  setAmbient: (id: AmbientId) => void;
  theme: AmbientTheme;
}

const AmbientContext = createContext<AmbientCtx>({
  ambient: 'standard',
  setAmbient: () => {},
  theme: AMBIENT_THEMES[0],
});

export function AmbientProvider({ children }: { children: ReactNode }) {
  const [ambient, setAmbientState] = useState<AmbientId>(() => {
    if (typeof window === 'undefined') return 'standard';
    return (localStorage.getItem('lifeos-ambient') as AmbientId) || 'standard';
  });

  const setAmbient = (id: AmbientId) => {
    setAmbientState(id);
    localStorage.setItem('lifeos-ambient', id);
  };

  const theme = AMBIENT_THEMES.find((t) => t.id === ambient) || AMBIENT_THEMES[0];

  return (
    <AmbientContext.Provider value={{ ambient, setAmbient, theme }}>
      {children}
    </AmbientContext.Provider>
  );
}

export function useAmbient() {
  return useContext(AmbientContext);
}
