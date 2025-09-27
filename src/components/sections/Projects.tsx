
'use client';

import { useEffect as useEffectReact } from 'react';
import { animateIn } from '@/utils/animation-anime';
import { useState, useEffect } from 'react';
import ProjectFilters from './projects/ProjectFilters';
import ProjectGrid from './projects/ProjectGrid';
import ProjectCTA from './projects/ProjectCTA';
import ProjectStructuredData from '../seo/ProjectStructuredData';
import { getProjectsDataFromAPI } from '../../utils/dataUtils';

const Projects = () => {
  const [filter, setFilter] = useState('all');
  const [projects, setProjects] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(['all']);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    animateIn('.section-title');
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

    loadProjects();
  }, []);

  return (
    <section id="projects" className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Featured Projects
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            A collection of projects showcasing modern web technologies, innovative solutions, and creative problem-solving.
          </p>
        </div>

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
