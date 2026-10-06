import { NAV_SECTIONS, type SectionId } from '@/config/navigation';

interface BottomNavProps {
  active: SectionId;
  onNavigate: (id: SectionId) => void;
}

export default function BottomNav({ active, onNavigate }: BottomNavProps) {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 glass border-t" style={{ zIndex: 30 }}>
      <div className="flex items-stretch justify-around px-1 py-1.5" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        {NAV_SECTIONS.map((section) => {
          const Icon = section.icon;
          const isActive = active === section.id;
          return (
            <button
              key={section.id}
              onClick={() => onNavigate(section.id)}
              className="flex flex-col items-center gap-1 px-2 py-1.5 rounded-xl transition-all duration-200 min-w-[58px]"
            >
              <div className={`
                w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300
                ${isActive
                  ? 'bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-glow scale-105'
                  : 'text-slate-400 dark:text-slate-500'}
              `}>
                <Icon size={20} />
              </div>
              <span className={`text-[10px] font-semibold transition-colors ${isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 dark:text-slate-500'}`}>
                {section.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
