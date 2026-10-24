import React, { useState, useEffect } from 'react';
import { X, Heart } from 'lucide-react';
import { pixelTracker } from '../utils/pixelTracker';
import { WhatsAppIcon } from './WhatsAppIcon';

interface FloatingWhatsAppProps {
  onOpenDonateModal?: (amount?: number) => void;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ onOpenDonateModal }) => {
  const [showTooltip, setShowTooltip] = useState(true);

  // Show "Need assistance?" option for 30 seconds, then auto hide
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 30000); // 30 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    pixelTracker.trackWhatsAppClick('Floating Widget');
    setShowTooltip(false);
    const msg = encodeURIComponent(`Hello Truth Foundation! I am interested in donating meals or volunteering.`);
    window.open(`https://wa.me/919962294949?text=${msg}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-4 sm:bottom-8 sm:right-6 z-[9990] flex flex-col items-end gap-3 max-w-[calc(100vw-2rem)]">
      {showTooltip && (
        <div className="bg-[#071b34] text-white text-xs border border-[#163863] p-3 sm:p-3.5 rounded-2xl shadow-2xl max-w-xs relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="absolute top-1.5 right-1.5 text-slate-400 hover:text-white p-1 cursor-pointer"
            aria-label="Close assistance message"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="font-bold text-[#da8a24] mb-0.5">Need assistance?</div>
          <p className="text-slate-300 text-[11px]">Chat with Truth Foundation on WhatsApp for donation queries & 80G receipts.</p>
        </div>
      )}

      {/* 1. Floating WhatsApp Button */}
      <button
        onClick={handleClick}
        className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-xl flex items-center justify-center cursor-pointer border-2 border-white transition-transform active:scale-95 shrink-0"
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
          className="sm:hidden w-12 h-12 bg-[#da8a24] hover:bg-[#c77a1e] text-[#0a2240] rounded-full shadow-xl flex items-center justify-center cursor-pointer border-2 border-white transition-transform active:scale-95 shrink-0"
          title="Donate Now"
          aria-label="Donate Now"
        >
          <Heart className="w-6 h-6 fill-[#0a2240]" />
        </button>
      )}
    </div>
  );
};
