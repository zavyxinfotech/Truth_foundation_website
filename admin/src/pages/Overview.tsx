import React, { useEffect, useState } from 'react';
import {
  IndianRupee,
  Users,
  Utensils,
  Image,
  ArrowUpRight,
  TrendingUp,
  Heart,
  Mail
} from 'lucide-react';
import { apiRequest } from '../api/client';
import { DashboardStats, Donation, ContactInquiry } from '../types';

interface OverviewProps {
  onNavigate: (tab: string) => void;
}

export const Overview: React.FC<OverviewProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentDonations, setRecentDonations] = useState<Donation[]>([]);
  const [recentInquiries, setRecentInquiries] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [statsData, donationsData, inquiriesData] = await Promise.all([
          apiRequest<DashboardStats>('/donations/stats').catch(() => ({
            totalAmount: 0,
            totalDonors: 0,
            mealsFunded: 0,
            monthlyRecurringAmount: 0,
            last30DaysAmount: 0
          })),
          apiRequest<{ donations: Donation[] }>('/donations?limit=5').catch(() => ({ donations: [] })),
          apiRequest<{ inquiries: ContactInquiry[] }>('/contact').catch(() => ({ inquiries: [] })),
        ]);

        setStats(statsData);
        setRecentDonations(donationsData.donations || []);
        setRecentInquiries((inquiriesData.inquiries || []).slice(0, 4));
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const metricCards = [
    {
      title: 'Total Contributions',
      value: `₹${(stats?.totalAmount || 0).toLocaleString('en-IN')}`,
      subtitle: `₹${(stats?.last30DaysAmount || 0).toLocaleString('en-IN')} in last 30 days`,
      icon: IndianRupee,
      color: 'from-amber-500/20 to-amber-500/5',
      textColor: 'text-amber-400',
      badge: '+Active'
    },
    {
      title: 'Total Donors',
      value: (stats?.totalDonors || 0).toLocaleString('en-IN'),
      subtitle: 'Registered Supporters',
      icon: Users,
      color: 'from-sky-500/20 to-sky-500/5',
      textColor: 'text-sky-400',
      badge: 'Verified'
    },
    {
      title: 'Wholesome Meals Funded',
      value: (stats?.mealsFunded || 0).toLocaleString('en-IN'),
      subtitle: 'At ₹20 per wholesome meal',
      icon: Utensils,
      color: 'from-emerald-500/20 to-emerald-500/5',
      textColor: 'text-emerald-400',
      badge: 'Redhills'
    },
    {
      title: 'Recurring Monthly Impact',
      value: `₹${(stats?.monthlyRecurringAmount || 0).toLocaleString('en-IN')}`,
      subtitle: 'Predictable Monthly Operations',
      icon: TrendingUp,
      color: 'from-indigo-500/20 to-indigo-500/5',
      textColor: 'text-indigo-400',
      badge: 'Monthly'
    },
  ];

  return (
    <div className="space-y-5 sm:space-y-8">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        {metricCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-[#071b34]/70 backdrop-blur-sm rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-none border-0"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-400">{card.title}</span>
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center ${card.textColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="text-xl sm:text-2xl font-bold text-white mb-1 tracking-tight">
                {loading ? <span className="opacity-40 animate-pulse">Loading...</span> : card.value}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 gap-2">
                <span className="truncate">{card.subtitle}</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800/80 text-slate-300 font-mono shrink-0">
                  {card.badge}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout: Recent Donations & Recent Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        
        {/* Left Column (2 Cols): Recent Donations */}
        <div className="lg:col-span-2 bg-[#071b34]/70 rounded-2xl p-4 sm:p-6 shadow-none border-0">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-semibold text-white">Recent Donations</h3>
              <p className="text-xs text-slate-400">Live records from Supabase PostgreSQL</p>
            </div>
            <button
              onClick={() => onNavigate('donations')}
              className="text-xs text-[#da8a24] hover:underline flex items-center gap-1 font-medium cursor-pointer"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentDonations.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              <Heart className="w-8 h-8 mx-auto mb-2 opacity-30 text-[#da8a24]" />
              <p>No donations recorded yet in Supabase.</p>
              <button
                onClick={() => onNavigate('donations')}
                className="mt-3 px-4 py-2 rounded-xl bg-[#da8a24]/10 text-[#da8a24] hover:bg-[#da8a24]/20 text-xs font-semibold transition"
              >
                + Record First Donation
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[480px]">
                <thead>
                  <tr className="border-b border-slate-800/40 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="pb-3">Donor</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Frequency</th>
                    <th className="pb-3">Receipt</th>
                    <th className="pb-3 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {recentDonations.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-800/20 transition">
                      <td className="py-3 font-medium text-white">{d.donor_name}</td>
                      <td className="py-3 font-semibold text-emerald-400">
                        ₹{parseFloat(String(d.amount)).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                          d.frequency === 'Monthly' ? 'bg-indigo-500/10 text-indigo-300' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {d.frequency}
                        </span>
                      </td>
                      <td className="py-3 font-mono text-slate-400 text-[11px]">{d.receipt_number || '-'}</td>
                      <td className="py-3 text-right text-slate-400">
                        {new Date(d.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column (1 Col): Contact Messages Inbox */}
        <div className="bg-[#071b34]/70 rounded-2xl p-4 sm:p-6 flex flex-col justify-between shadow-none border-0">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-white">Recent Inquiries</h3>
                <p className="text-xs text-slate-400">Website contact submissions</p>
              </div>
              <button
                onClick={() => onNavigate('inquiries')}
                className="text-xs text-[#da8a24] hover:underline flex items-center gap-1 font-medium cursor-pointer"
              >
                <span>Inbox</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {recentInquiries.length === 0 ? (
              <div className="py-10 text-center text-slate-500 text-xs">
                <Mail className="w-7 h-7 mx-auto mb-2 opacity-30 text-slate-400" />
                <p>No new inquiries from visitors.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentInquiries.map((inq) => (
                  <div key={inq.id} className="p-3 rounded-xl bg-slate-900/60 text-xs shadow-none border-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-white">{inq.name}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                        inq.status === 'NEW' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {inq.status}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px] line-clamp-2">{inq.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Shortcuts */}
          <div className="mt-6 pt-4 grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => onNavigate('gallery')}
              className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium flex items-center justify-center gap-1.5 transition"
            >
              <Image className="w-3.5 h-3.5 text-sky-400" />
              <span>Upload Image</span>
            </button>
            <button
              onClick={() => onNavigate('donations')}
              className="py-2 px-3 rounded-xl bg-[#da8a24]/10 hover:bg-[#da8a24]/20 text-[#da8a24] font-medium flex items-center justify-center gap-1.5 transition"
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Donations</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
