import React from 'react';
import { Heart } from 'lucide-react';
import { pixelTracker } from '../utils/pixelTracker';
import { WhatsAppIcon } from './WhatsAppIcon';

interface FloatingWhatsAppProps {
  onOpenDonateModal?: (amount?: number) => void;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ onOpenDonateModal }) => {
  const handleWhatsAppClick = () => {
    pixelTracker.trackWhatsAppClick('Floating Widget');
    const msg = encodeURIComponent(`Hello Truth Foundation! I am interested in donating meals or volunteering.`);
    window.open(`https://wa.me/919962294949?text=${msg}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-4 sm:bottom-8 sm:right-6 z-[9990] flex flex-col items-end gap-2.5 max-w-[calc(100vw-2rem)] select-none">
      {/* 1. Floating WhatsApp Button */}
      <button
        onClick={handleWhatsAppClick}
        className="w-12 h-12 sm:w-14 sm:h-14 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-xl flex items-center justify-center cursor-pointer border-2 border-white transition-transform active:scale-95 shrink-0"
        title="Chat on WhatsApp"
        aria-label="Chat on WhatsApp"
      >
        <WhatsAppIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
      </button>

      {/* 2. Floating Donate Button (Aligned directly below WhatsApp icon on mobile view) */}
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
