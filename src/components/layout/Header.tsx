import { useState, useRef, useEffect } from 'react';
import { Moon, Sun, Search, Bell, Menu, Settings, Palette, Check } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useAmbient, AMBIENT_THEMES } from '@/context/AmbientContext';
import { useProfile } from '@/context/ProfileContext';

interface HeaderProps {
  onOpenSidebar: () => void;
  onSearch: (q: string) => void;
  onOpenSettings: () => void;
}

export default function Header({ onOpenSidebar, onSearch, onOpenSettings }: HeaderProps) {
  const { theme, toggle } = useTheme();
  const { name } = useProfile();
  const { ambient, setAmbient } = useAmbient();
  const [showThemes, setShowThemes] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showThemes) return;
    const handler = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setShowThemes(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showThemes]);

  return (
    <header className="sticky top-0 z-30 glass border-b">
      <div className="flex items-center gap-3 px-4 h-16 lg:px-6">
        {/* Mobile menu */}
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 -mr-1 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="القائمة"
        >
          <Menu size={22} />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-glow">
            <span className="text-white font-extrabold text-lg">L</span>
          </div>
          <div className="hidden sm:block">
            <p className="font-extrabold text-base leading-tight">Life OS</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">نظام حياتك</p>
          </div>
        </div>

        {/* Quick Search */}
        <div className="flex-1 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="بحث سريع..."
              onChange={(e) => onSearch(e.target.value)}
              className="w-full rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-transparent focus:border-brand-400 focus:bg-white dark:focus:bg-slate-800 outline-none py-2.5 pr-10 pl-4 text-sm transition-all"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          {/* Theme switcher popover */}
          <div className="relative" ref={popoverRef}>
            <button
              onClick={() => setShowThemes((s) => !s)}
              className={`p-2.5 rounded-xl transition ${showThemes ? 'bg-brand-500/15 text-brand-500' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              aria-label="تبديل الخلفية"
            >
              <Palette size={20} />
            </button>

            {showThemes && (
              <div className="absolute left-0 mt-2 w-64 card p-3 shadow-xl animate-scale-in z-50">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 px-2 pb-2">خلفيات الصحة النفسية</p>
                <div className="space-y-1">
                  {AMBIENT_THEMES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => { setAmbient(t.id); setShowThemes(false); }}
                      className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition text-right ${
                        ambient === t.id ? 'bg-brand-500/10' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="text-lg">{t.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold ${ambient === t.id ? 'text-brand-600 dark:text-brand-400' : ''}`}>{t.label}</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">{t.description}</p>
                      </div>
                      {ambient === t.id && <Check size={16} className="text-brand-500 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={toggle}
            className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="تبديل الوضع"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="الإعدادات"
          >
            <Settings size={20} />
          </button>

          <button className="relative p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition" aria-label="الإشعارات">
            <Bell size={20} />
            <span className="absolute top-2 left-2 w-2 h-2 bg-error-500 rounded-full ring-2 ring-white dark:ring-slate-950" />
          </button>

          <button onClick={onOpenSettings} className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-500 to-brand-500 flex items-center justify-center text-white font-bold text-sm shadow-md hover:scale-105 transition" aria-label="الملف الشخصي">
            {name.charAt(0)}
          </button>
        </div>
      </div>
    </header>
  );
}
