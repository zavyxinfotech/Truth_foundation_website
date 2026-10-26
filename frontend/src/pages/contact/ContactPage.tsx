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
import immediateImpactIllustration from '../../assets/images/immediate_impact_donation_illustration.png';
import contactHeroBgDesktop from '../../assets/images/contact_page_hero_background_image_desktop_view.jpg';
import contactHeroBgMobile from '../../assets/images/contact_page_hero_background_image_mobile_view.jpeg';

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
    <div className="min-h-screen w-full max-w-full overflow-x-clip bg-[#0a2240] text-slate-900 font-sans antialiased selection:bg-[#da8a24] selection:text-[#0a2240] relative">
      
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
                  className="bg-[#da8a24] hover:bg-[#c77a1e] text-[#0a2240] font-normal px-8 py-4 rounded-2xl shadow-xl transition flex items-center gap-3 cursor-pointer text-base sm:text-lg uppercase tracking-wider"
                >
                  <WhatsAppIcon className="w-5.5 h-5.5 text-[#0a2240]" />
                  <span>WhatsApp Chat Now</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    pixelTracker.trackDonateClick(500, 'Contact Hero Secondary CTA');
                    onOpenDonateModal(500);
                  }}
                  className="bg-[#071b34] hover:bg-[#163863] text-white font-normal border border-[#da8a24]/50 px-8 py-4 rounded-2xl shadow-md transition flex items-center gap-2.5 cursor-pointer text-base sm:text-lg backdrop-blur-md"
                >
                  <Heart className="w-5 h-5 text-[#da8a24] fill-[#da8a24]" />
                  <span>Donate Now</span>
                </motion.button>
              </div>
            </motion.div>

          </div>

        </div>

        {/* ORGANIC WAVES SECTION DIVIDER (No Blue Bar) */}
        <div className="absolute -bottom-1 left-0 right-0 z-20 pointer-events-none">
          <DarkToLightDivider bgFrom="transparent" bgTo="#f8fafc" />
        </div>
      </section>



      {/* 4. MAIN CONTACT FORM & LOCATION MAP SECTION */}
      <section id="form-section" className="py-8 sm:py-24 bg-[#f8fafc] text-slate-900 relative">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 lg:px-12 space-y-16">
          
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

              {/* Grid of Contact Information Cards - Transparent & Dark Navy Icons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                {/* 1. Call Our Helpline */}
                <div className="p-6 rounded-2xl space-y-4 border border-slate-200/80 hover:border-[#da8a24]/50 transition-colors flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-[#0a2240] text-[#da8a24] flex items-center justify-center font-normal shadow-sm">
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

                {/* 2. WhatsApp Chat */}
                <div className="p-6 rounded-2xl space-y-4 border border-slate-200/80 hover:border-[#da8a24]/50 transition-colors flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-[#0a2240] text-[#da8a24] flex items-center justify-center font-normal shadow-sm">
                      <WhatsAppIcon className="w-6 h-6 text-[#da8a24]" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-normal text-[#0a2240] text-lg sm:text-xl">WhatsApp Chat</h3>
                      <p className="text-sm text-slate-500 font-normal">Instant response from coordinators</p>
                    </div>
                  </div>
                  <button
                    onClick={handleDirectWhatsApp}
                    className="w-full mt-2 bg-[#da8a24] hover:bg-[#c77a1e] text-[#0a2240] font-normal text-sm py-3 px-5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-sm uppercase tracking-wider"
                  >
                    <WhatsAppIcon className="w-4.5 h-4.5 text-[#0a2240]" />
                    <span>Chat Now</span>
                  </button>
                </div>

                {/* 3. Redhills Home Office */}
                <div className="p-6 rounded-2xl space-y-4 border border-slate-200/80 hover:border-[#da8a24]/50 transition-colors flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-[#0a2240] text-[#da8a24] flex items-center justify-center font-normal shadow-sm">
                      <MapPin className="w-6 h-6 text-[#da8a24]" />
                    </div>
                    <h3 className="font-normal text-[#0a2240] text-lg sm:text-xl">Redhills Home Office</h3>
                    <p className="text-sm text-slate-600 leading-relaxed font-normal">
                      #244, Mallima Nagar, Vilagadupakkam, Redhills, Chennai - 600052
                    </p>
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
                <div className="p-6 rounded-2xl space-y-4 border border-slate-200/80 hover:border-[#da8a24]/50 transition-colors flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-[#0a2240] text-[#da8a24] flex items-center justify-center font-normal shadow-sm">
                      <Building2 className="w-6 h-6 text-[#da8a24]" />
                    </div>
                    <h3 className="font-normal text-[#0a2240] text-lg sm:text-xl">Corporate Office</h3>
                    <p className="text-sm text-slate-600 leading-relaxed font-normal">
                      #49, Venus Nagar Main Road, Kolathur, Chennai - 600099
                    </p>
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
              {/* Google Map Panel */}
              <div className="bg-white p-6 rounded-3xl space-y-4">
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

                <div className="w-full h-72 rounded-2xl overflow-hidden relative bg-slate-100">
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

              {/* Working Hours & Visit Info Card (Dark Navy #0a2240) */}
              <div className="bg-[#0a2240] text-white p-6 sm:p-8 rounded-3xl space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#da8a24] text-[#0a2240] flex items-center justify-center font-normal">
                    <Clock className="w-6 h-6 text-[#0a2240]" />
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



      {/* 8. SUPPORT A CAUSE / FINAL DONATION CTA SECTION (White Section) */}
      <section className="py-10 sm:py-16 bg-white text-slate-900 relative">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 lg:px-12">
          
          <div className="bg-[#0a2240] text-white rounded-3xl p-6 sm:p-8 lg:p-10 relative overflow-hidden shadow-2xl">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center relative z-10">
              
              {/* Left Column: Transparent Illustration (5 cols) */}
              <div className="lg:col-span-5 flex items-center justify-center">
                <div className="relative w-full max-w-[270px] sm:max-w-[310px] lg:max-w-[330px] flex items-center justify-center">
                  {/* Subtle warm ambient backdrop glow */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#da8a24]/15 via-[#da8a24]/5 to-transparent rounded-full blur-2xl pointer-events-none transform -translate-y-2"></div>
                  
                  <img
                    src={immediateImpactIllustration}
                    alt="Support a Cause Truth Foundation - Make an Immediate Impact"
                    className="relative z-10 w-full h-auto max-h-[250px] sm:max-h-[280px] lg:max-h-[300px] object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.35)]"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Right Column: Heading & CTA Button (7 cols) */}
              <div className="lg:col-span-7 space-y-3.5 sm:space-y-4">
                <span className="text-[#da8a24] font-normal text-xs sm:text-sm uppercase tracking-widest block">
                  MAKE AN IMMEDIATE IMPACT
                </span>
                <h2 className="text-2xl sm:text-4xl lg:text-[40px] font-normal text-white tracking-tight leading-tight">
                  Support a Cause. <span className="text-[#da8a24]">Change a Life.</span>
                </h2>
                <p className="text-sm sm:text-base lg:text-lg text-slate-300 font-normal leading-relaxed">
                  Every contribution directly provides warm nutritious meals, school textbooks, medical care, and dignity to orphaned children and elderly seniors across Chennai.
                </p>

                <div className="pt-1.5 flex flex-wrap items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      pixelTracker.trackDonateClick(500, 'Contact Final Support CTA');
                      onOpenDonateModal(500);
                    }}
                    className="bg-[#da8a24] hover:bg-[#c77a1e] text-[#0a2240] font-normal px-8 py-3.5 sm:px-9 sm:py-4 rounded-2xl shadow-xl transition flex items-center gap-2.5 cursor-pointer text-base sm:text-lg uppercase tracking-wider min-h-[48px]"
                  >
                    <Heart className="w-5 h-5 fill-[#0a2240]" />
                    <span>Donate Now</span>
                  </motion.button>
                </div>
              </div>

            </div>

          </div>

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
              className="w-full bg-[#da8a24] hover:bg-[#c77a1e] text-[#0a2240] font-normal py-3.5 rounded-xl transition cursor-pointer text-sm uppercase tracking-wider"
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
