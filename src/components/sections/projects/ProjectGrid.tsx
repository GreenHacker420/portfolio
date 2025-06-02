
'use client';

import { motion } from 'framer-motion';
import ProjectCard from '../ProjectCard';

type ProjectGridProps = {
  projects: {
    title: string;
    description: string;
    tags: string[];
    category: string;
    imageUrl: string;
  }[];
  filter: string;
};

const ProjectGrid = ({ projects, filter }: ProjectGridProps) => {
  // Filter projects based on selected category
  const filteredProjects = filter === 'all'
    ? projects
    : projects.filter(project => project.category === filter);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {filteredProjects.map((project, index) => (
        <ProjectCard
          key={project.title}
          project={project}
          delay={index * 0.1}
        />
      ))}
    </div>
  );
};

export default ProjectGrid;
