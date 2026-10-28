import React from 'react';
import { HeartHandshake, GraduationCap, Award, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { AnimatedCounter } from './AnimatedCounter';

const COUNTABLE_STATS = [
  {
    icon: Award,
    value: 15,
    suffix: '+',
    label: 'Years of Dedicated Service',
    description: 'Serving underprivileged rural communities with trust, dignity, and care since 5th July 2010.',
  },
  {
    icon: Users,
    value: 41,
    suffix: '',
    label: 'Orphaned Children Supported',
    description: 'Providing loving shelter, nutrition, healthcare, and education to 41 boys & girls at Redhills Home.',
  },
  {
    icon: HeartHandshake,
    value: 3,
    suffix: '',
    label: 'Elderly People Cared For',
    description: 'Offering food, medical care, shelter, and companionship to 3 abandoned street elderly seniors.',
  },
  {
    icon: GraduationCap,
    value: 346,
    suffix: '+',
    label: 'Rural Students Educated',
    description: 'Free evening tuition, school bags, textbooks, and nutrition across 8 rural learning centers.',
  },
];

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-8 sm:py-12 bg-[#0a2240] text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="max-w-4xl space-y-2 mb-8 sm:mb-10 text-left"
        >
          <span className="text-[#da8a24] font-medium text-xs sm:text-sm uppercase tracking-widest block">
            About Truth Foundation
          </span>
          <h2 className="text-[18px] xs:text-[22px] sm:text-[30px] md:text-[36px] lg:text-[40px] font-semibold tracking-tight leading-tight whitespace-normal md:whitespace-nowrap">
            <span className="text-white">TRUTH FOUNDATION</span> <span className="text-[#da8a24]">(Public Charitable Trust)</span>
          </h2>

          <p className="text-xs sm:text-base lg:text-[16px] text-slate-300 leading-relaxed font-normal">
            Launched on <strong className="text-white font-medium">5th July 2010</strong>, Truth Foundation empowers marginalized rural communities through education, skills development, and advocacy for social justice, equality, and dignity.
          </p>
        </motion.div>

        {/* Countable Contents Grid (No Card Borders, No Shadows, Clean Typography) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 pt-2 pb-4">
          {COUNTABLE_STATS.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: 'easeOut' }}
                className="flex flex-col items-start space-y-2.5 p-0 bg-transparent border-0 shadow-none text-left"
              >
                {/* Icon Badge */}
                <div className="w-12 h-12 rounded-xl bg-[#da8a24]/10 text-[#da8a24] flex items-center justify-center shrink-0 border-0 shadow-none">
                  <Icon className="w-6 h-6 text-[#da8a24]" />
                </div>

                {/* Big Countable Number */}
                <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#da8a24] tracking-tight">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} repeatOnScroll={true} />
                </div>

                {/* Stat Title */}
                <h3 className="font-semibold text-white text-base sm:text-lg tracking-tight leading-snug">
                  {stat.label}
                </h3>

                {/* Stat Description */}
                <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
                  {stat.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
