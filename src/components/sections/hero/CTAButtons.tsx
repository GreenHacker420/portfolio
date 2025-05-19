
import React from 'react';
import { motion } from 'framer-motion';

const CTAButtons = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="mt-8"
    >
      <p className="text-lg text-github-text max-w-2xl mb-8 leading-relaxed">
        I'm currently working on a photo-sharing platform with face recognition.
        Passionate about open-source and applying Machine Learning to solve real-world problems.
      </p>
      
      <div className="flex flex-wrap gap-4">
        <motion.a
          href="#projects"
          className="px-6 py-3 bg-neon-green text-black font-medium rounded-md hover:bg-neon-green/90 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          View Projects
        </motion.a>
        <motion.a
          href="#contact"
          className="px-6 py-3 bg-transparent border border-neon-green text-neon-green font-medium rounded-md hover:bg-neon-green/10 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Contact Me
        </motion.a>
        <motion.a
          href="#resume"
          className="px-6 py-3 bg-transparent border border-neon-purple text-neon-purple font-medium rounded-md hover:bg-neon-purple/10 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          View Resume
        </motion.a>
      </div>
    </motion.div>
  );
};

export default CTAButtons;
