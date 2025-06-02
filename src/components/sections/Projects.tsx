
'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import ProjectFilters from './projects/ProjectFilters';
import ProjectGrid from './projects/ProjectGrid';
import ProjectCTA from './projects/ProjectCTA';
import { getProjectsData } from '../../utils/dataUtils';

const Projects = () => {
  const [filter, setFilter] = useState('all');
  const projects = getProjectsData();

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
        <ProjectGrid projects={projects} filter={filter} />
        <ProjectCTA />
      </div>
    </section>
  );
};

export default Projects;
