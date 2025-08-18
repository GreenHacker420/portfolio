
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { handleSkillHover } from '../../utils/animation';
import { initScrollAnimations } from '../../utils/animation';
import { getSkillsDataFromDB } from '../../utils/dataUtils';
import DisplayToggle from './skills/DisplayToggle';
import TabSkillsView from './skills/TabSkillsView';
import KeyboardSkillsView from './skills/KeyboardSkillsView';
import SkillsStructuredData from '../seo/SkillsStructuredData';

const Skills = () => {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [displayStyle, setDisplayStyle] = useState<'tabs' | 'keyboard'>('keyboard');
  const [skillsData, setSkillsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const skillsRef = useRef<HTMLDivElement>(null);

  // Load skills data from database
  useEffect(() => {
    const loadSkillsData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const dbSkillsData = await getSkillsDataFromDB();
        setSkillsData(dbSkillsData);
      } catch (error) {
        console.error('Failed to load skills from database:', error);
        setError('Failed to load skills data');
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

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-green"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-neon-green text-black rounded-md hover:bg-neon-green/90 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : skillsData ? (
          <>
            <SkillsStructuredData skills={skillsData.allSkills || []} />
            {displayStyle === 'tabs' ? (
              <TabSkillsView
                categories={skillsData.categories || []}
                topSkills={skillsData.topSkills || []}
                hoveredSkill={hoveredSkill}
                onSkillHover={onSkillHover}
              />
            ) : (
              <KeyboardSkillsView />
            )}
          </>
        ) : null}
      </div>
    </section>
  );
};

export default Skills;
