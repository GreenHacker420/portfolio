
'use client';

import { motion } from 'framer-motion';
import ProjectCard from '../ProjectCard';

interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  category: string;
  technologies?: string[];
  tags?: string[]; // For backward compatibility
  featured: boolean;
  status: string;
  github_url?: string;
  live_url?: string;
  image_url?: string;
  imageUrl?: string; // For backward compatibility
  screenshots?: string[];
  start_date?: string;
  end_date?: string;
  highlights?: string[];
  created_at?: string;
  updated_at?: string;
}

type ProjectGridProps = {
  projects: Project[];
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
