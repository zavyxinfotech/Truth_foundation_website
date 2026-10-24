import React, { useState, useEffect } from 'react';
import { apiRequest, getStoredToken, removeStoredToken } from './api/client';
import { AdminUser, ContactInquiry } from './types';
import { Login } from './pages/Login';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Overview } from './pages/Overview';
import { Donations } from './pages/Donations';
import { Gallery } from './pages/Gallery';
import { Inquiries } from './pages/Inquiries';
import { Settings } from './pages/Settings';
import { ContentManager } from './pages/ContentManager';
import { Loader2 } from 'lucide-react';

export const App: React.FC = () => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [currentTab, setCurrentTab] = useState('overview');
  const [unreadInquiries, setUnreadInquiries] = useState(0);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Check auth session on load
  useEffect(() => {
    async function checkAuth() {
      const token = getStoredToken();
      if (!token) {
        setCheckingAuth(false);
        return;
      }

      try {
        const data = await apiRequest<{ user: AdminUser }>('/auth/me');
        setUser(data.user);
      } catch {
        removeStoredToken();
        setUser(null);
      } finally {
        setCheckingAuth(false);
      }
    }

    checkAuth();

    const handleUnauthorized = () => {
      setUser(null);
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  // Check new inquiries count for sidebar badge
  useEffect(() => {
    if (!user) return;
    async function loadInquiriesBadge() {
      try {
        const data = await apiRequest<{ inquiries: ContactInquiry[] }>('/contact');
        const newCount = (data.inquiries || []).filter((i) => i.status === 'NEW').length;
        setUnreadInquiries(newCount);
      } catch {
        // silent fail
      }
    }
    loadInquiriesBadge();
  }, [user, currentTab]);

  const handleLogout = () => {
    removeStoredToken();
    setUser(null);
    setCurrentTab('overview');
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#040f1d] flex items-center justify-center text-slate-400 gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-[#da8a24]" />
        <span>Verifying administrator session...</span>
      </div>
    );
  }

  if (!user) {
    return <Login onLoginSuccess={(u) => setUser(u)} />;
  }

  const tabTitles: Record<string, string> = {
    overview: 'Executive Dashboard Overview',
    content: 'Website Content & Media Manager',
    donations: 'Donations & 80G Receipts',
    gallery: 'Cloudinary Gallery Manager',
    inquiries: 'Visitor Inquiries Inbox',
    settings: 'Security & Database Config',
  };

  return (
    <div className="min-h-screen bg-[#040f1d] flex">
      {/* Navigation Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setMobileSidebarOpen(false);
        }}
        onLogout={handleLogout}
        inquiriesCount={unreadInquiries}
        isOpenMobile={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          user={user}
          title={tabTitles[currentTab] || 'Dashboard'}
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />

        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 overflow-y-auto">
          {currentTab === 'overview' && <Overview onNavigate={setCurrentTab} />}
          {currentTab === 'content' && <ContentManager />}
          {currentTab === 'donations' && <Donations />}
          {currentTab === 'gallery' && <Gallery />}
          {currentTab === 'inquiries' && <Inquiries />}
          {currentTab === 'settings' && <Settings user={user} />}
        </main>
      </div>
    </div>
  );
};

export default App;
