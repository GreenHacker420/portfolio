
import React from 'react';
import { motion } from 'framer-motion';

const ScrollPrompt = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8, repeat: Infinity, repeatType: 'reverse', repeatDelay: 1 }}
      className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10"
    >
      <a href="#about" className="flex flex-col items-center text-github-text hover:text-white transition-colors">
        <span className="mb-2 text-sm">Scroll Down</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-bounce"
        >
          <path d="M12 5v14" />
          <path d="m19 12-7 7-7-7" />
        </svg>
      </a>
    </motion.div>
  );
};

export default ScrollPrompt;
