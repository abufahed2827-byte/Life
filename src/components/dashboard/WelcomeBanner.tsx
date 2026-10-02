import { useEffect, useState } from 'react';

const QUOTES = [
  'كل يوم هو فرصة جديدة لتكون أفضل من الأمس.',
  'العناية بنفسك ليست رفاهية، بل ضرورة.',
  'الخطوات الصغيرة تقودك إلى إنجازات كبيرة.',
  'صحتك أولوية، وعقلك ثروة لا تقدر بثمن.',
  'ابدأ يومك بنية صافية، وستنتهي بنتيجة رائعة.',
  'لا تؤجل ما يمكنك إنجازه اليوم.',
  'الاستقرار النفسي يبدأ بفهم مشاعرك.',
  'كل إنجاز عظيم بدأ بفكرة بسيطة.',
];

function formatDate(d: Date): string {
  const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  return `${days[d.getDay()]}، ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function formatTime(d: Date): string {
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, '0');
  const period = h < 12 ? 'ص' : 'م';
  const h12 = h % 12 || 12;
  return `${h12}:${m} ${period}`;
}

function greeting(d: Date): string {
  const h = d.getHours();
  if (h < 12) return 'صباح الخير';
  if (h < 17) return 'نهارك سعيد';
  if (h < 21) return 'مساء الخير';
  return 'ليلة هانئة';
}

export default function WelcomeBanner() {
  const [now, setNow] = useState(new Date());
  const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-500 to-accent-500 p-6 sm:p-8 text-white shadow-lg animate-fade-up">
      {/* Decorative blobs */}
      <div className="absolute -top-16 -left-16 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
      <div className="absolute -bottom-20 left-1/3 w-56 h-56 bg-accent-300/20 rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-white/80 text-sm font-semibold mb-1">{greeting(now)} 👋</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">أهلاً بك في Life OS</h1>
          <p className="text-white/90 text-sm">{formatDate(now)}</p>
        </div>
        <div className="flex flex-col items-start sm:items-end gap-1">
          <div className="text-3xl sm:text-4xl font-extrabold tabular-nums tracking-tight">{formatTime(now)}</div>
          <div className="text-white/70 text-xs">الوقت الحالي</div>
        </div>
      </div>

      {/* Quote */}
      <div className="relative z-10 mt-5 flex items-start gap-3 bg-white/15 backdrop-blur-sm rounded-2xl p-4">
        <span className="text-2xl">"</span>
        <p className="text-sm sm:text-base font-semibold leading-relaxed flex-1">{quote}</p>
      </div>
    </div>
  );
}
