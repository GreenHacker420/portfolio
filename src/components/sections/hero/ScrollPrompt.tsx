
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const ScrollPrompt = () => {
  const handleScrollDown = () => {
    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.2 }}
      className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-10"
    >
      <button
        onClick={handleScrollDown}
        className="group flex flex-col items-center gap-1 sm:gap-2 text-github-text hover:text-white transition-colors duration-300 p-3 sm:p-4 min-h-[48px] min-w-[48px]"
        aria-label="Scroll down to content"
      >
        <span className="text-xs sm:text-sm font-medium hidden sm:block">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="p-2 rounded-full border border-github-border group-hover:border-neon-green transition-colors duration-300"
        >
          <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
        </motion.div>
      </button>
    </motion.div>
  );
};

export default ScrollPrompt;
