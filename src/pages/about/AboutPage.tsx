import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  Home,
  GraduationCap,
  HeartHandshake,
  BookOpen,
  Award,
  ShieldCheck,
  Users,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Building2,
  FileCheck2,
  Lock,
  Camera,
  Compass,
  Utensils,
  Shirt,
  Stethoscope
} from 'lucide-react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { FloatingWhatsApp } from '../../components/FloatingWhatsApp';
import { DarkToLightDivider, LightToDarkDivider } from '../../components/SectionDividers';
import { pixelTracker } from '../../utils/pixelTracker';

// Real Project Image Imports
import aboutHeroBgDesktop from '../../assets/images/about_page_hero_section_desktop_view.jpeg';
import aboutHeroBgMobile from '../../assets/images/Gallery_page_hero_background_img_mobile_view.jpeg';
import storyImage from '../../assets/images/hero_redhills_orphanage.jpg?w=800&format=webp';
import ctaImage from '../../assets/images/trust_section_organic_meal.jpg?w=800&format=webp';

import heroRedhillsOrphanage from '../../assets/images/hero_redhills_orphanage.jpg?w=800&format=webp';
import elderlyFoodCareDrive from '../../assets/images/elderly_food_care_drive.jpg?w=800&format=webp';
import heroSpecialNeedsCare from '../../assets/images/hero_special_needs_care.jpg?w=800&format=webp';
import heroTuitionSchoolMeals from '../../assets/images/hero_tuition_school_meals.jpg?w=800&format=webp';

import sponsorMealImg from '../../assets/images/Sponsor_meal.jpeg?w=600&format=webp';
import sponsorVegMealImg from '../../assets/images/Sponsor_veg_meal.jpeg?w=600&format=webp';
import sponsorVegDinnerImg from '../../assets/images/Sponsor_veg_dinner.jpeg?w=600&format=webp';
import sponsorEducationImg from '../../assets/images/Education_support.jpeg?w=600&format=webp';
import sponsorHealthcareImg from '../../assets/images/Healthcare_support.jpeg?w=600&format=webp';
import sponsorClothingImg from '../../assets/images/clothing_support.jpeg?w=600&format=webp';

interface AboutPageProps {
  onOpenDonateModal: (amount?: number) => void;
  onNavigate: (page: 'home' | 'about' | 'gallery' | 'contact' | 'donate', anchor?: string) => void;
}

const STATS_CARDS = [
  { label: 'Years of Service', value: '14+', subtitle: 'Est. 5th July 2010', icon: Calendar },
  { label: 'Orphanage Children', value: '45', subtitle: 'Resident Boys & Girls', icon: Home },
  { label: 'Elderly Seniors', value: '20', subtitle: 'Day Care & Shelter', icon: HeartHandshake },
  { label: 'Special Needs Kids', value: '23', subtitle: 'Free Van Transportation', icon: GraduationCap },
  { label: 'Tuition Students', value: '346', subtitle: 'Across 8 Centers', icon: BookOpen }
];

const PROGRAMS = [
  {
    icon: Home,
    title: 'Redhills Orphanage Home',
    location: 'Redhills, Northern Chennai',
    tag: '15+ Years Active',
    image: heroRedhillsOrphanage,
    description: 'Operating on an acre of land with separate dormitories, study halls, hygienic dining facilities, and playgrounds for 45 resident boys and girls.',
    details: [
      'Separate dormitories & study rooms for boys & girls',
      '16 committed full-time & part-time caregivers',
      'Nutritious 3-meal daily diet & medical checkups',
      'Extracurricular activities & annual sports days'
    ]
  },
  {
    icon: HeartHandshake,
    title: 'Old Age Day Care Center',
    location: 'Redhills Campus, Chennai',
    tag: 'Senior Care',
    image: elderlyFoodCareDrive,
    description: 'Providing food, shelter, daily essential medication, and loving care for 20 abandoned street elderly seniors in Redhills.',
    details: [
      'Free wholesome daily meals & evening tea',
      'Periodic medical camps & prescription drugs',
      'Recreational space & daily companion care',
      'Dignified end-of-life shelter & emotional support'
    ]
  },
  {
    icon: GraduationCap,
    title: 'Rural Education & Support',
    location: 'Thiruvallur District',
    tag: 'Learning & Growth',
    image: heroSpecialNeedsCare,
    description: 'Tailored educational programs, learning resources, and doorstep van transport for underprivileged rural children.',
    details: [
      'Certified educators & community volunteers',
      'Dedicated van doorstep transportation support',
      'Learning materials, books & skill development',
      'Nutritious snacks & individual progress tracking'
    ]
  },
  {
    icon: BookOpen,
    title: '8 Evening Tuition Centers',
    location: 'Chennai & Thiruvallur Districts',
    tag: '346 Children',
    image: heroTuitionSchoolMeals,
    description: 'Free evening tuition across 8 centers in Vyasarpadi, Pulianthope, Surapattu, Periyapalem, Vichoor, Perungavoor, Athipattu, and Thirumullaivoyal.',
    details: [
      'Free evening tutoring by qualified educators',
      'School bags, notebooks, textbooks & stationery',
      'Daily evening protein snacks & wholesome meals',
      'Hygiene kits: soaps, shampoos, footwear & toothbrush'
    ]
  }
];

const JOURNEY_MILESTONES = [
  {
    year: '2010',
    title: 'Trust Foundation Established',
    desc: 'Registered Public Charitable Trust (Reg No. 132/2010) launched on 5th July 2010 in Chennai.'
  },
  {
    year: '2012',
    title: 'Redhills Orphanage Home',
    desc: 'Established 1-acre campus providing dormitories, dining, and healthcare for 45 resident boys and girls.'
  },
  {
    year: '2015',
    title: 'Old Age Senior Care Center',
    desc: 'Opened dedicated day care and shelter providing food and medication for 20 abandoned street elders.'
  },
  {
    year: '2018',
    title: 'Special Needs Rural Support',
    desc: 'Integrated free van transportation and specialized educational care in Thiruvallur district.'
  },
  {
    year: '2022-Present',
    title: '8 Evening Tuition Centers',
    desc: 'Expanded free tuition, nutrition, and hygiene kits serving 346 children across rural & urban centers.'
  }
];

const STATUTORY_CREDENTIALS = [
  { title: 'Registered Public Trust', desc: 'Reg. No. 132/2010 • Govt. of Tamil Nadu', icon: Building2 },
  { title: '80G Tax Exemption', desc: '50% Tax Exemption for Donors under IT Act', icon: FileCheck2 },
  { title: '12A Income Tax Cert.', desc: 'Tax Exempt Charitable Entity Status', icon: ShieldCheck },
  { title: 'NITI Aayog Darpan', desc: 'Official Govt. NGO Darpan Portal Registered', icon: Award },
  { title: 'CSR-1 Approved', desc: 'Eligible for Corporate Social Responsibility Funds', icon: Lock }
];

const SPONSOR_CAUSES = [
  {
    id: 'cause-breakfast',
    title: 'Breakfast Support',
    amount: 300,
    amountLabel: '₹300',
    image: sponsorMealImg,
    icon: Utensils,
    description: 'Provide wholesome morning breakfast meals to orphaned children and elders to start their day with energy.'
  },
  {
    id: 'cause-lunch',
    title: 'Hot Lunch & Meals',
    amount: 500,
    amountLabel: '₹500',
    image: sponsorVegMealImg,
    icon: Utensils,
    description: 'Sponsor protein-rich hot lunches for 45 orphanage kids and 20 abandoned seniors at our Redhills campus.'
  },
  {
    id: 'cause-dinner',
    title: 'Wholesome Dinner',
    amount: 1000,
    amountLabel: '₹1,000',
    image: sponsorVegDinnerImg,
    icon: Utensils,
    description: 'Provide freshly cooked warm dinner meals for resident children and evening tuition students.'
  },
  {
    id: 'cause-education',
    title: 'Education & Tuition Support',
    amount: 2500,
    amountLabel: '₹2,500',
    image: sponsorEducationImg,
    icon: GraduationCap,
    description: 'Sponsor school backpacks, textbooks, notebooks, and learning tools for 346 evening tuition children.'
  },
  {
    id: 'cause-healthcare',
    title: 'Healthcare & Medical Support',
    amount: 1500,
    amountLabel: '₹1,500',
    image: sponsorHealthcareImg,
    icon: Stethoscope,
    description: 'Support periodic medical checkups, essential prescription drugs, and health drives for elders & kids.'
  },
  {
    id: 'cause-clothing',
    title: 'Clothing & Hygiene Kits',
    amount: 1000,
    amountLabel: '₹1,000',
    image: sponsorClothingImg,
    icon: Shirt,
    description: 'Provide new clothing, footwear, soaps, shampoos, and personal hygiene supplies for resident children.'
  }
];

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenDonateModal, onNavigate }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [openPillar, setOpenPillar] = useState<'vision' | 'mission' | 'values' | null>('vision');
  const [currentProgramIndex, setCurrentProgramIndex] = useState(0);

  const handleNextProgram = () => {
    setCurrentProgramIndex((prev) => (prev + 1) % PROGRAMS.length);
  };

  const handlePrevProgram = () => {
    setCurrentProgramIndex((prev) => (prev - 1 + PROGRAMS.length) % PROGRAMS.length);
  };

  useEffect(() => {
    const programTimer = setInterval(() => {
      setCurrentProgramIndex((prev) => (prev + 1) % PROGRAMS.length);
    }, 4000);
    return () => clearInterval(programTimer);
  }, []);

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

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => {
        const nextIdx = (prev + 1) % PROGRAMS.length;
        scrollToCard(nextIdx);
        return nextIdx;
      });
    }, 3600);

    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-clip bg-[#0a2240] text-slate-900 font-sans antialiased selection:bg-[#da8a24] selection:text-[#0a2240] relative">
      
      {/* 1. Header (EXACT EXISTING NAVBAR - UNCHANGED) */}
      <Header
        currentPage="about"
        onOpenDonateModal={onOpenDonateModal}
        onNavigate={onNavigate}
      />

      {/* 2. HERO SECTION (Dark Navy #0a2240 - FULL DESKTOP HEIGHT) */}
      <section className="pt-28 sm:pt-36 pb-12 sm:pb-16 bg-[#0a2240] text-white relative overflow-hidden min-h-[75vh] lg:min-h-screen flex items-center">
        {/* Desktop Background Image (Hidden on Mobile) */}
        <div 
          className="hidden md:block absolute inset-0 w-full h-full bg-cover bg-center lg:bg-top pointer-events-none opacity-85"
          style={{ backgroundImage: `url(${aboutHeroBgDesktop})` }}
        />

        {/* Mobile Background Image (Block on Mobile, Hidden on Desktop) */}
        <div 
          className="block md:hidden absolute inset-0 w-full h-full bg-cover bg-center pointer-events-none opacity-85"
          style={{ backgroundImage: `url(${aboutHeroBgMobile})` }}
        />

        {/* Ambient Dark Gradient Overlay for maximum text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a2240]/90 via-[#0a2240]/65 to-transparent pointer-events-none" />

        {/* Ambient Brand Glows */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#da8a24]/12 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#da8a24]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10 w-full">
          
          <div className="max-w-3xl space-y-6">
            
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Main Heading */}
              <h1 className="text-3xl sm:text-5xl lg:text-[56px] font-semibold text-white tracking-tight leading-[1.1]">
                Empowering Lives with <span className="text-[#da8a24]">Dignity, Equality</span> & Hope
              </h1>

              {/* Hero Paragraph */}
              <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-[620px]">
                TRUTH FOUNDATION is a non-profit registered Public Charitable Trust established on <span className="font-semibold text-white">5th July 2010</span> in Chennai. We are dedicated to creating a social order rooted in social justice, human rights, equal access to education, and compassionate care for orphaned children, abandoned elders, and special-needs individuals across Tamil Nadu.
              </p>

              {/* Action Buttons in One Line */}
              <div className="pt-2 flex flex-row items-center justify-center sm:justify-start gap-3 sm:gap-4 flex-wrap xs:flex-nowrap">
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    pixelTracker.trackDonateClick(500, 'About Page Hero CTA');
                    onOpenDonateModal(500);
                  }}
                  className="bg-[#da8a24] hover:bg-[#c77a1e] text-[#0a2240] font-semibold px-4 sm:px-7 py-3.5 sm:py-4 rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-base uppercase tracking-wider min-h-[44px] sm:min-h-[48px] whitespace-nowrap"
                >
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-[#0a2240] shrink-0" />
                  <span>Support Our Cause</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onNavigate('contact')}
                  className="bg-[#071b34] hover:bg-[#163863] text-white font-semibold border border-[#da8a24]/50 px-4 sm:px-7 py-3.5 sm:py-4 rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-base min-h-[44px] sm:min-h-[48px] whitespace-nowrap"
                >
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#da8a24] shrink-0" />
                  <span>Contact Our Team</span>
                </motion.button>
              </div>
            </motion.div>

          </div>

        </div>

        {/* ORGANIC WAVES SECTION DIVIDER (No Blue Bar) */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
          <DarkToLightDivider bgFrom="transparent" bgTo="#ffffff" />
        </div>
      </section>

      {/* 4. IMPACT AT A GLANCE (3D Animated Cards, Borderless Mobile View with Increased Font Size) */}
      <section className="py-16 sm:py-20 bg-white text-slate-900 relative">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 lg:px-12">
          
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-[#da8a24] font-semibold text-xs sm:text-sm uppercase tracking-widest block">
              OUR IMPACT AT A GLANCE
            </span>
            <h2 className="text-2xl sm:text-4xl font-semibold text-[#0a2240] tracking-tight">
              14 Years of Compassionate Social Work
            </h2>
          </div>

          {/* Desktop Display: Borderless & Shadowless Interactive Cards Grid */}
          <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-4">
            {STATS_CARDS.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20, delay: idx * 0.05 }}
                className={`bg-[#f8fafc] hover:bg-[#0a2240] p-4 sm:p-5 rounded-2xl border-0 shadow-none flex flex-col items-center text-center space-y-2 transition-all duration-300 cursor-pointer group ${
                  idx === STATS_CARDS.length - 1 ? 'col-span-2 md:col-span-1 lg:col-span-1' : ''
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-[#da8a24]/15 group-hover:bg-[#da8a24] text-[#da8a24] group-hover:text-[#0a2240] flex items-center justify-center mb-1 transition-colors duration-300">
                  <stat.icon className="w-7 h-7" />
                </div>
                <div className="text-3xl sm:text-4xl font-semibold text-[#0a2240] group-hover:text-white tracking-tight transition-colors duration-300">
                  {stat.value}
                </div>
                <div className="text-sm sm:text-base font-semibold text-[#0a2240]/90 group-hover:text-slate-200 transition-colors duration-300">
                  {stat.label}
                </div>
                <div className="text-xs sm:text-sm font-medium text-[#da8a24] group-hover:text-[#da8a24] transition-colors duration-300">
                  {stat.subtitle}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile Display: Borderless & Shadowless Auto-Scrolling Track */}
          <div className="md:hidden overflow-hidden relative w-full -mx-4 px-4 py-2">
            <motion.div
              animate={{ x: ['0%', '-50%'] }}
              transition={{ repeat: Infinity, duration: 16, ease: 'linear' }}
              className="flex gap-6 w-max"
            >
              {[...STATS_CARDS, ...STATS_CARDS].map((stat, idx) => (
                <div
                  key={idx}
                  className="w-[200px] shrink-0 flex flex-col items-center text-center p-5 bg-[#f8fafc] rounded-3xl border-0 shadow-none space-y-2"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#da8a24]/15 flex items-center justify-center text-[#da8a24] mb-0.5">
                    <stat.icon className="w-6 h-6 text-[#da8a24]" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-semibold text-[#0a2240] tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-sm sm:text-base font-semibold text-[#0a2240]">
                    {stat.label}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-[#da8a24]">
                    {stat.subtitle}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

        </div>
      </section>

      {/* 5. OUR ORIGIN & FOUNDATION STORY + JOURNEY TIMELINE (#f8fafc Light Section) */}
      <section className="py-16 sm:py-24 bg-[#f8fafc] text-slate-900 relative border-t border-slate-100 overflow-hidden">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 lg:px-12 space-y-16">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* LEFT COLUMN: STORY & ORGANIC SHAPED IMAGE (~50%) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6 space-y-6"
            >
              <span className="text-[#da8a24] font-semibold text-xs sm:text-sm uppercase tracking-widest block">
                OUR ORIGIN & FOUNDATION STORY
              </span>

              <h2 className="text-2xl sm:text-4xl font-semibold text-[#0a2240] tracking-tight leading-tight">
                Established on 5th July 2010 to Serve the Underprivileged
              </h2>

              {/* Custom Organic Shaped Image Container (Asymmetric Leaf / Arch Shape) */}
              <div className="relative w-full aspect-[16/10] my-8 max-w-[560px]">
                {/* Decorative Gold Accent Backdrop Shape */}
                <div className="absolute -inset-3 bg-[#da8a24]/20 rounded-tr-[90px] rounded-bl-[90px] rounded-tl-[30px] rounded-br-[30px] -rotate-2 pointer-events-none" />
                
                {/* Asymmetric Curved Organic Image Frame */}
                <div className="relative w-full h-full rounded-tr-[80px] rounded-bl-[80px] rounded-tl-[24px] rounded-br-[24px] overflow-hidden shadow-2xl border-2 border-[#da8a24]/40 bg-[#0a2240] group">
                  <img
                    src={storyImage}
                    alt="Truth Foundation Redhills Campus"
                    className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a2240]/50 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Floating Gold Stat Badge */}
                <div className="absolute -bottom-4 right-4 bg-[#0a2240] text-white px-4 py-2.5 rounded-2xl border border-[#da8a24]/40 shadow-xl flex items-center gap-3 z-20">
                  <div className="w-8 h-8 rounded-xl bg-[#da8a24]/20 text-[#da8a24] flex items-center justify-center font-semibold">
                    <Calendar className="w-4 h-4 text-[#da8a24]" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-[#da8a24]">Est. 5th July 2010</div>
                    <div className="text-xs text-slate-300">Registered NGO Trust</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed font-normal">
                <p>
                  <span className="font-semibold text-[#0a2240]">TRUTH FOUNDATION</span> was established as a registered non-governmental Public Charitable Trust under the leadership of visionary trustees in Tamil Nadu. The trust was born with a profound commitment to uplift marginalized rural communities, with a strong focus on Dalit and Tribal families, women, abandoned elderly citizens, and orphaned children.
                </p>
                <p>
                  Over the past 14 years, our operations have grown from local community support into a comprehensive social service infrastructure spanning an <span className="font-semibold text-[#0a2240]">Orphanage Home in Redhills</span>, an <span className="font-semibold text-[#0a2240]">Old Age Senior Care Center</span>, a <span className="font-semibold text-[#0a2240]">Special Needs School in Thiruvallur</span>, and <span className="font-semibold text-[#0a2240]">8 Free Evening Tuition Centers</span> across Chennai and Thiruvallur districts.
                </p>
              </div>

              {/* Verification Badges */}
              <div className="pt-2 flex flex-wrap items-center gap-3 text-xs sm:text-sm font-semibold">
                <div className="flex items-center gap-2 bg-[#da8a24]/15 text-[#0a2240] border border-[#da8a24]/30 rounded-xl px-4 py-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#da8a24]" />
                  <span>100% Direct Impact Delivery</span>
                </div>
                <div className="flex items-center gap-2 bg-[#0a2240]/10 text-[#0a2240] border border-[#0a2240]/20 rounded-xl px-4 py-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#da8a24]" />
                  <span>80G Tax Exemption Certified</span>
                </div>
              </div>
            </motion.div>

            {/* RIGHT COLUMN: OUR JOURNEY TIMELINE (~50%) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-6 space-y-6"
            >
              <span className="text-[#da8a24] font-semibold text-xs sm:text-sm uppercase tracking-widest block">
                OUR JOURNEY
              </span>
              <h2 className="text-2xl sm:text-4xl font-semibold text-[#0a2240] tracking-tight">
                14-Year Timeline of Growth & Impact
              </h2>

              <div className="relative pl-6 sm:pl-8 space-y-8 border-l-2 border-[#da8a24] pt-2">
                {JOURNEY_MILESTONES.map((milestone, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                    className="relative group"
                  >
                    {/* Gold Timeline Node */}
                    <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-[#da8a24] ring-4 ring-[#f8fafc]" />

                    <div className="bg-transparent border-0 shadow-none p-0 space-y-1.5 transition-all">
                      <span className="text-xs font-semibold text-[#da8a24] uppercase tracking-wider bg-[#da8a24]/15 px-3 py-1 rounded-full inline-block">
                        {milestone.year}
                      </span>
                      <h3 className="text-lg sm:text-xl font-semibold text-[#0a2240]">
                        {milestone.title}
                      </h3>
                      <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                        {milestone.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

            </motion.div>

          </div>

        </div>
      </section>

      {/* 6. VISION / MISSION / VALUES (STADIUM ACCORDION MATCHING REFERENCE IMAGE) */}
      <section className="py-16 sm:py-24 bg-white text-slate-900 relative">
        <div className="max-w-[960px] mx-auto px-4 sm:px-8 space-y-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[#da8a24] font-semibold text-xs sm:text-sm uppercase tracking-widest block">
              OUR FOUNDATIONAL PILLARS
            </span>
            <h2 className="text-2xl sm:text-4xl font-semibold text-[#0a2240] tracking-tight">
              Vision, Mission & Core Values
            </h2>
          </div>

          {/* Accordion Pill Rows Stacked Vertically */}
          <div className="space-y-4">
            
            {/* 1. OUR VISION (Navy Pill) */}
            <div className="overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenPillar(openPillar === 'vision' ? null : 'vision')}
                className={`w-full bg-[#071b34] text-white p-3.5 sm:p-4 px-5 sm:px-7 flex items-center justify-between cursor-pointer transition-all duration-300 ${
                  openPillar === 'vision' ? 'rounded-t-[28px] rounded-b-none' : 'rounded-l-full rounded-r-2xl sm:rounded-r-3xl'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Gold Circle Badge with Dark Navy Icon */}
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#da8a24] border-2 border-[#071b34] text-[#071b34] flex items-center justify-center font-semibold shrink-0 shadow-md">
                    <Compass className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
                  </div>
                  <span className="text-lg sm:text-xl font-semibold tracking-tight text-white">
                    Our Vision
                  </span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 sm:w-6 sm:h-6 text-white transition-transform duration-300 ${
                    openPillar === 'vision' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {openPillar === 'vision' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className="bg-[#071b34] text-white p-6 sm:p-8 rounded-b-[28px] border-t border-[#163863] space-y-4">
                      <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
                        To establish a just and equitable social order where every child, elder, and special-needs individual lives with dignity, freedom, equal opportunity, and complete access to education, nutrition, and healthcare.
                      </p>
                      <div className="pt-3 border-t border-[#163863] text-xs sm:text-sm text-[#da8a24] font-semibold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#da8a24]" />
                        <span>Equal Opportunity for All</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 2. OUR MISSION (Gold Pill) */}
            <div className="overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenPillar(openPillar === 'mission' ? null : 'mission')}
                className={`w-full bg-[#da8a24] text-[#071b34] p-3.5 sm:p-4 px-5 sm:px-7 flex items-center justify-between cursor-pointer transition-all duration-300 ${
                  openPillar === 'mission' ? 'rounded-t-[28px] rounded-b-none' : 'rounded-l-full rounded-r-2xl sm:rounded-r-3xl'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* White Circle Badge with Gold Icon */}
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-[#da8a24] flex items-center justify-center font-semibold shrink-0 shadow-md">
                    <Heart className="w-5 h-5 sm:w-6 sm:h-6 fill-[#da8a24]" />
                  </div>
                  <span className="text-lg sm:text-xl font-semibold tracking-tight text-[#071b34]">
                    Our Mission
                  </span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 sm:w-6 sm:h-6 text-[#071b34] transition-transform duration-300 ${
                    openPillar === 'mission' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {openPillar === 'mission' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className="bg-[#da8a24] text-[#071b34] p-6 sm:p-8 rounded-b-[28px] border-t border-[#071b34]/20 space-y-4">
                      <p className="text-base sm:text-lg text-[#071b34]/90 leading-relaxed font-medium">
                        Empowering rural communities through free education, evening tuition centers, specialized therapy for children with disabilities, shelter and food for abandoned seniors, and health awareness campaigns.
                      </p>
                      <div className="pt-3 border-t border-[#071b34]/20 text-xs sm:text-sm text-[#071b34] font-semibold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#071b34]" />
                        <span>Grassroots Social Transformation</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 3. OUR VALUES (Light Pill) */}
            <div className="overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenPillar(openPillar === 'values' ? null : 'values')}
                className={`w-full bg-[#f4f7fb] text-[#071b34] border border-slate-200/80 p-3.5 sm:p-4 px-5 sm:px-7 flex items-center justify-between cursor-pointer transition-all duration-300 ${
                  openPillar === 'values' ? 'rounded-t-[28px] rounded-b-none' : 'rounded-l-full rounded-r-2xl sm:rounded-r-3xl'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* White Circle Badge with Gold Outline */}
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white border-2 border-[#da8a24] text-[#da8a24] flex items-center justify-center font-semibold shrink-0 shadow-sm">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
                  </div>
                  <span className="text-lg sm:text-xl font-semibold tracking-tight text-[#071b34]">
                    Our Values
                  </span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 sm:w-6 sm:h-6 text-[#071b34] transition-transform duration-300 ${
                    openPillar === 'values' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {openPillar === 'values' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className="bg-[#f4f7fb] text-slate-900 p-6 sm:p-8 rounded-b-[28px] border-t border-slate-200 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm sm:text-base text-slate-700 font-medium">
                        <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-slate-200/60 shadow-sm">
                          <CheckCircle2 className="w-4 h-4 text-[#da8a24] shrink-0" />
                          <span>Transparency & Annual Audits</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-slate-200/60 shadow-sm">
                          <CheckCircle2 className="w-4 h-4 text-[#da8a24] shrink-0" />
                          <span>Compassion & Human Dignity</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-slate-200/60 shadow-sm">
                          <CheckCircle2 className="w-4 h-4 text-[#da8a24] shrink-0" />
                          <span>Social Justice & Inclusivity</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-slate-200/60 shadow-sm">
                          <CheckCircle2 className="w-4 h-4 text-[#da8a24] shrink-0" />
                          <span>Community Leadership & Trust</span>
                        </div>
                      </div>
                      <div className="pt-3 border-t border-slate-200 text-xs sm:text-sm text-[#da8a24] font-semibold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#da8a24]" />
                        <span>Govt. Certified Public Trust</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

        </div>
      </section>

      {/* 7. ORGANIC SECTION DIVIDER (Light to Dark) */}
      <LightToDarkDivider bgFrom="#ffffff" bgTo="#071b34" />

      {/* 8. OUR PROGRAMS / INITIATIVES SECTION (Dark Blue #071b34 Section) */}
      <section className="py-16 sm:py-24 bg-[#071b34] text-white relative overflow-hidden">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 lg:px-12 space-y-8 relative z-10">
          
          {/* Section Header: Left Eyebrow & Title, Right Small Navigation Circular Arrow Buttons */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
            <div className="space-y-1.5 max-w-2xl text-left">
              <span className="text-[#da8a24] font-semibold text-xs sm:text-sm uppercase tracking-widest block">
                WHAT WE DO
              </span>
              <h2 className="text-2xl sm:text-4xl font-semibold text-white tracking-tight">
                Our Programs
              </h2>
              <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
                Comprehensive care and support for children, elderly, and communities across Tamil Nadu.
              </p>
            </div>

            {/* Top Right Small Navigation Arrow Buttons */}
            <div className="flex items-center gap-2.5 self-end md:self-auto">
              <button
                type="button"
                onClick={handlePrevProgram}
                aria-label="Previous Program"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-slate-600 bg-[#0a2240] text-white hover:bg-[#da8a24] hover:border-[#da8a24] transition-all flex items-center justify-center cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextProgram}
                aria-label="Next Program"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#da8a24] text-[#071b34] hover:bg-white transition-all flex items-center justify-center shadow-md cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Carousel Stage Container */}
          <div className="relative w-full max-w-[1240px] mx-auto">
            
            {/* Desktop Stage (No background card, no side arrows) */}
            <div className="hidden md:flex items-center justify-between relative overflow-hidden min-h-[440px]">
              
              {/* Left Side: Active Program Image */}
              <div className="w-[44%] h-[380px] lg:h-[420px] rounded-[28px] overflow-hidden relative shadow-2xl shrink-0 bg-[#0a2240]">
                <img
                  src={PROGRAMS[currentProgramIndex].image}
                  alt={PROGRAMS[currentProgramIndex].title}
                  className="w-full h-full object-cover object-center transform transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Center Overlapping White Content Panel */}
              <motion.div
                key={currentProgramIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="w-[56%] -ml-16 relative z-20 bg-white text-slate-900 rounded-[30px] p-6 lg:p-8 border-0 shadow-none flex flex-col justify-between space-y-4"
              >
                {/* Header Row: Big 01 Number, Icon, Title, Badge */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl lg:text-5xl font-semibold text-[#da8a24]/80 tracking-tighter">
                        0{currentProgramIndex + 1}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-[#da8a24]/15 text-[#da8a24] flex items-center justify-center shrink-0">
                        {React.createElement(PROGRAMS[currentProgramIndex].icon, { className: "w-5 h-5" })}
                      </div>
                      <div>
                        <h3 className="text-lg lg:text-2xl font-semibold text-[#0a2240] leading-snug">
                          {PROGRAMS[currentProgramIndex].title}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">
                          {PROGRAMS[currentProgramIndex].location}
                        </p>
                      </div>
                    </div>
                    
                    <span className="text-xs font-semibold text-[#da8a24] bg-[#da8a24]/15 px-3 py-1 rounded-full whitespace-nowrap shrink-0">
                      {PROGRAMS[currentProgramIndex].tag}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs lg:text-sm text-slate-600 font-normal leading-relaxed">
                    {PROGRAMS[currentProgramIndex].description}
                  </p>
                </div>

                {/* Feature Bullet List */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  {PROGRAMS[currentProgramIndex].details.map((detail, dIdx) => (
                    <div key={dIdx} className="flex items-center gap-2.5 text-xs lg:text-sm text-slate-700 font-medium">
                      <div className="w-5 h-5 rounded-full bg-[#da8a24] text-white flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Right Side: Peek of Next Program Image */}
              <div
                onClick={handleNextProgram}
                className="w-[20%] h-[340px] lg:h-[380px] rounded-[24px] overflow-hidden relative opacity-75 scale-95 shrink-0 shadow-lg border border-slate-700/50 cursor-pointer hover:opacity-95 transition-all group"
              >
                <img
                  src={PROGRAMS[(currentProgramIndex + 1) % PROGRAMS.length].image}
                  alt={PROGRAMS[(currentProgramIndex + 1) % PROGRAMS.length].title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-[#0a2240]/90 backdrop-blur-sm text-[#da8a24] text-lg font-semibold px-2.5 py-0.5 rounded-lg border border-[#da8a24]/30">
                  0{(currentProgramIndex + 1) % PROGRAMS.length + 1}
                </div>
              </div>

            </div>

            {/* Mobile Stage (No background card, borderless transparent container with increased text size) */}
            <div className="block md:hidden relative overflow-hidden">
              <div className="relative flex items-center">
                
                {/* Main Content Area */}
                <div className="w-full pr-4">
                  
                  {/* Top Image */}
                  <div className="w-full h-48 sm:h-56 rounded-[22px] overflow-hidden relative shadow-lg bg-[#0a2240]">
                    <img
                      src={PROGRAMS[currentProgramIndex].image}
                      alt={PROGRAMS[currentProgramIndex].title}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  {/* Overlapping Content Box (Borderless, No Background on Mobile) */}
                  <motion.div
                    key={`mobile-${currentProgramIndex}`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="pt-4 relative z-20 bg-transparent text-white border-0 shadow-none space-y-3"
                  >
                    {/* Number + Title + Tag */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-3xl font-semibold text-[#da8a24]">
                            0{currentProgramIndex + 1}
                          </span>
                          <div className="w-8 h-8 rounded-lg bg-[#da8a24]/15 text-[#da8a24] flex items-center justify-center shrink-0">
                            {React.createElement(PROGRAMS[currentProgramIndex].icon, { className: "w-4 h-4" })}
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-[#da8a24] bg-[#da8a24]/15 px-2.5 py-0.5 rounded-full">
                          {PROGRAMS[currentProgramIndex].tag}
                        </span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-semibold text-white leading-snug">
                        {PROGRAMS[currentProgramIndex].title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 font-medium">
                        {PROGRAMS[currentProgramIndex].location}
                      </p>
                    </div>

                    <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                      {PROGRAMS[currentProgramIndex].description}
                    </p>

                    <div className="pt-2 border-t border-slate-700/60 space-y-2">
                      {PROGRAMS[currentProgramIndex].details.map((detail, dIdx) => (
                        <div key={dIdx} className="flex items-center gap-2 text-sm sm:text-base text-slate-200 font-medium">
                          <div className="w-4.5 h-4.5 rounded-full bg-[#da8a24] text-white flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-3 h-3 stroke-[3]" />
                          </div>
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                </div>

                {/* Right Peek Image on Mobile */}
                <div
                  onClick={handleNextProgram}
                  className="w-7 h-48 rounded-r-xl overflow-hidden opacity-60 absolute right-0 top-3 border-l border-slate-700 shrink-0 cursor-pointer"
                >
                  <img
                    src={PROGRAMS[(currentProgramIndex + 1) % PROGRAMS.length].image}
                    alt="Next"
                    className="w-full h-full object-cover"
                  />
                </div>

              </div>
            </div>

            {/* Pagination Indicator Dots */}
            <div className="flex justify-center items-center gap-2 mt-6">
              {PROGRAMS.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentProgramIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    currentProgramIndex === idx
                      ? 'bg-[#da8a24] w-7 h-2.5'
                      : 'bg-slate-500/50 hover:bg-slate-400 w-2.5 h-2.5'
                  }`}
                />
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* 9. ORGANIC SECTION DIVIDER (Dark to Light) */}
      <DarkToLightDivider bgFrom="#071b34" bgTo="#ffffff" />

      {/* 10. STATUTORY CREDENTIALS (TRUST & TRANSPARENCY - White #ffffff Section) */}
      <section className="py-16 sm:py-20 bg-white text-slate-900 relative">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 lg:px-12 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[#da8a24] font-semibold text-xs sm:text-sm uppercase tracking-widest block">
              TRUST & TRANSPARENCY
            </span>
            <h2 className="text-2xl sm:text-4xl font-semibold text-[#0a2240] tracking-tight">
              100% Legally Compliant & Tax-Deductible NGO
            </h2>
            <p className="text-sm text-slate-600 font-normal">
              Truth Foundation maintains complete transparency with annual public audits and statutory compliance under Government of India guidelines.
            </p>
          </div>

          {/* Desktop Display: Borderless & Shadowless Credibility Grid */}
          <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-4">
            {STATUTORY_CREDENTIALS.map((cred, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="flex flex-col p-4 sm:p-5 bg-[#f8fafc] hover:bg-[#0a2240] rounded-2xl border-0 shadow-none space-y-2.5 cursor-pointer transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#0a2240] text-[#da8a24] group-hover:bg-[#da8a24] group-hover:text-[#0a2240] flex items-center justify-center font-semibold transition-colors duration-300">
                  <cred.icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#0a2240] group-hover:text-white text-base sm:text-lg transition-colors duration-300">{cred.title}</h4>
                  <p className="text-xs sm:text-sm text-slate-600 group-hover:text-slate-200 pt-1 leading-relaxed font-normal transition-colors duration-300">{cred.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile Display: Borderless & Shadowless Auto-Scrolling Track */}
          <div className="md:hidden overflow-hidden relative w-full -mx-4 px-4 py-2">
            <motion.div
              animate={{ x: ['0%', '-50%'] }}
              transition={{ repeat: Infinity, duration: 22, ease: 'linear' }}
              className="flex gap-6 w-max"
            >
              {[...STATUTORY_CREDENTIALS, ...STATUTORY_CREDENTIALS].map((cred, idx) => (
                <div
                  key={idx}
                  className="w-[260px] shrink-0 flex flex-col p-5 bg-[#f8fafc] rounded-3xl border-0 shadow-none space-y-2.5"
                >
                  <div className="w-11 h-11 rounded-2xl bg-[#0a2240] text-[#da8a24] flex items-center justify-center font-semibold shrink-0">
                    <cred.icon className="w-5 h-5 text-[#da8a24]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#0a2240] text-base sm:text-lg">{cred.title}</h4>
                    <p className="text-xs sm:text-sm text-slate-600 pt-1 leading-relaxed font-normal">{cred.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

        </div>
      </section>

      {/* 11. SPONSOR A CAUSE (DESKTOP & MOBILE DESIGN MATCHING REFERENCE IMAGE) */}
      <section className="py-10 sm:py-16 bg-[#f8fafc] text-slate-900 relative overflow-hidden">
        
        {/* Top-Left Botanical Leaf Accent */}
        <svg className="absolute top-0 left-0 w-24 sm:w-36 lg:w-44 h-auto text-[#da8a24]/20 pointer-events-none z-0" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 150Q40 100 130 30" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
          <path d="M130 30Q100 20 80 40Q110 50 130 30Z" fill="currentColor"/>
          <path d="M100 55Q75 40 55 60Q85 70 100 55Z" fill="currentColor"/>
          <path d="M70 80Q45 65 25 85Q55 95 70 80Z" fill="currentColor"/>
          <path d="M40 105Q20 95 5 110Q30 120 40 105Z" fill="currentColor"/>
          <path d="M115 42Q125 75 100 90Q105 60 115 42Z" fill="currentColor"/>
          <path d="M85 68Q95 100 70 115Q75 85 85 68Z" fill="currentColor"/>
        </svg>

        {/* Top-Right Botanical Leaf Accent */}
        <svg className="absolute top-0 right-0 w-24 sm:w-36 lg:w-44 h-auto text-[#da8a24]/20 pointer-events-none z-0 transform -scale-x-100" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 150Q40 100 130 30" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
          <path d="M130 30Q100 20 80 40Q110 50 130 30Z" fill="currentColor"/>
          <path d="M100 55Q75 40 55 60Q85 70 100 55Z" fill="currentColor"/>
          <path d="M70 80Q45 65 25 85Q55 95 70 80Z" fill="currentColor"/>
          <path d="M40 105Q20 95 5 110Q30 120 40 105Z" fill="currentColor"/>
          <path d="M115 42Q125 75 100 90Q105 60 115 42Z" fill="currentColor"/>
          <path d="M85 68Q95 100 70 115Q75 85 85 68Z" fill="currentColor"/>
        </svg>

        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 lg:px-12 space-y-8 sm:space-y-10 relative z-10">
          
          {/* Header: Left Aligned with Larger Font Size matching other sections */}
          <div className="text-left max-w-3xl space-y-2">
            <span className="text-[#da8a24] font-medium text-xs sm:text-sm uppercase tracking-widest block">
              SPONSOR A CAUSE
            </span>
            <h2 className="text-[22px] xs:text-[26px] sm:text-[38px] lg:text-[44px] font-semibold text-[#0a2240] tracking-tight leading-tight">
              Make a Direct Impact
            </h2>
            <p className="text-sm sm:text-lg lg:text-[18px] text-slate-600 font-normal leading-relaxed">
              Your support helps us provide nutrition, education, healthcare, and care for children, elderly, and special-needs individuals.
            </p>
          </div>

          {/* Desktop Display: 6 Cause Items Grid with Larger Images and No Description Text */}
          <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5 lg:gap-6">
            {SPONSOR_CAUSES.map((cause) => (
              <motion.div
                key={cause.id}
                whileHover={{ y: -6 }}
                onClick={() => {
                  pixelTracker.trackDonateClick(cause.amount, `Sponsor Cause - ${cause.title}`);
                  onOpenDonateModal(cause.amount);
                }}
                className="bg-transparent border-0 shadow-none rounded-[24px] p-3 transition-all duration-300 flex flex-col justify-between cursor-pointer group text-center"
              >
                <div>
                  {/* Image Container: Larger Aspect Ratio on Desktop */}
                  <div className="relative w-full aspect-[4/5] rounded-[20px] overflow-hidden bg-slate-100 shadow-xs">
                    <img
                      src={cause.image}
                      alt={cause.title}
                      className="w-full h-full object-cover object-center transform transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-2.5 right-2.5 bg-[#0a2240]/85 backdrop-blur-md text-[#da8a24] font-semibold text-xs px-2.5 py-1 rounded-full shadow-sm">
                      {cause.amountLabel}
                    </div>
                  </div>

                  {/* Title Only Below Image */}
                  <div className="pt-3.5 pb-2 px-1 flex flex-col items-center text-center">
                    <h3 className="font-semibold text-[#0a2240] text-base lg:text-lg leading-snug group-hover:text-[#da8a24] transition-colors">
                      {cause.title}
                    </h3>
                  </div>
                </div>

                {/* Bottom CTA Button */}
                <div className="pt-1">
                  <span className="inline-flex items-center justify-center gap-1.5 w-full bg-[#da8a24]/10 group-hover:bg-[#da8a24] text-[#0a2240] font-semibold text-xs sm:text-sm py-2 px-3 rounded-full transition-colors">
                    <Heart className="w-4 h-4 fill-[#0a2240]" />
                    <span>Donate ({cause.amountLabel})</span>
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile Display: Smooth Horizontal Auto-Scrolling Track with Larger Images and No Description Text */}
          <div className="md:hidden overflow-hidden relative w-full -mx-4 px-4 py-1">
            <motion.div
              animate={{ x: ['0%', '-50%'] }}
              transition={{ repeat: Infinity, duration: 16, ease: 'linear' }}
              className="flex gap-4 w-max"
            >
              {[...SPONSOR_CAUSES, ...SPONSOR_CAUSES].map((cause, idx) => (
                <div
                  key={`${cause.id}-${idx}`}
                  onClick={() => {
                    pixelTracker.trackDonateClick(cause.amount, `Sponsor Cause - ${cause.title}`);
                    onOpenDonateModal(cause.amount);
                  }}
                  className="w-[210px] shrink-0 bg-transparent border-0 shadow-none rounded-[22px] p-2.5 transition-all duration-300 flex flex-col justify-between cursor-pointer group text-center"
                >
                  <div>
                    {/* Image Container: Larger Image */}
                    <div className="relative w-full aspect-square rounded-[18px] overflow-hidden bg-slate-100">
                      <img
                        src={cause.image}
                        alt={cause.title}
                        className="w-full h-full object-cover object-center"
                      />
                      <div className="absolute top-2 right-2 bg-[#0a2240]/85 backdrop-blur-md text-[#da8a24] font-semibold text-[10px] px-2 py-0.5 rounded-full shadow-sm">
                        {cause.amountLabel}
                      </div>
                    </div>

                    {/* Title Only Below Image */}
                    <div className="pt-3 pb-1 px-1 flex flex-col items-center text-center">
                      <h3 className="font-semibold text-[#0a2240] text-sm leading-snug group-hover:text-[#da8a24] transition-colors">
                        {cause.title}
                      </h3>
                    </div>
                  </div>

                  {/* Bottom CTA Button */}
                  <div className="pt-1">
                    <span className="inline-flex items-center justify-center gap-1 w-full bg-[#da8a24]/10 group-hover:bg-[#da8a24] text-[#0a2240] font-semibold text-xs py-1.5 px-2 rounded-full transition-colors">
                      <Heart className="w-3.5 h-3.5 fill-[#0a2240]" />
                      <span>Donate ({cause.amountLabel})</span>
                    </span>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

        </div>
      </section>

      {/* 12. FINAL SUPPORT A CAUSE / DONATE CTA (ORGANIC WAVED BANNER MATCHING REFERENCE IMAGE) */}
      <section className="py-8 sm:py-12 bg-[#f8fafc] text-white relative overflow-hidden">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
          
          {/* Main Fluid Organic Banner Container */}
          <div className="relative bg-[#071b34] rounded-[28px] sm:rounded-[36px] overflow-hidden border border-[#da8a24]/30 shadow-2xl p-6 sm:p-8 lg:p-10">
            
            {/* Ambient Gold Glows */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#da8a24]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#da8a24]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top-Right Botanical Leaf Accent */}
            <svg className="absolute top-4 right-4 w-28 sm:w-36 h-auto text-[#da8a24]/20 pointer-events-none" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 150Q40 100 130 30" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
              <path d="M130 30Q100 20 80 40Q110 50 130 30Z" fill="currentColor"/>
              <path d="M100 55Q75 40 55 60Q85 70 100 55Z" fill="currentColor"/>
              <path d="M70 80Q45 65 25 85Q55 95 70 80Z" fill="currentColor"/>
              <path d="M40 105Q20 95 5 110Q30 120 40 105Z" fill="currentColor"/>
            </svg>

            {/* Floating Gold Line Art Heart Graphic on Right */}
            <div className="hidden lg:block absolute right-10 bottom-16 text-[#da8a24]/40 pointer-events-none">
              <svg className="w-16 h-16" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M50 88 C20 60 5 40 15 20 C25 5 45 10 50 25 C55 10 75 5 85 20 C95 40 80 60 50 88 Z" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M50 88 C55 95 60 100 65 105" strokeLinecap="round"/>
              </svg>
            </div>

            {/* Top Grid: Image on Left (Desktop), Content on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center relative z-10">
              
              {/* Left Column: Compact Image Frame (~40% / 5 cols) */}
              <div className="lg:col-span-5 relative">
                <div className="relative w-full h-[220px] sm:h-[260px] lg:h-[250px] overflow-hidden rounded-[20px] sm:rounded-[28px] border-2 border-[#da8a24]/50 shadow-xl bg-[#0a2240] group">
                  <img
                    src={ctaImage}
                    alt="Support Truth Foundation Community"
                    className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071b34]/60 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Overlapping Botanical Leaf Accent between Image and Content */}
                <div className="hidden lg:block absolute -right-5 top-1/2 -translate-y-1/2 text-[#da8a24]/60 pointer-events-none z-20">
                  <svg className="w-12 h-20" viewBox="0 0 60 120" fill="currentColor">
                    <path d="M10 10Q30 40 10 70Q40 50 50 20Z"/>
                    <path d="M20 50Q40 80 20 110Q50 90 55 60Z"/>
                  </svg>
                </div>
              </div>

              {/* Right Column: Title, Subtitle, Golden Pill Donate Button (~60% / 7 cols) */}
              <div className="lg:col-span-7 space-y-3.5 text-left">
                
                {/* Heading */}
                <h2 className="text-xl sm:text-3xl lg:text-4xl font-semibold text-white tracking-tight leading-tight">
                  Support a Cause. <span className="text-[#da8a24]">Change a Life.</span>
                </h2>

                {/* Subtitle Paragraph */}
                <p className="text-xs sm:text-sm lg:text-base text-slate-300 font-normal leading-relaxed max-w-xl">
                  Your contribution brings hope, education, nourishment, and care to children, elderly, and special-needs individuals across Tamil Nadu.
                </p>

                {/* Golden Pill Donate Button */}
                <div className="pt-1">
                  <motion.button
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      pixelTracker.trackDonateClick(500, 'About Page Final CTA');
                      onOpenDonateModal(500);
                    }}
                    className="bg-[#da8a24] hover:bg-[#c77a1e] text-[#0a2240] font-semibold px-7 py-3 rounded-full shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm uppercase tracking-wider min-h-[44px]"
                  >
                    <Heart className="w-4.5 h-4.5 fill-[#0a2240]" />
                    <span>Donate Now</span>
                  </motion.button>
                </div>

              </div>

            </div>

            {/* Bottom Trust Credentials Strip (4 Items in 1 Row on Desktop, 2x2 Grid on Mobile) */}
            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10 relative z-10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4 md:divide-x md:divide-white/10 text-slate-200">
                
                <div className="flex items-center gap-2.5 md:justify-center px-1">
                  <div className="w-8 h-8 rounded-full bg-[#da8a24]/20 border border-[#da8a24]/40 flex items-center justify-center text-[#da8a24] shrink-0">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-semibold leading-tight">Safe & Secure Donations</span>
                </div>

                <div className="flex items-center gap-2.5 md:justify-center px-1 md:pl-4">
                  <div className="w-8 h-8 rounded-full bg-[#da8a24]/20 border border-[#da8a24]/40 flex items-center justify-center text-[#da8a24] shrink-0">
                    <Camera className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-semibold leading-tight">Direct Impact Delivery</span>
                </div>

                <div className="flex items-center gap-2.5 md:justify-center px-1 md:pl-4">
                  <div className="w-8 h-8 rounded-full bg-[#da8a24]/20 border border-[#da8a24]/40 flex items-center justify-center text-[#da8a24] shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-semibold leading-tight">80G Tax Exemption</span>
                </div>

                <div className="flex items-center gap-2.5 md:justify-center px-1 md:pl-4">
                  <div className="w-8 h-8 rounded-full bg-[#da8a24]/20 border border-[#da8a24]/40 flex items-center justify-center text-[#da8a24] shrink-0">
                    <Award className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-semibold leading-tight">Trusted by Communities</span>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 13. Footer (EXACT EXISTING FOOTER - UNCHANGED) */}
      <Footer onNavigateHome={(anchor) => onNavigate('home', anchor)} />

      {/* 14. Floating WhatsApp Widget (EXACT UNCHANGED) */}
      <FloatingWhatsApp />

    </div>
  );
};
