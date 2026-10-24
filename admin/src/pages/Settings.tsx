import React, { useState } from 'react';
import { ShieldCheck, Lock, Database, Cloud, Loader2 } from 'lucide-react';
import { apiRequest } from '../api/client';
import { AdminUser } from '../types';

interface SettingsProps {
  user: AdminUser | null;
}

export const Settings: React.FC<SettingsProps> = ({ user }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    setLoading(true);
    try {
      await apiRequest('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword })
      });
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h3 className="text-lg font-bold text-white">Security & Environment Settings</h3>
        <p className="text-xs text-slate-400">Manage administrator account and cloud integrations</p>
      </div>

      {/* Account Info Box */}
      <div className="bg-[#071b34]/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <h4 className="text-sm font-semibold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#da8a24]" />
          <span>Superadmin Profile</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">Administrator Email</span>
            <span className="text-xs font-semibold text-white font-mono">{user?.email || 'zavyxindia@gmail.com'}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">Account Role</span>
            <span className="text-xs font-bold text-[#da8a24]">{user?.role || 'SUPERADMIN'}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">Organization</span>
            <span className="text-xs font-semibold text-white">Truth Foundation</span>
          </div>
        </div>
      </div>

      {/* Change Password Form */}
      <div className="bg-[#071b34]/80 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <h4 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
          <Lock className="w-4 h-4 text-[#da8a24]" />
          <span>Update Admin Password</span>
        </h4>

        {message && (
          <div className={`mb-4 p-3 rounded-xl text-xs flex items-center gap-2 ${
            message.type === 'success' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/10 text-red-300 border border-red-500/30'
          }`}>
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-[#da8a24] hover:bg-[#c77a1e] text-[#071b34] font-bold text-xs transition flex items-center gap-2 cursor-pointer shadow-sm"
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Update Password</span>
          </button>
        </form>
      </div>

      {/* Cloud Integrations Status */}
      <div className="bg-[#071b34]/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <h4 className="text-sm font-semibold text-white mb-2">Connected Cloud Services</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-white mb-1">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>Supabase PostgreSQL</span>
              </div>
              <p className="text-[11px] text-slate-400">Host: aws-0-ap-northeast-1.pooler.supabase.com</p>
              <p className="text-[11px] text-slate-400">Database: postgres (Port 5432)</p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Active
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-white mb-1">
                <Cloud className="w-4 h-4 text-sky-400" />
                <span>Cloudinary Image CDN</span>
              </div>
              <p className="text-[11px] text-slate-400">Cloud Name: xsuj7lkd</p>
              <p className="text-[11px] text-slate-400">Auto WebP & Lossless Optimization</p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
