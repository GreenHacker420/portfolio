
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Array of text options to type
const typingTexts = [
  "Building cool stuff with React & ML",
  "Creating interactive 3D web experiences",
  "Developing with React Three Fiber",
  "Exploring AI and machine learning",
  "Crafting beautiful UI animations"
];

const TypewriterEffect = () => {
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(100);
  const [isBlinking, setIsBlinking] = useState(true);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const currentText = typingTexts[textIndex];
    
    // If we've completed typing the current text
    if (!isDeleting && displayText === currentText) {
      // Pause at the end of typing
      timer = setTimeout(() => {
        setIsBlinking(true);
        setIsDeleting(true);
        setTypingSpeed(50); // Delete faster
      }, 2000);
    } 
    // If we've completed deleting the current text
    else if (isDeleting && displayText === "") {
      setIsDeleting(false);
      setTextIndex((textIndex + 1) % typingTexts.length);
      setTypingSpeed(100); // Type at normal speed
      setIsBlinking(false);
    }
    // If we're in the middle of typing or deleting
    else {
      setIsBlinking(false);
      timer = setTimeout(() => {
        const nextText = isDeleting
          ? currentText.substring(0, displayText.length - 1)
          : currentText.substring(0, displayText.length + 1);
          
        setDisplayText(nextText);
      }, typingSpeed);
    }
    
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, textIndex, typingSpeed]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.5 }}
      className="mt-12"
    >
      <p className="text-github-text text-lg flex items-center">
        <span className="mr-2">Currently:</span>
        <span className="text-neon-green font-mono relative">
          {displayText}
          <span 
            className={`absolute inset-y-0 right-[-0.7ch] w-[0.5ch] bg-neon-green ${
              isBlinking ? 'animate-cursor-blink' : ''
            }`}
          />
        </span>
      </p>
    </motion.div>
  );
};

export default TypewriterEffect;
