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
import { DarkToLightDivider, LightToDarkDivider } from '../../components/SectionDividers';
import { WhatsAppIcon } from '../../components/WhatsAppIcon';
import { pixelTracker } from '../../utils/pixelTracker';

// Real Project Image Imports
import heroChildLongingMeal from '../../assets/images/hero_child_longing_meal.jpg?w=900&format=webp';
import trustSectionOrganicMeal from '../../assets/images/trust_section_organic_meal.jpg?w=800&format=webp';
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

const CONTACT_FAQS = [
  {
    q: 'How can I visit the Redhills Orphanage or Special School?',
    a: 'Visitors are warmly welcome! You can visit our Redhills campus or Thiruvallur Special School between Monday and Saturday (9:00 AM – 6:00 PM). Please call us at +91 99622 94949 or submit the contact form to confirm timing.'
  },
  {
    q: 'How do I obtain my 80G tax exemption certificate?',
    a: 'When you donate online or via bank transfer, an official receipt with 80G tax exemption details is automatically emailed and sent on WhatsApp. If you need a duplicate receipt, select "80G Tax Exemption Receipt Request" in our form above.'
  },
  {
    q: 'Can I donate rice, stationery, or clothes instead of money?',
    a: 'Yes! We gratefully accept bulk rice bags, grocery provisions, school stationery kits (notebooks, bags, pens), hygiene items, and new clothes at both our Redhills and Kolathur offices.'
  },
  {
    q: 'How can I sign up as a volunteer educator or event helper?',
    a: 'We welcome volunteers to teach at our 8 evening tuition centers, conduct art workshops, or help at health camps. Simply fill out the form selecting "Volunteer Application" or WhatsApp us directly.'
  }
];

const MORE_WAYS_ITEMS = [
  {
    title: 'Phone Support',
    subtitle: '+91 99622 94949',
    description: 'Mon - Sat, 9am - 6pm hotline for immediate assistance.',
    icon: Phone,
    action: 'tel:+919962294949'
  },
  {
    title: 'WhatsApp Chat',
    subtitle: 'Instant WhatsApp',
    description: 'Connect directly with our helpline coordinators.',
    icon: MessageSquare,
    action: 'https://wa.me/919962294949'
  },
  {
    title: 'Email Us',
    subtitle: 'truthfoundationngo@gmail.com',
    description: 'Send official CSR proposals, 80G queries, or media inquiries.',
    icon: Mail,
    action: 'mailto:truthfoundationngo@gmail.com'
  },
  {
    title: 'Visit Our Centers',
    subtitle: 'Redhills & Kolathur',
    description: 'Schedule a visit to spend time with children and seniors.',
    icon: MapPin,
    action: '#map-section'
  },
  {
    title: 'Volunteer',
    subtitle: 'Teach or Assist',
    description: 'Join our evening tuition centers or medical drive teams.',
    icon: Users,
    action: '#form-section'
  }
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
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

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
      <section className="pt-28 sm:pt-36 pb-12 sm:pb-16 bg-[#0a2240] text-white relative overflow-hidden min-h-[75vh] lg:min-h-screen flex items-center">
        
        {/* Desktop Background Image (Hidden on Mobile) - Full Screen Coverage & Vivid Clarity */}
        <div 
          className="hidden md:block absolute inset-0 w-full h-full bg-cover bg-center lg:bg-top pointer-events-none opacity-90"
          style={{ backgroundImage: `url(${contactHeroBgDesktop})` }}
        />

        {/* Mobile Background Image (Block on Mobile, Hidden on Desktop) - Full Coverage */}
        <div 
          className="block md:hidden absolute inset-0 w-full h-full bg-cover bg-center pointer-events-none opacity-90"
          style={{ backgroundImage: `url(${contactHeroBgMobile})` }}
        />

        {/* Light Ambient Dark Gradient Overlay for maximum image sharpness & text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a2240]/90 via-[#0a2240]/60 to-transparent pointer-events-none" />

        {/* Subtle Ambient Background Glows */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#da8a24]/12 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#da8a24]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10 w-full">
          
          <div className="max-w-3xl space-y-6">
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Eyebrow Pill */}
              <div className="inline-flex items-center gap-2 text-[#da8a24] font-semibold text-xs sm:text-sm uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-[#da8a24]/20 border border-[#da8a24]/40 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-[#da8a24]" />
                <span>GET IN TOUCH WITH TRUTH FOUNDATION</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-semibold text-white tracking-tight leading-[1.1]">
                We Are Here to Listen, Guide & <span className="text-[#da8a24]">Partner</span>
              </h1>

              {/* Paragraph Description */}
              <p className="text-base sm:text-lg text-slate-100 font-normal leading-relaxed max-w-[660px] drop-shadow-sm">
                Have questions about donations, 80G tax exemption receipts, volunteering opportunities, or scheduling a visit to our Redhills Orphanage or Special Needs School? Our team is dedicated to serving you.
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
      </section>

      {/* ORGANIC WAVES SECTION DIVIDER (Dark #0a2240 to Light #f8fafc) */}
      <DarkToLightDivider bgFrom="#0a2240" bgTo="#f8fafc" />



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

      {/* 5. ORGANIC SECTION DIVIDER (Light to Dark) */}
      <LightToDarkDivider bgFrom="#f8fafc" bgTo="#0a2240" />

      {/* 6. MORE WAYS TO CONNECT SECTION (Dark Navy #0a2240 Section) */}
      <section className="py-16 sm:py-24 bg-[#0a2240] text-white relative overflow-hidden">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10 space-y-12">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[#da8a24] font-semibold text-xs uppercase tracking-widest block">
              MORE WAYS TO CONNECT
            </span>
            <h2 className="text-2xl sm:text-4xl font-semibold text-white tracking-tight">
              Together, We Create Brighter Futures
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
              Explore the multiple channels available to partner, donate provisions, volunteer as an educator, or request official receipts.
            </p>
          </div>

          {/* Grid Layout: 5 Connection Items + Organic Image */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* 5 Editorial Connection Items (8 cols) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {MORE_WAYS_ITEMS.map((item, idx) => {
                const IconComp = item.icon;
                return (
                  <motion.a
                    key={idx}
                    href={item.action}
                    whileHover={{ y: -3 }}
                    className={`p-5 rounded-2xl bg-[#071b34] border border-[#163863] space-y-2 hover:border-[#da8a24] transition-all group ${
                      idx === MORE_WAYS_ITEMS.length - 1 ? 'sm:col-span-2' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#da8a24]/15 border border-[#da8a24]/30 flex items-center justify-center text-[#da8a24]">
                        <IconComp className="w-4 h-4 text-[#da8a24]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-sm group-hover:text-[#da8a24] transition-colors">
                          {item.title}
                        </h3>
                        <div className="text-[11px] text-[#da8a24] font-medium">
                          {item.subtitle}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-normal pt-1">
                      {item.description}
                    </p>
                  </motion.a>
                );
              })}
            </div>

            {/* Organic Small Community Image (5 cols) */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="relative w-full max-w-[400px] p-2">
                <div 
                  className="w-full aspect-[4/3] overflow-hidden border-2 border-[#da8a24] shadow-2xl bg-[#071b34]"
                  style={{ borderRadius: '80px 20px 80px 20px' }}
                >
                  <img
                    src={trustSectionOrganicMeal}
                    alt="Truth Foundation Community Support"
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Contact FAQs Accordion */}
          <div className="pt-8 border-t border-[#163863] space-y-6">
            <div className="text-center space-y-2">
              <span className="text-[#da8a24] font-semibold text-xs uppercase tracking-widest block">
                FREQUENTLY ASKED QUESTIONS
              </span>
              <h3 className="text-xl sm:text-2xl font-semibold text-white">Visit & Donation FAQs</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-5xl mx-auto">
              {CONTACT_FAQS.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="bg-[#071b34] rounded-2xl border border-[#163863] overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-semibold text-white text-xs sm:text-sm hover:text-[#da8a24] transition cursor-pointer"
                    >
                      <span className="flex items-center gap-2.5">
                        <HelpCircle className="w-4 h-4 text-[#da8a24] shrink-0" />
                        {faq.q}
                      </span>
                      <ChevronRight className={`w-4 h-4 text-[#da8a24] transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-90' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="px-5 pb-5 text-xs text-slate-300 leading-relaxed font-normal border-t border-[#163863]/60 pt-3 pl-11"
                        >
                          {faq.a}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* 7. ORGANIC SECTION DIVIDER (Dark to Light) */}
      <DarkToLightDivider bgFrom="#0a2240" bgTo="#ffffff" />

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

      {/* 11. Floating WhatsApp Widget (EXACT UNCHANGED) */}
      <FloatingWhatsApp />

    </div>
  );
};
