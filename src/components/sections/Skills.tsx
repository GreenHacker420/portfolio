
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import SkillIcon from './SkillIcon';
import { handleSkillHover } from '../../utils/animation';
import { initScrollAnimations } from '../../utils/animation';

type SkillCategory = {
  name: string;
  description: string;
  skills: { name: string; color: string; level: number }[];
};

const Skills = () => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  
  // Initialize GSAP animations when component mounts
  useEffect(() => {
    initScrollAnimations();
  }, []);
  
  const categories: SkillCategory[] = [
    {
      name: 'Programming Languages',
      description: 'Core programming languages I use for development',
      skills: [
        { name: 'C++', color: 'bg-blue-600', level: 85 },
        { name: 'DART', color: 'bg-blue-400', level: 70 },
        { name: 'JAVASCRIPT', color: 'bg-yellow-500', level: 95 },
        { name: 'PYTHON', color: 'bg-blue-500', level: 90 },
        { name: 'TYPESCRIPT', color: 'bg-blue-700', level: 92 },
        { name: 'RUST', color: 'bg-orange-700', level: 60 },
        { name: 'POWERSHELL', color: 'bg-blue-300', level: 75 },
        { name: 'BASH SCRIPT', color: 'bg-gray-700', level: 80 }
      ]
    },
    {
      name: 'Frontend Development',
      description: 'Technologies I use to build beautiful and interactive UIs',
      skills: [
        { name: 'HTML5', color: 'bg-red-600', level: 98 },
        { name: 'CSS3', color: 'bg-purple-600', level: 95 },
        { name: 'REACT', color: 'bg-blue-400', level: 92 },
        { name: 'REACT NATIVE', color: 'bg-blue-500', level: 88 },
        { name: 'ANGULAR', color: 'bg-red-700', level: 75 },
        { name: 'VUE.JS', color: 'bg-green-600', level: 80 },
        { name: 'BOOTSTRAP', color: 'bg-purple-700', level: 90 },
        { name: 'TAILWINDCSS', color: 'bg-teal-500', level: 95 },
        { name: 'NEXT', color: 'bg-black', level: 85 },
        { name: 'IONIC', color: 'bg-blue-600', level: 70 }
      ]
    },
    {
      name: 'Backend Development',
      description: 'Server-side technologies and frameworks',
      skills: [
        { name: 'NODE.JS', color: 'bg-green-700', level: 90 },
        { name: 'EXPRESS.JS', color: 'bg-gray-800', level: 88 },
        { name: 'DJANGO', color: 'bg-green-900', level: 82 },
        { name: 'FLASK', color: 'bg-gray-700', level: 85 },
        { name: 'FASTAPI', color: 'bg-teal-700', level: 80 },
        { name: 'SPRING', color: 'bg-green-600', level: 65 }
      ]
    },
    {
      name: 'Cloud & Deployment',
      description: 'Services and platforms I use for deployment',
      skills: [
        { name: 'AWS', color: 'bg-yellow-600', level: 82 },
        { name: 'AZURE', color: 'bg-blue-700', level: 75 },
        { name: 'FIREBASE', color: 'bg-yellow-500', level: 90 },
        { name: 'GOOGLECLOUD', color: 'bg-blue-500', level: 78 },
        { name: 'NETLIFY', color: 'bg-teal-800', level: 92 },
        { name: 'RENDER', color: 'bg-green-600', level: 85 },
        { name: 'VERCEL', color: 'bg-black', level: 95 }
      ]
    },
    {
      name: 'Databases',
      description: 'Database technologies I work with',
      skills: [
        { name: 'MYSQL', color: 'bg-blue-900', level: 88 },
        { name: 'SQLITE', color: 'bg-blue-800', level: 90 },
        { name: 'MONGODB', color: 'bg-green-700', level: 92 },
        { name: 'SUPABASE', color: 'bg-green-600', level: 85 }
      ]
    },
    {
      name: 'DevOps & Tools',
      description: 'Development operations and tooling',
      skills: [
        { name: 'GITHUB ACTIONS', color: 'bg-blue-600', level: 85 },
        { name: 'GIT', color: 'bg-red-600', level: 95 },
        { name: 'DOCKER', color: 'bg-blue-500', level: 80 },
        { name: 'POSTMAN', color: 'bg-orange-500', level: 92 },
        { name: 'KUBERNETES', color: 'bg-blue-700', level: 70 },
        { name: 'GITHUB', color: 'bg-gray-800', level: 96 }
      ]
    },
    {
      name: 'Data Science & ML',
      description: 'Libraries and tools for data analysis and machine learning',
      skills: [
        { name: 'MATPLOTLIB', color: 'bg-gray-700', level: 85 },
        { name: 'NUMPY', color: 'bg-blue-800', level: 90 },
        { name: 'PANDAS', color: 'bg-purple-800', level: 92 },
        { name: 'TENSORFLOW', color: 'bg-orange-600', level: 85 },
        { name: 'PYTORCH', color: 'bg-red-700', level: 80 }
      ]
    },
    {
      name: 'UI/UX & Design',
      description: 'Design tools and technologies',
      skills: [
        { name: 'FIGMA', color: 'bg-red-600', level: 85 },
        { name: 'CANVA', color: 'bg-teal-500', level: 90 },
        { name: 'BLENDER', color: 'bg-orange-600', level: 75 },
        { name: 'ADOBE CREATIVE CLOUD', color: 'bg-red-800', level: 80 },
        { name: 'ADOBE PHOTOSHOP', color: 'bg-blue-900', level: 85 }
      ]
    }
  ];

  const toggleCategory = (name: string) => {
    setExpandedCategory(expandedCategory === name ? null : name);
  };
  
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
            <Tabs defaultValue="Programming Languages" className="w-full">
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
                  <div className="bg-github-light/20 rounded-lg p-4 mb-6">
                    <h3 className="text-xl text-white font-medium mb-2">
                      {category.name}
                    </h3>
                    <p className="text-github-text">
                      {category.description}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 skills-grid">
                    {category.skills.map((skill, index) => {
                      // Create a safe id that can be used with element selectors
                      const safeId = `skill-${skill.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}-${index}`;
                      
                      return (
                        <motion.div
                          key={`${skill.name}-${index}`}
                          id={safeId}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.05 }}
                          viewport={{ once: true }}
                          className="bg-github-light rounded-lg p-4 border border-github-border skill-item transition-all duration-300"
                          onMouseEnter={(e) => onSkillHover(e.currentTarget, skill.name, true)}
                          onMouseLeave={(e) => onSkillHover(e.currentTarget, skill.name, false)}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <SkillIcon 
                              name={skill.name} 
                              color={hoveredSkill === skill.name ? "#3fb950" : undefined} 
                            />
                            <div className="flex justify-between items-center w-full">
                              <span className="text-white font-medium">{skill.name}</span>
                              <span className="text-sm text-neon-green">{skill.level}%</span>
                            </div>
                          </div>
                          <div className="w-full bg-github-dark rounded-full h-2.5">
                            <motion.div 
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.level}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              viewport={{ once: true }}
                              className={`h-2.5 rounded-full ${skill.color}`}
                            ></motion.div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </motion.div>
        </div>

        <div className="mt-12">
          <h3 className="text-xl text-white font-bold mb-4">Top Skills at a Glance</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: 'JAVASCRIPT', level: 95 },
              { name: 'REACT', level: 92 },
              { name: 'NODE.JS', level: 90 },
              { name: 'PYTHON', level: 90 },
              { name: 'TYPESCRIPT', level: 92 },
              { name: 'MONGODB', level: 92 }
            ].map((skill, index) => {
              const safeId = `top-skill-${skill.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}-${index}`;
              return (
                <motion.div
                  key={safeId}
                  id={safeId}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-github-light/30 p-3 rounded-lg text-center flex flex-col items-center transition-all duration-300 hover:bg-github-light/50"
                  onMouseEnter={(e) => onSkillHover(e.currentTarget, skill.name, true)}
                  onMouseLeave={(e) => onSkillHover(e.currentTarget, skill.name, false)}
                >
                  <SkillIcon name={skill.name} color="#3fb950" />
                  <span className="text-white mt-2">{skill.name}</span>
                  <span className="text-neon-green text-sm">{skill.level}%</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
