import { useState } from 'react';
import { Palette, Shirt, Sparkles, Scan, Search, type LucideIcon } from 'lucide-react';
import WardrobeGrid from '@/components/studio/WardrobeGrid';
import AIStylist from '@/components/studio/AIStylist';
import ColorFitAnalysis from '@/components/studio/ColorFitAnalysis';
import MissingEssentials from '@/components/studio/MissingEssentials';
import ItemLocationTracker from '@/components/studio/ItemLocationTracker';

type Tab = 'wardrobe' | 'stylist' | 'analysis' | 'shopping' | 'tracker';

const TABS: { id: Tab; label: string; icon: LucideIcon }[] = [
  { id: 'wardrobe', label: 'الخزانة الرقمية', icon: Shirt },
  { id: 'stylist', label: 'مصمم الأناقة', icon: Sparkles },
  { id: 'analysis', label: 'تحليل الهيئة', icon: Scan },
  { id: 'shopping', label: 'قطع ناقصة', icon: Palette },
  { id: 'tracker', label: 'أين وضعتها؟', icon: Search },
];

export default function StudioPage() {
  const [tab, setTab] = useState<Tab>('wardrobe');

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-warning-500/10 flex items-center justify-center text-warning-500">
          <Palette size={26} />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold">الاستوديو والمقتنيات</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">خزانتك الذكية ومصمم أناقتك الشخصي</p>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/60 overflow-x-auto no-scrollbar">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                tab === t.id ? 'bg-white dark:bg-slate-900 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Icon size={16} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {tab === 'wardrobe' && <WardrobeGrid />}
      {tab === 'stylist' && <AIStylist />}
      {tab === 'analysis' && <ColorFitAnalysis />}
      {tab === 'shopping' && <MissingEssentials />}
      {tab === 'tracker' && <ItemLocationTracker />}
    </div>
  );
}
