import { useState } from 'react';
import { HeartPulse, Activity, Brain, Stethoscope, UserCircle, Sparkles, Scan } from 'lucide-react';
import { useProfile } from '@/context/ProfileContext';
import WaterTracker from '@/components/health/WaterTracker';
import SleepMoodTracker from '@/components/health/SleepMoodTracker';
import ActivityRings from '@/components/health/ActivityRings';
import BreathingExercise from '@/components/health/BreathingExercise';
import JournalCard from '@/components/health/JournalCard';
import MedicationTracker from '@/components/health/MedicationTracker';
import VitalsLog from '@/components/health/VitalsLog';
import AppointmentsList from '@/components/health/AppointmentsList';
import FemaleHealth from '@/components/health/FemaleHealth';
import MaleHealth from '@/components/health/MaleHealth';
import GroomingRoutine from '@/components/health/GroomingRoutine';

type Mode = 'general' | 'adaptive';
type Tab = 'dashboard' | 'medical' | 'mind' | 'grooming' | 'gender';

const TABS: { id: Tab; label: string; icon: typeof HeartPulse }[] = [
  { id: 'dashboard', label: 'اللوحة الصحية', icon: Activity },
  { id: 'medical', label: 'الأدوية والقياسات', icon: HeartPulse },
  { id: 'mind', label: 'الصحة النفسية', icon: Brain },
  { id: 'grooming', label: 'العناية الشخصية', icon: Scan },
];

export default function HealthPage() {
  const { gender } = useProfile();
  const [mode, setMode] = useState<Mode>('general');
  const [tab, setTab] = useState<Tab>('dashboard');

  const genderTabLabel = gender === 'female' ? 'الصحة النسائية' : 'الأداء البدني';

  // In adaptive mode, the gender tab is always visible alongside core tabs
  const visibleTabs = mode === 'adaptive'
    ? [...TABS, { id: 'gender' as Tab, label: genderTabLabel, icon: Sparkles }]
    : TABS;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-error-500/10 flex items-center justify-center text-error-500">
          <HeartPulse size={26} />
        </div>
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-extrabold">الصحة والطب</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {mode === 'adaptive'
              ? (gender === 'female' ? 'التكيف الذكي — وضع الأنثى' : 'التكيف الذكي — وضع الذكر')
              : 'العناية بالصحة (عام)'}
          </p>
        </div>
      </div>

      {/* ── Explicit Mode Toggle ── */}
      <div className="card p-4 animate-fade-up">
        <div className="flex items-center gap-2 mb-3">
          <UserCircle size={18} className="text-brand-500" />
          <p className="text-sm font-bold">وضع العرض</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => { setMode('general'); setTab('dashboard'); }}
            className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all duration-200 text-right ${
              mode === 'general'
                ? 'border-brand-500 bg-brand-500/10'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${mode === 'general' ? 'bg-brand-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
              <Stethoscope size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-bold text-sm ${mode === 'general' ? 'text-brand-600 dark:text-brand-400' : ''}`}>العناية بالصحة (عام)</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">ميزات صحية عامة للجميع</p>
            </div>
          </button>

          <button
            onClick={() => { setMode('adaptive'); setTab('dashboard'); }}
            className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all duration-200 text-right ${
              mode === 'adaptive'
                ? 'border-accent-500 bg-accent-500/10'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${mode === 'adaptive' ? 'bg-accent-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
              <Sparkles size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-bold text-sm ${mode === 'adaptive' ? 'text-accent-600 dark:text-accent-400' : ''}`}>التكيف الذكي (حسب الجنس)</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {gender === 'female' ? '🌸 صحة نسائية متكاملة' : '💪 أداء بدني وحيوية'}
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/60 overflow-x-auto no-scrollbar">
        {visibleTabs.map((t) => {
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

      {/* ── Dashboard Tab ── */}
      {tab === 'dashboard' && (
        <div className="space-y-5 animate-fade-in">
          <WaterTracker />
          <SleepMoodTracker />
          <GroomingRoutine />
          <ActivityRings />
        </div>
      )}

      {/* ── Medical Tab ── */}
      {tab === 'medical' && (
        <div className="space-y-5 animate-fade-in">
          <MedicationTracker />
          <VitalsLog />
          <AppointmentsList />
        </div>
      )}

      {/* ── Mindfulness Tab ── */}
      {tab === 'mind' && (
        <div className="space-y-5 animate-fade-in">
          <BreathingExercise />
          <JournalCard />
        </div>
      )}

      {/* ── Grooming Tab ── */}
      {tab === 'grooming' && (
        <div className="animate-fade-in">
          <GroomingRoutine />
        </div>
      )}

      {/* ── Gender Tab (only in adaptive mode) ── */}
      {tab === 'gender' && mode === 'adaptive' && gender === 'female' && <FemaleHealth />}
      {tab === 'gender' && mode === 'adaptive' && gender === 'male' && <MaleHealth />}
    </div>
  );
}
