'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, RefreshCw, FolderOpen } from 'lucide-react';
import { animateIn } from '@/utils/animation-anime';
import ProjectFilters from './projects/ProjectFilters';
import ProjectGrid from './projects/ProjectGrid';
import ProjectCTA from './projects/ProjectCTA';
import ProjectStructuredData from '../seo/ProjectStructuredData';

const Projects = () => {
  const [filter, setFilter] = useState('all');
  const [projects, setProjects] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(['all']);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/projects');
      const data = await response.json();
      setProjects(data.projects || []);
      setCategories(data.categories || ['all']);
    } catch (error) {
      console.error('Failed to load projects:', error);
      setError('Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    animateIn('.section-title');
    loadProjects();
  }, []);

  return (
    <section id="projects" className="py-16 sm:py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">
            Featured Projects
          </h2>
          <p className="text-slate-400 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto px-4">
            A collection of projects showcasing modern web technologies, innovative solutions, and creative problem-solving.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 sm:py-20">
            <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-neon-green animate-spin" />
            <p className="mt-4 text-github-text text-sm sm:text-base">Loading projects...</p>
          </div>
        ) : error ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 sm:py-20"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
              <FolderOpen className="w-8 h-8 text-red-400" />
            </div>
            <p className="text-red-400 mb-4 text-sm sm:text-base">{error}</p>
            <button
              onClick={loadProjects}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-neon-green text-black rounded-lg font-medium hover:bg-neon-green/90 active:scale-95 transition-all text-sm sm:text-base"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </motion.div>
        ) : projects.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 sm:py-20"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neon-green/10 flex items-center justify-center">
              <FolderOpen className="w-8 h-8 text-neon-green" />
            </div>
            <h3 className="text-white font-medium text-lg mb-2">No projects yet</h3>
            <p className="text-github-text text-sm sm:text-base">Projects will appear here once added.</p>
          </motion.div>
        ) : (
          <>
            <ProjectStructuredData projects={projects} />
            <ProjectFilters filter={filter} setFilter={setFilter} categories={categories} />
            <ProjectGrid projects={projects} filter={filter} />
            <ProjectCTA />
          </>
        )}
      </div>
    </section>
  );
};

export default Projects;
