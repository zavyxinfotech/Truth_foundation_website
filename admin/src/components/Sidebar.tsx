import React from 'react';
import {
  LayoutDashboard,
  HeartHandshake,
  Image,
  Mail,
  Settings,
  LogOut,
  ExternalLink,
  Layers,
  X
} from 'lucide-react';
import truthLogo from '../assets/truth_foundation_logo.jpg';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onLogout: () => void;
  inquiriesCount?: number;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onLogout,
  inquiriesCount = 0,
  isOpenMobile = false,
  onCloseMobile
}) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'content', label: 'Website Content', icon: Layers },
    { id: 'gallery', label: 'Gallery Photos', icon: Image },
    { id: 'donations', label: 'Donations', icon: HeartHandshake },
    { id: 'inquiries', label: 'Inquiries Inbox', icon: Mail, badge: inquiriesCount > 0 ? inquiriesCount : undefined },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (tabId: string) => {
    onSelectTab(tabId);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full">
      <div>
        {/* Brand Logo & Name */}
        <div className="p-4 sm:p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={truthLogo}
              alt="Truth Foundation Official Logo"
              className="w-10 h-10 rounded-full object-cover border-2 border-[#da8a24] bg-white shadow-md shrink-0"
            />
            <div>
              <h1 className="text-sm font-semibold tracking-wide text-white uppercase">Truth Foundation</h1>
              <p className="text-[11px] text-[#da8a24] font-medium tracking-wider">Admin Control Panel</p>
            </div>
          </div>

          {/* Close button on mobile */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden cursor-pointer"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="p-3 sm:p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#da8a24] text-white shadow-sm font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-500 text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions: View Public Website & Logout */}
      <div className="p-4 border-t border-slate-800/80 space-y-2">
        <a
          href="http://localhost:5173"
          target="_blank"
          rel="noreferrer"
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/40 transition"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Public Website</span>
          </span>
          <span className="text-[10px] text-emerald-400 font-semibold">Live</span>
        </a>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:flex w-64 bg-[#071b34] border-r border-slate-800 flex-col justify-between shrink-0 h-screen sticky top-0 overflow-y-auto z-20">
        {sidebarContent}
      </aside>

      {/* Mobile / Tablet Drawer Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Mobile / Tablet Slide-out Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-[#071b34] border-r border-slate-800 flex flex-col justify-between lg:hidden transition-transform duration-300 ease-in-out shadow-2xl overflow-y-auto ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};
