import React, { useEffect, useState } from 'react';
import { Mail, CheckCircle2, Trash2, Calendar, Loader2 } from 'lucide-react';
import { apiRequest } from '../api/client';
import { ContactInquiry } from '../types';

export const Inquiries: React.FC = () => {
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadInquiries = async () => {
    try {
      setLoading(true);
      const data = await apiRequest<{ inquiries: ContactInquiry[] }>('/contact');
      setInquiries(data.inquiries || []);
    } catch (err) {
      console.error('Failed to load inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'NEW' ? 'CONTACTED' : 'NEW';
    try {
      await apiRequest(`/contact/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus })
      });
      setInquiries(
        inquiries.map((inq) => (inq.id === id ? { ...inq, status: nextStatus as any } : inq))
      );
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this inquiry message?')) return;
    try {
      await apiRequest(`/contact/${id}`, { method: 'DELETE' });
      setInquiries(inquiries.filter((inq) => inq.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete inquiry');
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <div>
        <h3 className="text-base sm:text-lg font-bold text-white">Contact Inquiries Inbox</h3>
        <p className="text-xs text-slate-400">Visitor messages and volunteer requests from website contact form</p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm flex flex-col items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-[#da8a24]" />
          <span>Loading messages...</span>
        </div>
      ) : inquiries.length === 0 ? (
        <div className="py-16 text-center text-slate-500 text-sm bg-[#071b34]/60 border border-slate-800 rounded-2xl">
          <Mail className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-400" />
          <p>Inbox is clean! No messages received yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inq) => (
            <div
              key={inq.id}
              className={`p-4 sm:p-5 rounded-2xl border transition ${
                inq.status === 'NEW'
                  ? 'bg-[#071b34] border-[#da8a24]/40 shadow-sm'
                  : 'bg-slate-900/40 border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                  <span className="font-semibold text-white text-sm">{inq.name}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      inq.status === 'NEW'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}
                  >
                    {inq.status}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1 font-mono text-[11px]">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(inq.created_at).toLocaleString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>

              {/* Contact meta */}
              <div className="flex flex-wrap gap-2.5 sm:gap-4 text-xs text-slate-400 mb-3 break-all">
                <span>Email: <a href={`mailto:${inq.email}`} className="text-sky-400 hover:underline">{inq.email}</a></span>
                {inq.phone && <span>Phone: <a href={`tel:${inq.phone}`} className="text-emerald-400 hover:underline">{inq.phone}</a></span>}
                {inq.subject && <span>Subject: <strong className="text-white">{inq.subject}</strong></span>}
              </div>

              {/* Message body */}
              <div className="p-3 sm:p-3.5 rounded-xl bg-slate-900/80 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap break-words">
                {inq.message}
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-slate-800/80 flex-wrap sm:flex-nowrap">
                <button
                  onClick={() => handleToggleStatus(inq.id, inq.status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                    inq.status === 'NEW'
                      ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{inq.status === 'NEW' ? 'Mark Contacted' : 'Mark as New'}</span>
                </button>

                <button
                  onClick={() => handleDelete(inq.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 transition cursor-pointer flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
