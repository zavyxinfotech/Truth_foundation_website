import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, ChevronUp, Heart, Shield, FileText, CheckCircle2 } from 'lucide-react';
import { FAQS } from '../data/campaignData';
import { pixelTracker } from '../utils/pixelTracker';
import { WhatsAppIcon } from './WhatsAppIcon';

interface FAQSectionProps {
  onOpenDonateModal?: (amount?: number) => void;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ onOpenDonateModal }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [selectedAmt, setSelectedAmt] = useState<number>(500);
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [customVal, setCustomVal] = useState<string>('');

  const toggleFAQ = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const activeAmt = isCustom ? (parseInt(customVal, 10) || 500) : selectedAmt;

  const handleWhatsApp = () => {
    pixelTracker.trackWhatsAppClick('FAQ Section');
    const msg = encodeURIComponent(`Hello Truth Foundation! I have a question regarding donations/tax receipts that wasn't answered on the FAQ section.`);
    window.open(`https://wa.me/919962294949?text=${msg}`, '_blank');
  };

  return (
    <section id="faq" className="py-10 sm:py-16 bg-[#0a2240] text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Equal 6-col / 6-col Desktop Grid Alignment */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: FAQ Accordion (6 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="lg:col-span-6 space-y-5 flex flex-col justify-between"
          >
            <div className="space-y-1.5">
              <span className="text-[#da8a24] font-medium text-xs sm:text-sm uppercase tracking-widest block">
                Frequently Asked Questions
              </span>
              <h2 className="text-xl xs:text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                Clear Answers to Your Questions
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm font-normal leading-relaxed">
                Everything you need to know about our meal drives, centers, and payment safety.
              </p>
            </div>

            {/* Accordion List */}
            <div className="space-y-2.5">
              {FAQS.map((faq, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <div
                    key={idx}
                    className="border border-[#163863]/80 rounded-xl overflow-hidden transition duration-200 bg-[#071b34] shadow-2xs"
                  >
                    <button
                      onClick={() => toggleFAQ(idx)}
                      className="w-full text-left p-3.5 sm:p-4 flex items-center justify-between gap-2.5 font-semibold text-white text-xs sm:text-sm hover:text-[#da8a24] transition cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-[#163863] text-[#da8a24] text-[10px] sm:text-xs flex items-center justify-center font-semibold shrink-0">
                          Q{idx + 1}
                        </span>
                        <span className="leading-snug">{faq.question}</span>
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-[#da8a24] shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-[#163863]/60 bg-[#0a2240]/60 font-normal">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Right Column: Side Donation Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            className="lg:col-span-6 bg-[#071b34] p-6 sm:p-7 rounded-3xl border border-[#163863] flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="border-b border-[#163863] pb-3.5">
                <span className="text-[#da8a24] font-medium text-xs uppercase tracking-widest block">
                  Make an Impact Today
                </span>
                <h3 className="text-lg sm:text-xl font-semibold text-white mt-1.5">
                  Support Child Nutrition & Shelter
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm mt-1 leading-relaxed font-normal">
                  Your donation directly provides warm, nutritious daily meals to children in need.
                </p>
              </div>

              {/* Preset Amount Grid */}
              <div className="grid grid-cols-3 gap-2.5 pt-1">
                {[100, 500, 1000, 2500, 5000].map((amt) => {
                  const isSelected = !isCustom && selectedAmt === amt;
                  return (
                    <button
                      key={amt}
                      onClick={() => {
                        setSelectedAmt(amt);
                        setIsCustom(false);
                      }}
                      className={`py-3 px-2 rounded-xl font-semibold text-center text-xs sm:text-sm transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#da8a24] text-[#0a2240] shadow-md'
                          : 'bg-white text-slate-800 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      <span>₹{amt.toLocaleString()}</span>
                    </button>
                  );
                })}

                <button
                  onClick={() => setIsCustom(true)}
                  className={`py-3 px-2 rounded-xl font-semibold text-center text-xs sm:text-sm transition-all cursor-pointer ${
                    isCustom
                      ? 'bg-[#da8a24] text-[#0a2240] shadow-md'
                      : 'bg-white text-slate-800 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span>Custom</span>
                </button>
              </div>

              {isCustom && (
                <div className="relative pt-1">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-medium text-slate-400 text-xs sm:text-sm">₹</span>
                  <input
                    type="number"
                    value={customVal}
                    onChange={(e) => setCustomVal(e.target.value)}
                    placeholder="Enter amount (e.g. 1500)"
                    className="w-full pl-8 pr-3 py-2.5 bg-white border border-[#da8a24] rounded-xl text-xs sm:text-sm font-medium text-[#0a2240] focus:outline-none"
                  />
                </div>
              )}
            </div>

            <div className="space-y-4 pt-2">
              <button
                onClick={() => {
                  pixelTracker.trackDonateClick(activeAmt, 'FAQ Side Donation Card');
                  if (onOpenDonateModal) onOpenDonateModal(activeAmt);
                }}
                className="w-full py-4 bg-[#da8a24] hover:bg-[#c77a1e] text-[#0a2240] font-semibold text-sm sm:text-base rounded-xl shadow-lg flex items-center justify-center gap-2 transition cursor-pointer active:scale-98 uppercase tracking-wider"
              >
                <Heart className="w-4.5 h-4.5 fill-[#0a2240] text-[#0a2240] shrink-0" />
                <span>Donate Now</span>
              </button>

              <div className="space-y-2 pt-3 border-t border-[#163863]">
                <div className="flex items-center gap-2.5 text-xs text-slate-300 font-normal">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Instant Tax Exemption Receipt Certificate</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-300 font-normal">
                  <Shield className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Secure Encrypted Razorpay Gateway</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-300 font-normal">
                  <FileText className="w-4 h-4 text-[#da8a24] shrink-0" />
                  <span>Transparent WhatsApp Photo Receipt Updates</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>

        {/* WhatsApp Help Prompt */}
        <div className="mt-12 text-center py-6 border-t border-[#163863] space-y-3">
          <p className="text-xs sm:text-sm font-medium text-slate-300 leading-relaxed">
            Have another question not answered above? Speak directly with our team!
          </p>
          <button
            onClick={handleWhatsApp}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold px-7 py-3.5 rounded-2xl shadow-lg transition cursor-pointer active:scale-95"
          >
            <WhatsAppIcon className="w-4.5 h-4.5 text-white shrink-0" />
            <span>Chat directly on WhatsApp</span>
          </button>
        </div>

      </div>
    </section>
  );
};
