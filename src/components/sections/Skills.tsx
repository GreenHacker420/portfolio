
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { handleSkillHover } from '../../utils/animation';
import { initScrollAnimations } from '../../utils/animation';
import { getSkillsData } from '../../utils/dataUtils';
import SkillCategory from './skills/SkillCategory';
import TopSkills from './skills/TopSkills';
import KeyboardSkills from './skills/KeyboardSkills';

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

        <div className="flex justify-end mb-6">
          <button 
            onClick={toggleDisplayStyle}
            className="text-sm bg-github-light/30 px-4 py-2 rounded-md text-neon-green hover:bg-github-light/50 transition-colors"
          >
            {displayStyle === 'tabs' ? 'Switch to Keyboard View' : 'Switch to Tabs View'}
          </button>
        </div>

        {displayStyle === 'keyboard' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="my-8"
          >
            <KeyboardSkills />
          </motion.div>
        ) : (
          <div className="mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Tabs defaultValue={categories[0].name} className="w-full">
                <TabsList className="flex flex-wrap mb-6 bg-github-light/20">
                  {categories.map((category) => (
                    <TabsTrigger
                      key={category.name}
                      value={category.name}
                      className="data-[state=active]:bg-neon-green data-[state=active]:text-black"
                    >
                      {category.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {categories.map((category) => (
                  <TabsContent key={category.name} value={category.name}>
                    <SkillCategory 
                      category={category}
                      hoveredSkill={hoveredSkill}
                      onSkillHover={onSkillHover}
                    />
                  </TabsContent>
                ))}
              </Tabs>
            </motion.div>
          </div>
        )}

        {displayStyle === 'tabs' && (
          <TopSkills skills={topSkills} onSkillHover={onSkillHover} />
        )}
        
        {displayStyle === 'keyboard' && (
          <motion.div 
            className="text-center mt-8 text-github-text"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-neon-green">(hint: press a key)</p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Skills;
