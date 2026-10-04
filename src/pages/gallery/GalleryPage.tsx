import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Quote,
  Heart,
  MapPin,
  Sparkles,
  Users,
  ChevronRight as ChevronRightIcon,
  Eye,
  ArrowRight,
  Camera,
  LayoutGrid,
  Home,
  BookOpen,
  Calendar,
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
import galleryHeroBgDesktop from '../../assets/images/Gallery_page_hero_section_desktop_view.jpeg';
import galleryHeroBgMobile from '../../assets/images/Gallery_page_hero_background_img_mobile_view.jpeg';

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

const CATEGORY_DONATION_AMOUNTS: Record<string, number> = {
  Meals: 500,
  Education: 1000,
  Medical: 1500,
  Volunteers: 500,
  Events: 750
};

export const GalleryPage: React.FC<GalleryPageProps> = ({ onOpenDonateModal, onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeStoryItem, setActiveStoryItem] = useState<GalleryItem | null>(null);

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

  const filteredItems = selectedCategory === 'All'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-clip bg-[#0a2240] text-slate-900 font-sans antialiased selection:bg-[#da8a24] selection:text-[#0a2240] relative">
      
      {/* 1. Header (EXACT EXISTING NAVBAR - UNCHANGED) */}
      <Header
        currentPage="gallery"
        onOpenDonateModal={onOpenDonateModal}
        onNavigate={onNavigate}
      />

      {/* 2. GALLERY HERO SECTION WITH BACKGROUND IMAGES */}
      <section className="pt-28 sm:pt-36 pb-12 sm:pb-16 bg-slate-950 text-white relative overflow-hidden min-h-[75vh] lg:min-h-screen flex items-center">
        
        {/* Desktop Background Image (Hidden on Mobile) */}
        <div 
          className="hidden md:block absolute inset-0 w-full h-full bg-cover bg-center lg:bg-top pointer-events-none opacity-90"
          style={{ backgroundImage: `url(${galleryHeroBgDesktop})` }}
        />

        {/* Mobile Background Image (Block on Mobile, Hidden on Desktop) */}
        <div 
          className="block md:hidden absolute inset-0 w-full h-full bg-cover bg-center pointer-events-none opacity-90"
          style={{ backgroundImage: `url(${galleryHeroBgMobile})` }}
        />

        {/* Neutral Dark Gradient Overlay (No Blue Mask) */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent pointer-events-none" />

        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10 w-full">
          
          <div className="max-w-3xl space-y-4">
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              {/* Main Heading: All White, Non-bold & Enlarged */}
              <h1 className="text-4xl sm:text-6xl lg:text-[62px] font-normal text-white tracking-tight leading-[1.1]">
                A Glimpse into Lives We Touch
              </h1>

              {/* Concise Paragraph Description: Non-bold & Enlarged */}
              <p className="text-base sm:text-lg lg:text-xl text-slate-200 font-normal leading-relaxed max-w-[640px] drop-shadow-sm">
                Visual moments of warm meals, educational supplies, healthcare support, and care delivered across our centers in Tamil Nadu.
              </p>
            </motion.div>

          </div>

        </div>

        {/* ORGANIC WAVES SECTION DIVIDER */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
          <DarkToLightDivider bgFrom="transparent" bgTo="#f8fafc" />
        </div>
      </section>

      {/* 5. PHOTO GALLERY HEADER & FILTERABLE GRID (#f8fafc Light Section) */}
      <section className="py-16 sm:py-24 bg-[#f8fafc] text-slate-900 relative border-t border-slate-200">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 lg:px-12 space-y-10">
          
          {/* Header & Horizontal Filter Rail */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-200 pb-8">
            <div className="space-y-2 max-w-xl">
              <span className="text-[#da8a24] font-normal text-sm sm:text-base uppercase tracking-widest block">
                PHOTO GALLERY
              </span>
              <h2 className="text-3xl sm:text-5xl font-normal text-[#0a2240] tracking-tight">
                Our Journey in Pictures
              </h2>
              <p className="text-sm sm:text-base text-slate-600 font-normal">
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
                    className={`px-4 py-2.5 rounded-none text-sm sm:text-base font-normal transition-all cursor-pointer flex items-center gap-2 shrink-0 border-0 ${
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

          {/* Gallery Grid - 2 Columns on Mobile, 4 Columns on Desktop */}
          <motion.div layout className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <AnimatePresence>
              {filteredItems.map((item) => {
                const donateAmount = CATEGORY_DONATION_AMOUNTS[item.category] || 500;
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    onClick={() => setActiveStoryItem(item)}
                    className="bg-white rounded-none overflow-hidden border-0 shadow-none hover:shadow-none transition-all group cursor-pointer flex flex-col justify-between relative"
                  >
                    {/* Image Tile - Clean in default state */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#0a2240] rounded-none border-0 shadow-none">
                      <Picture
                        picture={item.image}
                        sizes="(min-width: 1024px) 300px, (min-width: 640px) 320px, 50vw"
                        alt={item.title}
                        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500 ease-out"
                      />

                      {/* Clean Category Badge (Top Corner) */}
                      <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-[#0a2240]/85 backdrop-blur-md text-white font-normal text-xs uppercase tracking-wider px-2.5 py-1 rounded-none border-0 flex items-center gap-1 z-10">
                        <Sparkles className="w-3 h-3 text-[#da8a24]" />
                        {item.category}
                      </span>

                      {/* Half-Size Hover Pop-Up Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#071b34]/95 backdrop-blur-md p-2.5 sm:p-3.5 flex flex-col justify-between translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out z-20">
                        {/* Title & Location */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-xs sm:text-sm text-[#da8a24] font-normal truncate">
                            <MapPin className="w-3 h-3 shrink-0" />
                            <span className="truncate">{item.location}</span>
                          </div>
                          <h3 className="font-normal text-white text-xs sm:text-sm line-clamp-1 leading-tight">
                            {item.title}
                          </h3>
                        </div>

                        {/* Category-Based Donate Action Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            pixelTracker.trackDonateClick(donateAmount, `Gallery Card (${item.category})`);
                            onOpenDonateModal(donateAmount);
                          }}
                          className="w-full bg-[#da8a24] hover:bg-[#c77a1e] text-[#0a2240] font-normal text-xs sm:text-sm py-1.5 px-2 rounded-none transition-all flex items-center justify-center gap-1 uppercase tracking-wider cursor-pointer shadow-sm active:scale-95"
                        >
                          <Heart className="w-3.5 h-3.5 fill-[#0a2240]" />
                          <span>Donate ₹{donateAmount}</span>
                        </button>
                      </div>
                    </div>

                    {/* Tile Bottom Action Bar */}
                    <div className="p-2.5 sm:p-3.5 bg-white border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm font-normal text-[#0a2240] group-hover:text-[#da8a24] transition-colors">
                      <span className="flex items-center gap-1 truncate">
                        <Eye className="w-3.5 h-3.5 text-[#da8a24] shrink-0" />
                        <span className="truncate">View Details</span>
                      </span>
                      <ChevronRightIcon className="w-4 h-4 text-[#da8a24] transform group-hover:translate-x-1 transition-transform shrink-0" />
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

        </div>
      </section>

      {/* 6. ORGANIC SECTION DIVIDER */}
      <LightToDarkDivider bgFrom="#f8fafc" bgTo="#071b34" />

      {/* 7. SUPPORT OUR CAUSE CTA */}
      <section className="py-8 sm:py-10 bg-[#071b34] text-white relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#da8a24]/8 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          
          {/* Card Container */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-center bg-transparent border-0 shadow-none p-0 relative overflow-hidden">
            
            {/* 1. Featured Image Column */}
            <div className="md:col-span-3 relative h-36 sm:h-40 w-full rounded-xl overflow-hidden border-0 shadow-none bg-[#071b34] shrink-0">
              <img
                src={heroChildLongingMeal}
                alt="Truth Foundation - Happy Moments"
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* 2. Content Column */}
            <div className="md:col-span-5 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#da8a24] text-[#0a2240] flex items-center justify-center font-normal shadow-none">
                <Heart className="w-4 h-4 fill-[#0a2240]" />
              </div>
              
              <h2 className="text-xl sm:text-2xl font-normal text-white tracking-tight leading-snug">
                Be a Part of More Happy Moments
              </h2>
              
              <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
                Every contribution directly funds wholesome daily meals, educational books, special needs therapy, and shelter for children and seniors across Chennai & Thiruvallur.
              </p>
            </div>

            {/* 3. CTA Buttons Column */}
            <div className="md:col-span-4 flex flex-col gap-2 justify-center">
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  pixelTracker.trackDonateClick(500, 'Gallery Page Support CTA');
                  onOpenDonateModal(500);
                }}
                className="bg-[#da8a24] hover:bg-[#c77a1e] text-[#0a2240] font-normal px-5 py-2.5 rounded-xl shadow-none border-0 transition flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm uppercase tracking-wider"
              >
                <Heart className="w-3.5 h-3.5 fill-[#0a2240]" />
                <span>Donate Now</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate('contact')}
                className="bg-[#071b34] hover:bg-[#163863] text-white border border-[#da8a24]/30 font-normal px-5 py-2.5 rounded-xl shadow-none transition flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm"
              >
                <Users className="w-3.5 h-3.5 text-[#da8a24]" />
                <span>Contact Our Team</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#da8a24]" />
              </motion.button>
            </div>

          </div>

        </div>
      </section>

      {/* 8. ORGANIC SECTION DIVIDER */}
      <DarkToLightDivider bgFrom="#071b34" bgTo="#0a2240" />

      {/* 7. FULL STORY LIGHTBOX MODAL */}
      {activeStoryItem && createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] bg-[#040f1a]/98 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 lg:p-8 overflow-hidden"
            onClick={() => setActiveStoryItem(null)}
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
                onClick={() => setActiveStoryItem(null)}
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
                  <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm pt-1">
                    <span className="bg-[#da8a24] text-[#0a2240] font-normal px-3 py-1 rounded-none uppercase tracking-wider text-xs flex items-center gap-1 border-0">
                      <Sparkles className="w-3.5 h-3.5" />{activeStoryItem.category}
                    </span>
                    <span className="text-slate-200 flex items-center gap-1 bg-[#0a2240] px-3 py-1 rounded-none border-0 font-normal">
                      <MapPin className="w-3.5 h-3.5 text-[#da8a24]" />
                      {activeStoryItem.location}
                    </span>
                    {activeStoryItem.impactStat && (
                      <span className="text-[#da8a24] flex items-center gap-1 bg-[#da8a24]/10 px-3 py-1 rounded-none border-0 font-normal">
                        <Users className="w-3.5 h-3.5" />
                        {activeStoryItem.impactStat.label}: {activeStoryItem.impactStat.value}
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-normal text-white leading-tight">{activeStoryItem.title}</h3>
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">{activeStoryItem.description}</p>

                  {activeStoryItem.storyDetails && (
                    <div className="bg-[#0a2240] p-4 rounded-none border-0 text-sm text-slate-200 leading-relaxed space-y-1">
                      <span className="text-[#da8a24] font-normal block text-xs uppercase tracking-wider">Field Narrative & Impact</span>
                      <p className="font-normal">{activeStoryItem.storyDetails}</p>
                    </div>
                  )}

                  {activeStoryItem.quote && (
                    <div className="bg-[#da8a24]/10 border-0 p-3.5 rounded-none flex items-start gap-3">
                      <Quote className="w-4 h-4 text-[#da8a24] shrink-0 mt-0.5" />
                      <p className="text-xs sm:text-sm italic font-normal text-amber-200">{activeStoryItem.quote}</p>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-[#163863] mt-2">
                  <button
                    onClick={() => {
                      pixelTracker.trackDonateClick(500, `Gallery Page: ${activeStoryItem.title}`);
                      setActiveStoryItem(null);
                      onOpenDonateModal(500);
                    }}
                    className="w-full bg-[#da8a24] hover:bg-[#c77a1e] text-[#0a2240] font-normal px-6 py-3.5 rounded-none shadow-none transition flex items-center justify-center gap-2 cursor-pointer text-sm uppercase tracking-wider"
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
