import React, { useState, useEffect } from 'react';
import { Heart, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Campaign } from '../types';
import { pixelTracker } from '../utils/pixelTracker';
import { Picture } from './Picture';
import { DarkToLightDivider } from './SectionDividers';

import heroChildLongingMeal from '../assets/images/hero_child_longing_meal.jpg?w=640;960;1376&format=webp;jpg&as=picture';
import heroRedhillsOrphanage from '../assets/images/hero_redhills_orphanage.jpg?w=640;960;1376&format=webp;jpg&as=picture';
import heroSpecialNeedsCare from '../assets/images/hero_special_needs_care.jpg?w=640;960;1376&format=webp;jpg&as=picture';
import heroTuitionSchoolMeals from '../assets/images/hero_tuition_school_meals.jpg?w=640;960;1376&format=webp;jpg&as=picture';

const HERO_SIZES = '100vw';

interface HeroProps {
  campaign: Campaign;
  onOpenDonateModal: (amount?: number) => void;
  onSelectCampaign?: (campaignId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ campaign, onOpenDonateModal }) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(campaign.suggestedAmounts[1] || campaign.minAmount || 500);
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [customVal, setCustomVal] = useState<string>('');
  const [showFloatingCta, setShowFloatingCta] = useState<boolean>(false);

  const activeAmount = isCustom ? (parseInt(customVal, 10) || campaign.minAmount || 100) : selectedAmount;

  // Track scroll position to show floating donate button ONLY after scrolling down past hero section
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 350) {
        setShowFloatingCta(true);
      } else {
        setShowFloatingCta(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hero Image Slideshow collection with realistic documentary photography
  const heroSlides = [
    {
      picture: heroChildLongingMeal,
      label: campaign.title,
      tag: 'Public Charitable Trust',
      badge: 'Est. 5th July 2010',
      title: 'ONE MEAL. ONE SMILE.',
      tagline: 'Your ₹100 can provide a warm, nutritious meal to a child in need.',
      subtitle: 'Every donation directly funds nutritious meals, education, and healthcare for orphaned children, abandoned seniors, and special needs children.',
    },
    {
      picture: heroRedhillsOrphanage,
      label: 'Orphanage Home for Children',
      tag: 'Our Campus',
      badge: '45 Resident Boys & Girls',
      title: 'Orphanage Home for Children.',
      tagline: 'Dormitories, Study Halls & Playgrounds in Rural Communities',
      subtitle: 'Managed by 16 committed staff members, providing full shelter, nutrition, healthcare, and education to 45 orphaned children.',
    },
    {
      picture: heroSpecialNeedsCare,
      label: 'Empowerment Center',
      tag: 'Education Center',
      badge: 'Dedicated Care & Support',
      title: 'Empowering Every Child.',
      tagline: 'Providing Compassionate Care, Structured Learning, and Safe Transportation',
      subtitle: 'Our dedicated professionals provide personalized learning and physical well-being support to foster growth and independence.',
    },
    {
      picture: heroTuitionSchoolMeals,
      label: '346 Evening Tuition Students',
      tag: '8 Tuition Centers',
      badge: 'Free Education & Supplies',
      title: '346 Enrolled Children Supported Daily.',
      tagline: 'Serving Marginalized Communities Across 8 Different Centers',
      subtitle: 'Providing free evening tuition, nutritious meals, backpacks, textbooks, pens, and hygiene supplies.',
    },
  ];

  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Prefetch the remaining slides once the page is idle so they don't compete with the first one
  useEffect(() => {
    const prefetch = () => {
      heroSlides.slice(1).forEach((slide) => {
        const img = new Image();
        img.sizes = HERO_SIZES;
        img.srcset = slide.picture.sources.webp || slide.picture.img.src;
      });
    };
    const id = window.requestIdleCallback
      ? window.requestIdleCallback(prefetch, { timeout: 4000 })
      : window.setTimeout(prefetch, 2500);
    return () => {
      window.cancelIdleCallback ? window.cancelIdleCallback(id) : window.clearTimeout(id);
    };
  }, [campaign.id]);

  // Auto transition slides slowly horizontally with fade effect every 5 seconds
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, heroSlides.length]);

  // Reset to slide 0 when campaign changes
  useEffect(() => {
    setCurrentSlide(0);
  }, [campaign.id]);

  return (
    <section className="w-full bg-[#0a2240] text-white relative overflow-hidden min-h-[85vh] lg:min-h-screen lg:h-screen flex flex-col justify-end pt-20 sm:pt-24">
      
      {/* Background Slideshow with Horizontal Motion */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={`${campaign.id}-${currentSlide}`}
            initial={{ opacity: 0, x: '3%', scale: 1.02 }}
            animate={{ 
              opacity: 1, 
              x: ['0%', '-2.5%'],
              scale: [1, 1.05]
            }}
            exit={{ opacity: 0, x: '-3%', scale: 1.07 }}
            transition={{ 
              opacity: { duration: 1.1, ease: [0.4, 0, 0.2, 1] },
              x: { duration: 6, ease: 'linear' },
              scale: { duration: 6, ease: 'linear' }
            }}
            className="absolute inset-0 w-full h-full"
          >
            <Picture
              picture={heroSlides[currentSlide].picture}
              sizes={HERO_SIZES}
              alt={`Truth Foundation NGO - ${heroSlides[currentSlide].title} - ${heroSlides[currentSlide].label}`}
              loading={currentSlide === 0 ? 'eager' : 'lazy'}
              fetchPriority={currentSlide === 0 ? 'high' : 'auto'}
              decoding={currentSlide === 0 ? 'sync' : 'async'}
              className="w-full h-full object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>

        {/* Soft, Lightened Gradient Overlays for Vivid Photography & Crystal Clear Text */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a2240]/75 via-[#0a2240]/25 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a2240]/55 via-transparent to-transparent"></div>

        {/* Ambient Radial Accent Light */}
        <div className="absolute top-1/4 -right-10 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Main Hero Content - Container Aligned within max-w-7xl */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-3.5 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12 flex flex-col justify-end">
        <div className="max-w-3xl space-y-2.5 sm:space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-1.5 sm:space-y-3"
            >
              <h1 className="text-[32px] xs:text-[38px] sm:text-5xl lg:text-[56px] font-semibold leading-tight tracking-tight text-white drop-shadow-md">
                {heroSlides[currentSlide].title}<br />
                <span className="text-[#da8a24] font-medium italic text-xl xs:text-2xl sm:text-2xl lg:text-3xl block pt-1 drop-shadow-sm">
                  {heroSlides[currentSlide].tagline}
                </span>
              </h1>

              <p className="text-base xs:text-xl sm:text-lg lg:text-[20px] text-blue-100 max-w-2xl leading-relaxed font-normal drop-shadow-md">
                {heroSlides[currentSlide].subtitle}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Primary Action Button: Donate Now */}
          <div className="pt-2 sm:pt-4 w-full relative z-20 flex flex-row items-center justify-start gap-2 sm:gap-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                pixelTracker.trackDonateClick(500, `Hero Primary Button - ${campaign.title}`);
                onOpenDonateModal(500);
              }}
              className="px-6 sm:px-8 py-3 sm:py-3.5 bg-[#da8a24] hover:bg-[#c77a1e] text-[#0a2240] rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-2xl transition cursor-pointer active:scale-98 uppercase tracking-wider relative z-20 whitespace-nowrap"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-[#0a2240] shrink-0" />
              <span>Donate Now</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5] hidden sm:inline-block" />
            </motion.button>
          </div>
        </div>

        {/* Slideshow Arrow Navigation Controls */}
        <div className="flex items-center justify-center gap-4 pt-4 pb-1 w-full z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsPaused(true);
              setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
            }}
            className="p-1 text-white/80 hover:text-[#da8a24] transition cursor-pointer active:scale-90"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsPaused(true);
              setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
            }}
            className="p-1 text-white/80 hover:text-[#da8a24] transition cursor-pointer active:scale-90"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>

      {/* Floating Donate Now CTA Button */}
      <AnimatePresence>
        {showFloatingCta && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 md:hidden"
          >
            <button
              onClick={() => {
                pixelTracker.trackDonateClick(500, 'Floating Donate Button');
                onOpenDonateModal(500);
              }}
              className="bg-[#da8a24] hover:bg-[#c77a1e] text-[#0a2240] font-semibold px-5 py-3 sm:px-6 sm:py-3.5 rounded-full shadow-2xl border-2 border-white flex items-center gap-2 text-xs sm:text-sm cursor-pointer ring-4 ring-[#da8a24]/30 uppercase tracking-wider transition-all active:scale-95"
              aria-label="Donate Now Floating Button"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-[#0a2240] text-[#0a2240] shrink-0 animate-pulse" />
              <span className="font-semibold">Donate Now</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ORGANIC WAVES SECTION DIVIDER (No Blue Bar) */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
        <DarkToLightDivider bgFrom="transparent" bgTo="#f8fafc" />
      </div>

    </section>
  );
};
