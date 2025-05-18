
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";

type SkillCategory = {
  name: string;
  description: string;
  skills: { name: string; color: string; level: number }[];
};

const Skills = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  
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

  const allSkills = categories.flatMap(category => category.skills);
  const displaySkills = activeCategory === 'All' 
    ? allSkills 
    : categories.find(c => c.name === activeCategory)?.skills || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 15 } }
  };

  const toggleCategory = (name: string) => {
    setExpandedCategory(expandedCategory === name ? null : name);
  };

  return (
    <section id="skills" className="py-20 bg-github-dark">
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
            className="flex flex-wrap gap-2 justify-center sm:justify-start"
          >
            <button
              onClick={() => setActiveCategory('All')}
              className={`px-4 py-2 rounded-md text-sm transition-colors ${
                activeCategory === 'All'
                  ? 'bg-neon-green text-black font-medium'
                  : 'bg-github-light text-github-text hover:bg-github-light/80'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setActiveCategory(category.name)}
                className={`px-4 py-2 rounded-md text-sm transition-colors ${
                  activeCategory === category.name
                    ? 'bg-neon-green text-black font-medium'
                    : 'bg-github-light text-github-text hover:bg-github-light/80'
                }`}
              >
                {category.name}
              </button>
            ))}
          </motion.div>
        </div>

        {activeCategory !== 'All' && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-8 bg-github-light rounded-lg p-4"
          >
            <h3 className="text-xl text-white font-medium mb-2">
              {categories.find(c => c.name === activeCategory)?.name}
            </h3>
            <p className="text-github-text">
              {categories.find(c => c.name === activeCategory)?.description}
            </p>
          </motion.div>
        )}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {displaySkills.map((skill, index) => (
            <motion.div
              key={`${skill.name}-${index}`}
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
              className="bg-github-light rounded-lg p-4 border border-github-border"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-medium">{skill.name}</span>
                <span className="text-sm text-neon-green">{skill.level}%</span>
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
          ))}
        </motion.div>

        <div className="mt-12 space-y-4">
          <h3 className="text-xl text-white font-bold">Dive Deeper</h3>
          {categories.map((category) => (
            <Collapsible 
              key={category.name}
              open={expandedCategory === category.name}
              onOpenChange={() => toggleCategory(category.name)}
              className="border border-github-border rounded-lg overflow-hidden"
            >
              <CollapsibleTrigger className="w-full p-4 flex justify-between items-center bg-github-light hover:bg-github-light/80 transition-colors">
                <span className="text-white font-medium">{category.name}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform ${expandedCategory === category.name ? 'rotate-180' : ''}`}
                >
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 bg-github-light/50">
                <p className="text-github-text mb-4">{category.description}</p>
                <div className="space-y-4">
                  {category.skills.map((skill, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-white">{skill.name}</span>
                        <span className="text-neon-green">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-github-dark rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${skill.color}`} 
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
