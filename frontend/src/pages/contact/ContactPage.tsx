import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  PhoneCall,
  MapPin,
  Send,
  CheckCircle2,
  ChevronRight,
  Clock,
  Heart,
  HelpCircle,
  ExternalLink,
  Building2,
  Sparkles,
  X,
  MessageSquare,
  Users,
  Mail,
  Phone
} from 'lucide-react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { FloatingWhatsApp } from '../../components/FloatingWhatsApp';
import { DarkToLightDivider } from '../../components/SectionDividers';
import { WhatsAppIcon } from '../../components/WhatsAppIcon';
import { pixelTracker } from '../../utils/pixelTracker';
import { fetchSiteContent } from '../../utils/cmsApi';

// Real Project Image Imports
import giveLoveHandsHeart from '../../assets/images/give_love_hands_heart.png';
import contactHeroBgDesktop from '../../assets/images/contact_page_hero_background_image_desktop_view.jpg';
import contactHeroBgMobile from '../../assets/images/contact_page_hero_background_image_mobile_view.jpeg';
import truthFoundationSealWatermark from '../../assets/images/truth_foundation_seal_watermark.png';

interface ContactPageProps {
  onOpenDonateModal: (amount?: number) => void;
  onNavigate: (page: 'home' | 'about' | 'gallery' | 'contact' | 'donate', anchor?: string) => void;
}

const INQUIRY_SUBJECTS = [
  'General Inquiry',
  '80G Tax Exemption Receipt Request',
  'Volunteer Application',
  'Material / Food Donation',
  'Schedule a Center Visit (Redhills / Thiruvallur)',
  'Corporate Sponsorship / CSR Partnership'
];

export const ContactPage: React.FC<ContactPageProps> = ({ onOpenDonateModal, onNavigate }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    subject: INQUIRY_SUBJECTS[0],
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [contactInfo, setContactInfo] = useState({
    redhillsPhone: '+91 63827 21178',
    kolathurPhone: '+91 99622 94949',
    email: 'truthfoundation2010@gmail.com',
    whatsapp: '916382721178'
  });

  useEffect(() => {
    fetchSiteContent().then((data) => {
      if (data?.contact_page) {
        setContactInfo({
          redhillsPhone: data.contact_page.redhills_phone || '+91 63827 21178',
          kolathurPhone: data.contact_page.kolathur_phone || '+91 99622 94949',
          email: data.contact_page.redhills_email || 'truthfoundation2010@gmail.com',
          whatsapp: (data.contact_page.whatsapp_number || '916382721178').replace('+', '')
        });
      }
    });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.message) return;

    setIsSubmitting(true);
    pixelTracker.track('Contact Form Submission', {
      subject: formData.subject,
      name: formData.fullName
    });

    // Save to Supabase contact_inquiries table via backend API
    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message
      })
    }).catch((err) => console.warn('Could not post inquiry to API:', err));

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        subject: INQUIRY_SUBJECTS[0],
        message: ''
      });
    }, 800);
  };

  const handleDirectWhatsApp = () => {
    pixelTracker.trackWhatsAppClick('Contact Page WhatsApp Card');
    const msg = encodeURIComponent(`Hello Truth Foundation! I have an inquiry regarding: ${formData.subject || 'General Info'}`);
    window.open(`https://wa.me/${contactInfo.whatsapp}?text=${msg}`, '_blank');
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-clip bg-white text-slate-900 font-sans antialiased selection:bg-[#da8a24] selection:text-[#0a2240] relative">
      
      {/* 1. Header (EXACT EXISTING NAVBAR - UNCHANGED) */}
      <Header
        currentPage="contact"
        onOpenDonateModal={onOpenDonateModal}
        onNavigate={onNavigate}
      />

      {/* 2. DARK NAVY HERO SECTION (#0a2240) WITH RESPONSIVE HERO BACKGROUND IMAGES (FULL DESKTOP HEIGHT) */}
      <section className="pt-24 sm:pt-36 pb-12 sm:pb-16 bg-slate-950 text-white relative overflow-x-clip min-h-0 sm:min-h-[75vh] lg:min-h-screen flex items-center">
        
        {/* Desktop Background Image (Hidden on Mobile) */}
        <div 
          className="hidden md:block absolute inset-0 w-full h-full bg-cover bg-center lg:bg-top pointer-events-none opacity-90"
          style={{ backgroundImage: `url(${contactHeroBgDesktop})` }}
        />

        {/* Mobile Background Image (Block on Mobile, Hidden on Desktop) */}
        <div 
          className="block md:hidden absolute inset-0 w-full h-full bg-cover bg-center pointer-events-none opacity-90"
          style={{ backgroundImage: `url(${contactHeroBgMobile})` }}
        />

        {/* Neutral Dark Gradient Overlay (No Blue Mask) */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent pointer-events-none" />

        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10 w-full">
          
          <div className="max-w-3xl space-y-6">
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-5"
            >
              {/* Main Heading: All White & Enlarged */}
              <h1 className="text-4xl sm:text-6xl lg:text-[64px] font-normal text-white tracking-tight leading-[1.1]">
                We Are Here to Listen, Guide & Partner
              </h1>

              {/* Concise Paragraph Description & Enlarged */}
              <p className="text-base sm:text-xl lg:text-2xl text-slate-200 font-normal leading-relaxed max-w-[660px] drop-shadow-sm">
                Get in touch with our team for donation inquiries, 80G tax exemption receipts, volunteering opportunities, or scheduling a visit to our Redhills campus.
              </p>

              {/* Hero CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleDirectWhatsApp}
                  className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl min-h-[48px] sm:min-h-[52px] font-semibold text-sm sm:text-base uppercase tracking-wider shadow-xl transition flex items-center justify-center gap-2.5 cursor-pointer whitespace-nowrap"
                >
                  <WhatsAppIcon className="w-5 h-5 text-white shrink-0" />
                  <span>WhatsApp Chat Now</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    pixelTracker.trackDonateClick(500, 'Contact Hero Secondary CTA');
                    onOpenDonateModal(500);
                  }}
                  className="bg-[#071b34] hover:bg-[#163863] text-white border border-[#da8a24]/50 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl min-h-[48px] sm:min-h-[52px] font-semibold text-sm sm:text-base uppercase tracking-wider shadow-md transition flex items-center justify-center gap-2.5 cursor-pointer backdrop-blur-md whitespace-nowrap"
                >
                  <Heart className="w-4.5 h-4.5 text-[#da8a24] fill-[#da8a24] shrink-0" />
                  <span>Donate Now</span>
                </motion.button>
              </div>
            </motion.div>

          </div>

        </div>

        {/* ORGANIC WAVES SECTION DIVIDER (No Blue Bar) */}
        <div className="absolute -bottom-1 left-0 right-0 z-20 pointer-events-none">
          <DarkToLightDivider bgFrom="transparent" bgTo="#ffffff" />
        </div>
      </section>



      {/* 4. MAIN CONTACT FORM & LOCATION MAP SECTION */}
      <section id="form-section" className="py-8 sm:py-24 bg-white text-slate-900 relative overflow-hidden">
        
        {/* Truth Foundation Circular Seal Watermark in Background (Side Right) */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 -right-16 sm:-right-24 lg:-right-10 w-[340px] sm:w-[500px] lg:w-[620px] h-[340px] sm:h-[500px] lg:h-[620px] pointer-events-none select-none z-0 opacity-[0.08] sm:opacity-[0.10] flex items-center justify-center"
          aria-hidden="true"
        >
          <img
            src={truthFoundationSealWatermark}
            alt=""
            className="w-full h-full object-contain mix-blend-multiply"
          />
        </div>

        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 lg:px-12 space-y-16 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            
            {/* Left Side: Direct Contact Details (Borderless & Transparent Card Background) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-8"
            >
              <div className="space-y-3 border-b border-slate-200/80 pb-6">
                <span className="text-[#da8a24] font-normal text-sm sm:text-base uppercase tracking-widest block">
                  GET IN TOUCH DIRECTLY
                </span>
                <h2 className="text-3xl sm:text-5xl lg:text-5xl font-normal text-[#0a2240] tracking-tight">
                  Direct Helplines & Office Locations
                </h2>
                <p className="text-sm sm:text-lg text-slate-600 font-normal">
                  Our team is dedicated to serving you. Feel free to call, chat, or visit our offices anytime.
                </p>
              </div>

              {/* Grid of Contact Information Cards - Borderless & Shadowless */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                {/* 1. Call Our Helpline */}
                <div className="p-6 rounded-2xl space-y-4 bg-slate-50 border-0 shadow-none flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-[#0a2240] text-[#da8a24] flex items-center justify-center font-normal shadow-none border-0">
                      <PhoneCall className="w-6 h-6 text-[#da8a24]" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-normal text-[#0a2240] text-lg sm:text-xl">Call Our Helpline</h3>
                      <p className="text-sm text-slate-500 font-normal">Mon – Sat, 9:00 AM – 6:00 PM</p>
                    </div>
                  </div>
                  <a
                    href="tel:+919962294949"
                    className="inline-block text-lg sm:text-xl font-normal text-[#da8a24] hover:underline pt-1"
                  >
                    +91 99622 94949
                  </a>
                </div>

                {/* 2. WhatsApp Chat (Strictly WhatsApp Theme Color Only) */}
                <div className="p-6 rounded-2xl space-y-4 bg-slate-50 border-0 shadow-none flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-[#25D366]/15 text-[#25D366] flex items-center justify-center font-normal shadow-none border-0">
                      <WhatsAppIcon className="w-6 h-6 text-[#25D366]" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-normal text-[#0a2240] text-lg sm:text-xl">WhatsApp Chat</h3>
                      <p className="text-sm text-slate-500 font-normal">Instant response from coordinators</p>
                    </div>
                  </div>
                  <button
                    onClick={handleDirectWhatsApp}
                    className="w-full mt-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-normal text-sm py-3 px-5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-none border-0 uppercase tracking-wider"
                  >
                    <WhatsAppIcon className="w-4.5 h-4.5 text-white" />
                    <span>Chat Now</span>
                  </button>
                </div>

                {/* 3. Redhills Home Office */}
                <div className="p-6 rounded-2xl space-y-4 bg-slate-50 border-0 shadow-none flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-[#0a2240] text-[#da8a24] flex items-center justify-center font-normal shadow-none border-0">
                      <MapPin className="w-6 h-6 text-[#da8a24]" />
                    </div>
                    <h3 className="font-normal text-[#0a2240] text-lg sm:text-xl">Redhills Home Office</h3>
                    <div className="text-sm text-slate-600 leading-relaxed font-normal space-y-0.5">
                      <p className="font-semibold text-[#0a2240]">Truth Foundation Home</p>
                      <p>#244, Mallima Nagar, Vilagadupakkam, Redhills, Chennai - 600052</p>
                    </div>
                  </div>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Truth+Foundation+244+Mallima+Nagar+Vilagadupakkam+Redhills+Chennai+600052"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-normal text-[#da8a24] hover:underline pt-2"
                  >
                    <span>View Google Map</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                {/* 4. Corporate Office */}
                <div className="p-6 rounded-2xl space-y-4 bg-slate-50 border-0 shadow-none flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-[#0a2240] text-[#da8a24] flex items-center justify-center font-normal shadow-none border-0">
                      <Building2 className="w-6 h-6 text-[#da8a24]" />
                    </div>
                    <h3 className="font-normal text-[#0a2240] text-lg sm:text-xl">Corporate Office</h3>
                    <div className="text-sm text-slate-600 leading-relaxed font-normal space-y-0.5">
                      <p className="font-semibold text-[#0a2240]">Truth Foundation Corporate Office</p>
                      <p>#49, Venus Nagar Main Road, Kolathur, Chennai - 600099</p>
                    </div>
                  </div>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Truth+Foundation+49+Venus+Nagar+Main+Road+Kolathur+Chennai+600099"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-normal text-[#da8a24] hover:underline pt-2"
                  >
                    <span>View Google Map</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

              </div>

            </motion.div>

            {/* Right Side: Map & Center Locations (5 cols ~40%) */}
            <motion.div
              id="map-section"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-5 space-y-6"
            >
              {/* Google Map Panel - Borderless & Shadowless */}
              <div className="bg-slate-50 p-6 rounded-3xl space-y-4 border-0 shadow-none">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-normal text-[#0a2240] text-base uppercase tracking-wider">
                    <MapPin className="w-4.5 h-4.5 text-[#da8a24]" />
                    <span>Corporate Office Map</span>
                  </div>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Truth+Foundation+49+Venus+Nagar+Main+Road+Kolathur+Chennai+600099"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-normal text-[#da8a24] hover:underline flex items-center gap-1"
                  >
                    <span>Full Map</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <div className="w-full h-72 rounded-2xl overflow-hidden relative bg-slate-100 border-0 shadow-none">
                  <iframe
                    title="Truth Foundation Office Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3885.642940251147!2d80.2078603!3d13.1221764!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5264ff9c5a15bd%3A0x429671d18bb76211!2s49%2C%20Venus%20Nagar%20Main%20Rd%2C%20Venus%20Nagar%2C%20Kolathur%2C%20Chennai%2C%20Tamil%20Nadu%20600099!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    className="w-full h-full"
                  />
                </div>
              </div>

              {/* Working Hours & Visit Info Card (Dark Navy #0a2240) - Borderless & Shadowless */}
              <div className="bg-[#0a2240] text-white p-6 sm:p-8 rounded-3xl space-y-5 border-0 shadow-none">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#da8a24] text-white flex items-center justify-center font-normal">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-normal text-white">Center Visit Hours</h3>
                    <p className="text-sm text-[#da8a24] font-normal">Redhills & Thiruvallur Campuses</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm sm:text-base text-slate-300">
                  <div className="flex items-center justify-between py-2 border-b border-[#163863]">
                    <span>Monday – Saturday</span>
                    <span className="font-normal text-white">9:00 AM – 6:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-[#163863]">
                    <span>Sunday (Prior Intimation)</span>
                    <span className="font-normal text-[#da8a24]">10:00 AM – 4:00 PM</span>
                  </div>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed font-normal pt-1">
                  We encourage donors to spend time with children and elders. Prior confirmation via phone or WhatsApp is recommended.
                </p>
              </div>

            </motion.div>

          </div>

        </div>
      </section>



      {/* 8. GIVE LOVE / MAKE AN IMMEDIATE IMPACT SECTION (Exact Reference Mockup Design) */}
      <section className="pt-10 sm:pt-14 pb-0 bg-white text-slate-900 relative overflow-hidden">
        
        {/* Giant Faint Heart Watermark in Background (Right Side) */}
        <div 
          className="absolute -top-12 sm:-top-16 -right-16 sm:-right-8 lg:right-0 w-[55%] min-w-[340px] max-w-[850px] h-[120%] pointer-events-none select-none z-0"
          aria-hidden="true"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full fill-[#fdf7ee]/90">
            <path d="M50 88.5 C20 62 4 44 4 27 C4 13.5 14.5 3 28 3 C36.5 3 44.5 7.5 50 14.5 C55.5 7.5 63.5 3 72 3 C85.5 3 96 13.5 96 27 C96 44 80 62 50 88.5 Z" />
          </svg>
        </div>

        <div className="max-w-[1140px] mx-auto px-4 sm:px-8 lg:px-10 relative z-20 space-y-6 sm:space-y-8">
          
          {/* Top Row: Left Header & Right Description + CTA */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
            
            {/* Top-Left: Truth Foundation Kicker & Give Love Title */}
            <div className="lg:col-span-5 space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-7 sm:w-8 h-1 sm:h-1.5 bg-[#da8a24] rounded-full" />
                <span className="text-xs sm:text-sm font-bold text-[#071b34] tracking-wider uppercase">
                  TRUTH FOUNDATION
                </span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-[56px] font-bold text-[#071b34] tracking-tight leading-none">
                Give Love
              </h2>
            </div>

            {/* Top-Right: Description Paragraph & DONATE NOW Button */}
            <div className="lg:col-span-7 space-y-3.5 lg:pl-4">
              <p className="text-sm sm:text-base lg:text-[17px] text-slate-600 font-normal leading-relaxed max-w-xl">
                Your support helps us create brighter futures, stronger communities, and lasting change. Together, we can make a real difference.
              </p>

              <div>
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    pixelTracker.trackDonateClick(500, 'Give Love Section - Donate Now');
                    onOpenDonateModal(500);
                  }}
                  className="bg-[#da8a24] hover:bg-[#c77a1e] text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl min-h-[48px] sm:min-h-[52px] font-semibold text-sm sm:text-base uppercase tracking-wider shadow-xl hover:shadow-2xl transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Heart className="w-4.5 h-4.5 fill-white text-white shrink-0" />
                  <span>DONATE NOW</span>
                </motion.button>
              </div>
            </div>

          </div>

          {/* Middle Row: 4 Action Items (DONATE, VOLUNTEER, GET HELP, CONTACT US) Situated Cleanly Above Hands */}
          <div className="grid grid-cols-4 gap-2 sm:gap-6 lg:gap-8 max-w-2xl sm:max-w-3xl mx-auto pt-4 sm:pt-6 pb-4 sm:pb-6">
            
            {/* 1. DONATE */}
            <button
              onClick={() => {
                pixelTracker.trackDonateClick(500, 'Give Love - Donate Action');
                onOpenDonateModal(500);
              }}
              className="flex flex-col items-center justify-center gap-2.5 sm:gap-3 p-1 sm:p-2 group cursor-pointer transition-all border-0 bg-transparent text-center"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center transition-transform group-hover:scale-110">
                <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
                  {/* Golden Heart */}
                  <path
                    d="M32 23 C28 17 21 17 19 22 C17 27 24 33 32 38 C40 33 47 27 45 22 C43 17 36 17 32 23 Z"
                    fill="#da8a24"
                    stroke="#da8a24"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  {/* Navy Hand */}
                  <path
                    d="M16 41 L27 41 L34 45 L48 41 C51 40 53 43 51 46 L42 53 C40 54 37 55 34 55 L22 55 C18 55 16 52 16 48 Z"
                    stroke="#071b34"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="font-bold text-[#071b34] text-[10px] sm:text-xs md:text-sm tracking-wider uppercase group-hover:text-[#da8a24] transition-colors whitespace-nowrap">
                DONATE
              </span>
            </button>

            {/* 2. VOLUNTEER */}
            <button
              onClick={() => {
                pixelTracker.trackWhatsAppClick('Give Love - Volunteer Action');
                const msg = encodeURIComponent('Hello Truth Foundation! I would love to volunteer and get involved.');
                window.open(`https://wa.me/${contactInfo.whatsapp}?text=${msg}`, '_blank');
              }}
              className="flex flex-col items-center justify-center gap-2.5 sm:gap-3 p-1 sm:p-2 group cursor-pointer transition-all border-0 bg-transparent text-center"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center transition-transform group-hover:scale-110">
                <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
                  {/* Golden Heart over center person */}
                  <path
                    d="M32 17 C29 12 24 12 22.5 15.5 C21 19 26 23.5 32 27 C38 23.5 43 19 41.5 15.5 C40 12 35 12 32 17 Z"
                    fill="#da8a24"
                    stroke="#da8a24"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                  {/* Center Person */}
                  <circle cx="32" cy="34" r="5" stroke="#071b34" strokeWidth="2.5" />
                  <path d="M24 49 C24 43 28 41 32 41 C36 41 40 43 40 49" stroke="#071b34" strokeWidth="2.5" strokeLinecap="round" />
                  {/* Left Person */}
                  <circle cx="20" cy="37" r="4" stroke="#071b34" strokeWidth="2.2" />
                  <path d="M14 50 C14 45 17 43 21 43" stroke="#071b34" strokeWidth="2.2" strokeLinecap="round" />
                  {/* Right Person */}
                  <circle cx="44" cy="37" r="4" stroke="#071b34" strokeWidth="2.2" />
                  <path d="M43 43 C47 43 50 45 50 50" stroke="#071b34" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </div>
              <span className="font-bold text-[#071b34] text-[10px] sm:text-xs md:text-sm tracking-wider uppercase group-hover:text-[#da8a24] transition-colors whitespace-nowrap">
                VOLUNTEER
              </span>
            </button>

            {/* 3. GET HELP */}
            <a
              href="tel:+919962294949"
              className="flex flex-col items-center justify-center gap-2.5 sm:gap-3 p-1 sm:p-2 group cursor-pointer transition-all border-0 bg-transparent text-center"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center transition-transform group-hover:scale-110">
                <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
                  {/* Golden Heart */}
                  <path
                    d="M32 24 C28 18 21 18 19 23 C17 28 24 34 32 39 C40 34 47 28 45 23 C43 18 36 18 32 24 Z"
                    fill="#da8a24"
                    stroke="#da8a24"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  {/* Left Cupped Hand */}
                  <path
                    d="M16 35 C16 43 23 52 30 52 C31 52 31 50 28 49 C22 47 19 41 19 36 L21 34"
                    stroke="#071b34"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Right Cupped Hand */}
                  <path
                    d="M48 35 C48 43 41 52 34 52 C33 52 33 50 36 49 C42 47 45 41 45 36 L43 34"
                    stroke="#071b34"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="font-bold text-[#071b34] text-[10px] sm:text-xs md:text-sm tracking-wider uppercase group-hover:text-[#da8a24] transition-colors whitespace-nowrap">
                GET HELP
              </span>
            </a>

            {/* 4. CONTACT US */}
            <button
              onClick={() => {
                const formElem = document.getElementById('form-section');
                if (formElem) {
                  formElem.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="flex flex-col items-center justify-center gap-2.5 sm:gap-3 p-1 sm:p-2 group cursor-pointer transition-all border-0 bg-transparent text-center"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center transition-transform group-hover:scale-110">
                <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
                  {/* Envelope Body */}
                  <path
                    d="M16 30 L16 50 C16 52 18 54 20 54 L44 54 C46 54 48 52 48 50 L48 30"
                    stroke="#071b34"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Envelope V Flap */}
                  <path
                    d="M16 30 L32 42 L48 30"
                    stroke="#071b34"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Golden Heart emerging from envelope */}
                  <path
                    d="M32 23 C28 17 21 17 19 22 C17 27 24 33 32 38 C40 33 47 27 45 22 C43 17 36 17 32 23 Z"
                    fill="#da8a24"
                    stroke="#da8a24"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="font-bold text-[#071b34] text-[10px] sm:text-xs md:text-sm tracking-wider uppercase group-hover:text-[#da8a24] transition-colors whitespace-nowrap">
                CONTACT US
              </span>
            </button>

          </div>

        </div>

        {/* Bottom Full-Bleed Hands Forming Heart Image (Reaches Both Screen Edges, Cleanly Below Icons With Zero Overlap) */}
        <div className="relative w-full overflow-hidden leading-none z-10 pointer-events-none">
          <img
            src={giveLoveHandsHeart}
            alt="Truth Foundation - Give Love"
            className="w-full h-auto min-h-[140px] sm:min-h-[220px] md:min-h-[280px] lg:min-h-[340px] select-none pointer-events-none block mx-auto"
          />
        </div>
      </section>

      {/* 9. SUBMISSION SUCCESS MODAL */}
      {isSubmitted && (
        <div className="fixed inset-0 z-[99999] bg-[#040f1a]/95 backdrop-blur-xl flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#071b34] text-white border-2 border-[#da8a24] rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-2xl relative"
          >
            <button
              onClick={() => setIsSubmitted(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-full bg-[#da8a24]/20 text-[#da8a24] border border-[#da8a24]/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-[#da8a24]" />
            </div>

            <h3 className="text-3xl font-normal text-white">Message Received!</h3>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Thank you for contacting Truth Foundation. Our coordinator has received your message and will respond to your phone or email within 24 hours.
            </p>

            <button
              onClick={() => setIsSubmitted(false)}
              className="w-full bg-[#da8a24] hover:bg-[#c77a1e] text-white font-normal py-3.5 rounded-xl transition cursor-pointer text-sm uppercase tracking-wider"
            >
              Close Window
            </button>
          </motion.div>
        </div>
      )}

      {/* 10. Footer (EXACT EXISTING FOOTER - UNCHANGED) */}
      <Footer onNavigateHome={(anchor) => onNavigate('home', anchor)} />

      {/* 11. Floating WhatsApp & Donate Widget */}
      <FloatingWhatsApp onOpenDonateModal={onOpenDonateModal} />

    </div>
  );
};
