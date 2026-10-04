import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Heart, Menu, X as CloseIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { pixelTracker } from '../utils/pixelTracker';
import { WhatsAppIcon } from './WhatsAppIcon';
import truthLogo from '../assets/images/truth_foundation_logo_1785562616008.jpg?w=128&format=webp';

export type PageType = 'home' | 'about' | 'gallery' | 'contact' | 'donate';

interface HeaderProps {
  currentPage?: PageType;
  onOpenDonateModal: (amount?: number) => void;
  onNavigate?: (page: PageType, anchor?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage = 'home',
  onOpenDonateModal,
  onNavigate,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleWhatsAppClick = () => {
    pixelTracker.trackWhatsAppClick('Header WhatsApp Button');
    const msg = encodeURIComponent(`Hello Truth Foundation! I am interested in donating meals or volunteering.`);
    window.open(`https://wa.me/919962294949?text=${msg}`, '_blank');
  };

  const navLinks: { label: string; page: PageType }[] = [
    { label: 'Home', page: 'home' },
    { label: 'About Us', page: 'about' },
    { label: 'Gallery', page: 'gallery' },
    { label: 'Contact Us', page: 'contact' },
  ];

  const handleNavClick = (page: PageType) => {
    setIsMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 border-none ${
        isScrolled
          ? 'bg-[#0a2240]/95 backdrop-blur-md shadow-lg py-2 sm:py-2.5'
          : 'bg-gradient-to-b from-[#0a2240]/85 via-[#0a2240]/30 to-transparent py-3 sm:py-4'
      }`}
    >
      {/* Main Navbar Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 lg:h-24 flex items-center justify-between gap-4">
        
        {/* Left Side: Brand Logo & Title */}
        <div className="flex items-center min-w-0 shrink">
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 sm:gap-4 group min-w-0 text-left cursor-pointer border-none bg-transparent"
          >
            <motion.div
              whileHover={{ scale: 1.08, rotate: 3 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              className="relative shrink-0"
            >
              <div className="absolute -inset-1 rounded-full bg-[#da8a24]/60 blur-sm group-hover:bg-[#da8a24]/50 transition-all duration-300" />
              <img
                src={truthLogo}
                alt="Truth Foundation Logo"
                width={160}
                height={160}
                fetchPriority="high"
                className="relative w-13 h-13 xs:w-14 xs:h-14 sm:w-16 sm:h-16 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full object-cover border-2 lg:border-3 border-[#da8a24] shadow-lg shrink-0"
              />
            </motion.div>

            <div className="min-w-0 text-left">
              <span className="text-lg xs:text-xl sm:text-2xl md:text-2xl lg:text-3xl font-semibold text-white tracking-tight leading-none block group-hover:text-[#da8a24] transition-colors whitespace-nowrap drop-shadow-sm">
                TRUTH FOUNDATION
              </span>
              <div className="flex items-center gap-1.5 pt-0.5">
                <p className="text-[11px] xs:text-xs sm:text-xs md:text-xs lg:text-sm font-normal text-slate-300 uppercase tracking-normal sm:tracking-widest whitespace-nowrap drop-shadow-xs">
                  Registered NGO &bull; Chennai, India
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Center: Desktop Navigation Links (No background, underline only for active) */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-8">
          {navLinks.map((link) => {
            const isActive = currentPage === link.page;
            return (
              <button
                key={link.page}
                onClick={() => handleNavClick(link.page)}
                className={`px-1 py-2 text-base lg:text-lg font-normal transition-colors cursor-pointer relative bg-transparent border-none ${
                  isActive
                    ? 'text-[#da8a24] font-medium'
                    : 'text-slate-200 hover:text-[#da8a24]'
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="activeHeaderTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#da8a24] rounded-full"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Side: Action Buttons */}
        <div className="flex flex-row items-center justify-end gap-1.5 sm:gap-3 shrink-0">

          {/* WhatsApp button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleWhatsAppClick}
            className="hidden sm:flex items-center justify-center gap-1.5 sm:gap-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium shadow-sm cursor-pointer transition-all shrink-0
              w-9 h-9 sm:w-auto sm:h-auto sm:px-3.5 sm:py-2.5 lg:px-4.5 lg:py-2.5 text-xs sm:text-sm"
            title="Chat on WhatsApp"
            aria-label="Chat on WhatsApp"
          >
            <WhatsAppIcon className="w-4 h-4 text-white shrink-0" />
            <span className="hidden sm:inline font-medium">WhatsApp</span>
          </motion.button>

          {/* Donate Now button (Hidden on mobile, visible on sm and up) */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              pixelTracker.trackDonateClick(500, 'Header Donate Button');
              onOpenDonateModal(500);
            }}
            className="hidden sm:flex items-center justify-center gap-1.5 sm:gap-2 bg-[#da8a24] hover:bg-[#c77a1e] text-[#0a2240] rounded-xl font-semibold shadow-md cursor-pointer transition-all shrink-0 uppercase tracking-wider
              px-3.5 py-2 sm:px-4.5 sm:py-2.5 lg:px-6 lg:py-2.5 text-xs sm:text-sm lg:text-base"
            aria-label="Donate Now"
          >
            <Heart className="w-4 h-4 lg:w-5 lg:h-5 fill-[#0a2240] shrink-0 animate-pulse" />
            <span className="inline font-semibold">Donate</span>
          </motion.button>

          {/* Mobile Menu Toggle Button (No border color, outline-none) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2.5 text-slate-200 hover:text-white bg-[#071b34]/80 backdrop-blur-md rounded-xl border-0 outline-none cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <CloseIcon className="w-6 h-6 text-[#da8a24]" /> : <Menu className="w-6 h-6 text-white" />}
          </button>

        </div>

      </div>

      {/* Mobile Slide-in Drawer Portal from Right Side (Rendered in document.body to stay above all sections) */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 z-[999990] bg-black/60 backdrop-blur-sm md:hidden"
              />

              {/* Right Drawer Panel (Occupies Half Screen Width, Highest Z-Index) */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 280 }}
                className="fixed top-0 right-0 bottom-0 z-[999999] w-[60%] xs:w-1/2 max-w-xs h-full bg-[#071b34] p-5 pt-6 flex flex-col justify-between shadow-2xl md:hidden overflow-y-auto"
              >
                <div className="space-y-6">
                  {/* Header row in mobile menu: Close button aligned right (No Navigation text) */}
                  <div className="flex items-center justify-end border-b border-white/10 pb-4">
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2 text-slate-300 hover:text-white bg-white/10 rounded-lg border-0 cursor-pointer"
                      aria-label="Close menu"
                    >
                      <CloseIcon className="w-5 h-5 text-white" />
                    </button>
                  </div>

                  {/* Nav Links (font-normal, non-bold, enlarged font size) */}
                  <div className="flex flex-col gap-2">
                    {navLinks.map((link) => {
                      const isActive = currentPage === link.page;
                      return (
                        <button
                          key={link.page}
                          onClick={() => handleNavClick(link.page)}
                          className={`w-full text-left px-4 py-3.5 rounded-xl text-base sm:text-lg font-normal transition-all cursor-pointer flex items-center justify-between border-0 ${
                            isActive
                              ? 'bg-[#da8a24] text-[#0a2240]'
                              : 'text-slate-200 hover:bg-[#0a2240] hover:text-white'
                          }`}
                        >
                          <span className="font-normal">{link.label}</span>
                          {isActive && <div className="w-2 h-2 rounded-full bg-[#0a2240]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}

    </header>
  );
};
