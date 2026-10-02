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
    <section id="why-donate" className="py-12 sm:py-18 bg-[#f8fafc] relative overflow-hidden">
      {/* Ambient background soft glow blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-900/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 space-y-2"
        >
          <span className="text-[#da8a24] font-medium text-xs sm:text-sm uppercase tracking-widest block">
            Make an Impact Today
          </span>
          <h2 className="text-[22px] xs:text-[26px] sm:text-[38px] lg:text-[44px] font-semibold text-[#0a2240] tracking-tight leading-tight">
            Transforming Lives, One Plate at a Time
          </h2>
          <p className="text-sm sm:text-lg lg:text-[18px] text-slate-600 leading-relaxed font-normal">
            Your small contribution creates a massive ripple effect in the life of a child. Here is how your ₹100 turns into health, dignity, and education.
          </p>
        </motion.div>

        {/* Reference Design Centered Minimal Cards Carousel */}
        <div className="relative py-2 sm:py-4">
          <div
            ref={scrollContainerRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="flex gap-4 sm:gap-6 lg:gap-8 overflow-x-auto py-6 px-2 sm:px-8 scrollbar-none snap-x snap-mandatory scroll-smooth items-center justify-start lg:justify-center"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {cards.map((card, idx) => {
              const Icon = card.icon;
              const isActive = activeIndex === idx;

              return (
                <motion.div
                  key={idx}
                  onClick={() => scrollToCard(idx)}
                  initial={{ opacity: 0, y: 35, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{ duration: 0.5, delay: idx * 0.12 }}
                  className={`w-[85vw] max-w-[310px] sm:w-[330px] lg:w-[360px] shrink-0 snap-center p-4 sm:p-6 transition-all duration-300 transform-gpu cursor-pointer flex flex-col items-center text-center relative group ${
                    isActive
                      ? 'scale-100 sm:scale-105 z-20 opacity-100'
                      : 'scale-95 opacity-80 z-10'
                  }`}
                >
                  {/* Top Centered Circular Icon Badge */}
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mb-5 sm:mb-6 transition-all duration-300 shrink-0 ${
                    isActive 
                      ? 'bg-[#da8a24] text-[#0a2240] scale-110 shadow-lg shadow-[#da8a24]/30' 
                      : 'bg-[#0a2240] text-[#da8a24] group-hover:bg-[#da8a24] group-hover:text-[#0a2240] shadow-md'
                  }`}>
                    <Icon className="w-7 h-7 sm:w-9 sm:h-9" />
                  </div>

                  {/* Card Title Centered */}
                  <h3 className="text-xl sm:text-2xl font-semibold text-[#0a2240] mb-3 tracking-tight">
                    {card.title}
                  </h3>

                  {/* Card Description Centered */}
                  <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-normal text-center">
                    {card.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Pagination Indicators */}
          <div className="flex items-center justify-center pt-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-md rounded-full border border-slate-200/80 shadow-xs">
              {cards.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollToCard(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    activeIndex === i ? 'w-8 bg-[#da8a24] shadow-xs' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
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
