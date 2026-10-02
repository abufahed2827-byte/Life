import { useState, useEffect } from 'react';
import {
  GraduationCap, Plus, CheckCircle2, Circle, Clock, AlertCircle,
  Sparkles, Zap, MapPin, Navigation, TrendingUp, Calendar, Award,
  BatteryHigh, BatteryMedium, BatteryLow, X,
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  done: boolean;
  priority: 'high' | 'medium' | 'low';
  energy: 'high' | 'medium' | 'low';
  subject?: string;
  due?: string;
  location?: string;
}

const LOCATIONS = [
  { id: 'university', label: 'جامعة آل البيت', emoji: '🎓' },
  { id: 'home', label: 'المنزل', emoji: '🏠' },
  { id: 'gym', label: 'النادي الرياضي', emoji: '🏋️' },
  { id: 'library', label: 'المكتبة', emoji: '📚' },
  { id: 'laundry', label: 'المغسلة', emoji: '🧺' },
  { id: 'cafe', label: 'المقهى', emoji: '☕' },
];

const PRIORITY_META = {
  high: { label: 'عالية', color: 'text-error-500', bg: 'bg-error-500/10', icon: AlertCircle },
  medium: { label: 'متوسطة', color: 'text-warning-500', bg: 'bg-warning-500/10', icon: Clock },
  low: { label: 'منخفضة', color: 'text-brand-500', bg: 'bg-brand-500/10', icon: Circle },
};

const ENERGY_META = {
  high: { label: 'عالية', icon: BatteryHigh, color: 'text-success-500', bg: 'bg-success-500/10' },
  medium: { label: 'متوسطة', icon: BatteryMedium, color: 'text-warning-500', bg: 'bg-warning-500/10' },
  low: { label: 'منخفضة', icon: BatteryLow, color: 'text-error-500', bg: 'bg-error-500/10' },
};

const INITIAL: Task[] = [
  { id: '1', title: 'مراجعة محاضرة القلب', done: true, priority: 'high', energy: 'high', subject: 'طب', due: 'اليوم', location: 'university' },
  { id: '2', title: 'حل واجب الكيمياء', done: false, priority: 'high', energy: 'high', subject: 'كيمياء', due: 'اليوم', location: 'home' },
  { id: '3', title: 'قراءة فصل النفسية', done: false, priority: 'medium', energy: 'low', subject: 'نفسية', due: 'غداً', location: 'library' },
  { id: '4', title: 'تجهيز عرض التقديم', done: false, priority: 'low', energy: 'medium', subject: 'عام', due: 'الأحد', location: 'home' },
];

const SUGGESTED_TASKS: Omit<Task, 'id' | 'done'>[] = [
  { title: 'مراجعة سريعة للامتحان (30 دقيقة)', priority: 'high', energy: 'high', subject: 'طب', due: 'اليوم', location: 'university' },
  { title: 'تمارين رياضية خفيفة', priority: 'medium', energy: 'medium', subject: 'عام', due: 'اليوم', location: 'gym' },
  { title: 'قراءة مقال علمي', priority: 'low', energy: 'low', subject: 'عام', due: 'اليوم', location: 'library' },
  { title: 'تنظيم الملاحظات', priority: 'medium', energy: 'medium', subject: 'عام', due: 'اليوم', location: 'home' },
];

interface Course {
  id: string;
  name: string;
  credits: number;
  grade: string;
}

const GRADE_POINTS: Record<string, number> = {
  'A+': 4.0, 'A': 3.7, 'B+': 3.3, 'B': 3.0, 'C+': 2.7, 'C': 2.4, 'D+': 2.0, 'D': 1.7, 'F': 0,
};

const INITIAL_COURSES: Course[] = [
  { id: 'c1', name: 'طب القلب', credits: 4, grade: 'A' },
  { id: 'c2', name: 'الكيمياء العضوية', credits: 3, grade: 'B+' },
  { id: 'c3', name: 'علم النفس', credits: 2, grade: 'A' },
];

interface Exam {
  id: string;
  name: string;
  date: string;
}

const INITIAL_EXAMS: Exam[] = [
  { id: 'e1', name: 'امتحان القلب', date: '2026-10-15' },
  { id: 'e2', name: 'امتحان الكيمياء', date: '2026-10-22' },
  { id: 'e3', name: 'امتحان النفسية', date: '2026-11-05' },
];

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr).getTime();
  const now = new Date().getTime();
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
}

export default function AcademicPage() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL);
  const [newTitle, setNewTitle] = useState('');
  const [newLocation, setNewLocation] = useState<string>('home');
  const [newEnergy, setNewEnergy] = useState<'high' | 'medium' | 'low'>('medium');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const [showLocationAlert, setShowLocationAlert] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<string | null>(null);
  const [sortByEnergy, setSortByEnergy] = useState(false);
  const [userEnergy, setUserEnergy] = useState<'high' | 'medium' | 'low'>('high');

  // GPA state
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [showGPA, setShowGPA] = useState(false);
  const [courseName, setCourseName] = useState('');
  const [courseCredits, setCourseCredits] = useState('3');
  const [courseGrade, setCourseGrade] = useState('A');

  // Exams
  const [exams] = useState<Exam[]>(INITIAL_EXAMS);

  const toggle = (id: string) => setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const add = () => {
    if (!newTitle.trim()) return;
    setTasks((ts) => [{
      id: Date.now().toString(),
      title: newTitle,
      done: false,
      priority: 'medium',
      energy: newEnergy,
      due: 'اليوم',
      location: newLocation,
    }, ...ts]);
    setNewTitle('');
  };

  const suggestTasks = () => {
    setSuggestionLoading(true);
    setShowSuggestions(false);
    setTimeout(() => {
      setSuggestionLoading(false);
      setShowSuggestions(true);
    }, 1200);
  };

  const addSuggested = (task: Omit<Task, 'id' | 'done'>) => {
    setTasks((ts) => [{ ...task, id: Date.now().toString(), done: false }, ...ts]);
    setShowSuggestions(false);
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setShowLocationAlert(true);
      setCurrentLocation('university');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      () => {
        setCurrentLocation('university');
        setShowLocationAlert(true);
      },
      () => {
        setCurrentLocation('university');
        setShowLocationAlert(true);
      },
      { timeout: 5000 },
    );
  };

  const selectLocation = (locId: string) => {
    setCurrentLocation(locId);
    setShowLocationAlert(true);
  };

  const locationTasks = currentLocation
    ? tasks.filter((t) => t.location === currentLocation && !t.done)
    : [];

  const energyOrder = { high: 0, medium: 1, low: 2 };
  const displayTasks = sortByEnergy
    ? [...tasks].sort((a, b) => energyOrder[a.energy] - energyOrder[b.energy])
    : tasks;

  const done = tasks.filter((t) => t.done).length;
  const total = tasks.length;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;

  // GPA calculation
  const addCourse = () => {
    if (!courseName.trim()) return;
    setCourses((cs) => [...cs, { id: Date.now().toString(), name: courseName, credits: Number(courseCredits), grade: courseGrade }]);
    setCourseName('');
  };

  const removeCourse = (id: string) => setCourses((cs) => cs.filter((c) => c.id !== id));

  const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);
  const totalPoints = courses.reduce((sum, c) => sum + c.credits * (GRADE_POINTS[c.grade] || 0), 0);
  const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-500">
          <GraduationCap size={26} />
        </div>
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-extrabold">الدراسة والمهام</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">نظم مهامك الأكاديمية ودراساتك</p>
        </div>
      </div>

      {/* Progress + Energy selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card p-5 animate-fade-up">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-sm">تقدم اليوم</h2>
            <span className="text-2xl font-extrabold text-brand-500">{progress}%</span>
          </div>
          <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all duration-700" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{done} من {total} مهمة مكتملة</p>
        </div>

        {/* Energy level selector */}
        <div className="card p-5 animate-fade-up" style={{ animationDelay: '60ms' }}>
          <div className="flex items-center gap-2 mb-3">
            <Zap size={18} className="text-accent-500" />
            <h2 className="font-bold text-sm">طاقتك الحالية</h2>
          </div>
          <div className="flex gap-2 mb-3">
            {(['high', 'medium', 'low'] as const).map((e) => {
              const meta = ENERGY_META[e];
              const Icon = meta.icon;
              return (
                <button
                  key={e}
                  onClick={() => { setUserEnergy(e); setSortByEnergy(true); }}
                  className={`flex-1 flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 transition ${userEnergy === e ? `${meta.bg} ${meta.color} border-current` : 'border-slate-200 dark:border-slate-700 text-slate-400'}`}
                >
                  <Icon size={18} />
                  <span className="text-[10px] font-bold">{meta.label}</span>
                </button>
              );
            })}
          </div>
          <p className="text-[10px] text-slate-400">
            {sortByEnergy ? 'المهام مرتبة حسب طاقتك' : 'اختر طاقتك لترتيب المهام تلقائياً'}
          </p>
        </div>
      </div>

      {/* GPA Calculator + Exam Countdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* GPA */}
        <div className="card p-5 animate-fade-up">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Award size={18} className="text-success-500" />
              <h2 className="font-bold text-sm">معدل GPA</h2>
            </div>
            <span className="text-3xl font-extrabold text-success-500">{gpa}</span>
          </div>
          <div className="space-y-1.5 mb-3">
            {courses.map((c) => (
              <div key={c.id} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <span className="flex-1 text-xs font-semibold truncate">{c.name}</span>
                <span className="text-[10px] text-slate-400">{c.credits} ساعة</span>
                <span className="text-xs font-bold text-brand-500 w-8 text-center">{c.grade}</span>
                <button onClick={() => removeCourse(c.id)} className="p-1 rounded text-slate-300 hover:text-error-500">
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowGPA(!showGPA)}
            className="text-[10px] font-semibold text-brand-500 hover:text-brand-600 transition"
          >
            {showGPA ? 'إخفاء' : 'إضافة مادة +'}
          </button>
          {showGPA && (
            <div className="mt-2 space-y-2 animate-scale-in">
              <input type="text" value={courseName} onChange={(e) => setCourseName(e.target.value)} placeholder="اسم المادة" className="w-full rounded-lg bg-slate-100 dark:bg-slate-800 outline-none px-3 py-2 text-xs focus:ring-2 focus:ring-brand-400" />
              <div className="flex gap-2">
                <input type="number" value={courseCredits} onChange={(e) => setCourseCredits(e.target.value)} placeholder="الساعات" min="1" max="6" className="w-20 rounded-lg bg-slate-100 dark:bg-slate-800 outline-none px-3 py-2 text-xs focus:ring-2 focus:ring-brand-400" />
                <select value={courseGrade} onChange={(e) => setCourseGrade(e.target.value)} className="flex-1 rounded-lg bg-slate-100 dark:bg-slate-800 outline-none px-3 py-2 text-xs focus:ring-2 focus:ring-brand-400">
                  {Object.keys(GRADE_POINTS).map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
                <button onClick={addCourse} className="px-3 rounded-lg bg-brand-500 text-white text-xs font-bold transition hover:bg-brand-600">إضافة</button>
              </div>
            </div>
          )}
        </div>

        {/* Exam Countdown */}
        <div className="card p-5 animate-fade-up" style={{ animationDelay: '60ms' }}>
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={18} className="text-error-500" />
            <h2 className="font-bold text-sm">العد التنازلي للامتحانات</h2>
          </div>
          <div className="space-y-2">
            {exams.map((exam, i) => {
              const days = daysUntil(exam.date);
              const isUrgent = days <= 14;
              return (
                <div key={exam.id} className={`flex items-center justify-between p-2.5 rounded-xl animate-fade-up ${isUrgent ? 'bg-error-500/10' : 'bg-slate-50 dark:bg-slate-800/50'}`} style={{ animationDelay: `${i * 50}ms` }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate">{exam.name}</p>
                    <p className="text-[10px] text-slate-400">{exam.date}</p>
                  </div>
                  <div className={`text-center shrink-0 ${isUrgent ? 'text-error-500' : 'text-slate-500 dark:text-slate-400'}`}>
                    <span className="text-xl font-extrabold">{days}</span>
                    <p className="text-[8px]">يوم</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Location tagging */}
      <div className="card p-4 animate-fade-up">
        <div className="flex items-center gap-2 mb-3">
          <MapPin size={18} className="text-brand-500" />
          <p className="text-sm font-bold">موقعك الحالي</p>
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-2">
          {LOCATIONS.map((loc) => (
            <button
              key={loc.id}
              onClick={() => selectLocation(loc.id)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${currentLocation === loc.id ? 'bg-brand-500 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}
            >
              <span>{loc.emoji}</span>
              {loc.label}
            </button>
          ))}
        </div>
        <button
          onClick={detectLocation}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-semibold py-2.5 transition"
        >
          <Navigation size={16} className="text-brand-500" />
          اكتشف موقعي تلقائياً
        </button>
      </div>

      {/* Location alert card */}
      {showLocationAlert && currentLocation && locationTasks.length > 0 && (
        <div className="card p-5 animate-scale-in bg-gradient-to-br from-brand-500/10 to-accent-500/10 border-brand-500/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{LOCATIONS.find((l) => l.id === currentLocation)?.emoji}</span>
              <div>
                <p className="font-bold text-sm">مهام في {LOCATIONS.find((l) => l.id === currentLocation)?.label}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">{locationTasks.length} مهمة نشطة هنا</p>
              </div>
            </div>
            <button onClick={() => setShowLocationAlert(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
              <X size={16} />
            </button>
          </div>
          <div className="space-y-2">
            {locationTasks.map((task) => (
              <div key={task.id} className="flex items-center gap-2 p-3 rounded-xl bg-white/50 dark:bg-slate-900/30">
                <button onClick={() => toggle(task.id)} className="shrink-0">
                  <Circle size={18} className="text-slate-300 dark:text-slate-600" />
                </button>
                <span className="flex-1 text-sm font-semibold">{task.title}</span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Clock size={10} />
                  {task.due}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Suggest Tasks */}
      <div className="card p-4 animate-fade-up bg-gradient-to-br from-accent-500/5 to-transparent">
        <div className="flex items-center gap-2 mb-3">
          <Zap size={18} className="text-accent-500" />
          <p className="text-sm font-bold">مولد المهام الذكي</p>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
          يقترح مهام لليوم بناءً على طاقتك ({ENERGY_META[userEnergy].label}) وجدولك
        </p>
        <button
          onClick={suggestTasks}
          disabled={suggestionLoading}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent-500 to-brand-500 hover:from-accent-600 hover:to-brand-600 text-white font-bold text-sm py-3 transition shadow-md disabled:opacity-60"
        >
          {suggestionLoading ? (
            <><Sparkles size={18} className="animate-spin" /> جاري التحليل...</>
          ) : (
            <><Sparkles size={18} /> اقترح مهام لليوم</>
          )}
        </button>

        {showSuggestions && (
          <div className="mt-3 space-y-2 animate-scale-in">
            {SUGGESTED_TASKS.map((task, i) => {
              const meta = PRIORITY_META[task.priority];
              return (
                <div key={i} className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{task.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {task.subject && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">{task.subject}</span>}
                      <span className={`text-[10px] ${meta.color}`}>{meta.label}</span>
                      {task.location && <span className="text-[10px] text-slate-400">{LOCATIONS.find((l) => l.id === task.location)?.emoji} {LOCATIONS.find((l) => l.id === task.location)?.label}</span>}
                    </div>
                  </div>
                  <button onClick={() => addSuggested(task)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 hover:bg-brand-500/20 transition text-xs font-semibold shrink-0">
                    <Plus size={14} /> إضافة
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add task with location + energy */}
      <div className="card p-4 animate-fade-up">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && add()}
              placeholder="أضف مهمة جديدة..."
              className="flex-1 rounded-xl bg-slate-100 dark:bg-slate-800 outline-none px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-400"
            />
            <button onClick={add} className="p-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white transition shrink-0">
              <Plus size={20} />
            </button>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Location selector for new task */}
            <div className="flex items-center gap-1">
              <MapPin size={14} className="text-slate-400" />
              <select
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                className="rounded-lg bg-slate-100 dark:bg-slate-800 outline-none px-2 py-1.5 text-xs focus:ring-2 focus:ring-brand-400"
              >
                {LOCATIONS.map((l) => <option key={l.id} value={l.id}>{l.emoji} {l.label}</option>)}
              </select>
            </div>
            {/* Energy selector for new task */}
            <div className="flex items-center gap-1">
              <Zap size={14} className="text-slate-400" />
              <div className="flex gap-1">
                {(['high', 'medium', 'low'] as const).map((e) => (
                  <button
                    key={e}
                    onClick={() => setNewEnergy(e)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold transition ${newEnergy === e ? `${ENERGY_META[e].bg} ${ENERGY_META[e].color}` : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}
                  >
                    {ENERGY_META[e].label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sort toggle */}
      <div className="flex items-center justify-between px-1">
        <h2 className="font-bold text-lg">مهام اليوم</h2>
        <button
          onClick={() => setSortByEnergy(!sortByEnergy)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${sortByEnergy ? 'bg-accent-500/10 text-accent-600 dark:text-accent-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}
        >
          <TrendingUp size={12} />
          {sortByEnergy ? 'مرتبة بالطاقة' : 'ترتيب بالطاقة'}
        </button>
      </div>

      {/* Tasks list */}
      <div className="space-y-2.5">
        {displayTasks.map((task, i) => {
          const meta = PRIORITY_META[task.priority];
          const PIcon = meta.icon;
          const taskLoc = task.location ? LOCATIONS.find((l) => l.id === task.location) : null;
          return (
            <div key={task.id} className={`card p-4 flex items-center gap-3 animate-fade-up ${task.done ? 'opacity-60' : ''}`} style={{ animationDelay: `${i * 60}ms` }}>
              <button onClick={() => toggle(task.id)} className="shrink-0 transition">
                {task.done
                  ? <CheckCircle2 size={22} className="text-success-500" />
                  : <Circle size={22} className="text-slate-300 dark:text-slate-600" />}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm ${task.done ? 'line-through' : ''}`}>{task.title}</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  {task.subject && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">{task.subject}</span>}
                  {task.due && <span className="text-[10px] text-slate-400 flex items-center gap-1"><Clock size={10} />{task.due}</span>}
                  {taskLoc && <span className="text-[10px] text-slate-400 flex items-center gap-0.5"><MapPin size={10} />{taskLoc.label}</span>}
                  {task.energy && (
                    <span className={`text-[10px] flex items-center gap-0.5 ${ENERGY_META[task.energy].color}`}>
                      <Zap size={10} />{ENERGY_META[task.energy].label}
                    </span>
                  )}
                </div>
              </div>
              <div className={`flex items-center gap-1 ${meta.color} ${meta.bg} px-2 py-1 rounded-full shrink-0`}>
                <PIcon size={12} />
                <span className="text-[10px] font-semibold">{meta.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
