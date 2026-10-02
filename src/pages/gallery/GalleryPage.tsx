import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Quote,
  Heart,
  MapPin,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Users,
  ChevronRight as ChevronRightIcon,
  Eye,
  Filter,
  ArrowRight,
  Camera,
  LayoutGrid,
  Home,
  BookOpen,
  Calendar,
  Building2,
  GraduationCap,
  HeartHandshake,
  Stethoscope
} from 'lucide-react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { FloatingWhatsApp } from '../../components/FloatingWhatsApp';
import { Picture } from '../../components/Picture';
import { DarkToLightDivider, LightToDarkDivider } from '../../components/SectionDividers';
import { GALLERY_ITEMS } from '../../data/campaignData';
import { GalleryItem } from '../../types';
import { pixelTracker } from '../../utils/pixelTracker';

// Real Project Image Imports
import heroChildLongingMeal from '../../assets/images/hero_child_longing_meal.jpg?w=900&format=webp';
import trustSectionOrganicMeal from '../../assets/images/trust_section_organic_meal.jpg?w=800&format=webp';

interface GalleryPageProps {
  onOpenDonateModal: (amount?: number) => void;
  onNavigate: (page: 'home' | 'about' | 'gallery' | 'contact' | 'donate', anchor?: string) => void;
}

const CATEGORY_ITEMS = [
  { label: 'All', icon: LayoutGrid },
  { label: 'Meals', icon: Home },
  { label: 'Education', icon: BookOpen },
  { label: 'Medical', icon: Stethoscope },
  { label: 'Volunteers', icon: HeartHandshake },
  { label: 'Events', icon: Calendar }
];

const STATS_CARDS = [
  { label: 'Years of Service', value: '14+', subtitle: 'Est. 5th July 2010', icon: Calendar },
  { label: 'Orphanage Children', value: '45', subtitle: 'Resident Boys & Girls', icon: Home },
  { label: 'Elderly Seniors', value: '20', subtitle: 'Day Care & Shelter', icon: HeartHandshake },
  { label: 'Special Needs Kids', value: '23', subtitle: 'Free Van Transportation', icon: GraduationCap },
  { label: 'Tuition Students', value: '346', subtitle: 'Across 8 Centers', icon: BookOpen }
];

const TOTAL_CAROUSEL = GALLERY_ITEMS.length;
const CARD_ROTATE_INTERVAL = 3400;

export const GalleryPage: React.FC<GalleryPageProps> = ({ onOpenDonateModal, onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [activeStoryItem, setActiveStoryItem] = useState<GalleryItem | null>(null);
  const [isCarouselRunning, setIsCarouselRunning] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Body scroll lock when story modal is open
  useEffect(() => {
    if (activeStoryItem) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeStoryItem]);

  // Carousel auto-rotate
  useEffect(() => {
    if (!isCarouselRunning || activeStoryItem) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setCarouselIndex((p) => (p + 1) % TOTAL_CAROUSEL);
    }, CARD_ROTATE_INTERVAL);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isCarouselRunning, activeStoryItem]);

  const goNext = () => setCarouselIndex((p) => (p + 1) % TOTAL_CAROUSEL);
  const goPrev = () => setCarouselIndex((p) => (p - 1 + TOTAL_CAROUSEL) % TOTAL_CAROUSEL);

  const getIdx = useCallback(
    (offset: number) => ((carouselIndex + offset) % TOTAL_CAROUSEL + TOTAL_CAROUSEL) % TOTAL_CAROUSEL,
    [carouselIndex]
  );

  const filteredItems = selectedCategory === 'All'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.category === selectedCategory);

  const positionConfig = [
    { xPct: -148, scale: 0.65, opacity: 0.22, zIndex: 0, rotateY: 24, blur: 4, brightness: 0.38, show: 'hidden lg:flex' },
    { xPct: -83, scale: 0.80, opacity: 0.60, zIndex: 10, rotateY: 14, blur: 1.5, brightness: 0.65, show: 'hidden sm:flex' },
    { xPct: 0, scale: 1, opacity: 1, zIndex: 30, rotateY: 0, blur: 0, brightness: 1, show: 'flex' },
    { xPct: 83, scale: 0.80, opacity: 0.60, zIndex: 10, rotateY: -14, blur: 1.5, brightness: 0.65, show: 'hidden sm:flex' },
    { xPct: 148, scale: 0.65, opacity: 0.22, zIndex: 0, rotateY: -24, blur: 4, brightness: 0.38, show: 'hidden lg:flex' }
  ];

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-clip bg-[#0a2240] text-slate-900 font-sans antialiased selection:bg-[#da8a24] selection:text-[#0a2240] relative">
      
      {/* 1. Header (EXACT EXISTING NAVBAR - UNCHANGED) */}
      <Header
        currentPage="gallery"
        onOpenDonateModal={onOpenDonateModal}
        onNavigate={onNavigate}
      />

      {/* 2. GALLERY HERO SECTION (Dark Navy #0a2240) */}
      <section className="pt-24 sm:pt-32 pb-16 sm:pb-20 bg-[#0a2240] text-white relative overflow-hidden">
        
        {/* Subtle Ambient Background Glows */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#da8a24]/12 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#da8a24]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
          
          {/* 12-Column Hero Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center min-h-[300px] lg:min-h-[360px]">
            
            {/* HERO LEFT (~55%) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-5"
            >
              {/* Eyebrow Pill */}
              <div className="inline-flex items-center gap-2 text-[#da8a24] font-semibold text-xs sm:text-sm uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-[#da8a24]/10 border border-[#da8a24]/30">
                <Camera className="w-3.5 h-3.5 text-[#da8a24]" />
                <span>OUR MOMENTS</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-semibold text-white tracking-tight leading-[1.1]">
                A Glimpse into <span className="text-[#da8a24]">Lives We Touch</span>
              </h1>

              {/* Paragraph Description */}
              <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-[580px]">
                Visual evidence of warm meals delivered, educational supplies distributed, and care provided across Redhills, Thiruvallur, Vyasarpadi, and surrounding rural communities in Tamil Nadu.
              </p>
            </motion.div>

            {/* HERO RIGHT (~45%): IMAGE FRAME */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-5 flex items-center justify-center relative w-full"
            >
              <div className="relative w-full max-w-[500px] mx-auto p-3 sm:p-4">
                
                {/* Main Image Container - No Rounded Borders, No Shadows */}
                <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] overflow-hidden border-0 shadow-none rounded-none bg-[#071b34] group">
                  <img
                    src={heroChildLongingMeal}
                    alt="Truth Foundation Field Moments"
                    className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a2240]/50 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Info Badge: Real People Real Impact */}
                <motion.div
                  initial={{ opacity: 0, y: -15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="absolute -top-3 right-0 bg-[#0a2240]/95 backdrop-blur-md border-0 shadow-none rounded-none px-4 py-2 flex items-center gap-2.5 z-20"
                >
                  <div className="w-8 h-8 rounded-none bg-[#da8a24]/20 border-0 flex items-center justify-center text-[#da8a24] shrink-0">
                    <Camera className="w-4 h-4 text-[#da8a24]" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-semibold text-white leading-none">
                      Real People
                    </div>
                    <div className="text-[10px] text-[#da8a24] font-medium pt-0.5">
                      Real Impact
                    </div>
                  </div>
                </motion.div>

              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* 3. ORGANIC SECTION DIVIDER (Dark to Light) */}
      <DarkToLightDivider bgFrom="#0a2240" bgTo="#ffffff" />

      {/* 4. IMPACT STATISTICS (White #ffffff Section) */}
      <section className="py-14 sm:py-18 bg-white text-slate-900 relative">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 lg:px-12">
          
          {/* Statistics Display */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-0 lg:divide-x lg:divide-slate-200">
            {STATS_CARDS.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className={`flex flex-col items-center text-center p-4 lg:px-6 space-y-2 ${
                  idx === STATS_CARDS.length - 1 ? 'col-span-2 md:col-span-1 lg:col-span-1' : ''
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-[#da8a24]/10 border border-[#da8a24]/30 flex items-center justify-center text-[#da8a24] mb-1">
                  <stat.icon className="w-6 h-6 text-[#da8a24]" />
                </div>
                <div className="text-3xl sm:text-4xl font-semibold text-[#0a2240] tracking-tight">
                  {stat.value}
                </div>
                <div className="text-sm font-semibold text-[#0a2240]">
                  {stat.label}
                </div>
                <div className="text-xs font-medium text-[#da8a24]">
                  {stat.subtitle}
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. PHOTO GALLERY HEADER & FILTERABLE GRID (#f8fafc Light Section) */}
      <section className="py-16 sm:py-24 bg-[#f8fafc] text-slate-900 relative border-t border-slate-200">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 lg:px-12 space-y-10">
          
          {/* Header & Horizontal Filter Rail */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-200 pb-8">
            <div className="space-y-2 max-w-xl">
              <span className="text-[#da8a24] font-semibold text-xs sm:text-sm uppercase tracking-widest block">
                PHOTO GALLERY
              </span>
              <h2 className="text-2xl sm:text-4xl font-semibold text-[#0a2240] tracking-tight">
                Our Journey in Pictures
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-normal">
                Real stories. Real people. Real change. Click any photo to open full field details.
              </p>
            </div>

            {/* Category Filter Rail */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none [scrollbar-width:none]">
              {CATEGORY_ITEMS.map((cat) => {
                const IconComponent = cat.icon;
                const isSelected = selectedCategory === cat.label;
                return (
                  <button
                    key={cat.label}
                    onClick={() => setSelectedCategory(cat.label)}
                    className={`px-4 py-2.5 rounded-none text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 shrink-0 border-0 ${
                      isSelected
                        ? 'bg-[#da8a24] text-[#0a2240]'
                        : 'bg-white text-[#0a2240] hover:bg-slate-100'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 ${isSelected ? 'text-[#0a2240]' : 'text-[#da8a24]'}`} />
                    <span>{cat.label === 'All' ? 'All Media' : cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4-Column Image Gallery Grid - Borderless & Shadowless Cards */}
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => {
                    setIsCarouselRunning(false);
                    setActiveStoryItem(item);
                  }}
                  className="bg-white rounded-none overflow-hidden border-0 shadow-none hover:shadow-none transition-all group cursor-pointer flex flex-col justify-between"
                >
                  {/* Image Tile */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#0a2240] rounded-none border-0 shadow-none">
                    <Picture
                      picture={item.image}
                      sizes="(min-width: 1024px) 300px, (min-width: 640px) 320px, 100vw"
                      alt={item.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a2240]/85 via-transparent to-transparent opacity-75 group-hover:opacity-90 transition-opacity" />

                    {/* Category Badge */}
                    <span className="absolute top-3 left-3 bg-[#0a2240]/90 text-white font-semibold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-none border-0 flex items-center gap-1 backdrop-blur-md">
                      <Sparkles className="w-3 h-3 text-[#da8a24]" />
                      {item.category}
                    </span>

                    {/* Bottom Metadata Overlay */}
                    <div className="absolute bottom-3 left-3 right-3 text-white space-y-1">
                      <div className="flex items-center gap-1 text-[11px] text-[#da8a24] font-medium">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </div>
                      <h3 className="font-semibold text-white text-sm line-clamp-1 leading-snug group-hover:text-[#da8a24] transition-colors">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  {/* Tile Bottom Action */}
                  <div className="p-3.5 bg-white border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0a2240] group-hover:text-[#da8a24] transition-colors">
                    <span className="flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-[#da8a24]" />
                      <span>View Story & Details</span>
                    </span>
                    <ChevronRightIcon className="w-4 h-4 text-[#da8a24] transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

        </div>
      </section>

      {/* 6. ORGANIC SECTION DIVIDER (Light to Dark) */}
      <LightToDarkDivider bgFrom="#f8fafc" bgTo="#0a2240" />

      {/* 7. FEATURED MOMENT / MOMENTS OF HOPE CAROUSEL (Dark Navy #0a2240 Section) */}
      <section className="py-16 sm:py-24 bg-[#0a2240] text-white relative overflow-hidden select-none">
        
        {/* Background Ambient Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#da8a24]/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10 space-y-10">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="text-[#da8a24] font-semibold text-xs sm:text-sm uppercase tracking-widest block">
                FEATURED MOMENT
              </span>
              <h2 className="text-2xl sm:text-4xl font-semibold text-white tracking-tight">
                Moments of Hope
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-normal">
                Explore our 3D interactive spotlight gallery showcasing ground-level impact across Chennai & Thiruvallur.
              </p>
            </div>

            {/* Navigation Arrows */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => goPrev()}
                className="w-11 h-11 rounded-none bg-[#071b34] border-0 hover:bg-[#da8a24] hover:text-[#0a2240] text-white transition flex items-center justify-center cursor-pointer"
                aria-label="Previous story"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => goNext()}
                className="w-11 h-11 rounded-none bg-[#071b34] border-0 hover:bg-[#da8a24] hover:text-[#0a2240] text-white transition flex items-center justify-center cursor-pointer"
                aria-label="Next story"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 3D Showcase Stage */}
          <div
            className="relative w-full flex items-center justify-center py-2 sm:py-6 min-h-[350px] xs:min-h-[420px] sm:min-h-[500px] lg:min-h-[560px] overflow-x-hidden"
            style={{ perspective: 1500 }}
            onMouseEnter={() => setIsCarouselRunning(false)}
            onMouseLeave={() => {
              if (!activeStoryItem) setIsCarouselRunning(true);
            }}
          >
            {/* 5 Positional Slots */}
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
                    filter: `blur(${cfg.blur}px) brightness(${cfg.brightness})`
                  }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  style={{ zIndex: cfg.zIndex }}
                  onClick={() => {
                    if (!isCenter) {
                      setCarouselIndex(itemIdx);
                    } else {
                      setIsCarouselRunning(false);
                      setActiveStoryItem(item);
                    }
                  }}
                >
                  <div
                    className={`relative overflow-hidden cursor-pointer group rounded-none border-0 shadow-none ${
                      isCenter
                        ? 'w-[230px] xs:w-[275px] sm:w-[370px] lg:w-[440px]'
                        : 'w-[180px] sm:w-[240px] lg:w-[310px]'
                    }`}
                    style={{ aspectRatio: '3/4' }}
                  >
                    <Picture
                      picture={item.image}
                      sizes="(min-width: 1024px) 440px, (min-width: 640px) 370px, 275px"
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none"
                      draggable={false}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#061525]/95 via-[#061525]/25 to-[#061525]/50 pointer-events-none" />

                    {/* Category Badge */}
                    <div className="absolute top-0 left-0 right-0 p-4 flex items-start justify-between">
                      <span
                        className={`text-[10px] sm:text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-none flex items-center gap-1 border-0 ${
                          isCenter ? 'bg-[#da8a24] text-[#0a2240]' : 'bg-white/20 text-white backdrop-blur-md'
                        }`}
                      >
                        <Sparkles className="w-3 h-3" />
                        {item.category}
                      </span>
                    </div>

                    {/* Title & Location */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 space-y-1.5 text-white">
                      <div className="flex items-center gap-1 text-xs text-[#da8a24] font-medium">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span>{item.location}</span>
                      </div>
                      <h3
                        className={`font-semibold tracking-tight leading-tight transition-colors ${
                          isCenter
                            ? 'text-base sm:text-xl text-white group-hover:text-[#da8a24]'
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

        </div>
      </section>

      {/* 8. ORGANIC SECTION DIVIDER (Dark to Light) */}
      <DarkToLightDivider bgFrom="#0a2240" bgTo="#ffffff" />

      {/* 9. SUPPORT OUR CAUSE CTA (White / Light #ffffff Section) */}
      <section className="py-16 sm:py-24 bg-white text-slate-900 relative">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 lg:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#f8fafc] rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-lg">
            
            {/* Left Column: Icon & Content */}
            <div className="lg:col-span-8 space-y-4">
              <div className="w-12 h-12 rounded-none bg-[#da8a24]/15 border-0 flex items-center justify-center text-[#da8a24]">
                <Heart className="w-6 h-6 fill-[#da8a24]" />
              </div>
              
              <h2 className="text-2xl sm:text-4xl font-semibold text-[#0a2240] tracking-tight">
                Be a Part of More Happy Moments
              </h2>
              
              <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-xl">
                Every contribution directly funds wholesome daily meals, educational books, special needs therapy, and shelter for children and seniors across Chennai & Thiruvallur.
              </p>
            </div>

            {/* Right Column: CTA Buttons */}
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  pixelTracker.trackDonateClick(500, 'Gallery Page Support CTA');
                  onOpenDonateModal(500);
                }}
                className="bg-[#da8a24] hover:bg-[#c77a1e] text-[#0a2240] font-semibold px-8 py-4 rounded-none shadow-none transition flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base uppercase tracking-wider min-h-[48px]"
              >
                <Heart className="w-5 h-5 fill-[#0a2240]" />
                <span>Donate Now</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onNavigate('contact')}
                className="bg-white hover:bg-slate-100 text-[#0a2240] font-semibold border-0 px-8 py-4 rounded-none shadow-none transition flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base min-h-[48px]"
              >
                <span>Contact Our Team</span>
                <ArrowRight className="w-4 h-4 text-[#da8a24]" />
              </motion.button>
            </div>

          </div>

        </div>
      </section>

      {/* 10. FULL STORY LIGHTBOX MODAL (PORTAL - Borderless & Shadowless) */}
      {activeStoryItem && createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] bg-[#040f1a]/98 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 lg:p-8 overflow-hidden"
            onClick={() => {
              setActiveStoryItem(null);
              setIsCarouselRunning(true);
            }}
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: 24 }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#071b34] text-white border-0 rounded-none max-w-2xl sm:max-w-3xl lg:max-w-5xl w-full overflow-hidden shadow-none relative flex flex-col lg:grid lg:grid-cols-12 max-h-[85vh] my-auto"
            >
              {/* Close button */}
              <button
                onClick={() => {
                  setActiveStoryItem(null);
                  setIsCarouselRunning(true);
                }}
                className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-50 bg-[#da8a24] text-[#0a2240] hover:bg-rose-600 hover:text-white p-2.5 sm:p-3 rounded-none border-0 shadow-none transition-all transform hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center"
                aria-label="Close modal"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              </button>

              {/* Image side */}
              <div className="lg:col-span-5 relative bg-[#06172a] p-3 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-[#163863] min-h-[200px] lg:min-h-[420px] max-h-[35vh] lg:max-h-[85vh] overflow-hidden shrink-0">
                <Picture
                  picture={activeStoryItem.image}
                  sizes="(min-width: 1024px) 420px, calc(100vw - 2rem)"
                  alt={activeStoryItem.title}
                  loading="eager"
                  className="w-full h-full max-h-[32vh] lg:max-h-[75vh] object-cover rounded-none shadow-none"
                />
              </div>

              {/* Narrative details side */}
              <div className="lg:col-span-7 p-4 sm:p-7 space-y-4 overflow-y-auto max-h-[50vh] lg:max-h-[85vh] flex flex-col justify-between">
                <div className="space-y-3.5 pr-1 sm:pr-2">
                  <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
                    <span className="bg-[#da8a24] text-[#0a2240] font-semibold px-3 py-1 rounded-none uppercase tracking-wider text-[10px] flex items-center gap-1 border-0">
                      <Sparkles className="w-3 h-3" />{activeStoryItem.category}
                    </span>
                    <span className="text-slate-200 flex items-center gap-1 bg-[#0a2240] px-3 py-1 rounded-none border-0">
                      <MapPin className="w-3.5 h-3.5 text-[#da8a24]" />
                      {activeStoryItem.location}
                    </span>
                    {activeStoryItem.impactStat && (
                      <span className="text-[#da8a24] flex items-center gap-1 bg-[#da8a24]/10 px-3 py-1 rounded-none border-0 font-medium">
                        <Users className="w-3.5 h-3.5" />
                        {activeStoryItem.impactStat.label}: {activeStoryItem.impactStat.value}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-semibold text-white leading-tight">{activeStoryItem.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">{activeStoryItem.description}</p>

                  {activeStoryItem.storyDetails && (
                    <div className="bg-[#0a2240] p-4 rounded-none border-0 text-xs text-slate-200 leading-relaxed space-y-1">
                      <span className="text-[#da8a24] font-semibold block text-[11px] uppercase tracking-wider">Field Narrative & Impact</span>
                      <p>{activeStoryItem.storyDetails}</p>
                    </div>
                  )}

                  {activeStoryItem.quote && (
                    <div className="bg-[#da8a24]/10 border-0 p-3.5 rounded-none flex items-start gap-3">
                      <Quote className="w-4 h-4 text-[#da8a24] shrink-0 mt-0.5" />
                      <p className="text-xs italic text-amber-200">{activeStoryItem.quote}</p>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-[#163863] mt-2">
                  <button
                    onClick={() => {
                      pixelTracker.trackDonateClick(500, `Gallery Page: ${activeStoryItem.title}`);
                      setActiveStoryItem(null);
                      setIsCarouselRunning(true);
                      onOpenDonateModal(500);
                    }}
                    className="w-full bg-[#da8a24] hover:bg-[#c77a1e] text-[#0a2240] font-semibold px-6 py-3.5 rounded-none shadow-none transition flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm uppercase tracking-wider"
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

      {/* 11. Footer (EXACT EXISTING FOOTER - UNCHANGED) */}
      <Footer onNavigateHome={(anchor) => onNavigate('home', anchor)} />

      {/* 12. Floating WhatsApp Widget (EXACT UNCHANGED) */}
      <FloatingWhatsApp />

    </div>
  );
};
