import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Quote,
  Heart,
  MapPin,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GALLERY_ITEMS } from '../data/campaignData';
import { pixelTracker } from '../utils/pixelTracker';
import { Picture } from './Picture';

interface GallerySectionProps {
  onOpenDonateModal?: (amount: number) => void;
}

const TOTAL = GALLERY_ITEMS.length;
const CARD_ROTATE_INTERVAL = 3200; // ms between continuous card advances

export const GallerySection: React.FC<GallerySectionProps> = ({ onOpenDonateModal }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const activeItem = GALLERY_ITEMS[currentIndex];

  const getIdx = useCallback(
    (offset: number) => ((currentIndex + offset) % TOTAL + TOTAL) % TOTAL,
    [currentIndex]
  );

  // Lock body scroll when story modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  // Continuous rotation
  useEffect(() => {
    if (!isRunning || isModalOpen) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setCurrentIndex((p) => (p + 1) % TOTAL);
    }, CARD_ROTATE_INTERVAL);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, isModalOpen]);

  const goNext = () => setCurrentIndex((p) => (p + 1) % TOTAL);
  const goPrev = () => setCurrentIndex((p) => (p - 1 + TOTAL) % TOTAL);

  const positionConfig = [
    {
      xPct: -148, scale: 0.65, opacity: 0.22, zIndex: 0,
      rotateY: 24, blur: 4, brightness: 0.38,
      show: 'hidden lg:flex',
    },
    {
      xPct: -83, scale: 0.80, opacity: 0.60, zIndex: 10,
      rotateY: 14, blur: 1.5, brightness: 0.65,
      show: 'hidden sm:flex',
    },
    {
      xPct: 0, scale: 1, opacity: 1, zIndex: 30,
      rotateY: 0, blur: 0, brightness: 1,
      show: 'flex',
    },
    {
      xPct: 83, scale: 0.80, opacity: 0.60, zIndex: 10,
      rotateY: -14, blur: 1.5, brightness: 0.65,
      show: 'hidden sm:flex',
    },
    {
      xPct: 148, scale: 0.65, opacity: 0.22, zIndex: 0,
      rotateY: -24, blur: 4, brightness: 0.38,
      show: 'hidden lg:flex',
    },
  ];

  return (
    <section id="gallery" className="py-12 sm:py-20 bg-white text-slate-900 relative overflow-hidden w-full select-none">
      {/* Ambient glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#da8a24]/8 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#0a2240]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full relative z-10 overflow-x-hidden">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3 mb-4 sm:mb-8"
        >
          <span className="text-[#da8a24] font-medium text-xs sm:text-sm uppercase tracking-widest block">
            Field Gallery & Real Stories
          </span>
          <h2 className="text-[24px] xs:text-[28px] sm:text-4xl lg:text-[44px] font-semibold text-[#0a2240] tracking-tight leading-tight">
            Authentic Moments of Hope & Dignity
          </h2>
        </motion.div>

        {/* 5-Card Cinematic 3D Rotating Stage */}
        <div
          className="relative w-full flex items-center justify-center py-2 sm:py-6 lg:py-10 min-h-[350px] xs:min-h-[420px] sm:min-h-[540px] md:min-h-[580px] lg:min-h-[640px]"
          style={{ perspective: 1500 }}
          onMouseEnter={() => setIsRunning(false)}
          onMouseLeave={() => {
            if (!isModalOpen) setIsRunning(true);
          }}
        >
          {/* Left Arrow */}
          <button
            onClick={() => goPrev()}
            className="absolute left-1 sm:left-4 md:left-7 top-1/2 -translate-y-1/2 z-40 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#0a2240]/90 hover:bg-[#da8a24] text-white hover:text-[#0a2240] border border-[#da8a24]/50 shadow-xl flex items-center justify-center transition-all cursor-pointer active:scale-95"
            aria-label="Previous"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => goNext()}
            className="absolute right-1 sm:right-4 md:right-7 top-1/2 -translate-y-1/2 z-40 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#0a2240]/90 hover:bg-[#da8a24] text-white hover:text-[#0a2240] border border-[#da8a24]/50 shadow-xl flex items-center justify-center transition-all cursor-pointer active:scale-95"
            aria-label="Next"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Render 5 positional slots */}
          {[-2, -1, 0, 1, 2].map((offset, posIdx) => {
            const itemIdx = getIdx(offset);
            const item = GALLERY_ITEMS[itemIdx];
            const cfg = positionConfig[posIdx];
            const isCenter = offset === 0;

            return (
              <motion.div
                key={`slot-${posIdx}`}
                className={`absolute top-1/2 ${cfg.show} items-center justify-center`}
                animate={{
                  x: `${cfg.xPct}%`,
                  y: '-50%',
                  scale: cfg.scale,
                  opacity: cfg.opacity,
                  rotateY: cfg.rotateY,
                  filter: `blur(${cfg.blur}px) brightness(${cfg.brightness})`,
                }}
                transition={{
                  duration: 0.72,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ zIndex: cfg.zIndex }}
                onClick={() => {
                  if (!isCenter) {
                    setCurrentIndex(itemIdx);
                  } else {
                    setIsRunning(false);
                    setIsModalOpen(true);
                  }
                }}
              >
                {/* Card Shell */}
                <div
                  className={`relative overflow-hidden cursor-pointer group rounded-[12px]
                    ${isCenter
                      ? 'w-[220px] xs:w-[265px] sm:w-[360px] md:w-[400px] lg:w-[430px]'
                      : 'w-[180px] sm:w-[230px] md:w-[270px] lg:w-[310px]'
                    }
                  `}
                  style={{ aspectRatio: '3/4' }}
                >
                  <Picture
                    picture={item.image}
                    sizes="(min-width: 1024px) 430px, (min-width: 768px) 400px, (min-width: 640px) 360px, 265px"
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none"
                    draggable={false}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#061525]/95 via-[#061525]/20 to-[#061525]/55 pointer-events-none" />

                  {/* TOP: Category badge */}
                  <div className="absolute top-0 left-0 right-0 p-3 sm:p-4 flex items-start justify-between">
                    <span
                      className={`text-[9px] sm:text-[11px] font-semibold uppercase tracking-widest px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-full flex items-center gap-1 sm:gap-1.5 shadow-md
                        ${isCenter
                          ? 'bg-[#da8a24] text-[#0a2240]'
                          : 'bg-white/15 backdrop-blur-sm text-white border border-white/25'
                        }`}
                    >
                      <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      {item.category}
                    </span>
                  </div>

                  {/* BOTTOM: Title & Location */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 space-y-1.5 text-white">
                    <div className="flex items-center gap-1 text-[10px] sm:text-xs text-[#da8a24] font-medium">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span>{item.location}</span>
                    </div>
                    <h3
                      className={`font-semibold tracking-tight leading-tight drop-shadow-md transition-colors ${
                        isCenter
                          ? 'text-sm sm:text-lg lg:text-xl text-white group-hover:text-[#da8a24]'
                          : 'text-xs sm:text-sm text-slate-200 line-clamp-1'
                      }`}
                    >
                      {item.title}
                    </h3>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Carousel Indicator Dots */}
        <div className="flex items-center justify-center gap-2 pt-2 pb-4">
          {GALLERY_ITEMS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`rounded-full transition-all duration-500 cursor-pointer ${
                idx === currentIndex
                  ? 'w-5 h-1.5 bg-[#da8a24] shadow-sm'
                  : 'w-1.5 h-1.5 bg-slate-300 hover:bg-[#da8a24]/60'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Full Story Modal */}
        {isModalOpen && activeItem && createPortal(
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[99999] bg-[#040f1a]/98 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 lg:p-8 overflow-hidden"
              onClick={() => {
                setIsModalOpen(false);
                setIsRunning(true);
              }}
            >
              <motion.div
                initial={{ scale: 0.88, opacity: 0, y: 24 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.88, opacity: 0, y: 24 }}
                transition={{ type: 'spring', damping: 26, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#071b34] text-white border-2 border-[#da8a24] rounded-3xl max-w-2xl sm:max-w-3xl lg:max-w-5xl w-full overflow-hidden shadow-2xl relative flex flex-col lg:grid lg:grid-cols-12 max-h-[85vh] my-auto"
              >
                {/* Close button */}
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setIsRunning(true);
                  }}
                  className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-50 bg-[#da8a24] text-[#0a2240] hover:bg-rose-600 hover:text-white p-2.5 sm:p-3 rounded-full border-2 border-white shadow-2xl transition-all transform hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                </button>

                {/* Left Column (Desktop) */}
                <div className="lg:col-span-5 relative bg-[#06172a] p-3 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-[#163863] min-h-[200px] lg:min-h-[420px] max-h-[35vh] lg:max-h-[85vh] overflow-hidden shrink-0">
                  <Picture
                    picture={activeItem.image}
                    sizes="(min-width: 1024px) 420px, calc(100vw - 2rem)"
                    alt={activeItem.title}
                    loading="eager"
                    className="w-full h-full max-h-[32vh] lg:max-h-[75vh] object-cover rounded-2xl shadow-xl"
                  />
                </div>

                {/* Right Column (Desktop) */}
                <div className="lg:col-span-7 p-4 sm:p-7 space-y-4 overflow-y-auto max-h-[50vh] lg:max-h-[85vh] flex flex-col justify-between">
                  <div className="space-y-3.5 pr-1 sm:pr-2">
                    {/* Badges row */}
                    <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
                      <span className="bg-[#da8a24] text-[#0a2240] font-semibold px-3 py-1 rounded-full uppercase tracking-wider text-[10px] flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />{activeItem.category}
                      </span>
                      <span className="text-slate-200 flex items-center gap-1 bg-[#0a2240] px-3 py-1 rounded-full border border-[#163863]">
                        <MapPin className="w-3.5 h-3.5 text-[#da8a24]" />
                        {activeItem.location}
                      </span>
                      {activeItem.impactStat && (
                        <span className="text-[#da8a24] flex items-center gap-1 bg-[#da8a24]/10 px-3 py-1 rounded-full border border-[#da8a24]/30 font-medium">
                          <Users className="w-3.5 h-3.5" />
                          {activeItem.impactStat.label}: {activeItem.impactStat.value}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl sm:text-2xl font-semibold text-white leading-tight">{activeItem.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">{activeItem.description}</p>

                    {activeItem.storyDetails && (
                      <div className="bg-[#0a2240] p-4 rounded-2xl border border-[#163863] text-xs text-slate-200 leading-relaxed space-y-1 font-normal">
                        <span className="text-[#da8a24] font-medium block text-[11px] uppercase tracking-wider">Field Narrative & Impact</span>
                        <p>{activeItem.storyDetails}</p>
                      </div>
                    )}

                    {activeItem.quote && (
                      <div className="bg-[#da8a24]/10 border border-[#da8a24]/30 p-3.5 rounded-2xl flex items-start gap-3">
                        <Quote className="w-4 h-4 text-[#da8a24] shrink-0 mt-0.5" />
                        <p className="text-xs italic text-amber-200 font-normal">{activeItem.quote}</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[#163863] mt-2">
                    <button
                      onClick={() => {
                        pixelTracker.trackDonateClick(500, `Gallery: ${activeItem.title}`);
                        setIsModalOpen(false);
                        setIsRunning(true);
                        if (onOpenDonateModal) onOpenDonateModal(500);
                      }}
                      className="w-full bg-[#da8a24] hover:bg-[#c77a1e] text-[#0a2240] font-semibold px-6 py-3.5 rounded-2xl shadow-xl transition flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm uppercase tracking-wider"
                    >
                      <Heart className="w-4 h-4 fill-[#0a2240] animate-pulse" />
                      <span>Sponsor Meals for This Drive (₹500)</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>,
          document.body
        )}

      </div>
    </section>
  );
};
