import React from 'react';
import {
  LayoutDashboard,
  HeartHandshake,
  Image,
  Mail,
  Settings,
  LogOut,
  ExternalLink,
  Layers
} from 'lucide-react';
import truthLogo from '../assets/truth_foundation_logo.jpg';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onLogout: () => void;
  inquiriesCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onLogout,
  inquiriesCount = 0
}) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'content', label: 'Website Content', icon: Layers },
    { id: 'gallery', label: 'Gallery Photos', icon: Image },
    { id: 'donations', label: 'Donations', icon: HeartHandshake },
    { id: 'inquiries', label: 'Inquiries Inbox', icon: Mail, badge: inquiriesCount > 0 ? inquiriesCount : undefined },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#071b34] border-r border-slate-800 flex flex-col justify-between shrink-0 min-h-screen">
      <div>
        {/* Brand Logo & Name */}
        <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
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

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#da8a24] text-[#071b34] shadow-sm font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#071b34]' : 'text-slate-400'}`} />
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
          <span className="text-[10px] text-emerald-400">Live</span>
        </a>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
