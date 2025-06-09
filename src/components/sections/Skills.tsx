
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { handleSkillHover } from '../../utils/animation';
import { initScrollAnimations } from '../../utils/animation';
import { getSkillsData, getSkillsDataFromDB } from '../../utils/dataUtils';
import DisplayToggle from './skills/DisplayToggle';
import TabSkillsView from './skills/TabSkillsView';
import KeyboardSkillsView from './skills/KeyboardSkillsView';

const Skills = () => {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [displayStyle, setDisplayStyle] = useState<'tabs' | 'keyboard'>('tabs');
  const skillsRef = useRef<HTMLDivElement>(null);
  const { categories, topSkills } = getSkillsData();

  // Initialize GSAP animations when component mounts
  useEffect(() => {
    initScrollAnimations();
  }, []);

  // Handle skill hover
  const onSkillHover = (element: HTMLElement, skill: string, isEntering: boolean) => {
    setHoveredSkill(isEntering ? skill : null);
    handleSkillHover(element, isEntering);
  };

  // Toggle between display styles
  const toggleDisplayStyle = () => {
    setDisplayStyle(prev => prev === 'tabs' ? 'keyboard' : 'tabs');
  };

  return (
    <section id="skills" className="py-20 bg-github-dark" ref={skillsRef}>
      <div className="section-container relative">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="section-title"
        >
          Skills
        </motion.h2>

        <DisplayToggle
          displayStyle={displayStyle}
          toggleDisplayStyle={toggleDisplayStyle}
        />

        {displayStyle === 'tabs' ? (
          <TabSkillsView
            categories={categories}
            topSkills={topSkills}
            hoveredSkill={hoveredSkill}
            onSkillHover={onSkillHover}
          />
        ) : (
          <KeyboardSkillsView />
        )}
      </div>
    </section>
  );
};

export default Skills;
