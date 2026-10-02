import { useState } from 'react';
import { HeartPulse, Brain, Plus, X } from 'lucide-react';
import type { SectionId } from '@/config/navigation';

interface QuickActionsProps {
  onNavigate: (id: SectionId) => void;
}

interface QuickForm {
  id: 'medical' | 'cbt' | 'task';
  title: string;
  icon: typeof HeartPulse;
  color: string;
  bg: string;
  label: string;
}

const ACTIONS: QuickForm[] = [
  { id: 'medical', title: 'تسجيل طبي سريع', icon: HeartPulse, color: 'text-error-500', bg: 'bg-error-500/10', label: 'سجّل دواء أو قياساً' },
  { id: 'cbt', title: 'تأمل CBT فوري', icon: Brain, color: 'text-accent-500', bg: 'bg-accent-500/10', label: 'دوّن فكرة ومشاعر' },
  { id: 'task', title: 'مهمة جديدة', icon: Plus, color: 'text-brand-500', bg: 'bg-brand-500/10', label: 'أضف مهمة لقائمتك' },
];

export default function QuickActions({ onNavigate }: QuickActionsProps) {
  const [openForm, setOpenForm] = useState<QuickForm | null>(null);

  const handleAction = (action: QuickForm) => {
    if (action.id === 'task') {
      onNavigate('academic');
    } else if (action.id === 'medical') {
      onNavigate('health');
    } else if (action.id === 'cbt') {
      onNavigate('cbt');
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      {ACTIONS.map((action, i) => {
        const Icon = action.icon;
        return (
          <button
            key={action.id}
            onClick={() => handleAction(action)}
            className={`card card-hover p-5 text-right group animate-fade-up`}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className={`w-12 h-12 rounded-xl ${action.bg} flex items-center justify-center ${action.color} mb-3 group-hover:scale-110 transition-transform`}>
              <Icon size={24} />
            </div>
            <p className="font-bold text-sm mb-0.5">{action.title}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{action.label}</p>
          </button>
        );
      })}

      {/* Modal form */}
      {openForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setOpenForm(null)}>
          <div className="card p-6 w-full max-w-md animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">{openForm.title}</h3>
              <button onClick={() => setOpenForm(null)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3">
              <input type="text" placeholder="العنوان" className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 outline-none px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-400" />
              <textarea placeholder="التفاصيل..." rows={3} className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 outline-none px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-400 resize-none" />
              <button className="w-full rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold py-2.5 text-sm transition">حفظ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
