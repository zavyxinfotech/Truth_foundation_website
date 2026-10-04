import React from 'react';
import { motion } from 'motion/react';
import { Heart, Utensils, GraduationCap, Stethoscope, Shirt } from 'lucide-react';
import { pixelTracker } from '../utils/pixelTracker';

import sponsorBreakfastImg from '../images/veg_beakfast.png?w=600&format=webp';
import sponsorLunchImg from '../images/lunch_high_rate.png?w=600&format=webp';
import sponsorDinnerImg from '../images/veg_dinner.png?w=600&format=webp';
import sponsorEducationImg from '../images/education_support.png?w=600&format=webp';
import sponsorHealthcareImg from '../images/medical_support.png?w=600&format=webp';
import sponsorClothingImg from '../images/clothing_support.png?w=600&format=webp';

export const SPONSOR_CAUSES = [
  {
    id: 'cause-breakfast',
    title: 'Breakfast Support',
    amount: 300,
    amountLabel: '₹300',
    image: sponsorBreakfastImg,
    icon: Utensils,
    description: 'Provide wholesome morning breakfast meals to orphaned children and elders to start their day with energy.'
  },
  {
    id: 'cause-lunch',
    title: 'Hot Lunch & Meals',
    amount: 500,
    amountLabel: '₹500',
    image: sponsorLunchImg,
    icon: Utensils,
    description: 'Sponsor protein-rich hot lunches for 45 orphanage kids and 20 abandoned seniors at our Redhills campus.'
  },
  {
    id: 'cause-dinner',
    title: 'Wholesome Dinner',
    amount: 1000,
    amountLabel: '₹1,000',
    image: sponsorDinnerImg,
    icon: Utensils,
    description: 'Provide freshly cooked warm dinner meals for resident children and evening tuition students.'
  },
  {
    id: 'cause-education',
    title: 'Education & Tuition Support',
    amount: 2500,
    amountLabel: '₹2,500',
    image: sponsorEducationImg,
    icon: GraduationCap,
    description: 'Sponsor school backpacks, textbooks, notebooks, and learning tools for 346 evening tuition children.'
  },
  {
    id: 'cause-healthcare',
    title: 'Healthcare & Medical Support',
    amount: 1500,
    amountLabel: '₹1,500',
    image: sponsorHealthcareImg,
    icon: Stethoscope,
    description: 'Support periodic medical checkups, essential prescription drugs, and health drives for elders & kids.'
  },
  {
    id: 'cause-clothing',
    title: 'Clothing & Hygiene Kits',
    amount: 1000,
    amountLabel: '₹1,000',
    image: sponsorClothingImg,
    icon: Shirt,
    description: 'Provide new clothing, footwear, soaps, shampoos, and personal hygiene supplies for resident children.'
  }
];

interface SponsorCauseSectionProps {
  onOpenDonateModal: (amount?: number) => void;
}

export const SponsorCauseSection: React.FC<SponsorCauseSectionProps> = ({ onOpenDonateModal }) => {
  return (
    <section className="py-10 sm:py-16 bg-[#f8fafc] text-slate-900 relative overflow-hidden">
      
      {/* Top-Left Botanical Leaf Accent */}
      <svg className="absolute top-0 left-0 w-24 sm:w-36 lg:w-44 h-auto text-[#da8a24]/20 pointer-events-none z-0" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 150Q40 100 130 30" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        <path d="M130 30Q100 20 80 40Q110 50 130 30Z" fill="currentColor"/>
        <path d="M100 55Q75 40 55 60Q85 70 100 55Z" fill="currentColor"/>
        <path d="M70 80Q45 65 25 85Q55 95 70 80Z" fill="currentColor"/>
        <path d="M40 105Q20 95 5 110Q30 120 40 105Z" fill="currentColor"/>
        <path d="M115 42Q125 75 100 90Q105 60 115 42Z" fill="currentColor"/>
        <path d="M85 68Q95 100 70 115Q75 85 85 68Z" fill="currentColor"/>
      </svg>

      {/* Top-Right Botanical Leaf Accent */}
      <svg className="absolute top-0 right-0 w-24 sm:w-36 lg:w-44 h-auto text-[#da8a24]/20 pointer-events-none z-0 transform -scale-x-100" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 150Q40 100 130 30" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        <path d="M130 30Q100 20 80 40Q110 50 130 30Z" fill="currentColor"/>
        <path d="M100 55Q75 40 55 60Q85 70 100 55Z" fill="currentColor"/>
        <path d="M70 80Q45 65 25 85Q55 95 70 80Z" fill="currentColor"/>
        <path d="M40 105Q20 95 5 110Q30 120 40 105Z" fill="currentColor"/>
        <path d="M115 42Q125 75 100 90Q105 60 115 42Z" fill="currentColor"/>
        <path d="M85 68Q95 100 70 115Q75 85 85 68Z" fill="currentColor"/>
      </svg>

      <div className="max-w-[1320px] mx-auto px-4 sm:px-8 lg:px-12 space-y-8 sm:space-y-10 relative z-10">
        
        {/* Header: Left Aligned */}
        <div className="text-left max-w-3xl space-y-2">
          <span className="text-[#da8a24] font-medium text-xs sm:text-sm uppercase tracking-widest block">
            SPONSOR A CAUSE
          </span>
          <h2 className="text-[22px] xs:text-[26px] sm:text-[38px] lg:text-[44px] font-semibold text-[#0a2240] tracking-tight leading-tight">
            Make a Direct Impact
          </h2>
          <p className="text-sm sm:text-lg lg:text-[18px] text-slate-600 font-normal leading-relaxed">
            Your support helps us provide nutrition, education, healthcare, and care for children, elderly, and special-needs individuals.
          </p>
        </div>

        {/* Desktop Display: 6 Cause Items Grid with Round Frames & Increased Donate Button Size */}
        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5 lg:gap-6">
          {SPONSOR_CAUSES.map((cause) => (
            <motion.div
              key={cause.id}
              whileHover={{ y: -6 }}
              onClick={() => {
                pixelTracker.trackDonateClick(cause.amount, `Sponsor Cause - ${cause.title}`);
                onOpenDonateModal(cause.amount);
              }}
              className="bg-transparent border-0 shadow-none rounded-[24px] p-3 transition-all duration-300 flex flex-col justify-between cursor-pointer group text-center"
            >
              <div>
                {/* Circular / Round Frame for the Image */}
                <div className="relative w-36 h-36 sm:w-40 sm:h-40 mx-auto rounded-full overflow-hidden p-1.5 bg-gradient-to-b from-[#da8a24]/30 via-white to-[#0a2240]/10 border-2 border-[#da8a24]/50 shadow-md ring-4 ring-[#da8a24]/10 shrink-0">
                  <img
                    src={cause.image}
                    alt={cause.title}
                    className="w-full h-full object-cover object-center rounded-full transform transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-1 right-1 bg-[#0a2240] text-[#da8a24] font-medium text-[11px] sm:text-xs px-2.5 py-0.5 rounded-full border border-[#da8a24]/40 shadow-sm">
                    {cause.amountLabel}
                  </div>
                </div>

                {/* Title Below Image: Non-bold Font */}
                <div className="pt-3.5 pb-2 px-1 flex flex-col items-center text-center">
                  <h3 className="font-medium text-[#0a2240] text-base lg:text-lg leading-snug group-hover:text-[#da8a24] transition-colors">
                    {cause.title}
                  </h3>
                </div>
              </div>

              {/* Increased Size Donate Button */}
              <div className="pt-2">
                <span className="inline-flex items-center justify-center gap-1.5 w-full bg-[#da8a24] hover:bg-[#c77a1e] text-[#0a2240] font-medium text-xs sm:text-sm py-2.5 px-3.5 rounded-full shadow-md transition-colors uppercase tracking-wider min-h-[40px]">
                  <Heart className="w-4 h-4 fill-[#0a2240]" />
                  <span>Donate ({cause.amountLabel})</span>
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Display: Smooth Horizontal Auto-Scrolling Track with Round Frames */}
        <div className="md:hidden overflow-hidden relative w-full -mx-4 px-4 py-1">
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ repeat: Infinity, duration: 16, ease: 'linear' }}
            className="flex gap-4 w-max"
          >
            {[...SPONSOR_CAUSES, ...SPONSOR_CAUSES].map((cause, idx) => (
              <div
                key={`${cause.id}-${idx}`}
                onClick={() => {
                  pixelTracker.trackDonateClick(cause.amount, `Sponsor Cause - ${cause.title}`);
                  onOpenDonateModal(cause.amount);
                }}
                className="w-[210px] shrink-0 bg-transparent border-0 shadow-none rounded-[22px] p-2.5 transition-all duration-300 flex flex-col justify-between cursor-pointer group text-center"
              >
                <div>
                  {/* Round Frame for Mobile */}
                  <div className="relative w-36 h-36 mx-auto rounded-full overflow-hidden p-1.5 bg-gradient-to-b from-[#da8a24]/30 via-white to-[#0a2240]/10 border-2 border-[#da8a24]/50 shadow-md ring-4 ring-[#da8a24]/10 shrink-0">
                    <img
                      src={cause.image}
                      alt={cause.title}
                      className="w-full h-full object-cover object-center rounded-full"
                    />
                    <div className="absolute top-1 right-1 bg-[#0a2240] text-[#da8a24] font-medium text-[10px] px-2 py-0.5 rounded-full border border-[#da8a24]/40 shadow-sm">
                      {cause.amountLabel}
                    </div>
                  </div>

                  {/* Title Below Image: Non-bold Font */}
                  <div className="pt-3 pb-1 px-1 flex flex-col items-center text-center">
                    <h3 className="font-medium text-[#0a2240] text-sm leading-snug group-hover:text-[#da8a24] transition-colors">
                      {cause.title}
                    </h3>
                  </div>
                </div>

                {/* Increased Size Donate Button */}
                <div className="pt-2">
                  <span className="inline-flex items-center justify-center gap-1.5 w-full bg-[#da8a24] hover:bg-[#c77a1e] text-[#0a2240] font-medium text-xs py-2.5 px-3 rounded-full shadow-md transition-colors uppercase tracking-wider min-h-[38px]">
                    <Heart className="w-3.5 h-3.5 fill-[#0a2240]" />
                    <span>Donate ({cause.amountLabel})</span>
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
};
