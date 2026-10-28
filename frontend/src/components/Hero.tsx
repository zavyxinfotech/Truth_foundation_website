import React, { useState, useEffect } from 'react';
import { Heart, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Campaign } from '../types';
import { pixelTracker } from '../utils/pixelTracker';
import { Picture } from './Picture';
import { DarkToLightDivider } from './SectionDividers';
import { fetchSiteContent } from '../utils/cmsApi';

import heroChildLongingMeal from '../assets/images/hero_child_longing_meal.jpg?w=640;960;1376&format=webp;jpg&as=picture';
import heroRedhillsOrphanage from '../assets/images/hero_redhills_orphanage.jpg?w=640;960;1376&format=webp;jpg&as=picture';
import heroSpecialNeedsCare from '../assets/images/hero_special_needs_care.jpg?w=640;960;1376&format=webp;jpg&as=picture';
import heroTuitionSchoolMeals from '../assets/images/hero_tuition_school_meals.jpg?w=640;960;1376&format=webp;jpg&as=picture';

const HERO_SIZES = '100vw';

const DEFAULT_HERO_SLIDES = [
  {
    picture: heroChildLongingMeal,
    imageUrl: null as string | null,
    label: 'One Meal. One Smile.',
    tag: 'Public Charitable Trust',
    badge: 'Est. 5th July 2010',
    title: 'ONE MEAL. ONE SMILE.',
    tagline: 'Your ₹500 can provide warm, nutritious meals to children in need.',
    subtitle: 'Every donation directly funds nutritious meals, education, and healthcare for orphaned children, abandoned seniors, and special needs children.',
  },
  {
    picture: heroRedhillsOrphanage,
    imageUrl: null as string | null,
    label: 'Orphanage Home for Children',
    tag: 'Our Campus',
    badge: '41 Resident Boys & Girls',
    title: 'Orphanage Home for Children.',
    tagline: 'Dormitories, Study Halls & Playgrounds in Rural Communities',
    subtitle: 'Managed by 16 committed staff members, providing full shelter, nutrition, healthcare, and education to 41 orphaned children.',
  },
  {
    picture: heroSpecialNeedsCare,
    imageUrl: null as string | null,
    label: 'Empowerment Center',
    tag: 'Education Center',
    badge: 'Dedicated Care & Support',
    title: 'Empowering Every Child.',
    tagline: 'Providing Compassionate Care, Structured Learning, and Safe Transportation',
    subtitle: 'Our dedicated professionals provide personalized learning and physical well-being support to foster growth and independence.',
  },
  {
    picture: heroTuitionSchoolMeals,
    imageUrl: null as string | null,
    label: '346 Evening Tuition Students',
    tag: '8 Tuition Centers',
    badge: 'Free Education & Supplies',
    title: '346 Enrolled Children Supported Daily.',
    tagline: 'Serving Marginalized Communities Across 8 Different Centers',
    subtitle: 'Providing free evening tuition, nutritious meals, backpacks, textbooks, pens, and hygiene supplies.',
  },
];

interface HeroProps {
  campaign: Campaign;
  onOpenDonateModal: (amount?: number) => void;
  onSelectCampaign?: (campaignId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ campaign, onOpenDonateModal }) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(campaign.suggestedAmounts[1] || campaign.minAmount || 500);
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [customVal, setCustomVal] = useState<string>('');
  const activeAmount = isCustom ? (parseInt(customVal, 10) || campaign.minAmount || 100) : selectedAmount;

  const [heroSlides, setHeroSlides] = useState(DEFAULT_HERO_SLIDES);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Load dynamic CMS slides from backend database
  useEffect(() => {
    fetchSiteContent().then((data) => {
      if (data?.home_hero?.slides && data.home_hero.slides.length > 0) {
        const mapped = data.home_hero.slides.map((s, idx) => {
          const fallback = DEFAULT_HERO_SLIDES[idx % DEFAULT_HERO_SLIDES.length];
          const isRemote = s.image_url?.startsWith('http://') || s.image_url?.startsWith('https://');
          return {
            picture: isRemote ? null : fallback.picture,
            imageUrl: isRemote ? s.image_url : null,
            label: campaign.title,
            tag: s.tag || fallback.tag,
            badge: s.badge || fallback.badge,
            title: s.title || fallback.title,
            tagline: s.tagline || fallback.tagline,
            subtitle: s.subtitle || fallback.subtitle,
          };
        });
        setHeroSlides(mapped as any);
      }
    });
  }, [campaign.id, campaign.title]);

  // Prefetch the remaining slides once the page is idle so they don't compete with the first one
  useEffect(() => {
    const prefetch = () => {
      heroSlides.slice(1).forEach((slide) => {
        if (slide.picture) {
          const img = new Image();
          img.sizes = HERO_SIZES;
          img.srcset = slide.picture.sources.webp || slide.picture.img.src;
        } else if (slide.imageUrl) {
          const img = new Image();
          img.src = slide.imageUrl;
        }
      });
    };
    const id = window.requestIdleCallback
      ? window.requestIdleCallback(prefetch, { timeout: 4000 })
      : window.setTimeout(prefetch, 2500);
    return () => {
      window.cancelIdleCallback ? window.cancelIdleCallback(id) : window.clearTimeout(id);
    };
  }, [campaign.id, heroSlides]);

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

  const activeSlide = heroSlides[currentSlide] || heroSlides[0];

  return (
    <section className="w-full bg-slate-950 text-white relative overflow-x-clip min-h-[85vh] lg:min-h-screen lg:h-screen flex flex-col justify-end pt-20 sm:pt-24">
      
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
            {activeSlide.imageUrl ? (
              <img
                src={activeSlide.imageUrl}
                alt={`Truth Foundation NGO - ${activeSlide.title} - ${activeSlide.label}`}
                loading={currentSlide === 0 ? 'eager' : 'lazy'}
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <Picture
                picture={activeSlide.picture!}
                sizes={HERO_SIZES}
                alt={`Truth Foundation NGO - ${activeSlide.title} - ${activeSlide.label}`}
                loading={currentSlide === 0 ? 'eager' : 'lazy'}
                fetchPriority={currentSlide === 0 ? 'high' : 'auto'}
                decoding={currentSlide === 0 ? 'sync' : 'async'}
                className="w-full h-full object-cover object-center"
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Soft, Neutral Vignette Overlays for Vivid Photography & Crystal Clear Text */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent"></div>
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
              <h1 className="text-4xl sm:text-6xl lg:text-[64px] font-normal text-white tracking-tight leading-[1.1] drop-shadow-md">
                {heroSlides[currentSlide].title}<br />
                <span className="text-white font-normal italic text-lg sm:text-xl lg:text-2xl block pt-1.5 drop-shadow-sm">
                  {heroSlides[currentSlide].tagline}
                </span>
              </h1>

              <p className="text-base sm:text-xl lg:text-2xl text-slate-200 font-normal leading-relaxed max-w-[660px] drop-shadow-sm">
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
              className="bg-[#da8a24] hover:bg-[#c77a1e] text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl min-h-[48px] sm:min-h-[52px] font-semibold text-sm sm:text-base uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-xl transition cursor-pointer active:scale-98 relative z-20 whitespace-nowrap"
            >
              <Heart className="w-4.5 h-4.5 sm:w-5 sm:h-5 fill-white text-white shrink-0" />
              <span>Donate Now</span>
              <ArrowRight className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[2.5] hidden sm:inline-block" />
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

      {/* ORGANIC WAVES SECTION DIVIDER (No Blue Bar) */}
      <div className="absolute -bottom-1 left-0 right-0 z-20 pointer-events-none">
        <DarkToLightDivider bgFrom="transparent" bgTo="#f8fafc" />
      </div>

    </section>
  );
};
