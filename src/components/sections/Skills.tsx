
'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { initScrollAnimations } from '../../utils/animation';
import SplineKeyboard from './skills/keyboard/SplineKeyboard';

const Skills = () => {
  const skillsRef = useRef<HTMLDivElement>(null);

  // Initialize GSAP animations when component mounts
  useEffect(() => {
    initScrollAnimations();
  }, []);

  return (
    <section id="skills" className="relative min-h-screen bg-github-dark" ref={skillsRef}>
      {/* Title overlay */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="section-title"
        >
          Skills
        </motion.h2>
      </div>

      {/* Integrated Spline Keyboard - Full Section */}
      <div className="w-full h-full">
        <SplineKeyboard />
      </div>
    </section>
  );
};

export default Skills;
