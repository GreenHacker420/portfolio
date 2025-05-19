
import React from 'react';
import { motion } from 'framer-motion';

const IntroMessage = () => {
  return (
    <div className="max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="overflow-hidden"
      >
        <h2 className="text-neon-green text-lg md:text-xl font-mono mb-2 flex items-center">
          <span className="wave-emoji mr-2 inline-block">👋</span> Hello, I'm
        </h2>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-3 relative">
          Green Hacker
          <span className="absolute -bottom-2 left-0 h-1 bg-neon-green w-0 animate-expand"></span>
        </h1>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-xl md:text-2xl text-github-text font-medium mb-6 flex flex-wrap gap-2 md:gap-4">
          <span className="flex items-center"><span className="bg-neon-green w-2 h-2 rounded-full mr-2"></span>Full Stack Developer</span>
          <span className="flex items-center"><span className="bg-neon-purple w-2 h-2 rounded-full mr-2"></span>ML Expert</span>
          <span className="flex items-center"><span className="bg-neon-blue w-2 h-2 rounded-full mr-2"></span>OSS Contributor</span>
        </h2>
      </motion.div>
    </div>
  );
};

export default IntroMessage;
