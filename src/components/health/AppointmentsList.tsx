import { Stethoscope, FlaskConical, Calendar, Plus, MapPin } from 'lucide-react';

interface Appt {
  id: string;
  title: string;
  doctor: string;
  date: string;
  location: string;
  type: 'appointment' | 'lab';
}

const INITIAL: Appt[] = [
  { id: '1', title: 'موعد الكشف الدوري', doctor: 'د. أحمد العلي', date: 'غداً 11:00 ص', location: 'مستشفى الحياة', type: 'appointment' },
  { id: '2', title: 'تحليل دم شامل', doctor: 'مختبر الحياة', date: 'الأحد 8:00 ص', location: 'فرع المدي', type: 'lab' },
  { id: '3', title: 'متابعة القلب', doctor: 'د. سارة محمد', date: 'الثلاثاء 2:00 م', location: 'عيادات النور', type: 'appointment' },
];

export default function AppointmentsList() {
  return (
    <div className="animate-fade-up">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <Stethoscope size={18} className="text-accent-500" />
          <h2 className="font-bold text-lg">المواعيد والتحاليل القادمة</h2>
        </div>
        <button className="flex items-center gap-1.5 text-xs font-semibold text-accent-600 dark:text-accent-400 bg-accent-500/10 hover:bg-accent-500/20 px-3 py-1.5 rounded-lg transition">
          <Plus size={14} />
          موعد جديد
        </button>
      </div>

      <div className="space-y-2.5">
        {INITIAL.map((appt, i) => {
          const isLab = appt.type === 'lab';
          return (
            <div key={appt.id} className="card p-4 flex items-center gap-3 animate-fade-up" style={{ animationDelay: `${i * 70}ms` }}>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                isLab ? 'bg-brand-500/10 text-brand-500' : 'bg-accent-500/10 text-accent-500'
              }`}>
                {isLab ? <FlaskConical size={20} /> : <Stethoscope size={20} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{appt.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{appt.doctor}</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin size={10} />
                  {appt.location}
                </p>
              </div>
              <div className="text-left shrink-0">
                <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 justify-end">
                  <Calendar size={12} />
                  {appt.date}
                </p>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${
                  isLab ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400' : 'bg-accent-500/10 text-accent-600 dark:text-accent-400'
                }`}>
                  {isLab ? 'تحليل' : 'موعد'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
