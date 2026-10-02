import WelcomeBanner from '@/components/dashboard/WelcomeBanner';
import StatCards from '@/components/dashboard/StatCards';
import ItemFinder from '@/components/dashboard/ItemFinder';
import QuickActions from '@/components/dashboard/QuickActions';
import AnalyticsCharts from '@/components/dashboard/AnalyticsCharts';
import type { SectionId } from '@/config/navigation';

interface DashboardProps {
  onNavigate: (id: SectionId) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  return (
    <div className="space-y-5 sm:space-y-6">
      <WelcomeBanner />
      <StatCards />
      <div>
        <h2 className="font-bold text-lg mb-3 px-1">الرسوم البيانية ومتابعة التقدم</h2>
        <AnalyticsCharts />
      </div>
      <ItemFinder />
      <div>
        <h2 className="font-bold text-lg mb-3 px-1">إجراءات سريعة</h2>
        <QuickActions onNavigate={onNavigate} />
      </div>
    </div>
  );
}
