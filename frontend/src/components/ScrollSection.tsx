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
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false, amount: 0.08 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
