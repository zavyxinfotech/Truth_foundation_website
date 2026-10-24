import React, { useRef, useEffect, useState } from 'react';
import { HeartHandshake, Home, GraduationCap, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

const FEATURES = [
  {
    icon: Home,
    title: 'Redhills Orphanage Home',
    description: 'Campus in rural Redhills Chennai with separate dormitories, study halls, and playgrounds for 45 boys & girls.',
  },
  {
    icon: HeartHandshake,
    title: 'Old Age Day Care Center',
    description: 'Providing food, shelter, regular medicine, and loving care for 20 abandoned street elderly seniors in Redhills.',
  },
  {
    icon: GraduationCap,
    title: 'Rural Education Support',
    description: 'Educational assistance, learning materials, and doorstep transport for rural children across Thiruvallur.',
  },
  {
    icon: BookOpen,
    title: '346 Tuition Students',
    description: 'Free evening tuition across 8 centers in Chennai & Thiruvallur with free food, backpacks, textbooks & hygiene supplies.',
  },
];

export const AboutSection: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const scrollToCard = (index: number) => {
    setActiveIndex(index);
    const container = scrollContainerRef.current;
    if (!container) return;
    const cardElement = container.children[index] as HTMLElement;
    if (cardElement) {
      const cardOffsetLeft = cardElement.offsetLeft;
      const cardWidth = cardElement.offsetWidth;
      const containerWidth = container.offsetWidth;
      const targetScroll = cardOffsetLeft - (containerWidth / 2) + (cardWidth / 2);

      container.scrollTo({
        left: Math.max(0, targetScroll),
        behavior: 'smooth'
      });
    }
  };

  // Automatic horizontal step-scroll timer
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => {
        const nextIdx = (prev + 1) % FEATURES.length;
        scrollToCard(nextIdx);
        return nextIdx;
      });
    }, 3200);

    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <section id="about" className="py-6 sm:py-10 bg-[#0a2240] text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Section Header: Aligned in a Single Line on Desktop */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="max-w-4xl space-y-2 mb-5 sm:mb-8"
        >
          <span className="text-[#da8a24] font-medium text-xs sm:text-sm uppercase tracking-widest block">
            About Truth Foundation
          </span>
          <h2 className="text-[18px] xs:text-[22px] sm:text-[30px] md:text-[36px] lg:text-[40px] font-semibold text-white tracking-tight leading-tight whitespace-normal md:whitespace-nowrap">
            <span className="text-[#da8a24]">TRUTH FOUNDATION</span> (Public Charitable Trust)
          </h2>

          <p className="text-xs sm:text-base lg:text-[16px] text-slate-300 leading-relaxed font-normal">
            Launched on <strong className="text-white font-medium">5th July 2010</strong>, Truth Foundation empowers marginalized rural communities through education, skills development, and advocacy for social justice, equality, and dignity.
          </p>
        </motion.div>

        {/* Responsive 4-Card Showcase: Thin Borders, No Gradients */}
        <div className="relative py-1">
          <div
            ref={scrollContainerRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="flex lg:grid lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-4 overflow-x-auto lg:overflow-x-visible py-3 px-1 sm:px-2 scrollbar-none snap-x snap-mandatory scroll-smooth items-stretch justify-start w-full"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {FEATURES.map((feature, idx) => {
              const isActive = activeIndex === idx;
              return (
                <motion.div
                  key={idx}
                  onClick={() => scrollToCard(idx)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className={`w-[82vw] max-w-[280px] sm:w-[310px] lg:w-full lg:max-w-none shrink-0 lg:shrink snap-center rounded-2xl p-5 sm:p-6 bg-[#071b34] border transition-all duration-300 transform-gpu cursor-pointer space-y-3 flex flex-col justify-between group ${
                    isActive
                      ? 'border-[#da8a24]/80 z-20'
                      : 'border-[#163863]/60 hover:border-[#da8a24]/60 z-10'
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isActive ? 'bg-[#da8a24] text-[#0a2240]' : 'bg-[#0a2240] border border-[#163863] text-[#da8a24]'
                    }`}>
                      <feature.icon className="w-5 h-5" />
                    </div>

                    {/* Card Title: Non-bold Font */}
                    <h3 className="font-normal text-white text-base sm:text-lg lg:text-xl tracking-tight group-hover:text-[#da8a24] transition-colors leading-snug">
                      {feature.title}
                    </h3>

                    {/* Card Description: Non-bold Font */}
                    <p className="text-xs sm:text-sm text-slate-300 group-hover:text-white leading-relaxed font-normal">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Pagination Indicators on Mobile */}
          <div className="flex lg:hidden items-center justify-center pt-3">
            <div className="flex items-center gap-2 px-3 py-1 bg-[#071b34] rounded-full border border-[#163863]">
              {FEATURES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollToCard(i)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    activeIndex === i ? 'w-6 bg-[#da8a24]' : 'w-2 bg-slate-600 hover:bg-slate-500'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
