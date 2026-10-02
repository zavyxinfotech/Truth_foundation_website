import React from 'react';
import { FileCheck, Users, MessageSquareCode, Lock, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Picture } from './Picture';
import trustSectionOrganicMeal from '../assets/images/trust_section_organic_meal.jpg?w=480;800&format=webp;jpg&as=picture';

export const TrustSection: React.FC = () => {
  const trustPillars = [
    {
      icon: Lock,
      title: 'Secure Payments',
      description: 'Bank-grade encrypted Razorpay gateway supporting instant UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, and NetBanking.'
    },
    {
      icon: FileCheck,
      title: '100% Transparency',
      description: 'Registered Public Charitable Trust under Section 12A of the Income Tax Act with annual statutory audits and full financial clarity.'
    },
    {
      icon: Users,
      title: 'Community Impact',
      description: 'Direct field delivery through certified local volunteers and tuition center educators without intermediary leakages.'
    },
    {
      icon: MessageSquareCode,
      title: 'Donor Updates',
      description: 'Receive instant WhatsApp photo updates, GPS-tagged distribution reports, and official donation receipts within minutes.'
    }
  ];

  return (
    <section id="trust" className="py-12 sm:py-20 bg-[#0a2240] text-white relative overflow-hidden">
      {/* Ambient Soft Glow Blobs */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* 2-Column Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Heading, Subtitle & Pillar Headings */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="lg:col-span-7 space-y-6 sm:space-y-8"
          >
            {/* Section Heading Header */}
            <div className="space-y-2.5">
              <span className="text-[#da8a24] font-medium text-xs sm:text-sm uppercase tracking-widest block">
                Guaranteed Trust & Integrity
              </span>
              <h2 className="text-[26px] xs:text-[30px] sm:text-4xl lg:text-[44px] font-semibold text-white tracking-tight leading-tight">
                Why Donors Trust <br className="hidden sm:inline" />
                <span className="text-[#da8a24]">Truth Foundation</span>
              </h2>
              <p className="text-slate-300 text-sm sm:text-lg lg:text-[18px] font-normal leading-relaxed max-w-2xl">
                We hold ourselves to the highest standards of governance, financial clarity, and operational accountability for every donation received.
              </p>
            </div>

            {/* Pillar List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 pt-2">
              {trustPillars.map((pillar, idx) => {
                const Icon = pillar.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.15 }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    className="flex items-center gap-3.5 group"
                  >
                    <Icon className="w-6 h-6 text-[#da8a24] shrink-0 group-hover:scale-110 transition-transform duration-300" />
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-[#da8a24] transition-colors leading-snug">
                        {pillar.title}
                      </h3>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Compliance Badge Indicator */}
            <div className="pt-2 flex items-center gap-2 text-xs font-medium text-emerald-400">
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
              <span>Public Charitable Trust • Annual Statutory Financial Audits Published</span>
            </div>
          </motion.div>

          {/* Right Column: Organic Blob Photo Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, x: 30 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 relative flex items-center justify-center"
          >
            <div className="absolute inset-0 rounded-[45%_55%_65%_35%/50%_60%_40%_50%] bg-[#da8a24]/20 blur-2xl pointer-events-none transform scale-105" />

            <div className="relative w-full aspect-[4/3] rounded-[45%_55%_65%_35%/50%_60%_40%_50%] overflow-hidden border-4 border-[#da8a24]/60 shadow-2xl shadow-amber-400/10 group transform hover:scale-[1.02] transition-all duration-500 bg-[#071b34]">
              <Picture
                picture={trustSectionOrganicMeal}
                sizes="(min-width: 1024px) 500px, calc(100vw - 2rem)"
                alt="Truth Foundation Volunteer Serving Meals to Children"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a2240]/40 via-transparent to-transparent pointer-events-none" />
            </div>

            <div className="absolute -inset-3 rounded-[45%_55%_65%_35%/50%_60%_40%_50%] border-2 border-emerald-400/30 blur-xs pointer-events-none animate-pulse" />
          </motion.div>

        </div>

      </div>
    </section>
  );
};
