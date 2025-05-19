
import React from 'react';
import { motion } from 'framer-motion';

const TypewriterEffect = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.5 }}
      className="mt-12"
    >
      <p className="text-github-text text-lg flex items-center">
        <span className="mr-2">Currently:</span>
        <span className="text-neon-green font-mono typewriter">Building cool stuff with React & ML</span>
      </p>
    </motion.div>
  );
};

export default TypewriterEffect;
