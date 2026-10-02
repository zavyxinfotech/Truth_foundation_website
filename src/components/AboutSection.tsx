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

  // Automatic 3D horizontal step-scroll timer
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
    <section id="about" className="py-12 sm:py-20 bg-[#0a2240] text-white relative overflow-hidden">
      {/* Background Soft Ambient Glows matching TrustSection */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Section Header & Narrative */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="max-w-3xl space-y-3 mb-8 sm:mb-12"
        >
          <span className="text-[#da8a24] font-medium text-xs sm:text-sm uppercase tracking-widest block">
            About Truth Foundation
          </span>
          <h2 className="text-[20px] xs:text-[24px] sm:text-[36px] lg:text-[44px] font-semibold text-white tracking-tight leading-tight">
            <span className="text-[#da8a24]">TRUTH FOUNDATION</span> (Public Charitable Trust)
          </h2>

          <p className="text-sm sm:text-lg lg:text-[18px] text-slate-300 leading-relaxed font-normal">
            Launched on <strong className="text-white font-medium">5th July 2010</strong>, Truth Foundation empowers marginalized rural communities through education, skills development, and advocacy for social justice, equality, and dignity.
          </p>
        </motion.div>

        {/* Responsive 4-Card Showcase: Grid on Desktop (0 cropping), Auto-Scroll Carousel on Mobile */}
        <div className="relative py-2">
          <div
            ref={scrollContainerRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="flex lg:grid lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-5 overflow-x-auto lg:overflow-x-visible py-6 px-1 sm:px-2 scrollbar-none snap-x snap-mandatory scroll-smooth items-stretch justify-start w-full [perspective:1000px]"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {FEATURES.map((feature, idx) => {
              const isActive = activeIndex === idx;
              return (
                <motion.div
                  key={idx}
                  onClick={() => scrollToCard(idx)}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className={`w-[82vw] max-w-[280px] sm:w-[310px] lg:w-full lg:max-w-none shrink-0 lg:shrink snap-center rounded-3xl p-6 sm:p-7 bg-[#071b34] backdrop-blur-md border transition-all duration-500 transform-gpu cursor-pointer space-y-4 flex flex-col justify-between group ${
                    isActive
                      ? 'scale-105 lg:scale-[1.02] border-[#da8a24] shadow-2xl z-20 ring-4 ring-[#da8a24]/20 [transform:rotateY(0deg)_translateZ(20px)]'
                      : 'border-[#163863]/80 opacity-100 hover:border-[#da8a24]/90 z-10 [transform:rotateY(0deg)] lg:hover:scale-[1.02]'
                  }`}
                >
                  <div className="space-y-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md transition-all duration-300 ${
                      isActive ? 'bg-[#da8a24] text-[#0a2240] scale-110' : 'bg-[#0a2240] border border-[#163863] text-[#da8a24]'
                    }`}>
                      <feature.icon className="w-6 h-6" />
                    </div>

                    <h3 className="font-semibold text-white text-lg sm:text-xl lg:text-2xl tracking-tight group-hover:text-[#da8a24] transition-colors leading-snug">
                      {feature.title}
                    </h3>

                    <p className="text-sm sm:text-base text-slate-200 group-hover:text-white leading-relaxed font-normal">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Pagination Indicators on Mobile */}
          <div className="flex lg:hidden items-center justify-center pt-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#071b34] backdrop-blur-md rounded-full border border-[#163863]">
              {FEATURES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollToCard(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    activeIndex === i ? 'w-8 bg-[#da8a24] shadow-xs' : 'w-2.5 bg-slate-600 hover:bg-slate-500'
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
