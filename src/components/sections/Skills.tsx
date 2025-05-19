
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { handleSkillHover } from '../../utils/animation';
import { initScrollAnimations } from '../../utils/animation';
import { getSkillsData } from '../../utils/dataUtils';
import SkillCategory from './skills/SkillCategory';
import TopSkills from './skills/TopSkills';

const Skills = () => {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
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

  return (
    <section id="skills" className="py-20 bg-github-dark" ref={skillsRef}>
      <div className="section-container">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="section-title"
        >
          Skills
        </motion.h2>

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

        <TopSkills skills={topSkills} onSkillHover={onSkillHover} />
      </div>
    </section>
  );
};

export default Skills;
