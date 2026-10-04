import React, { useState, useRef, useEffect } from 'react';
import { UtensilsCrossed, HeartHandshake, GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';

interface WhyDonateProps {
  onOpenDonateModal: (amount?: number) => void;
}

export const WhyDonate: React.FC<WhyDonateProps> = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(1);

  const cards = [
    {
      icon: HeartHandshake,
      title: 'Orphanage & Elderly Care',
      description: 'Sustaining our Redhills campus providing separate dormitories, food, healthcare, and dignity for 45 orphaned children and 20 abandoned senior citizens.',
    },
    {
      icon: UtensilsCrossed,
      title: 'Educational Care & Transport',
      description: 'Funding learning resources, educational kits, and free van transportation for rural children in Thiruvallur.',
    },
    {
      icon: GraduationCap,
      title: '346 Tuition & Hygiene Kits',
      description: 'Providing free evening tuition, warm meals, school bags, textbooks, notebooks, pens, soap, shampoo, and footwear for 346 kids in Chennai & Thiruvallur.',
    }
  ];

  const [isPaused, setIsPaused] = useState(false);

  // Scroll to selected card within container without scrolling window
  const scrollToCard = (index: number, smooth = true) => {
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
        behavior: smooth ? 'smooth' : 'auto'
      });
    }
  };

  // Automatic 3D step-scroll timer: advances card one by one every 3.0s
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => {
        const nextIdx = (prev + 1) % cards.length;
        scrollToCard(nextIdx);
        return nextIdx;
      });
    }, 3000);

    return () => clearInterval(timer);
  }, [isPaused, cards.length]);

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToCard(1, false);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="why-donate" className="py-4 sm:py-6 bg-[#f8fafc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header: Aligned in a Single Line on Desktop */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-center max-w-4xl mx-auto mb-3 sm:mb-4 space-y-1"
        >
          <span className="text-[#da8a24] font-medium text-xs sm:text-sm uppercase tracking-widest block">
            Make an Impact Today
          </span>
          <h2 className="text-[20px] xs:text-[24px] sm:text-[32px] md:text-[38px] lg:text-[40px] font-semibold text-[#0a2240] tracking-tight leading-tight whitespace-normal md:whitespace-nowrap">
            Transforming Lives, One Plate at a Time
          </h2>
          <p className="text-xs sm:text-base lg:text-[16px] text-slate-600 leading-relaxed font-normal">
            Your small contribution creates a massive ripple effect in the life of a child. Here is how your ₹100 turns into health, dignity, and education.
          </p>
        </motion.div>

        {/* Minimal Cards Carousel with Thin Border and No Gradient */}
        <div className="relative py-1">
          <div
            ref={scrollContainerRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="flex gap-4 sm:gap-6 lg:gap-8 overflow-x-auto py-2 px-2 sm:px-6 scrollbar-none snap-x snap-mandatory scroll-smooth items-center justify-start lg:justify-center"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {cards.map((card, idx) => {
              const Icon = card.icon;
              const isActive = activeIndex === idx;

              return (
                <motion.div
                  key={idx}
                  onClick={() => scrollToCard(idx)}
                  initial={{ opacity: 0, y: 25, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className={`w-[85vw] max-w-[310px] sm:w-[330px] lg:w-[360px] shrink-0 snap-center p-4 sm:p-5 transition-all duration-300 transform-gpu cursor-pointer flex flex-col items-center text-center relative group rounded-2xl border ${
                    isActive
                      ? 'scale-100 sm:scale-105 z-20 opacity-100 border-[#da8a24]/60 bg-white'
                      : 'scale-95 opacity-80 z-10 border-slate-200/80 bg-white/70 hover:border-slate-300'
                  }`}
                >
                  {/* Top Centered Circular Icon Badge */}
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300 shrink-0 ${
                    isActive 
                      ? 'bg-[#da8a24] text-[#0a2240] scale-105' 
                      : 'bg-[#0a2240] text-[#da8a24] group-hover:bg-[#da8a24] group-hover:text-[#0a2240]'
                  }`}>
                    <Icon className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>

                  {/* Card Title Centered: Non-bold Font */}
                  <h3 className="text-lg sm:text-xl font-normal text-[#0a2240] mb-2 tracking-tight">
                    {card.title}
                  </h3>

                  {/* Card Description Centered: Non-bold Font */}
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal text-center">
                    {card.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Pagination Indicators */}
          <div className="flex items-center justify-center pt-3">
            <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-slate-200/80">
              {cards.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollToCard(i)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    activeIndex === i ? 'w-6 bg-[#da8a24]' : 'w-2 bg-slate-300 hover:bg-slate-400'
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
