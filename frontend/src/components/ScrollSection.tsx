import React from 'react';
import { motion } from 'motion/react';

interface ScrollSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const ScrollSection: React.FC<ScrollSectionProps> = ({ children, className = '', id }) => {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.15 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
