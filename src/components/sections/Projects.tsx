
import { motion } from 'framer-motion';
import { useState } from 'react';
import ProjectCard from './ProjectCard';
import ProjectFilters from './projects/ProjectFilters';
import ProjectCTA from './projects/ProjectCTA';
import { getProjectsData } from '../../utils/dataUtils';

const Projects = () => {
  const [filter, setFilter] = useState('all');
  const projects = getProjectsData();
  
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

        <ProjectFilters filter={filter} setFilter={setFilter} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project, index) => (
            <ProjectCard 
              key={project.title} 
              project={project} 
              delay={index * 0.1}
            />
          ))}
        </div>
        
        <ProjectCTA />
      </div>
    </section>
  );
};

export default Projects;
