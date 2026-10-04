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
    <section className="py-6 sm:py-8 bg-[#f8fafc] text-slate-900 relative overflow-hidden">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-8 lg:px-12 space-y-4 sm:space-y-6 relative z-10">
        
        {/* Header: Left Aligned Single Line */}
        <div className="text-left max-w-4xl space-y-1">
          <span className="text-[#da8a24] font-medium text-xs sm:text-sm uppercase tracking-widest block">
            SPONSOR A CAUSE
          </span>
          <h2 className="text-[20px] xs:text-[24px] sm:text-[32px] md:text-[38px] lg:text-[40px] font-semibold text-[#0a2240] tracking-tight leading-tight whitespace-normal md:whitespace-nowrap">
            Make a Direct Impact
          </h2>
          <p className="text-xs sm:text-base lg:text-[16px] text-slate-600 font-normal leading-relaxed">
            Your support helps us provide nutrition, education, healthcare, and care for children, elderly, and special-needs individuals.
          </p>
        </div>

        {/* Desktop Display: 6 Cause Items Grid (Hover shows Donate button) */}
        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-6 gap-2.5 lg:gap-3">
          {SPONSOR_CAUSES.map((cause) => (
            <motion.div
              key={cause.id}
              whileHover={{ y: -4 }}
              onClick={() => {
                pixelTracker.trackDonateClick(cause.amount, `Sponsor Cause - ${cause.title}`);
                onOpenDonateModal(cause.amount);
              }}
              className="bg-transparent border-0 p-0 transition-all duration-300 flex flex-col justify-between cursor-pointer group text-center"
            >
              <div>
                {/* Taller Image Container (No card borders/gradients/shadows) */}
                <div className="relative w-full aspect-[3/4.2] rounded-2xl overflow-hidden bg-slate-100">
                  <img
                    src={cause.image}
                    alt={cause.title}
                    className="w-full h-full object-cover object-center transform transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Glassmorphism Price Header Above Image with Bigger & Bolder Price */}
                  <div className="absolute top-2.5 inset-x-2.5 px-3 py-1.5 rounded-xl bg-[#0a2240]/80 backdrop-blur-md flex items-center justify-between text-left border border-white/10">
                    <span className="text-xs text-slate-300 font-normal">Cause</span>
                    <span className="text-base sm:text-lg font-bold text-[#da8a24] tracking-tight">
                      {cause.amountLabel}
                    </span>
                  </div>

                  {/* Desktop Hover Only: Shows Donate Button */}
                  <div className="absolute bottom-2.5 inset-x-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <span className="inline-flex items-center justify-center gap-1.5 w-full bg-[#da8a24] hover:bg-[#c77a1e] text-[#0a2240] font-semibold text-xs sm:text-sm py-2.5 px-3 rounded-xl uppercase tracking-wider">
                      <Heart className="w-4 h-4 fill-[#0a2240]" />
                      <span>Donate</span>
                    </span>
                  </div>
                </div>

                {/* Title Below Image: Strictly Normal Font (No Bold) */}
                <div className="pt-2.5 pb-1 px-1 flex flex-col items-center text-center">
                  <h3 className="font-normal text-[#0a2240] text-sm sm:text-base leading-snug group-hover:text-[#da8a24] transition-colors">
                    {cause.title}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Display: Smooth Horizontal Track (Click redirects directly to donate modal) */}
        <div className="md:hidden overflow-hidden relative w-full -mx-4 px-4 py-1">
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ repeat: Infinity, duration: 16, ease: 'linear' }}
            className="flex gap-2.5 w-max"
          >
            {[...SPONSOR_CAUSES, ...SPONSOR_CAUSES].map((cause, idx) => (
              <div
                key={`${cause.id}-${idx}`}
                onClick={() => {
                  pixelTracker.trackDonateClick(cause.amount, `Sponsor Cause - ${cause.title}`);
                  onOpenDonateModal(cause.amount);
                }}
                className="w-[190px] shrink-0 bg-transparent border-0 p-0 transition-all duration-300 flex flex-col justify-between cursor-pointer group text-center"
              >
                <div>
                  {/* Taller Image Container with Glassmorphism Overlay */}
                  <div className="relative w-full aspect-[3/4.2] rounded-2xl overflow-hidden bg-slate-100">
                    <img
                      src={cause.image}
                      alt={cause.title}
                      className="w-full h-full object-cover object-center"
                    />
                    
                    {/* Glassmorphism Price Header Above Image */}
                    <div className="absolute top-2 inset-x-2 px-2.5 py-1 rounded-xl bg-[#0a2240]/80 backdrop-blur-md flex items-center justify-between text-left border border-white/10">
                      <span className="text-[10px] text-slate-300 font-normal">Cause</span>
                      <span className="text-sm font-bold text-[#da8a24] tracking-tight">
                        {cause.amountLabel}
                      </span>
                    </div>
                  </div>

                  {/* Title Below Image: Strictly Normal Font */}
                  <div className="pt-2 pb-1 px-1 flex flex-col items-center text-center">
                    <h3 className="font-normal text-[#0a2240] text-xs sm:text-sm leading-snug group-hover:text-[#da8a24] transition-colors">
                      {cause.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
};
