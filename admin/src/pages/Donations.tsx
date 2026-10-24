import React, { useEffect, useState } from 'react';
import {
  Search,
  Download,
  Plus,
  Trash2,
  FileText,
  X,
  Loader2
} from 'lucide-react';
import { apiRequest } from '../api/client';
import { Donation } from '../types';

export const Donations: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [frequencyFilter, setFrequencyFilter] = useState<'All' | 'One-time' | 'Monthly'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // New donation form state
  const [formData, setFormData] = useState({
    donor_name: '',
    email: '',
    phone: '',
    pan_number: '',
    amount: '',
    frequency: 'One-time',
    is_eighty_g: true,
    payment_method: 'Direct Bank Transfer',
    notes: ''
  });

  const loadDonations = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (searchTerm) queryParams.set('search', searchTerm);
      if (frequencyFilter !== 'All') queryParams.set('frequency', frequencyFilter);

      const data = await apiRequest<{ donations: Donation[] }>(`/donations?${queryParams.toString()}`);
      setDonations(data.donations || []);
    } catch (err) {
      console.error('Failed to load donations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDonations();
  }, [frequencyFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadDonations();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this donation record?')) return;
    try {
      await apiRequest(`/donations/${id}`, { method: 'DELETE' });
      setDonations(donations.filter((d) => d.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete donation');
    }
  };

  const handleCreateDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const result = await apiRequest<{ donation: Donation }>('/donations', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      setDonations([result.donation, ...donations]);
      setIsModalOpen(false);
      setFormData({
        donor_name: '',
        email: '',
        phone: '',
        pan_number: '',
        amount: '',
        frequency: 'One-time',
        is_eighty_g: true,
        payment_method: 'Direct Bank Transfer',
        notes: ''
      });
    } catch (err: any) {
      alert(err.message || 'Failed to record donation');
    } finally {
      setSubmitting(false);
    }
  };

  const handleExportCSV = () => {
    if (donations.length === 0) {
      alert('No donation records to export.');
      return;
    }

    const headers = ['Receipt No', 'Date', 'Donor Name', 'Email', 'Phone', 'PAN', 'Amount', 'Frequency', '80G Required', 'Payment Method', 'Status'];
    const rows = donations.map((d) => [
      d.receipt_number || '',
      new Date(d.created_at).toISOString().split('T')[0],
      `"${d.donor_name}"`,
      d.email,
      d.phone || '',
      d.pan_number || '',
      d.amount,
      d.frequency,
      d.is_eighty_g ? 'YES' : 'NO',
      d.payment_method,
      d.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `truth_foundation_donations_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header & Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">Donations Management</h3>
          <p className="text-xs text-slate-400">Total {donations.length} records retrieved from Supabase</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleExportCSV}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-[#da8a24] hover:bg-[#c77a1e] text-[#071b34] text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Record Donation</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#071b34]/70 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search donor name, email, phone, receipt..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#da8a24]"
          />
        </form>

        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto">
          {(['All', 'One-time', 'Monthly'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFrequencyFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                frequencyFilter === tab
                  ? 'bg-[#da8a24] text-[#071b34] font-semibold'
                  : 'text-slate-400 hover:text-white bg-slate-900/60'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-[#071b34]/70 border border-slate-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-sm flex flex-col items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-[#da8a24]" />
            <span>Loading donations from Supabase...</span>
          </div>
        ) : donations.length === 0 ? (
          <div className="py-20 text-center text-slate-500 text-sm">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#da8a24]" />
            <p>No donation records match the filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/70 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Receipt #</th>
                  <th className="py-3.5 px-4">Donor Name</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Frequency</th>
                  <th className="py-3.5 px-4">80G PAN</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {donations.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3.5 px-4 font-mono font-medium text-[#da8a24] text-[11px]">
                      {d.receipt_number || `TF-${d.id}`}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-white">
                      {d.donor_name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      <div>{d.email}</div>
                      {d.phone && <div className="text-[10px] text-slate-500">{d.phone}</div>}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400">
                      ₹{parseFloat(String(d.amount)).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                        d.frequency === 'Monthly' ? 'bg-indigo-500/10 text-indigo-300' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {d.frequency}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      {d.pan_number ? (
                        <span className="text-slate-300">{d.pan_number}</span>
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {d.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {new Date(d.created_at).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDelete(d.id)}
                        className="text-red-400/80 hover:text-red-400 p-1 hover:bg-red-500/10 rounded transition cursor-pointer"
                        title="Delete Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Record Donation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#040f1d]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#071b34] border border-slate-700 rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl relative">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-base font-bold text-white">Record Offline / Direct Donation</h4>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDonation} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Donor Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.donor_name}
                    onChange={(e) => setFormData({ ...formData, donor_name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">PAN Number (for 80G)</label>
                  <input
                    type="text"
                    maxLength={10}
                    value={formData.pan_number}
                    onChange={(e) => setFormData({ ...formData, pan_number: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Payment Method</label>
                  <select
                    value={formData.payment_method}
                    onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                  >
                    <option value="Direct Bank Transfer">Direct Bank Transfer</option>
                    <option value="Cheque / DD">Cheque / DD</option>
                    <option value="Cash Contribution">Cash Contribution</option>
                    <option value="UPI / QR Offline">UPI / QR Offline</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Optional note e.g. Special meals on anniversary..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-[#da8a24] hover:bg-[#c77a1e] text-[#071b34] text-xs font-bold transition flex items-center gap-1.5"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Record</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
