import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, ChevronUp, Heart } from 'lucide-react';
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

  // Keep only 3 FAQ questions
  const displayedFaqs = FAQS.slice(0, 3);

  const toggleFAQ = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const activeAmt = isCustom ? (parseInt(customVal, 10) || 500) : selectedAmt;

  const handleWhatsApp = () => {
    pixelTracker.trackWhatsAppClick('FAQ Section');
    const msg = encodeURIComponent(`Hello Truth Foundation! I have a question regarding donations/tax receipts that wasn't answered on the FAQ section.`);
    window.open(`https://wa.me/919962294949?text=${msg}`, '_blank');
  };

  const donationOptions = [
    { label: '₹100', value: 100 },
    { label: '₹500', value: 500 },
    { label: '₹1,000', value: 1000 },
    { label: '₹2,500', value: 2500 },
    { label: '₹5,000', value: 5000 },
    { label: 'Breakfast – ₹6,000', value: 6000 },
    { label: 'Lunch – ₹8,000', value: 8000 },
    { label: 'Dinner – ₹6,000', value: 6000 }
  ];

  return (
    <section id="faq" className="py-8 sm:py-12 bg-[#0a2240] text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Equal 6-col / 6-col Desktop Grid Alignment */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: FAQ Accordion (6 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="lg:col-span-6 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-1">
              <span className="text-[#da8a24] font-medium text-xs sm:text-sm uppercase tracking-widest block">
                Frequently Asked Questions
              </span>
              <h2 className="text-xl xs:text-2xl sm:text-3xl font-medium text-white tracking-tight">
                Clear Answers to Your Questions
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm font-normal leading-relaxed">
                Everything you need to know about our meal drives, centers, and payment safety.
              </p>
            </div>

            {/* Accordion List (3 Questions, Non-bold font) */}
            <div className="space-y-2.5">
              {displayedFaqs.map((faq, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <div
                    key={idx}
                    className="border border-[#163863]/80 rounded-xl overflow-hidden transition duration-200 bg-[#071b34]"
                  >
                    <button
                      onClick={() => toggleFAQ(idx)}
                      className="w-full text-left p-3.5 sm:p-4 flex items-center justify-between gap-2.5 font-normal text-white text-xs sm:text-sm hover:text-[#da8a24] transition cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-[#163863] text-[#da8a24] text-[10px] sm:text-xs flex items-center justify-center font-normal shrink-0">
                          Q{idx + 1}
                        </span>
                        <span className="leading-snug font-normal">{faq.question}</span>
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
            className="lg:col-span-6 bg-[#071b34] p-5 sm:p-6 rounded-3xl border border-[#163863] flex flex-col justify-between space-y-5"
          >
            <div className="space-y-3.5">
              <div className="border-b border-[#163863] pb-3">
                <span className="text-[#da8a24] font-medium text-xs uppercase tracking-widest block">
                  Make an Impact Today
                </span>
                <h3 className="text-base sm:text-lg font-normal text-white mt-1">
                  Support Child Nutrition & Shelter
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm mt-0.5 leading-relaxed font-normal">
                  Your donation directly provides warm, nutritious daily meals to children in need.
                </p>
              </div>

              {/* Preset Amount Grid including Breakfast, Lunch, Dinner options */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                {donationOptions.map((opt, i) => {
                  const isSelected = !isCustom && selectedAmt === opt.value;
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        setSelectedAmt(opt.value);
                        setIsCustom(false);
                      }}
                      className={`py-2.5 px-2 rounded-xl font-normal text-center text-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#da8a24] text-[#0a2240] font-medium shadow-md'
                          : 'bg-white text-slate-800 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      <span>{opt.label}</span>
                    </button>
                  );
                })}

                <button
                  onClick={() => setIsCustom(true)}
                  className={`py-2.5 px-2 rounded-xl font-normal text-center text-xs transition-all cursor-pointer ${
                    isCustom
                      ? 'bg-[#da8a24] text-[#0a2240] font-medium shadow-md'
                      : 'bg-white text-slate-800 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span>Custom</span>
                </button>
              </div>

              {isCustom && (
                <div className="relative pt-1">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-normal text-slate-400 text-xs sm:text-sm">₹</span>
                  <input
                    type="number"
                    value={customVal}
                    onChange={(e) => setCustomVal(e.target.value)}
                    placeholder="Enter amount (e.g. 1500)"
                    className="w-full pl-8 pr-3 py-2.5 bg-white border border-[#da8a24] rounded-xl text-xs sm:text-sm font-normal text-[#0a2240] focus:outline-none"
                  />
                </div>
              )}
            </div>

            <div className="pt-1">
              <button
                onClick={() => {
                  pixelTracker.trackDonateClick(activeAmt, 'FAQ Side Donation Card');
                  if (onOpenDonateModal) onOpenDonateModal(activeAmt);
                }}
                className="w-full py-3.5 bg-[#da8a24] hover:bg-[#c77a1e] text-[#0a2240] font-medium text-xs sm:text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition cursor-pointer active:scale-98 uppercase tracking-wider"
              >
                <Heart className="w-4 h-4 fill-[#0a2240] text-[#0a2240] shrink-0" />
                <span>Donate Now</span>
              </button>
            </div>
          </motion.div>

        </div>

        {/* WhatsApp Help Prompt */}
        <div className="mt-8 text-center py-4 border-t border-[#163863] space-y-2">
          <p className="text-xs sm:text-sm font-normal text-slate-300 leading-relaxed">
            Have another question not answered above? Speak directly with our team!
          </p>
          <button
            onClick={handleWhatsApp}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-normal px-6 py-2.5 rounded-xl shadow-md transition cursor-pointer active:scale-95"
          >
            <WhatsAppIcon className="w-4 h-4 text-white shrink-0" />
            <span>Chat directly on WhatsApp</span>
          </button>
        </div>

      </div>
    </section>
  );
};
