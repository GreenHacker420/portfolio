
import React from 'react';
import { motion } from 'framer-motion';

type ProjectFiltersProps = {
  filter: string;
  setFilter: (filter: string) => void;
  categories?: string[];
};

const ProjectFilters = ({ filter, setFilter, categories = ['all', 'web-app', 'mobile-app', 'api', 'library'] }: ProjectFiltersProps) => {
  const formatCategoryName = (category: string) => {
    if (category === 'all') return 'All Projects';
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      viewport={{ once: true }}
      className="flex flex-wrap gap-3 mb-12 justify-center"
    >
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setFilter(category)}
          className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
            filter === category
              ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/25'
              : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 hover:text-white border border-slate-700/50 hover:border-slate-600/50'
          }`}
        >
          {formatCategoryName(category)}
        </button>
      ))}
    </motion.div>
  );
};

export default ProjectFilters;
