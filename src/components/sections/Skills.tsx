
import { useState } from 'react';
import { motion } from 'framer-motion';

type SkillCategory = {
  name: string;
  skills: { name: string; color: string; icon?: string }[];
};

const Skills = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  
  const categories: SkillCategory[] = [
    {
      name: 'Programming Languages',
      skills: [
        { name: 'C++', color: 'bg-blue-600' },
        { name: 'DART', color: 'bg-blue-400' },
        { name: 'JAVASCRIPT', color: 'bg-yellow-500' },
        { name: 'PYTHON', color: 'bg-blue-500' },
        { name: 'TYPESCRIPT', color: 'bg-blue-700' },
        { name: 'RUST', color: 'bg-orange-700' },
        { name: 'POWERSHELL', color: 'bg-blue-300' },
        { name: 'BASH SCRIPT', color: 'bg-gray-700' }
      ]
    },
    {
      name: 'Frontend Development',
      skills: [
        { name: 'HTML5', color: 'bg-red-600' },
        { name: 'CSS3', color: 'bg-purple-600' },
        { name: 'REACT', color: 'bg-blue-400' },
        { name: 'REACT NATIVE', color: 'bg-blue-500' },
        { name: 'ANGULAR', color: 'bg-red-700' },
        { name: 'VUE.JS', color: 'bg-green-600' },
        { name: 'BOOTSTRAP', color: 'bg-purple-700' },
        { name: 'TAILWINDCSS', color: 'bg-teal-500' },
        { name: 'NEXT', color: 'bg-black' },
        { name: 'IONIC', color: 'bg-blue-600' }
      ]
    },
    {
      name: 'Backend Development',
      skills: [
        { name: 'NODE.JS', color: 'bg-green-700' },
        { name: 'EXPRESS.JS', color: 'bg-gray-800' },
        { name: 'DJANGO', color: 'bg-green-900' },
        { name: 'FLASK', color: 'bg-gray-700' },
        { name: 'FASTAPI', color: 'bg-teal-700' },
        { name: 'SPRING', color: 'bg-green-600' }
      ]
    },
    {
      name: 'Cloud & Deployment',
      skills: [
        { name: 'AWS', color: 'bg-yellow-600' },
        { name: 'AZURE', color: 'bg-blue-700' },
        { name: 'FIREBASE', color: 'bg-yellow-500' },
        { name: 'GOOGLECLOUD', color: 'bg-blue-500' },
        { name: 'NETLIFY', color: 'bg-teal-800' },
        { name: 'RENDER', color: 'bg-green-600' },
        { name: 'VERCEL', color: 'bg-black' }
      ]
    },
    {
      name: 'Databases',
      skills: [
        { name: 'MYSQL', color: 'bg-blue-900' },
        { name: 'SQLITE', color: 'bg-blue-800' },
        { name: 'MONGODB', color: 'bg-green-700' },
        { name: 'SUPABASE', color: 'bg-green-600' }
      ]
    },
    {
      name: 'DevOps & Tools',
      skills: [
        { name: 'GITHUB ACTIONS', color: 'bg-blue-600' },
        { name: 'GIT', color: 'bg-red-600' },
        { name: 'DOCKER', color: 'bg-blue-500' },
        { name: 'POSTMAN', color: 'bg-orange-500' },
        { name: 'KUBERNETES', color: 'bg-blue-700' },
        { name: 'GITHUB', color: 'bg-gray-800' }
      ]
    },
    {
      name: 'Data Science & ML',
      skills: [
        { name: 'MATPLOTLIB', color: 'bg-gray-700' },
        { name: 'NUMPY', color: 'bg-blue-800' },
        { name: 'PANDAS', color: 'bg-purple-800' },
        { name: 'TENSORFLOW', color: 'bg-orange-600' },
        { name: 'PYTORCH', color: 'bg-red-700' }
      ]
    },
    {
      name: 'UI/UX & Design',
      skills: [
        { name: 'FIGMA', color: 'bg-red-600' },
        { name: 'CANVA', color: 'bg-teal-500' },
        { name: 'BLENDER', color: 'bg-orange-600' },
        { name: 'ADOBE CREATIVE CLOUD', color: 'bg-red-800' },
        { name: 'ADOBE PHOTOSHOP', color: 'bg-blue-900' }
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

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
        >
          {displaySkills.map((skill, index) => (
            <motion.div
              key={`${skill.name}-${index}`}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className={`${skill.color} rounded-lg p-4 flex items-center justify-center h-16 shadow-lg hover:shadow-xl transition-shadow`}
            >
              <span className="text-white font-medium text-xs sm:text-sm text-center">
                {skill.name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
