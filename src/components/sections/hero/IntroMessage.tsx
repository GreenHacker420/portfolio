
import React from 'react';
import { motion } from 'framer-motion';

const IntroMessage = () => {
  return (
    <div className="max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="overflow-hidden"
      >
        <h2 className="text-neon-green text-sm sm:text-lg md:text-xl font-mono mb-2 sm:mb-3 flex items-center">
          <span className="wave-emoji mr-2 inline-block text-base sm:text-xl">👋</span> 
          <span className="text-sm sm:text-lg md:text-xl">Hello, I'm</span>
        </h2>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-3 sm:mb-4 relative leading-tight">
          Green Hacker
          <span className="absolute -bottom-1 sm:-bottom-2 left-0 h-0.5 sm:h-1 bg-neon-green w-0 animate-expand"></span>
        </h1>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="text-base sm:text-xl md:text-2xl text-github-text font-medium mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4">
            <span className="flex items-center text-sm sm:text-base md:text-xl">
              <span className="bg-neon-green w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mr-2"></span>
              Full Stack Developer
            </span>
            <span className="flex items-center text-sm sm:text-base md:text-xl">
              <span className="bg-neon-purple w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mr-2"></span>
              ML Expert
            </span>
            <span className="flex items-center text-sm sm:text-base md:text-xl">
              <span className="bg-neon-blue w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mr-2"></span>
              OSS Contributor
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default IntroMessage;
