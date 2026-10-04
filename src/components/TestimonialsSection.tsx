import React, { useState, useEffect, useRef } from 'react';
import { Star, Quote, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { TESTIMONIALS } from '../data/campaignData';

export const TestimonialsSection: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [activeCardId, setActiveCardId] = useState<string | number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Quadruple list for continuous infinite horizontal marquee stream
  const displayItems = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS];

  // Continuous auto-scroll moving FROM LEFT TO RIGHT
  useEffect(() => {
    let animationFrameId: number;
    const container = scrollContainerRef.current;
    if (!container) return;

    // Start at middle of container for instant left-to-right continuous flow
    if (container.scrollLeft === 0) {
      container.scrollLeft = container.scrollWidth / 2;
    }

    const step = () => {
      if (!isPaused && container) {
        if (container.scrollLeft <= 0) {
          container.scrollLeft = container.scrollWidth / 2;
        } else {
          container.scrollLeft -= 1.2;
        }
      }
      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused]);

  // Pause on hover / touch
  const handleCardInteract = (id: string | number, element: HTMLDivElement) => {
    setIsPaused(true);
    setActiveCardId(id);
    element.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  };

  const handleCardLeave = () => {
    setIsPaused(false);
    setActiveCardId(null);
  };

  return (
    <section className="py-8 sm:py-14 bg-white relative border-t border-slate-100 overflow-hidden w-full">
      {/* Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-center max-w-3xl mx-auto mb-6 sm:mb-8 space-y-2"
        >
          <span className="text-[#da8a24] font-medium text-xs sm:text-sm uppercase tracking-widest block">
            Stories & Voices
          </span>
          <h2 className="text-[20px] xs:text-[24px] sm:text-3xl lg:text-[36px] font-normal text-blue-950 tracking-tight leading-tight">
            Hear From Our Donors & Volunteers
          </h2>
          <p className="text-slate-600 text-xs sm:text-base font-normal leading-relaxed">
            Read authentic feedback from individuals, teachers, and volunteers who have experienced the impact firsthand.
          </p>
        </motion.div>
      </div>

      {/* Full Width Edge-to-Edge Marquee Stream Moving Left to Right */}
      <div className="w-full overflow-hidden relative z-10 px-0">
        <div
          ref={scrollContainerRef}
          onPointerEnter={(e) => { if (e.pointerType === 'mouse') setIsPaused(true); }}
          onPointerLeave={(e) => {
            if (e.pointerType === 'mouse') {
              setIsPaused(false);
              setActiveCardId(null);
            }
          }}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => {
            setIsPaused(false);
            setActiveCardId(null);
          }}
          className="flex gap-4 sm:gap-6 overflow-x-auto py-4 px-2 sm:px-4 scrollbar-none scroll-smooth w-full"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {displayItems.map((testimonial, idx) => {
            const cardUniqueKey = `${testimonial.id}-${idx}`;
            const isHovered = activeCardId === cardUniqueKey;
            return (
              <div
                key={cardUniqueKey}
                onPointerEnter={(e) => {
                  if (e.pointerType === 'mouse') handleCardInteract(cardUniqueKey, e.currentTarget);
                }}
                onPointerLeave={(e) => {
                  if (e.pointerType === 'mouse') handleCardLeave();
                }}
                className={`w-[260px] xs:w-[295px] sm:w-[340px] md:w-[370px] lg:w-[410px] shrink-0 bg-slate-50/90 backdrop-blur-md border rounded-2xl p-4 xs:p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between relative space-y-3 cursor-pointer transform-gpu ${
                  isHovered
                    ? 'scale-105 -translate-y-1 border-[#da8a24] bg-white z-30'
                    : 'border-slate-200/80 hover:border-[#da8a24]/60 hover:bg-white z-10'
                }`}
              >
                <Quote className={`w-6 h-6 sm:w-8 sm:h-8 absolute top-4 right-4 pointer-events-none transition-colors ${
                  isHovered ? 'text-[#da8a24]/80' : 'text-[#da8a24]/30'
                }`} />

                <div className="space-y-2 pr-4 sm:pr-6">
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#da8a24] text-[#da8a24]" />
                    ))}
                    <span className="text-[10px] sm:text-xs text-slate-400 font-normal ml-1">{testimonial.date}</span>
                  </div>

                  {/* Comment */}
                  <p className="text-slate-700 text-xs sm:text-sm leading-relaxed italic font-normal line-clamp-4">
                    "{testimonial.comment}"
                  </p>
                </div>

                {/* Author Footer */}
                <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      width={96}
                      height={96}
                      loading="lazy"
                      decoding="async"
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-[#da8a24] shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="font-normal text-blue-950 text-xs sm:text-sm flex items-center gap-1">
                        <span>{testimonial.name}</span>
                        {testimonial.verified && (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100 shrink-0" />
                        )}
                      </div>
                      <div className="text-[10px] sm:text-xs text-slate-500 font-normal">
                        {testimonial.role} • {testimonial.location}
                      </div>
                    </div>
                  </div>

                  {testimonial.donatedAmount && (
                    <span className="bg-[#da8a24]/15 text-[#0a2240] text-[10px] sm:text-xs font-normal px-2.5 py-1 rounded-full border border-[#da8a24]/30 shrink-0">
                      Donated {testimonial.donatedAmount}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
};
