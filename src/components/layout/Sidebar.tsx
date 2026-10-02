import { X } from 'lucide-react';
import { NAV_SECTIONS, SETTINGS_SECTION, type SectionId } from '@/config/navigation';
import { useProfile } from '@/context/ProfileContext';

interface SidebarProps {
  active: SectionId;
  onNavigate: (id: SectionId) => void;
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ active, onNavigate, open, onClose }: SidebarProps) {
  const { name, gender } = useProfile();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed lg:sticky top-0 right-0 z-50 lg:z-auto
          h-screen w-72 lg:w-64 shrink-0
          flex flex-col gap-2 p-4
          glass border-l border-slate-200/60 dark:border-slate-800/60
          transition-transform duration-300
          ${open ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Mobile header */}
        <div className="flex items-center justify-between lg:hidden mb-2">
          <span className="font-bold text-lg">القائمة</span>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
            <X size={20} />
          </button>
        </div>

        {/* Desktop logo */}
        <div className="hidden lg:flex items-center gap-2.5 px-2 py-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-glow">
            <span className="text-white font-extrabold text-lg">L</span>
          </div>
          <div>
            <p className="font-extrabold text-lg leading-tight">Life OS</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">نظام حياتك</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1.5 flex-1">
          {NAV_SECTIONS.map((section, i) => {
            const Icon = section.icon;
            const isActive = active === section.id;
            return (
              <button
                key={section.id}
                onClick={() => { onNavigate(section.id); onClose(); }}
                className={`nav-item animate-fade-up ${isActive ? 'nav-item-active' : 'nav-item-idle'}`}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <Icon size={20} className="shrink-0" />
                <span className="flex-1 text-right">{section.label}</span>
                <span className="text-base opacity-70">{section.emoji}</span>
              </button>
            );
          })}

          {/* Settings link */}
          <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
            <button
              onClick={() => { onNavigate(SETTINGS_SECTION.id); onClose(); }}
              className={`nav-item w-full ${active === SETTINGS_SECTION.id ? 'nav-item-active' : 'nav-item-idle'}`}
            >
              <SETTINGS_SECTION.icon size={20} className="shrink-0" />
              <span className="flex-1 text-right">{SETTINGS_SECTION.label}</span>
              <span className="text-base opacity-70">{SETTINGS_SECTION.emoji}</span>
            </button>
          </div>
        </nav>

        {/* Footer card */}
        <div className="card p-4 mt-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-500 to-brand-500 flex items-center justify-center text-white font-bold text-sm">
              {name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm truncate">{name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {gender === 'female' ? '👩 أنثى' : '👨 ذكر'}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
