import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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

  // 4 balanced FAQ questions that seamlessly harmonize with the donation card height
  const displayedFaqs = FAQS.slice(0, 4);

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
        
        {/* items-start decouples column heights completely so opening/closing FAQ never shifts or stretches the donation card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: FAQ Accordion (6 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="lg:col-span-6 flex flex-col gap-4"
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

            {/* Accordion List (Balanced spacing, zero dead space) */}
            <div className="flex flex-col gap-2.5">
              {displayedFaqs.map((faq, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <div
                    key={idx}
                    className="border border-[#163863]/80 rounded-xl overflow-hidden transition-colors duration-200 bg-[#071b34]"
                  >
                    <button
                      type="button"
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

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="answer"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 pt-1 text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-[#163863]/60 bg-[#0a2240]/60 font-normal">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Right Column: Side Donation Card (Self-contained compact height, zero dead space, bold prominent amounts) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            className="lg:col-span-6 bg-[#071b34] p-5 sm:p-6 rounded-3xl border border-[#163863] flex flex-col gap-4 self-start"
          >
            <div className="border-b border-[#163863] pb-3 space-y-1">
              <span className="text-[#da8a24] font-medium text-xs uppercase tracking-widest block">
                Make an Impact Today
              </span>
              <h3 className="text-base sm:text-lg font-semibold text-white tracking-tight">
                Support Child Nutrition & Shelter
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
                Your donation directly provides warm, nutritious daily meals to children in need.
              </p>
            </div>

            {/* Preset Amount Grid: Prominent Bold Typography & Seamless Responsive Layout */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {donationOptions.map((opt, i) => {
                const isSelected = !isCustom && selectedAmt === opt.value;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setSelectedAmt(opt.value);
                      setIsCustom(false);
                    }}
                    className={`py-3 px-2 sm:px-3 rounded-xl text-center transition-all cursor-pointer flex items-center justify-center ${
                      isSelected
                        ? 'bg-[#da8a24] text-white font-bold shadow-md ring-2 ring-[#da8a24]/40'
                        : 'bg-white text-[#0a2240] hover:bg-slate-100 hover:text-black border border-slate-200'
                    }`}
                  >
                    <span className="text-sm sm:text-base font-bold tracking-tight">{opt.label}</span>
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => setIsCustom(true)}
                className={`py-3 px-2 sm:px-3 rounded-xl text-center transition-all cursor-pointer flex items-center justify-center col-span-1 sm:col-span-2 ${
                  isCustom
                    ? 'bg-[#da8a24] text-white font-bold shadow-md ring-2 ring-[#da8a24]/40'
                    : 'bg-white text-[#0a2240] hover:bg-slate-100 hover:text-black border border-slate-200'
                }`}
              >
                <span className="text-sm sm:text-base font-bold tracking-tight">Custom Amount</span>
              </button>
            </div>

            {isCustom && (
              <div className="relative pt-0.5">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">₹</span>
                <input
                  type="number"
                  value={customVal}
                  onChange={(e) => setCustomVal(e.target.value)}
                  placeholder="Enter custom amount (e.g. 1500)"
                  className="w-full pl-8 pr-3 py-2.5 bg-white border border-[#da8a24] rounded-xl text-sm font-semibold text-[#0a2240] focus:outline-none ring-2 ring-[#da8a24]/20"
                  autoFocus
                />
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                pixelTracker.trackDonateClick(activeAmt, 'FAQ Side Donation Card');
                if (onOpenDonateModal) onOpenDonateModal(activeAmt);
              }}
              className="w-full py-3.5 bg-[#da8a24] hover:bg-[#c77a1e] text-white font-bold text-sm sm:text-base rounded-xl shadow-md flex items-center justify-center gap-2 transition cursor-pointer active:scale-98 uppercase tracking-wider"
            >
              <Heart className="w-4.5 h-4.5 fill-white text-white shrink-0" />
              <span>Donate Now</span>
            </button>
          </motion.div>

        </div>

        {/* WhatsApp Help Prompt */}
        <div className="mt-8 text-center py-4 border-t border-[#163863] space-y-2">
          <p className="text-xs sm:text-sm font-normal text-slate-300 leading-relaxed">
            Have another question not answered above? Speak directly with our team!
          </p>
          <button
            type="button"
            onClick={handleWhatsApp}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-xl shadow-md transition cursor-pointer active:scale-95"
          >
            <WhatsAppIcon className="w-4 h-4 text-white shrink-0" />
            <span>Chat directly on WhatsApp</span>
          </button>
        </div>

      </div>
    </section>
  );
};


