import React from 'react';
import { Database, Cloud, User } from 'lucide-react';
import { AdminUser } from '../types';
import truthLogo from '../assets/truth_foundation_logo.jpg';

interface HeaderProps {
  user: AdminUser | null;
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ user, title }) => {
  return (
    <header className="h-18 bg-[#071b34]/90 backdrop-blur-md border-b border-slate-800/80 px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <img
          src={truthLogo}
          alt="Truth Foundation Official Logo"
          className="w-10 h-10 rounded-full object-cover border-2 border-[#da8a24] bg-white shadow-sm shrink-0"
        />
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
          <p className="text-xs text-slate-400">Public Charitable Trust (Est. 2010) • Redhills, Chennai</p>
        </div>
      </div>

      <div className="flex items-center gap-5">
        {/* System Health Indicators */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50 text-[11px] text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>Supabase DB</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1.5">
            <Cloud className="w-3.5 h-3.5 text-sky-400" />
            <span>Cloudinary CDN</span>
          </div>
        </div>

        {/* User Profile Badge */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
          <div className="w-9 h-9 rounded-full bg-slate-800 border border-[#da8a24]/40 flex items-center justify-center text-[#da8a24]">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-semibold text-white">{user?.name || 'Administrator'}</div>
            <div className="text-[10px] text-slate-400">{user?.email || 'admin@truthfoundation.org'}</div>
          </div>
        </div>
      </div>
    </header>
  );
};
