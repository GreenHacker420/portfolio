
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TypewriterEffect = () => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  
  const texts = [
    "Building innovative web applications",
    "Creating ML-powered solutions", 
    "Contributing to open source",
    "Solving complex problems"
  ];

  useEffect(() => {
    const currentText = texts[currentTextIndex];
    
    if (currentIndex < currentText.length) {
      const timeout = setTimeout(() => {
        setDisplayText(currentText.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 100);
      
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setCurrentIndex(0);
        setDisplayText('');
        setCurrentTextIndex((currentTextIndex + 1) % texts.length);
      }, 2000);
      
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, currentTextIndex, texts]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="mt-4 sm:mt-6"
    >
      <div className="text-base sm:text-lg md:text-xl lg:text-2xl text-github-text font-mono min-h-[1.5em] sm:min-h-[2em] flex items-center">
        <span className="mr-2 text-neon-green">{'>'}</span>
        <span className="text-neon-green">
          {displayText}
          <span className="animate-pulse">|</span>
        </span>
      </div>
    </motion.div>
  );
};

export default TypewriterEffect;
