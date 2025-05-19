
import React from 'react';
import { motion } from 'framer-motion';

type ProjectFiltersProps = {
  filter: string;
  setFilter: (filter: string) => void;
};

const ProjectFilters = ({ filter, setFilter }: ProjectFiltersProps) => {
  return (
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
  );
};

export default ProjectFilters;
