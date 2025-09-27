
'use client';

import ProjectCard from './ProjectCard';
import * as React from 'react'
import { motion } from 'framer-motion'

// Project interface matching exact Prisma schema
interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  category: string;
  technologies?: string; // JSON string from Prisma
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  gallery?: string; // JSON string from Prisma
  highlights?: string; // JSON string from Prisma
  challenges?: string; // JSON string from Prisma
  learnings?: string; // JSON string from Prisma
  startDate?: Date;
  endDate?: Date;
  teamSize?: number;
  role?: string;
  isVisible: boolean;
  displayOrder: number;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
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

  const [hoveredId, setHoveredId] = React.useState<string | null>(null)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto px-4">
      {filteredProjects.map((project) => {
        const isActive = hoveredId === project.id
        return (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: filteredProjects.indexOf(project) * 0.1 }}
            className={`h-96 w-full transition-all duration-300 ${
              hoveredId && !isActive ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
            }`}
            onMouseEnter={() => setHoveredId(project.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <ProjectCard
              project={project}
              isHovered={!!isActive}
              onHover={() => setHoveredId(project.id)}
              onLeave={() => setHoveredId(null)}
            />
          </motion.div>
        );
      })}
    </div>
  );
};

export default ProjectGrid;

