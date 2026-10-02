import { useState } from 'react';
import { Settings, Moon, Sun, User, Palette, Check } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useAmbient, AMBIENT_THEMES } from '@/context/AmbientContext';
import { useProfile, type Gender } from '@/context/ProfileContext';

export default function SettingsPage() {
  const { theme, toggle } = useTheme();
  const { ambient, setAmbient } = useAmbient();
  const { gender, setGender, name, setName } = useProfile();
  const [nameInput, setNameInput] = useState(name);

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-slate-500/10 flex items-center justify-center text-slate-500">
          <Settings size={26} />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold">الإعدادات</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">خصّص تجربتك في Life OS</p>
        </div>
      </div>

      {/* Profile section */}
      <div className="card p-5 animate-fade-up">
        <div className="flex items-center gap-2 mb-4">
          <User size={18} className="text-brand-500" />
          <h2 className="font-bold text-base">الملف الشخصي</h2>
        </div>

        {/* Name */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">الاسم</label>
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onBlur={() => setName(nameInput || 'مستخدم')}
            placeholder="اسمك"
            className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 outline-none px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-400 transition"
          />
        </div>

        {/* Gender selector */}
        <div>
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">الجنس (لتخصيص القسم الطبي)</label>
          <div className="grid grid-cols-2 gap-3">
            {([
              { id: 'male', label: 'ذكر', emoji: '👨' },
              { id: 'female', label: 'أنثى', emoji: '👩' },
            ] as { id: Gender; label: string; emoji: string }[]).map((opt) => (
              <button
                key={opt.id}
                onClick={() => setGender(opt.id)}
                className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200 ${
                  gender === opt.id
                    ? 'border-brand-500 bg-brand-500/10'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <span className="text-2xl">{opt.emoji}</span>
                <span className={`font-bold text-sm flex-1 text-right ${gender === opt.id ? 'text-brand-600 dark:text-brand-400' : ''}`}>{opt.label}</span>
                {gender === opt.id && <Check size={18} className="text-brand-500" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Appearance: Dark/Light */}
      <div className="card p-5 animate-fade-up">
        <div className="flex items-center gap-2 mb-4">
          <Moon size={18} className="text-accent-500" />
          <h2 className="font-bold text-base">المظهر</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => theme === 'dark' && toggle()}
            className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
              theme === 'light' ? 'border-accent-500 bg-accent-500/10' : 'border-slate-200 dark:border-slate-700'
            }`}
          >
            <Sun size={22} className="text-warning-500" />
            <span className="font-bold text-sm">فاتح</span>
            {theme === 'light' && <Check size={16} className="text-accent-500 mr-auto" />}
          </button>
          <button
            onClick={() => theme === 'light' && toggle()}
            className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
              theme === 'dark' ? 'border-accent-500 bg-accent-500/10' : 'border-slate-200 dark:border-slate-700'
            }`}
          >
            <Moon size={22} className="text-brand-400" />
            <span className="font-bold text-sm">داكن</span>
            {theme === 'dark' && <Check size={16} className="text-accent-500 mr-auto" />}
          </button>
        </div>
      </div>

      {/* Ambient Themes */}
      <div className="card p-5 animate-fade-up">
        <div className="flex items-center gap-2 mb-1">
          <Palette size={18} className="text-brand-500" />
          <h2 className="font-bold text-base">خلفيات تحسين الصحة النفسية</h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">اختر خلفية محيطة للاسترخاء وتقليل التوتر البصري — التغيير فوري</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {AMBIENT_THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => setAmbient(t.id)}
              className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200 text-right ${
                ambient === t.id
                  ? 'border-brand-500 bg-brand-500/10'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              {/* Rich mini preview */}
              <ThemePreview theme={t} active={ambient === t.id} />
              <div className="flex-1 min-w-0">
                <p className={`font-bold text-sm ${ambient === t.id ? 'text-brand-600 dark:text-brand-400' : ''}`}>{t.label}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{t.description}</p>
              </div>
              {ambient === t.id && <Check size={18} className="text-brand-500 shrink-0" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Rich theme preview ── */
function ThemePreview({ theme, active }: { theme: typeof AMBIENT_THEMES[number]; active: boolean }) {
  const previewStars = theme.starCount ? Array.from({ length: 8 }, (_, i) => ({
    x: (i * 37) % 48,
    y: (i * 23) % 48,
    delay: `${(i * 0.3) % 2}s`,
    large: i % 4 === 0,
  })) : [];

  return (
    <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
      {/* Base gradient */}
      <div className="absolute inset-0" style={{
        background: theme.id === 'space' ? 'linear-gradient(135deg, #1e1b4b, #312e81)'
          : theme.id === 'ocean' ? 'linear-gradient(180deg, #e0f2fe, #bae6fd)'
          : theme.id === 'forest' ? 'linear-gradient(135deg, #f0fdf4, #dcfce7)'
          : theme.id === 'sunset' ? 'linear-gradient(135deg, #fef3c7, #fde68a, #fbbf24)'
          : 'linear-gradient(135deg, #f8fafc, #f1f5f9)'
      }} />

      {/* Blobs */}
      {theme.effects.filter((e) => e.type === 'blob').slice(0, 2).map((blob, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: '32px',
            height: '32px',
            top: i === 0 ? '-6px' : '20px',
            left: i === 0 ? '-4px' : '20px',
            backgroundColor: blob.color,
            filter: 'blur(6px)',
          }}
        />
      ))}

      {/* Stars */}
      {previewStars.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: s.large ? '3px' : '2px',
            height: s.large ? '3px' : '2px',
            top: `${s.y}px`,
            left: `${s.x}px`,
            backgroundColor: '#c4b5fd',
            boxShadow: s.large ? '0 0 3px 1px #a78bfa' : 'none',
            opacity: active ? 1 : 0.6,
            animation: `twinkle 2s ease-in-out ${s.delay} infinite`,
          }}
        />
      ))}

      {/* Wave lines */}
      {theme.waveLayers && theme.waveLayers.slice(0, 2).map((w, i) => (
        <div key={i} className="absolute left-0 w-full" style={{
          bottom: `${i * 14}%`,
          height: '16px',
          opacity: w.opacity,
        }}>
          <svg className="w-full h-full" viewBox="0 0 56 16" preserveAspectRatio="none">
            <path d="M0,8 C14,14 28,2 42,8 C50,12 56,6 56,8 L56,16 L0,16 Z" fill={w.color} />
          </svg>
        </div>
      ))}

      {/* Mist dots */}
      {theme.mistCount && Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="absolute rounded-full" style={{
          width: '10px',
          height: '10px',
          top: `${20 + i * 12}%`,
          left: `${10 + i * 10}%`,
          backgroundColor: 'rgba(132,204,22,0.2)',
          filter: 'blur(4px)',
        }} />
      ))}

      {/* Emoji */}
      <span className="relative text-lg flex items-center justify-center h-full">{theme.emoji}</span>
    </div>
  );
}
