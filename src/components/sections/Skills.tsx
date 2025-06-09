
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
  const [skillsData, setSkillsData] = useState(() => getSkillsData()); // Fallback to static data
  const [isLoading, setIsLoading] = useState(true);
  const skillsRef = useRef<HTMLDivElement>(null);

  // Load skills data from database
  useEffect(() => {
    const loadSkillsData = async () => {
      try {
        const dbSkillsData = await getSkillsDataFromDB();
        setSkillsData(dbSkillsData);
      } catch (error) {
        console.error('Failed to load skills from database:', error);
        // Keep the static data as fallback
      } finally {
        setIsLoading(false);
      }
    };

    loadSkillsData();
  }, []);

  // Initialize GSAP animations when component mounts
  useEffect(() => {
    initScrollAnimations();
  }, []);

  const { categories, topSkills } = skillsData;

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
