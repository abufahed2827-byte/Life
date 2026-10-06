import { useState } from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { AmbientProvider } from '@/context/AmbientContext';
import { ProfileProvider } from '@/context/ProfileContext';
import AmbientBackground from '@/components/layout/AmbientBackground';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import BottomNav from '@/components/layout/BottomNav';
import AIAssistant from '@/components/layout/AIAssistant';
import InstallBanner from '@/components/layout/InstallBanner';
import Dashboard from '@/pages/Dashboard';
import HealthPage from '@/pages/Health';
import CBTPage from '@/pages/CBT';
import AcademicPage from '@/pages/Academic';
import StudioPage from '@/pages/Studio';
import WishlistPage from '@/pages/Wishlist';
import SavedLaterPage from '@/pages/SavedLater';
import SettingsPage from '@/pages/Settings';
import type { SectionId } from '@/config/navigation';

function App() {
  const [section, setSection] = useState<SectionId>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderPage = () => {
    switch (section) {
      case 'dashboard': return <Dashboard onNavigate={setSection} />;
      case 'health': return <HealthPage />;
      case 'cbt': return <CBTPage />;
      case 'academic': return <AcademicPage />;
      case 'studio': return <StudioPage />;
      case 'wishlist': return <WishlistPage />;
      case 'savedlater': return <SavedLaterPage />;
      case 'settings': return <SettingsPage />;
      default: return <Dashboard onNavigate={setSection} />;
    }
  };

  return (
    <ThemeProvider>
      <AmbientProvider>
        <ProfileProvider>
          <div className="relative min-h-screen flex overflow-x-hidden" dir="rtl">
            <AmbientBackground />

            <div className="relative z-10 flex w-full overflow-x-hidden">
              <Sidebar
                active={section}
                onNavigate={setSection}
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
              />

              <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
                <Header
                  onOpenSidebar={() => setSidebarOpen(true)}
                  onSearch={() => {}}
                  onOpenSettings={() => setSection('settings')}
                />

                <main className="relative z-10 flex-1 p-4 sm:p-6 pb-28 lg:pb-6 max-w-6xl mx-auto w-full overflow-x-hidden">
                  <div key={section} className="animate-fade-in">
                    {renderPage()}
                  </div>
                </main>
              </div>
            </div>

            <div className="relative z-30">
              <BottomNav active={section} onNavigate={setSection} />
            </div>
            <div className="relative z-20">
              <AIAssistant />
              <InstallBanner />
            </div>
          </div>
        </ProfileProvider>
      </AmbientProvider>
    </ThemeProvider>
  );
}

export default App;
