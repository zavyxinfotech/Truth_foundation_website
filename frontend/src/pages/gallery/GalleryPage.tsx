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
  Stethoscope,
  Cake,
  Video,
  Play
} from 'lucide-react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { FloatingWhatsApp } from '../../components/FloatingWhatsApp';
import { Picture } from '../../components/Picture';
import { DarkToLightDivider, LightToDarkDivider } from '../../components/SectionDividers';
import { GALLERY_ITEMS, LOCAL_GALLERY_IMAGE_MAP } from '../../data/campaignData';
import { GalleryItem } from '../../types';
import { pixelTracker } from '../../utils/pixelTracker';
import { fetchGalleryImages } from '../../utils/cmsApi';

// Real Project Media Imports
import childrenEatingMealsBg from '../../assets/images/children_eating_meals_background.jpg?w=1200&format=webp';
import galleryHeroBg from '../../assets/images/gallery_hero_children_gate.jpg';
import giveLoveHandsHeart from '../../assets/images/give_love_hands_heart.png';
import video3 from '../../assets/videos/video3.mp4';
import video4 from '../../assets/videos/video4.mp4';

interface GalleryPageProps {
  onOpenDonateModal: (amount?: number) => void;
  onNavigate: (page: 'home' | 'about' | 'gallery' | 'contact' | 'donate', anchor?: string) => void;
}

const CATEGORY_ITEMS = [
  { label: 'All', icon: LayoutGrid },
  { label: 'Videos', icon: Video },
  { label: 'Meals', icon: Home },
  { label: 'Education', icon: BookOpen },
  { label: 'Medical', icon: Stethoscope },
  { label: 'Volunteers', icon: HeartHandshake },
  { label: 'Birthday Celebrations', icon: Cake },
  { label: 'Events', icon: Calendar }
];

const CATEGORY_DONATION_AMOUNTS: Record<string, number> = {
  All: 500,
  Videos: 500,
  Meals: 500,
  Education: 1000,
  Medical: 1500,
  Volunteers: 500,
  'Birthday Celebrations': 1000,
  Events: 750
};

// Recent Donation Information mapped to categories for prominent donor impact cards
const RECENT_DONATION_MAP: Record<string, { donor: string; amount: number; cause: string; location: string }> = {
  'Education': { donor: 'Ananya Sharma', amount: 2500, cause: 'Monthly Education Kit & Books', location: 'Anna Nagar' },
  'Meals': { donor: 'Karthik Subramanian', amount: 1500, cause: '30 Wholesome Meals for Children', location: 'Redhills' },
  'Medical': { donor: 'Priya Sundaram', amount: 750, cause: 'Senior Care & Daily Medicines', location: 'Tambaram' },
  'Volunteers': { donor: 'Vignesh Kumar', amount: 1000, cause: 'Evening Tuition Support & Kits', location: 'Thiruvallur' },
  'Birthday Celebrations': { donor: 'Rajesh Natarajan', amount: 3000, cause: 'Birthday Feast & Special Cake', location: 'Velachery' },
  'Events': { donor: 'Divya & Arun', amount: 1200, cause: 'Community Feast & Relief Kits', location: 'Redhills' },
  'Videos': { donor: 'Sangeetha R.', amount: 800, cause: 'Fresh Fruits & Wholesome Diet', location: 'Mylapore' },
  'All': { donor: 'Meera Krishnan', amount: 5000, cause: 'Special Needs Care & Nutrition', location: 'Adyar' }
};

const DEFAULT_VIDEO_ITEMS = [
  {
    id: 'vid_nutrition_care',
    title: 'Children Nutrition & Daily Campus Care',
    category: 'Videos',
    image: 'https://res.cloudinary.com/xsuj7lkd/video/upload/so_2,w_800,c_fill,q_auto,f_jpg/v1793165936/truth_foundation_gallery/truth_foundation_field_video_3.jpg',
    videoUrl: 'https://res.cloudinary.com/xsuj7lkd/video/upload/v1793165936/truth_foundation_gallery/truth_foundation_field_video_3.mp4',
    localFallbackUrl: video3,
    location: 'Truth Foundation Redhills Campus, Chennai',
    date: 'Field Activity Video',
    description: 'Field video documenting daily wholesome meal preparation, nutrition support, and loving environment for 41 children at Truth Foundation Redhills campus.',
    quote: '“Seeing the joy and nourishment our children receive every single day is our greatest reward.”',
    aspectRatio: 'wide',
    impactStat: { label: 'Daily Care', value: '41 Children' },
    beneficiaries: '41 Resident Boys & Girls',
    readTime: 'Video • 6 min',
    storyDetails: 'Field video documenting daily wholesome meal preparation, nutrition support, and loving environment at Truth Foundation Redhills campus.',
    isVideo: true
  },
  {
    id: 'vid_tuition_empowerment',
    title: 'Rural Evening Tuition & Youth Empowerment',
    category: 'Videos',
    image: 'https://res.cloudinary.com/xsuj7lkd/video/upload/so_2,w_800,c_fill,q_auto,f_jpg/v1793165797/truth_foundation_gallery/truth_foundation_field_video_4.jpg',
    videoUrl: 'https://res.cloudinary.com/xsuj7lkd/video/upload/v1793165797/truth_foundation_gallery/truth_foundation_field_video_4.mp4',
    localFallbackUrl: video4,
    location: 'Rural Tuition Centers, Thiruvallur',
    date: 'Field Activity Video',
    description: 'Field video highlighting education support, evening tuition classes, textbooks, and hygiene kit distribution across rural centers.',
    quote: '“Education is the foundation for lasting social change and dignity.”',
    aspectRatio: 'wide',
    impactStat: { label: 'Tuition', value: '346 Students' },
    beneficiaries: '346 Rural Tuition Students',
    readTime: 'Video • 2 min',
    storyDetails: 'Field video highlighting education support, evening tuition classes, textbooks, and hygiene kit distribution across rural centers.',
    isVideo: true
  }
];

function resolveGalleryImage(url: string | any, title?: string): any {
  if (!url) return null;
  if (typeof url !== 'string') return url;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;

  // Match key from LOCAL_GALLERY_IMAGE_MAP
  for (const [key, pic] of Object.entries(LOCAL_GALLERY_IMAGE_MAP)) {
    if (url.includes(key)) {
      return pic;
    }
  }

  // Match title in GALLERY_ITEMS
  if (title) {
    const matched = GALLERY_ITEMS.find((it) => it.title?.trim().toLowerCase() === title.trim().toLowerCase());
    if (matched?.image) return matched.image;
  }

  return url;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ onOpenDonateModal, onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeStoryItem, setActiveStoryItem] = useState<any | null>(null);
  const [galleryList, setGalleryList] = useState<any[]>([...DEFAULT_VIDEO_ITEMS, ...GALLERY_ITEMS]);

  // Load photos & videos dynamically from Supabase database
  useEffect(() => {
    fetchGalleryImages().then((dbImgs) => {
      if (dbImgs && dbImgs.length > 0) {
        const dynamicItems = dbImgs.map((img) => {
          const isVideo = img.category === 'Videos' || img.image_url?.endsWith('.mp4') || img.image_url?.includes('/video/upload/');
          const localFallback = img.image_url?.includes('video_3') ? video3 : img.image_url?.includes('video_4') ? video4 : null;
          
          let resolvedImage: any = img.image_url;
          if (isVideo) {
            resolvedImage = img.image_url.includes('/video/upload/')
              ? img.image_url.replace('/video/upload/', '/video/upload/so_2,w_800,c_fill,q_auto,f_jpg/')
              : (localFallback || img.image_url);
          } else {
            resolvedImage = resolveGalleryImage(img.image_url, img.title);
          }

          return {
            id: `db_${img.id}`,
            title: img.title || 'Truth Foundation Community Work',
            category: img.category,
            image: resolvedImage,
            videoUrl: isVideo ? img.image_url : null,
            localFallbackUrl: localFallback,
            isVideo,
            location: 'Truth Foundation Centers, Chennai',
            date: 'Recent Field Activity',
            description: img.description || 'Providing daily hot meals, education support, and medical care to underprivileged children.',
            quote: '“Every hot meal brings a smile and gives our children strength to learn and thrive.”',
            aspectRatio: 'wide',
            impactStat: { label: img.category, value: isVideo ? 'Video Story' : 'Active Care' },
            beneficiaries: 'Underprivileged Children & Elders',
            readTime: isVideo ? 'Video • Watch Story' : '2 min read',
            storyDetails: img.description || 'Our foundation conducts humanitarian drives across northern Chennai and Thiruvallur districts.'
          };
        });

        // Combine DB items with local video fallback to ensure videos always appear
        const hasDbVideos = dynamicItems.some((it) => it.isVideo);
        setGalleryList(hasDbVideos ? dynamicItems : [...DEFAULT_VIDEO_ITEMS, ...dynamicItems]);
      }
    });
  }, []);

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
    ? galleryList
    : galleryList.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-clip bg-[#0a2240] text-slate-900 font-sans antialiased selection:bg-[#da8a24] selection:text-[#0a2240] relative">
      
      {/* 1. Header (EXACT EXISTING NAVBAR - UNCHANGED) */}
      <Header
        currentPage="gallery"
        onOpenDonateModal={onOpenDonateModal}
        onNavigate={onNavigate}
      />

      {/* 2. GALLERY HERO SECTION WITH BACKGROUND IMAGES */}
      <section className="pt-20 sm:pt-36 pb-12 sm:pb-20 bg-slate-950 text-white relative overflow-x-clip min-h-[55vh] sm:min-h-[75vh] lg:min-h-screen flex items-center">
        
        {/* Desktop Hero Background Image (Children at Truth Home Gate) */}
        <div 
          className="hidden sm:block absolute inset-0 w-full h-full bg-cover bg-[position:center_top] sm:bg-[center_top_15%] pointer-events-none opacity-95"
          style={{ backgroundImage: `url(${galleryHeroBg})` }}
        />

        {/* Mobile Background Ambient Tone */}
        <div 
          className="block sm:hidden absolute inset-0 w-full h-full bg-cover bg-[position:center_top] pointer-events-none opacity-30"
          style={{ backgroundImage: `url(${galleryHeroBg})` }}
        />

        {/* Neutral Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/75 via-black/35 to-transparent pointer-events-none" />

        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10 w-full">
          
          <div className="max-w-3xl space-y-5">
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              {/* Mobile View: Dedicated Full-Width Image so every child & gate is 100% visible without cropping */}
              <div className="block sm:hidden w-full overflow-hidden rounded-none shadow-2xl border border-white/20 mb-4">
                <img
                  src={galleryHeroBg}
                  alt="Truth Foundation Children & Volunteers at Gate"
                  className="w-full h-auto object-cover object-top"
                />
              </div>

              {/* Main Heading: All White, Non-bold & Enlarged */}
              <h1 className="text-3xl sm:text-6xl lg:text-[64px] font-normal text-white tracking-tight leading-[1.15]">
                A Glimpse into Lives We Touch
              </h1>

              {/* Concise Paragraph Description: Non-bold & Enlarged */}
              <p className="text-base sm:text-xl lg:text-2xl text-slate-200 font-normal leading-relaxed max-w-[660px] drop-shadow-sm">
                Visual moments of warm meals, educational supplies, healthcare support, and care delivered across our centers in Tamil Nadu.
              </p>

              {/* Hero CTA Buttons matching other pages */}
              <div className="pt-2 flex flex-row items-center justify-start gap-3 sm:gap-4 flex-wrap xs:flex-nowrap">
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    pixelTracker.trackDonateClick(500, 'Gallery Page Hero CTA');
                    onOpenDonateModal(500);
                  }}
                  className="bg-[#da8a24] hover:bg-[#c77a1e] text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl min-h-[48px] sm:min-h-[52px] font-semibold text-sm sm:text-base uppercase tracking-wider shadow-xl transition flex items-center justify-center gap-2.5 cursor-pointer whitespace-nowrap"
                >
                  <Heart className="w-4.5 h-4.5 sm:w-5 sm:h-5 fill-white text-white shrink-0" />
                  <span>Support Our Cause</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onNavigate('contact')}
                  className="bg-[#071b34] hover:bg-[#163863] text-white border border-[#da8a24]/50 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl min-h-[48px] sm:min-h-[52px] font-semibold text-sm sm:text-base uppercase tracking-wider shadow-md transition flex items-center justify-center gap-2.5 cursor-pointer whitespace-nowrap"
                >
                  <Users className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-[#da8a24] shrink-0" />
                  <span>Contact Our Team</span>
                </motion.button>
              </div>
            </motion.div>

          </div>

        </div>

        {/* ORGANIC WAVES SECTION DIVIDER */}
        <div className="absolute -bottom-1 left-0 right-0 z-20 pointer-events-none">
          <DarkToLightDivider bgFrom="transparent" bgTo="#f8fafc" />
        </div>
      </section>

      {/* 5. PHOTO GALLERY HEADER & FILTERABLE GRID (#f8fafc Light Section) */}
      <section className="py-8 sm:py-24 bg-[#f8fafc] text-slate-900 relative overflow-hidden">
        
        {/* Minimal Shade Hands Watermark Behind Gallery Images */}
        <div 
          className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden flex items-center justify-center"
          aria-hidden="true"
        >
          <img
            src={giveLoveHandsHeart}
            alt=""
            className="w-full max-w-[1100px] h-auto object-contain opacity-[0.04] grayscale contrast-125 filter mix-blend-multiply"
          />
        </div>

        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 lg:px-12 space-y-10 relative z-10">
          
          {/* Header & Horizontal Filter Rail (Options Below Text) */}
          <div className="flex flex-col gap-6 border-b border-slate-200 pb-8">
            <div className="space-y-2">
              <span className="text-[#da8a24] font-normal text-sm sm:text-base uppercase tracking-widest block">
                PHOTO GALLERY
              </span>
              <h2 className="text-3xl sm:text-5xl font-normal text-[#0a2240] tracking-tight">
                Our Journey in Pictures
              </h2>
              {/* Single Line Subtext with Increased Font Size */}
              <p className="text-base sm:text-lg text-slate-600 font-normal whitespace-nowrap overflow-x-auto">
                Real stories. Real people. Real change.
              </p>
            </div>

            {/* Category Filter Rail (Placed Below Header Text) */}
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none [scrollbar-width:none]">
              {CATEGORY_ITEMS.map((cat) => {
                const IconComponent = cat.icon;
                const isSelected = selectedCategory === cat.label;
                return (
                  <button
                    key={cat.label}
                    onClick={() => setSelectedCategory(cat.label)}
                    className={`px-4 py-2.5 rounded-lg text-sm sm:text-base font-normal transition-all cursor-pointer flex items-center gap-2 shrink-0 border-0 ${
                      isSelected
                        ? 'bg-[#da8a24] text-white'
                        : 'bg-white text-[#0a2240] hover:bg-slate-100'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-[#da8a24]'}`} />
                    <span>{cat.label === 'All' ? 'All Media' : cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Gallery Grid - 2 Columns on Mobile, 3 Columns on Tablet, 4 Columns on Desktop */}
          <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
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
                    className="bg-white rounded-none overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    {/* Top: Image/Video Tile with sharp corners (rounded-none) - Clicking opens media preview / plays video */}
                    <div
                      onClick={() => setActiveStoryItem(item)}
                      className="relative aspect-[4/3] overflow-hidden bg-[#0a2240] rounded-none cursor-pointer group/media"
                    >
                      {typeof item.image === 'string' ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover object-center group-hover/media:scale-105 transition-transform duration-500 ease-out"
                        />
                      ) : (
                        <Picture
                          picture={item.image}
                          sizes="(min-width: 1024px) 300px, (min-width: 640px) 320px, 50vw"
                          alt={item.title}
                          className="w-full h-full object-cover object-center group-hover/media:scale-105 transition-transform duration-500 ease-out"
                        />
                      )}

                      {/* Video Play Overlay Badge */}
                      {item.isVideo && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/25 group-hover/media:bg-black/10 transition-colors z-10">
                          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-none bg-[#da8a24] text-white flex items-center justify-center shadow-xl transform group-hover/media:scale-110 transition-transform">
                            <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                          </div>
                          <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-none bg-black/75 backdrop-blur-md text-xs text-white font-normal flex items-center gap-1">
                            <Video className="w-3.5 h-3.5 text-[#da8a24]" />
                            <span>Video</span>
                          </span>
                        </div>
                      )}

                      {/* Sharp Category Label */}
                      <span className="absolute top-2.5 left-2.5 bg-[#0a2240]/85 text-white font-normal text-xs uppercase tracking-wider px-2.5 py-0.5 rounded-none z-10">
                        {item.category}
                      </span>
                    </div>

                    {/* Bottom: ONLY Donation Amount and Arrow at bottom end (rounded-none, simple) - Clicking navigates to donate */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        pixelTracker.trackDonateClick(donateAmount, `Gallery Card (${item.category})`);
                        onOpenDonateModal(donateAmount);
                      }}
                      className="px-3 py-2.5 bg-white border-t border-slate-100 flex items-center justify-between gap-2 hover:bg-[#fff7ed] transition-colors rounded-none cursor-pointer group/donate"
                    >
                      <span className="text-sm sm:text-base font-medium text-[#0a2240] group-hover/donate:text-[#da8a24] flex items-center gap-1.5 transition-colors">
                        <Heart className="w-4 h-4 fill-[#da8a24] text-[#da8a24] shrink-0" />
                        <span>Donate ₹{donateAmount}</span>
                      </span>
                      <div className="w-6 h-6 flex items-center justify-center text-[#da8a24] group-hover/donate:translate-x-1 transition-transform">
                        <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

        </div>
      </section>

      {/* 7. SUPPORT OUR CAUSE CTA - Bright, clear image without dark masks or heavy glassmorphism */}
      <section className="relative text-white overflow-hidden w-full min-h-[440px] sm:min-h-[480px] lg:min-h-[520px] flex flex-col justify-between">
        
        {/* Full Image Background covering the entire height including both waves */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <img
            src={childrenEatingMealsBg}
            alt="Truth Foundation - Children Having Wholesome Meals"
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle lightened overlay to keep the photo bright and visible without heavy darkening */}
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Top Organic Wave Transition from #f8fafc into the background image */}
        <div className="relative z-10 w-full leading-none pointer-events-none select-none block -mt-px">
          <svg
            viewBox="0 0 1440 90"
            preserveAspectRatio="none"
            className="relative block w-full h-8 sm:h-14 lg:h-20"
          >
            {/* Soft accent wave */}
            <path
              d="M0,0 L1440,0 L1440,40 C1240,-10 1000,28 680,105 C360,-10 0,40 0,40 Z"
              fill="#f8fafc"
              fillOpacity="0.4"
            />
            {/* Main top wave filled with #f8fafc */}
            <path
              d="M0,0 L1440,0 L1440,40 C1320,70 1120,-10 840,28 C560,100 280,-25 0,55 Z"
              fill="#f8fafc"
            />
          </svg>
        </div>

        {/* Center CTA Content - Aligned at left end, buttons at right end */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-8 sm:py-12 md:py-14 my-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 sm:gap-8 lg:gap-12">
            
            {/* Left End: Content */}
            <div className="max-w-2xl space-y-3 text-left">
              <div className="w-9 h-9 rounded-xl bg-[#da8a24] text-white flex items-center justify-center font-normal shadow-none">
                <Heart className="w-4.5 h-4.5 fill-white text-white" />
              </div>
              
              <h2 className="text-[26px] sm:text-3xl lg:text-[34px] font-normal text-white tracking-tight leading-snug drop-shadow-md">
                Be a Part of More Happy Moments
              </h2>
              
              <p className="text-[17px] sm:text-lg text-white/95 font-normal leading-relaxed max-w-xl drop-shadow-md">
                Every contribution directly funds wholesome daily meals, educational books, special needs therapy, and shelter for children and seniors across Chennai & Thiruvallur.
              </p>
            </div>

            {/* Right End: Buttons */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0 w-full sm:w-auto md:w-56 items-stretch md:items-end">
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  pixelTracker.trackDonateClick(500, 'Gallery Page Support CTA');
                  onOpenDonateModal(500);
                }}
                className="bg-[#da8a24] hover:bg-[#c77a1e] text-white font-normal px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl shadow-none border-0 transition flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base uppercase tracking-wider w-full"
              >
                <Heart className="w-4 h-4 fill-white text-white" />
                <span>Donate Now</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate('contact')}
                className="bg-[#071b34]/90 hover:bg-[#163863] text-white border border-[#da8a24]/30 font-normal px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl shadow-none transition flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base w-full"
              >
                <Users className="w-4 h-4 text-[#da8a24]" />
                <span>Contact Our Team</span>
                <ArrowRight className="w-4 h-4 text-[#da8a24]" />
              </motion.button>
            </div>

          </div>
        </div>

        {/* Bottom Organic Wave Transition from background image into #f8fafc footer */}
        <div className="relative z-10 w-full leading-none pointer-events-none select-none block -mb-px">
          <svg
            viewBox="0 0 1440 90"
            preserveAspectRatio="none"
            className="relative block w-full h-8 sm:h-14 lg:h-20"
          >
            {/* Soft accent wave */}
            <path
              d="M0,32 C280,96 560,0 840,64 C1120,128 1320,32 1440,48 L1440,95 L0,95 Z"
              fill="#f8fafc"
              fillOpacity="0.4"
            />
            {/* Main bottom wave filled with #f8fafc */}
            <path
              d="M0,48 C320,110 640,-10 960,75 C1200,130 1360,35 1440,55 L1440,95 L0,95 Z"
              fill="#f8fafc"
            />
          </svg>
        </div>

      </section>

      {/* 7. FULL STORY LIGHTBOX MODAL (GLASSMORPHISM & RESPONSIVE MOBILE ALIGNMENT) */}
      {activeStoryItem && createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] bg-[#040f1a]/85 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 lg:p-8 overflow-hidden"
            onClick={() => setActiveStoryItem(null)}
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: 24 }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#071b34]/80 backdrop-blur-xl border border-white/15 rounded-2xl max-w-2xl sm:max-w-3xl lg:max-w-5xl w-full overflow-hidden shadow-2xl relative flex flex-col lg:grid lg:grid-cols-12 max-h-[90vh] my-auto"
            >
              {/* Close button */}
              <button
                onClick={() => setActiveStoryItem(null)}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 z-50 bg-[#da8a24] text-white hover:bg-rose-600 hover:text-white p-2 sm:p-2.5 rounded-full border-0 shadow-lg transition-all transform hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center"
                aria-label="Close modal"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              </button>

              {/* Media side - Image or Video Player */}
              <div className="lg:col-span-5 relative bg-[#040f1a]/40 backdrop-blur-md p-3 sm:p-4 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-white/10 shrink-0">
                {activeStoryItem.isVideo ? (
                  <div className="relative w-full aspect-video max-h-[32vh] sm:max-h-[42vh] lg:max-h-[75vh] flex items-center justify-center bg-black rounded-xl overflow-hidden shadow-xl">
                    <video
                      key={activeStoryItem.id || activeStoryItem.videoUrl}
                      src={activeStoryItem.videoUrl || activeStoryItem.localFallbackUrl}
                      controls
                      autoPlay
                      playsInline
                      className="w-full h-full object-contain rounded-xl"
                    >
                      {activeStoryItem.videoUrl && (
                        <source src={activeStoryItem.videoUrl} type="video/mp4" />
                      )}
                      {activeStoryItem.localFallbackUrl && (
                        <source src={activeStoryItem.localFallbackUrl} type="video/mp4" />
                      )}
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ) : typeof activeStoryItem.image === 'string' ? (
                  <img
                    src={activeStoryItem.image}
                    alt={activeStoryItem.title}
                    className="w-full h-full max-h-[32vh] sm:max-h-[42vh] lg:max-h-[75vh] object-cover rounded-xl shadow-lg"
                  />
                ) : (
                  <Picture
                    picture={activeStoryItem.image}
                    sizes="(min-width: 1024px) 420px, calc(100vw - 2rem)"
                    alt={activeStoryItem.title}
                    loading="eager"
                    className="w-full h-full max-h-[32vh] sm:max-h-[42vh] lg:max-h-[75vh] object-cover rounded-xl shadow-lg"
                  />
                )}

                {/* Category Label Overlay UPON the Image */}
                <span className="absolute top-5 left-5 bg-[#da8a24] text-white font-semibold text-xs uppercase tracking-wider px-3 py-1 rounded-md shadow-md z-20 flex items-center gap-1">
                  {activeStoryItem.isVideo && <Video className="w-3.5 h-3.5" />}
                  <span>{activeStoryItem.category}</span>
                </span>
              </div>

              {/* Details side (No background color for Location/Person, No Field Narrative Section) */}
              <div className="lg:col-span-7 p-4 sm:p-7 space-y-4 overflow-y-auto max-h-[60vh] lg:max-h-[85vh] flex flex-col justify-between scrollbar-thin">
                <div className="space-y-3.5 pr-1 sm:pr-2">
                  {/* Location & Impact Stats (Clean Text - No Pill Backgrounds) */}
                  <div className="flex flex-wrap items-center gap-3 text-sm sm:text-base pt-1">
                    <span className="text-[#da8a24] flex items-center gap-1 font-normal">
                      <MapPin className="w-3.5 h-3.5 text-[#da8a24]" />
                      {activeStoryItem.location}
                    </span>
                    {activeStoryItem.impactStat && (
                      <span className="text-amber-200/90 flex items-center gap-1 font-normal">
                        <Users className="w-3.5 h-3.5 text-[#da8a24]" />
                        {activeStoryItem.impactStat.label}: {activeStoryItem.impactStat.value}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl sm:text-3xl font-normal text-white leading-tight">{activeStoryItem.title}</h3>
                  <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">{activeStoryItem.description}</p>

                  {activeStoryItem.quote && (
                    <div className="bg-[#da8a24]/10 backdrop-blur-md border border-[#da8a24]/20 p-3.5 rounded-xl flex items-start gap-3">
                      <Quote className="w-4 h-4 text-[#da8a24] shrink-0 mt-0.5" />
                      <p className="text-sm sm:text-base italic font-normal text-amber-200">{activeStoryItem.quote}</p>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-white/10 mt-2">
                  <button
                    onClick={() => {
                      pixelTracker.trackDonateClick(500, `Gallery Page: ${activeStoryItem.title}`);
                      setActiveStoryItem(null);
                      onOpenDonateModal(500);
                    }}
                    className="w-full bg-[#da8a24] hover:bg-[#c77a1e] text-white font-normal px-6 py-3.5 rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base uppercase tracking-wider active:scale-95"
                  >
                    <Heart className="w-4 h-4 fill-white text-white animate-pulse" />
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

      {/* 12. Floating WhatsApp & Donate Widget */}
      <FloatingWhatsApp onOpenDonateModal={onOpenDonateModal} />

    </div>
  );
};
