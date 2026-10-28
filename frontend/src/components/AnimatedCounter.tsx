import React, { useEffect, useState, useRef } from 'react';

interface AnimatedCounterProps {
  value: number | string; // e.g. 58400 or "58,400" or "1.2M" or "100%"
  prefix?: string;
  suffix?: string;
  duration?: number; // duration in ms
  className?: string;
  repeatOnScroll?: boolean;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  prefix = '',
  suffix = '',
  duration = 1800,
  className = '',
  repeatOnScroll = true,
}) => {
  const [displayValue, setDisplayValue] = useState<string>('0');
  const elementRef = useRef<HTMLSpanElement>(null);
  const animFrameRef = useRef<number | null>(null);

  // Parse target number and suffix if raw string passed like "58,400+" or "1.2M+"
  let numericTarget = 0;
  let parsedSuffix = suffix;
  let parsedPrefix = prefix;

  if (typeof value === 'number') {
    numericTarget = value;
  } else {
    const cleanStr = value.toString();
    // Extract prefix if present like ₹
    if (cleanStr.startsWith('₹')) {
      parsedPrefix = '₹';
    }
    // Extract suffix if +, %, M, K present
    if (cleanStr.endsWith('+')) parsedSuffix = '+' + parsedSuffix;
    if (cleanStr.endsWith('%')) parsedSuffix = '%' + parsedSuffix;

    // Remove non-digits except decimal point
    const numericStr = cleanStr.replace(/[^0-9.]/g, '');
    numericTarget = parseFloat(numericStr) || 0;
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
          let startTime: number | null = null;
          const startVal = 0;

          const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            // Ease out cubic formula: 1 - Math.pow(1 - progress, 3)
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(startVal + (numericTarget - startVal) * easeProgress);

            if (numericTarget >= 1000) {
              setDisplayValue(current.toLocaleString('en-IN'));
            } else {
              setDisplayValue(current.toString());
            }

            if (progress < 1) {
              animFrameRef.current = requestAnimationFrame(step);
            } else {
              if (numericTarget >= 1000) {
                setDisplayValue(numericTarget.toLocaleString('en-IN'));
              } else {
                setDisplayValue(numericTarget.toString());
              }
            }
          };

          animFrameRef.current = requestAnimationFrame(step);
        } else if (repeatOnScroll) {
          if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
          setDisplayValue('0');
        }
      },
      { threshold: 0.15 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [numericTarget, duration, repeatOnScroll]);

  return (
    <span ref={elementRef} className={className}>
      {parsedPrefix}{displayValue}{parsedSuffix}
    </span>
  );
};
