import React, { useState } from 'react';
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
  Phone,
  ShieldCheck,
  Lock,
  Award
} from 'lucide-react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { FloatingWhatsApp } from '../../components/FloatingWhatsApp';
import { DarkToLightDivider } from '../../components/SectionDividers';
import { WhatsAppIcon } from '../../components/WhatsAppIcon';
import { pixelTracker } from '../../utils/pixelTracker';

// Real Project Image Imports
import heroChildLongingMeal from '../../assets/images/hero_child_longing_meal.jpg?w=900&format=webp';
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
    }, 1000);
  };

  const handleDirectWhatsApp = () => {
    pixelTracker.trackWhatsAppClick('Contact Page WhatsApp Card');
    const msg = encodeURIComponent(`Hello Truth Foundation! I have an inquiry regarding: ${formData.subject || 'General Info'}`);
    window.open(`https://wa.me/919962294949?text=${msg}`, '_blank');
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
      <section className="pt-28 sm:pt-36 pb-12 sm:pb-16 bg-slate-950 text-white relative overflow-hidden min-h-[75vh] lg:min-h-screen flex items-center">
        
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
          
          <div className="max-w-3xl space-y-4">
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              {/* Main Heading: All White */}
              <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-semibold text-white tracking-tight leading-[1.1]">
                We Are Here to Listen, Guide & Partner
              </h1>

              {/* Concise Paragraph Description */}
              <p className="text-sm sm:text-base text-slate-200 font-normal leading-relaxed max-w-[600px] drop-shadow-sm">
                Get in touch with our team for donation inquiries, 80G tax exemption receipts, volunteering opportunities, or scheduling a visit to our Redhills campus.
              </p>

              {/* Hero CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleDirectWhatsApp}
                  className="bg-[#da8a24] hover:bg-[#c77a1e] text-[#0a2240] font-semibold px-7 py-3.5 rounded-2xl shadow-xl transition flex items-center gap-2.5 cursor-pointer text-sm uppercase tracking-wider"
                >
                  <WhatsAppIcon className="w-5 h-5 text-[#0a2240]" />
                  <span>WhatsApp Chat Now</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    pixelTracker.trackDonateClick(500, 'Contact Hero Secondary CTA');
                    onOpenDonateModal(500);
                  }}
                  className="bg-[#071b34] hover:bg-[#163863] text-white font-semibold border border-[#da8a24]/50 px-7 py-3.5 rounded-2xl shadow-md transition flex items-center gap-2 cursor-pointer text-sm backdrop-blur-md"
                >
                  <Heart className="w-4 h-4 text-[#da8a24] fill-[#da8a24]" />
                  <span>Donate Now</span>
                </motion.button>
              </div>
            </motion.div>

          </div>

        </div>

        {/* ORGANIC WAVES SECTION DIVIDER (No Blue Bar) */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
          <DarkToLightDivider bgFrom="transparent" bgTo="#f8fafc" />
        </div>
      </section>



      {/* 4. MAIN CONTACT FORM & LOCATION MAP SECTION */}
      <section id="form-section" className="py-16 sm:py-24 bg-[#f8fafc] text-slate-900 relative">
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
              <div className="space-y-2 border-b border-slate-200/80 pb-6">
                <span className="text-[#da8a24] font-semibold text-xs uppercase tracking-widest block">
                  GET IN TOUCH DIRECTLY
                </span>
                <h2 className="text-2xl sm:text-3xl font-semibold text-[#0a2240] tracking-tight">
                  Direct Helplines & Office Locations
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 font-normal">
                  Our team is dedicated to serving you. Feel free to call, chat, or visit our offices anytime.
                </p>
              </div>

              {/* Grid of Contact Information Cards - Transparent & Dark Navy Icons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                {/* 1. Call Our Helpline */}
                <div className="p-5 rounded-2xl space-y-3 border border-slate-200/80 hover:border-[#da8a24]/50 transition-colors flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-[#0a2240] text-[#da8a24] flex items-center justify-center font-semibold shadow-sm">
                      <PhoneCall className="w-5 h-5 text-[#da8a24]" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-[#0a2240] text-base">Call Our Helpline</h3>
                      <p className="text-xs text-slate-500 font-medium">Mon – Sat, 9:00 AM – 6:00 PM</p>
                    </div>
                  </div>
                  <a
                    href="tel:+919962294949"
                    className="inline-block text-base sm:text-lg font-semibold text-[#da8a24] hover:underline pt-1"
                  >
                    +91 99622 94949
                  </a>
                </div>

                {/* 2. WhatsApp Chat */}
                <div className="p-5 rounded-2xl space-y-3 border border-slate-200/80 hover:border-[#da8a24]/50 transition-colors flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-[#0a2240] text-[#da8a24] flex items-center justify-center font-semibold shadow-sm">
                      <WhatsAppIcon className="w-5 h-5 text-[#da8a24]" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-[#0a2240] text-base">WhatsApp Chat</h3>
                      <p className="text-xs text-slate-500 font-normal">Instant response from coordinators</p>
                    </div>
                  </div>
                  <button
                    onClick={handleDirectWhatsApp}
                    className="w-full mt-2 bg-[#da8a24] hover:bg-[#c77a1e] text-[#0a2240] font-semibold text-xs py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-sm uppercase tracking-wider"
                  >
                    <WhatsAppIcon className="w-4 h-4 text-[#0a2240]" />
                    <span>Chat Now</span>
                  </button>
                </div>

                {/* 3. Redhills Home Office */}
                <div className="p-5 rounded-2xl space-y-3 border border-slate-200/80 hover:border-[#da8a24]/50 transition-colors flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-[#0a2240] text-[#da8a24] flex items-center justify-center font-semibold shadow-sm">
                      <MapPin className="w-5 h-5 text-[#da8a24]" />
                    </div>
                    <h3 className="font-semibold text-[#0a2240] text-base">Redhills Home Office</h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      #244, Mallima Nagar, Vilagadupakkam, Redhills, Chennai - 600052
                    </p>
                  </div>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Truth+Foundation+244+Mallima+Nagar+Vilagadupakkam+Redhills+Chennai+600052"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#da8a24] hover:underline pt-2"
                  >
                    <span>View Google Map</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* 4. Corporate Office */}
                <div className="p-5 rounded-2xl space-y-3 border border-slate-200/80 hover:border-[#da8a24]/50 transition-colors flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-[#0a2240] text-[#da8a24] flex items-center justify-center font-semibold shadow-sm">
                      <Building2 className="w-5 h-5 text-[#da8a24]" />
                    </div>
                    <h3 className="font-semibold text-[#0a2240] text-base">Corporate Office</h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      #49, Venus Nagar Main Road, Kolathur, Chennai - 600099
                    </p>
                  </div>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Truth+Foundation+49+Venus+Nagar+Main+Road+Kolathur+Chennai+600099"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#da8a24] hover:underline pt-2"
                  >
                    <span>View Google Map</span>
                    <ExternalLink className="w-3.5 h-3.5" />
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
              <div className="bg-white p-5 rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-semibold text-[#0a2240] text-sm uppercase tracking-wider">
                    <MapPin className="w-4 h-4 text-[#da8a24]" />
                    <span>Corporate Office Map</span>
                  </div>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Truth+Foundation+49+Venus+Nagar+Main+Road+Kolathur+Chennai+600099"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-[#da8a24] hover:underline flex items-center gap-1"
                  >
                    <span>Full Map</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="w-full h-64 rounded-2xl overflow-hidden relative bg-slate-100">
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
              <div className="bg-[#0a2240] text-white p-6 sm:p-7 rounded-3xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#da8a24] text-[#0a2240] flex items-center justify-center font-semibold">
                    <Clock className="w-5 h-5 text-[#0a2240]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Center Visit Hours</h3>
                    <p className="text-xs text-[#da8a24] font-medium">Redhills & Thiruvallur Campuses</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-center justify-between py-2 border-b border-[#163863]">
                    <span>Monday – Saturday</span>
                    <span className="font-semibold text-white">9:00 AM – 6:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-[#163863]">
                    <span>Sunday (Prior Intimation)</span>
                    <span className="font-semibold text-[#da8a24]">10:00 AM – 4:00 PM</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-normal pt-1">
                  We encourage donors to spend time with children and elders. Prior confirmation via phone or WhatsApp is recommended.
                </p>
              </div>

            </motion.div>

          </div>

        </div>
      </section>



      {/* 8. SUPPORT A CAUSE / FINAL DONATION CTA SECTION (White Section) */}
      <section className="py-16 sm:py-24 bg-white text-slate-900 relative">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 lg:px-12">
          
          <div className="bg-[#0a2240] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden space-y-10 shadow-2xl">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              
              {/* Left Column: Organic Image Frame (5 cols) */}
              <div className="lg:col-span-5 flex items-center justify-center">
                <div className="relative w-full max-w-[380px]">
                  <div 
                    className="w-full aspect-[4/3] overflow-hidden border-2 border-[#da8a24] shadow-2xl bg-[#071b34]"
                    style={{ borderRadius: '90px 25px 90px 25px' }}
                  >
                    <img
                      src={heroChildLongingMeal}
                      alt="Support a Cause Truth Foundation"
                      className="w-full h-full object-cover object-center"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Heading & CTA Button (7 cols) */}
              <div className="lg:col-span-7 space-y-5">
                <span className="text-[#da8a24] font-semibold text-xs uppercase tracking-widest block">
                  MAKE AN IMMEDIATE IMPACT
                </span>
                <h2 className="text-2xl sm:text-4xl font-semibold text-white tracking-tight">
                  Support a Cause. <span className="text-[#da8a24]">Change a Life.</span>
                </h2>
                <p className="text-xs sm:text-base text-slate-300 font-normal leading-relaxed">
                  Every contribution directly provides warm nutritious meals, school textbooks, medical care, and dignity to orphaned children and elderly seniors across Chennai.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      pixelTracker.trackDonateClick(500, 'Contact Final Support CTA');
                      onOpenDonateModal(500);
                    }}
                    className="bg-[#da8a24] hover:bg-[#c77a1e] text-[#0a2240] font-semibold px-8 py-4 rounded-2xl shadow-xl transition flex items-center gap-2 cursor-pointer text-sm uppercase tracking-wider min-h-[48px]"
                  >
                    <Heart className="w-5 h-5 fill-[#0a2240]" />
                    <span>Donate Now</span>
                  </motion.button>
                </div>
              </div>

            </div>

            {/* Horizontal Trust Indicators Strip */}
            <div className="pt-6 border-t border-[#163863] grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-semibold text-slate-300">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#da8a24] shrink-0" />
                <span>Safe & Secure Donations</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#da8a24] shrink-0" />
                <span>Direct Impact Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#da8a24] shrink-0" />
                <span>80G Tax Exemption</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#da8a24] shrink-0" />
                <span>Trusted by Communities</span>
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

            <h3 className="text-2xl font-semibold text-white">Message Received!</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Thank you for contacting Truth Foundation. Our coordinator has received your message and will respond to your phone or email within 24 hours.
            </p>

            <button
              onClick={() => setIsSubmitted(false)}
              className="w-full bg-[#da8a24] hover:bg-[#c77a1e] text-[#0a2240] font-semibold py-3 rounded-xl transition cursor-pointer text-xs uppercase tracking-wider"
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
