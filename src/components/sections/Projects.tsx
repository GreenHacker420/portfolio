
'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import ProjectFilters from './projects/ProjectFilters';
import ProjectGrid from './projects/ProjectGrid';
import ProjectCTA from './projects/ProjectCTA';
import ProjectStructuredData from '../seo/ProjectStructuredData';
import { getProjectsDataFromAPI } from '../../utils/dataUtils';

const Projects = () => {
  const [filter, setFilter] = useState('all');
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const projectsData = await getProjectsDataFromAPI();
        setProjects(projectsData);
      } catch (error) {
        console.error('Failed to load projects:', error);
        setError('Failed to load projects');
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, []);

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
        ) : (
          <>
            <ProjectStructuredData projects={projects} />
            <ProjectFilters filter={filter} setFilter={setFilter} />
            <ProjectGrid projects={projects} filter={filter} />
            <ProjectCTA />
          </>
        )}
      </div>
    </section>
  );
};

export default Projects;
