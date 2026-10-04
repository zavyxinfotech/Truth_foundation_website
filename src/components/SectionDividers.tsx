import React from 'react';
import { motion } from 'motion/react';

interface DividerProps {
  bgFrom?: string;
  bgTo?: string;
  fillColor?: string;
  className?: string;
}

/**
 * DarkToLightDivider:
 * Premium organic SVG wave transition from dark section to light section.
 * No icon — clean pure wave.
 */
export const DarkToLightDivider: React.FC<DividerProps> = ({ 
  bgFrom = 'transparent', 
  bgTo = '#f8fafc', 
  fillColor,
  className = '' 
}) => {
  const targetFill = fillColor || bgTo;

  return (
    <div 
      className={`w-full relative overflow-hidden leading-none pointer-events-none select-none block -mb-px ${className}`}
      style={{ backgroundColor: bgFrom === 'transparent' ? 'transparent' : bgFrom }}
    >
      {/* Ambient glow strip */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-16 bg-[#da8a24]/8 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full block leading-none"
      >
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="relative block w-full h-10 sm:h-16 lg:h-22"
        >
          {/* Soft background accent wave */}
          <path
            d="M0,32 C280,96 560,0 840,64 C1120,128 1320,32 1440,48 L1440,120 L0,120 Z"
            fill={targetFill}
            fillOpacity="0.35"
          />
          {/* Main organic wave */}
          <path
            d="M0,48 C320,110 640,-10 960,75 C1200,130 1360,35 1440,55 L1440,120 L0,120 Z"
            fill={targetFill}
          />
        </svg>
      </motion.div>
    </div>
  );
};

/**
 * LightToDarkDivider:
 * Organic SVG wave transition from light section to dark section.
 * No icon — clean pure wave.
 */
export const LightToDarkDivider: React.FC<DividerProps> = ({ 
  bgFrom = '#f8fafc', 
  bgTo = '#0a2240', 
  fillColor,
  className = '' 
}) => {
  const targetFill = fillColor || bgTo;

  return (
    <div 
      className={`w-full relative overflow-hidden leading-none pointer-events-none select-none block -mb-px ${className}`}
      style={{ backgroundColor: bgFrom }}
    >
      {/* Ambient glow strip */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-16 bg-[#da8a24]/8 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full block leading-none"
      >
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="relative block w-full h-10 sm:h-16 lg:h-22"
        >
          {/* Soft background accent wave */}
          <path
            d="M0,40 C360,-10 680,105 1000,28 C1240,-10 1360,55 1440,40 L1440,120 L0,120 Z"
            fill={targetFill}
            fillOpacity="0.35"
          />
          {/* Main inverted organic wave */}
          <path
            d="M0,55 C280,-25 560,100 840,28 C1120,-10 1320,70 1440,40 L1440,120 L0,120 Z"
            fill={targetFill}
          />
        </svg>
      </motion.div>
    </div>
  );
};

/**
 * DarkToDarkGlowDivider:
 * Radial glow line transition between adjacent dark navy sections.
 * No icon — clean pure gradient line.
 */
export const DarkToDarkGlowDivider: React.FC<DividerProps> = ({ 
  bgFrom = '#0a2240', 
  bgTo = '#071b34', 
  className = '' 
}) => {
  return (
    <div 
      className={`w-full relative py-6 sm:py-8 flex items-center justify-center pointer-events-none ${className}`}
      style={{ backgroundColor: bgFrom }}
    >
      <motion.div
        initial={{ opacity: 0, scaleX: 0.9 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-7xl relative flex items-center justify-center"
      >
        {/* Gold gradient rule */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#da8a24]/50 to-transparent" />
        {/* Centre glow bloom */}
        <div className="absolute w-80 h-12 bg-[#da8a24]/10 rounded-full blur-3xl pointer-events-none" />
        {/* Small solid centre dot — no icon inside */}
        <div className="absolute w-2.5 h-2.5 rounded-full bg-[#da8a24] shadow-md ring-4 ring-[#da8a24]/20" />
      </motion.div>
    </div>
  );
};
