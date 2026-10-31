import React, { useState, useEffect } from 'react';
import { X, Heart, CheckCircle2 } from 'lucide-react';
import { pixelTracker } from '../utils/pixelTracker';
import { WhatsAppIcon } from './WhatsAppIcon';
import { fetchSiteContent, DynamicDonationPopup } from '../utils/cmsApi';

interface FloatingWhatsAppProps {
  onOpenDonateModal?: (amount?: number) => void;
}

const DEFAULT_POPUPS: DynamicDonationPopup[] = [
  {
    id: 'pop-1',
    donor_name: 'Karthik Raja',
    amount: 1500,
    cause: 'Special Meals for 15 Children',
    location: 'Chennai',
    time_ago: 'Just now',
    cta_text: 'Add your donation'
  },
  {
    id: 'pop-2',
    donor_name: 'Priya Sundaram',
    amount: 750,
    cause: 'Senior Care & Daily Medicines',
    location: 'Tambaram',
    time_ago: '1 min ago',
    cta_text: 'Add your donation'
  },
  {
    id: 'pop-3',
    donor_name: 'Ananya Sharma',
    amount: 2500,
    cause: 'Monthly Education Kit & Books',
    location: 'Anna Nagar',
    time_ago: 'Just now',
    cta_text: 'Add your donation'
  },
  {
    id: 'pop-4',
    donor_name: 'Vignesh Kumar',
    amount: 1000,
    cause: 'Daily Nutritious Breakfast for Kids',
    location: 'Thiruvallur',
    time_ago: '2 mins ago',
    cta_text: 'Add your donation'
  },
  {
    id: 'pop-5',
    donor_name: 'Meera Krishnan',
    amount: 5000,
    cause: 'Special Needs Therapy & Care',
    location: 'Adyar',
    time_ago: 'Just now',
    cta_text: 'Add your donation'
  },
  {
    id: 'pop-6',
    donor_name: 'Rajesh Natarajan',
    amount: 3000,
    cause: 'Emergency Shelter & Bedding Provisions',
    location: 'Velachery',
    time_ago: '3 mins ago',
    cta_text: 'Add your donation'
  },
  {
    id: 'pop-7',
    donor_name: 'Divya & Arun',
    amount: 1200,
    cause: 'Sunday Feast for Orphan Children',
    location: 'Redhills',
    time_ago: 'Just now',
    cta_text: 'Add your donation'
  },
  {
    id: 'pop-8',
    donor_name: 'Sangeetha R.',
    amount: 800,
    cause: 'Fresh Fruits & Wholesome Diet',
    location: 'Mylapore',
    time_ago: '4 mins ago',
    cta_text: 'Add your donation'
  }
];

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ onOpenDonateModal }) => {
  const [popups, setPopups] = useState<DynamicDonationPopup[]>(DEFAULT_POPUPS);
  const [enabled, setEnabled] = useState(true);
  const [intervalSec, setIntervalSec] = useState(5);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  // Fetch CMS config if available
  useEffect(() => {
    let mounted = true;
    fetchSiteContent().then((content) => {
      if (!mounted) return;
      if (content?.donation_popups) {
        if (typeof content.donation_popups.enabled === 'boolean') {
          setEnabled(content.donation_popups.enabled);
        }
        if (content.donation_popups.interval_seconds && content.donation_popups.interval_seconds >= 3) {
          setIntervalSec(content.donation_popups.interval_seconds);
        }
        const customMsgs = content.donation_popups.messages || content.donation_popups.popups;
        if (customMsgs && customMsgs.length > 0) {
          setPopups(customMsgs);
        }
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // 5-second cycle: Typing animation (~1.2s) followed by Popup display (~3.8s)
  useEffect(() => {
    if (!enabled || isDismissed || popups.length === 0) return;

    let typingTimeout: ReturnType<typeof setTimeout>;
    let nextCycleTimeout: ReturnType<typeof setTimeout>;

    const runCycle = () => {
      // Step 1: Start typing state
      setIsTyping(true);

      // Step 2: After 1.2s, reveal the completed donation popup message
      typingTimeout = setTimeout(() => {
        setIsTyping(false);
      }, 1200);

      // Step 3: At the end of the configured interval (default 5s), move to the next donor
      nextCycleTimeout = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % popups.length);
        runCycle();
      }, intervalSec * 1000);
    };

    // Initial trigger
    runCycle();

    return () => {
      clearTimeout(typingTimeout);
      clearTimeout(nextCycleTimeout);
    };
  }, [enabled, isDismissed, popups.length, intervalSec]);

  const currentPopup = popups[currentIndex] || DEFAULT_POPUPS[0];
  const donorName = currentPopup.donor_name || currentPopup.name || 'Kind Supporter';
  const amount = Number(currentPopup.amount) || 500;
  const cause = currentPopup.cause || 'Nutritious Meals & Care';
  const location = currentPopup.location || 'Chennai';
  const timeAgo = currentPopup.time_ago || 'Just now';
  const ctaText = currentPopup.cta_text || 'Add your donation';

  // Extract initials for donor avatar
  const initials = donorName
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'TF';

  const handleWhatsAppClick = () => {
    pixelTracker.trackWhatsAppClick('Floating Widget');
    const msg = encodeURIComponent(`Hello Truth Foundation! I am interested in donating meals or volunteering.`);
    window.open(`https://wa.me/919962294949?text=${msg}`, '_blank');
  };

  const handleDonateClick = () => {
    pixelTracker.trackDonateClick(500, 'WhatsApp Popup CTA');
    if (onOpenDonateModal) {
      onOpenDonateModal(500);
    }
  };

  return (
    <div className="fixed bottom-6 right-4 sm:bottom-8 sm:right-6 z-[9990] flex flex-col items-end gap-2.5 max-w-[calc(100vw-2rem)] select-none">
      {/* Dynamic Popups & Automatic Typing Notification (No border color applied) */}
      {enabled && !isDismissed && isPopupVisible && (
        <div className="flex flex-col items-end">
          {isTyping ? (
            /* Automatic Typing Indicator Bubble - Transparent, No Color, No Borders, No Shadows */
            <div className="bg-transparent text-slate-800 px-2 py-1.5 flex items-center gap-2 border-0 shadow-none text-xs transition-all">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-slate-600 text-[11px] font-medium tracking-wide">
                Someone is donating...
              </span>
              <span className="flex items-center gap-1 ml-0.5">
                <span className="w-1.5 h-1.5 bg-[#da8a24] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-[#da8a24] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-[#da8a24] rounded-full animate-bounce"></span>
              </span>
            </div>
          ) : (
            /* Popup Notification Message Card - Transparent Background, No Color, No Borders, No Shadows */
            <div className="bg-black/20 text-slate-800 p-2.5 border-0 shadow-none w-[180px] xs:w-[195px] sm:w-[205px] backdrop-blur-md relative transition-all duration-300 flex flex-col items-center text-center">
              {/* Dismiss Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDismissed(true);
                }}
                className="absolute top-0 right-0 text-slate-400 hover:text-slate-700 p-1 rounded-full transition cursor-pointer"
                title="Dismiss notification"
                aria-label="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              {/* Vertical Stack: Donor Avatar, Name, Location & Verified Check */}
              <div className="flex flex-col items-center mt-0.5 mb-1.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#da8a24] to-[#f59e0b] text-white font-bold text-xs flex items-center justify-center shadow-sm mb-1">
                  {initials}
                </div>
                <div className="flex items-center gap-1 justify-center max-w-[150px]">
                  <span className="font-semibold text-[#0a2240] text-xs truncate">{donorName}</span>
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0 fill-emerald-100" />
                </div>
                <p className="text-[10px] text-slate-500">
                  {location} • <span className="text-emerald-600 font-medium">{timeAgo}</span>
                </p>
              </div>

              {/* Middle Section: Cause & Amount - Transparent, No Color, No Borders, No Shadows */}
              <div className="w-full bg-transparent p-1.5 mb-2 border-0 shadow-none text-center flex flex-col items-center gap-0.5">
                <div className="text-[11px] text-slate-600 leading-tight">
                  Donated for <span className="text-[#da8a24] font-medium block truncate max-w-[155px]">{cause}</span>
                </div>
                <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md text-emerald-700 font-bold text-xs">
                  ₹{amount.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Bottom Row: Interactive "Add your donation" CTA button */}
              <button
                onClick={handleDonateClick}
                className="w-full py-1.5 px-2 bg-gradient-to-r from-[#da8a24] to-[#f59e0b] hover:from-[#c77a1e] hover:to-[#da8a24] text-white text-[11px] font-bold rounded-xl shadow-md transition active:scale-95 flex items-center justify-center gap-1 cursor-pointer border-0 uppercase tracking-wider"
              >
                <Heart className="w-3 h-3 fill-white text-white" />
                <span className="truncate">{ctaText}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* 1. Floating WhatsApp Button */}
      <button
        onClick={handleWhatsAppClick}
        className="w-12 h-12 sm:w-14 sm:h-14 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-xl flex items-center justify-center cursor-pointer border-2 border-white transition-transform active:scale-95 shrink-0"
        title="Chat on WhatsApp"
        aria-label="Chat on WhatsApp"
      >
        <WhatsAppIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
      </button>

      {/* 2. Floating Donate Button (Aligned directly below WhatsApp icon only on mobile view) */}
      {onOpenDonateModal && (
        <button
          onClick={() => {
            pixelTracker.trackDonateClick(500, 'Floating Mobile Donate Button');
            onOpenDonateModal(500);
          }}
          className="sm:hidden w-12 h-12 bg-[#da8a24] hover:bg-[#c77a1e] text-white rounded-full shadow-xl flex items-center justify-center cursor-pointer border-2 border-white transition-transform active:scale-95 shrink-0"
          title="Donate Now"
          aria-label="Donate Now"
        >
          <Heart className="w-6 h-6 fill-white text-white" />
        </button>
      )}
    </div>
  );
};

