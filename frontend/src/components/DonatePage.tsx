/* cspell:disable */
/* eslint-disable */
import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import truthLogo from '../assets/images/truth_foundation_logo_1785562616008.jpg?w=128&format=webp';
import sadChildPainting from '../assets/images/sad_child_painting.jpg?w=512;1024&format=webp;jpg&as=picture';
import brushMask from '../assets/images/brush_mask.png?w=700&format=webp';
import { pixelTracker } from '../utils/pixelTracker';
import { Picture } from './Picture';

interface DonatePageProps {
  initialAmount?: number;
  onClose?: () => void;
  onDonateSuccess?: () => void;
  onNavigateHome?: (anchor?: string) => void;
}

export const DonatePage: React.FC<DonatePageProps> = ({ initialAmount = 500, onClose, onDonateSuccess, onNavigateHome }) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(initialAmount);
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [customValue, setCustomValue] = useState<string>('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
  });

  const activeAmount = isCustom ? (parseInt(customValue, 10) || 100) : selectedAmount;

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateHome) {
      onNavigateHome();
    } else if (onClose) {
      onClose();
    } else {
      window.location.href = '/';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    pixelTracker.trackDonateClick(activeAmount, 'Separate Donate Page Submit');
    if (onDonateSuccess) onDonateSuccess();
    else if (onClose) onClose();
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-slate-900 flex flex-col justify-between font-sans antialiased selection:bg-amber-400 selection:text-slate-950">
      
      {/* 1. Header Bar */}
      <header className="w-full bg-white text-slate-900 py-3.5 px-4 sm:px-8 border-b border-slate-200/80 shadow-xs sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Permanent Left Logo & Title Branding */}
          <a
            href="/"
            onClick={handleLogoClick}
            className="flex items-center gap-3 group shrink cursor-pointer"
            aria-label="Truth Foundation Home Page"
          >
            <img
              src={truthLogo}
              alt="Truth Foundation Logo"
              width={128}
              height={128}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-[#da8a24] shrink-0 shadow-sm"
            />
            <div className="min-w-0 text-left whitespace-nowrap">
              <span className="text-sm xs:text-base sm:text-xl lg:text-2xl font-semibold text-[#0a2240] tracking-tight leading-none block group-hover:text-[#da8a24] transition-colors">
                TRUTH FOUNDATION
              </span>
              <p className="text-[8px] xs:text-[9.5px] sm:text-[10.5px] font-medium text-[#0a2240] uppercase tracking-wider block pt-0.5">
                REGISTERED NGO • CHENNAI
              </p>
            </div>
          </a>

        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        
        {/* Hero Section Banner */}
        <div className="max-w-4xl space-y-2 sm:space-y-3 mb-6 sm:mb-10">
          <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-[46px] font-semibold text-[#0a2240] tracking-tight leading-tight">
            Make Your Contribution
          </h1>

          <p className="text-slate-600 text-xs sm:text-sm lg:text-base max-w-2xl font-normal leading-relaxed">
            Your generosity empowers children, provides education, healthcare, nutrition, shelter, and community development across India.
          </p>
        </div>

        {/* 2-Column Grid Layout */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
          
          {/* Left Section (6 Columns Desktop): Amount Selection */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8">
            
            {/* Amount Selection */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-[#0a2240] tracking-tight">
                  Select Donation Amount (INR)
                </h2>
              </div>

              {/* 2-Row Amount Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[100, 500, 1000, 2500, 5000, 10000].map((amt) => {
                  const isSelected = !isCustom && selectedAmount === amt;
                  return (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setSelectedAmount(amt);
                        setIsCustom(false);
                      }}
                      className={`py-3.5 px-3 rounded-2xl font-semibold text-base border-2 transition-all cursor-pointer text-center ${
                        isSelected
                          ? 'bg-[#da8a24] border-[#da8a24] text-[#0a2240] shadow-md scale-102'
                          : 'bg-white border-slate-200/90 text-slate-800 hover:border-slate-300 hover:bg-slate-50 shadow-2xs'
                      }`}
                    >
                      ₹{amt.toLocaleString()}
                    </button>
                  );
                })}

                {/* Custom Amount Button Pill */}
                <div className={`relative col-span-2 sm:col-span-2 rounded-2xl border-2 transition-all flex items-center justify-center ${
                  isCustom ? 'border-[#da8a24] bg-amber-50 shadow-md' : 'border-slate-200/90 bg-white shadow-2xs'
                }`}>
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-semibold text-sm text-[#0a2240]">₹</span>
                  <input
                    type="number"
                    value={customValue}
                    onFocus={() => setIsCustom(true)}
                    onChange={(e) => {
                      setIsCustom(true);
                      setCustomValue(e.target.value);
                    }}
                    placeholder="Custom"
                    className="w-full py-3.5 pl-8 pr-3 text-center text-base font-semibold text-[#0a2240] bg-transparent focus:outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>

            {/* Emotional Painted Image Section */}
            <div className="w-full flex justify-center mt-6 sm:mt-10">
              <div
                className="relative w-full max-w-lg aspect-[5/4] sm:aspect-video"
                style={{ mixBlendMode: 'multiply' }}
              >
                <Picture
                  picture={sadChildPainting}
                  sizes="(min-width: 640px) 512px, calc(100vw - 2rem)"
                  alt="Emotional painting of a child receiving care"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: `url('${brushMask}')`,
                    backgroundSize: '100% 100%',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    mixBlendMode: 'lighten'
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Right Section (6 Columns Desktop): Summary Card, Donor Info & Submit Button */}
          <div className="lg:col-span-6 space-y-6 bg-white p-5 sm:p-8 rounded-3xl border border-slate-200/90 shadow-md lg:sticky lg:top-24">
            
            {/* SELECTED CONTRIBUTION Box */}
            <div className="bg-slate-50 border border-slate-200/80 p-4.5 rounded-2xl flex items-center justify-between">
              <span className="text-[11px] uppercase font-semibold text-slate-500 tracking-wider">
                SELECTED CONTRIBUTION
              </span>
              <div className="text-2xl sm:text-3xl font-semibold text-[#0a2240]">
                ₹{activeAmount.toLocaleString()}
              </div>
            </div>

            {/* Donor Information Form */}
            <div className="pt-4 border-t border-slate-200/80 space-y-4">
              <h2 className="text-lg sm:text-xl font-semibold text-[#0a2240] tracking-tight">
                Donor Information
              </h2>

              <div>
                <label className="font-medium text-slate-700 text-xs sm:text-sm block mb-1.5">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full h-12 sm:h-13 px-4 bg-white border border-slate-200/90 rounded-2xl font-normal focus:outline-none focus:border-[#da8a24] focus:ring-2 focus:ring-[#da8a24]/20 text-slate-900 text-sm transition shadow-2xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-slate-700 text-xs sm:text-sm block mb-1.5">Email Address (for Receipt) *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="rahul@example.com"
                    className="w-full h-12 sm:h-13 px-4 bg-white border border-slate-200/90 rounded-2xl font-normal focus:outline-none focus:border-[#da8a24] focus:ring-2 focus:ring-[#da8a24]/20 text-slate-900 text-sm transition shadow-2xs"
                  />
                </div>

                <div>
                  <label className="font-medium text-slate-700 text-xs sm:text-sm block mb-1.5">Mobile / WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="9876543210"
                    className="w-full h-12 sm:h-13 px-4 bg-white border border-slate-200/90 rounded-2xl font-normal focus:outline-none focus:border-[#da8a24] focus:ring-2 focus:ring-[#da8a24]/20 text-slate-900 text-sm transition shadow-2xs"
                  />
                </div>
              </div>
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              className="w-full h-14 bg-[#da8a24] hover:bg-[#c77a1e] text-[#0a2240] font-semibold text-lg rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 uppercase tracking-wider"
            >
              <Lock className="w-5 h-5 fill-[#0a2240] text-[#0a2240] shrink-0" />
              <span>DONATE NOW</span>
            </button>

          </div>

        </form>
      </main>

      {/* Simple minimal footer for Donate page */}
      <footer className="py-6 border-t border-amber-200/50 text-center text-xs text-slate-500 font-normal">
        © {new Date().getFullYear()} Truth Foundation • Registered NGO. Developed with ❤️ by{' '}
        <a
          href="https://zavyx.odoo.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#da8a24] font-medium hover:underline"
        >
          ZAVYX InfoTech
        </a>
      </footer>
    </div>
  );
};
