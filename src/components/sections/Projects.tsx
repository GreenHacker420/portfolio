
import { motion } from 'framer-motion';
import { useState } from 'react';
import ProjectCard from './ProjectCard';

const Projects = () => {
  const [filter, setFilter] = useState('all');
  
  const projects = [
    {
      title: 'Portfolio',
      description: 'Personal portfolio website built with HTML and showcasing my projects and skills.',
      tags: ['HTML', 'CSS', 'JavaScript'],
      category: 'web',
      imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=800&ixid=MnwxfDB8MXxyYW5kb218MHx8dGVjaHx8fHx8fDE2MjM2MzYyODE&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1200',
    },
    {
      title: 'SNW',
      description: 'A CSS-based interactive web application with modern design principles.',
      tags: ['CSS', 'React', 'Tailwind'],
      category: 'web',
      imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=800&ixid=MnwxfDB8MXxyYW5kb218MHx8dGVjaHx8fHx8fDE2MjM2MzYyODE&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1200',
    },
    {
      title: 'Nirmaan',
      description: 'A CSS framework for creating responsive and accessible web interfaces.',
      tags: ['CSS', 'JavaScript', 'Design'],
      category: 'design',
      imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=800&ixid=MnwxfDB8MXxyYW5kb218MHx8cHJvZ3JhbW1pbmd8fHx8fHwxNjIzNjM2MzU4&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1200',
    },
    {
      title: 'Storage-NextJs',
      description: 'A NextJS-based storage solution with TypeScript integration.',
      tags: ['TypeScript', 'Next.js', 'Cloud'],
      category: 'app',
      imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=800&ixid=MnwxfDB8MXxyYW5kb218MHx8Y29kZXx8fHx8fDE2MjM2MzYzNzg&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1200',
    }
  ];

  // Filter projects based on selected category
  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(project => project.category === filter);

  return (
    <section id="projects" className="py-20 bg-github-light">
      <div className="section-container">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="section-title"
        >
          Projects
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-3 mb-8 justify-center sm:justify-start"
        >
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md text-sm transition-colors ${
              filter === 'all'
                ? 'bg-neon-green text-black font-medium'
                : 'bg-github-dark text-github-text hover:bg-github-dark/80'
            }`}
          >
            All Projects
          </button>
          <button
            onClick={() => setFilter('web')}
            className={`px-4 py-2 rounded-md text-sm transition-colors ${
              filter === 'web'
                ? 'bg-neon-green text-black font-medium'
                : 'bg-github-dark text-github-text hover:bg-github-dark/80'
            }`}
          >
            Web
          </button>
          <button
            onClick={() => setFilter('app')}
            className={`px-4 py-2 rounded-md text-sm transition-colors ${
              filter === 'app'
                ? 'bg-neon-green text-black font-medium'
                : 'bg-github-dark text-github-text hover:bg-github-dark/80'
            }`}
          >
            Apps
          </button>
          <button
            onClick={() => setFilter('design')}
            className={`px-4 py-2 rounded-md text-sm transition-colors ${
              filter === 'design'
                ? 'bg-neon-green text-black font-medium'
                : 'bg-github-dark text-github-text hover:bg-github-dark/80'
            }`}
          >
            Design
          </button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project, index) => (
            <ProjectCard 
              key={project.title} 
              project={project} 
              delay={index * 0.1}
            />
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <a
            href="#contact"
            className="inline-flex items-center px-6 py-3 bg-neon-green text-black font-medium rounded-md hover:bg-neon-green/90 transition-colors"
          >
            <span>Interested in working together?</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
