'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ExternalLink, Github, X } from 'lucide-react';
import { PinContainer } from '@/components/ui/3d-pin';

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    description: string;
    longDescription?: string;
    category: string;
    technologies?: string;
    status: 'draft' | 'published' | 'archived';
    featured: boolean;
    githubUrl?: string;
    liveUrl?: string;
    imageUrl?: string;
    gallery?: string;
    highlights?: string;
    challenges?: string;
    learnings?: string;
    startDate?: string | Date;
    endDate?: string | Date;
    teamSize?: number;
    role?: string;
    isVisible: boolean;
    displayOrder: number;
    viewCount: number;
    createdAt: string | Date;
    updatedAt: string | Date;
  };
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}

export default function ProjectCard({ project, isHovered, onHover, onLeave }: ProjectCardProps) {
  // Parse JSON fields safely
  let technologies: string[] = [];
  let highlights: string[] = [];
  let challenges: string[] = [];
  let learnings: string[] = [];
  let gallery: string[] = [];

  try {
    technologies = project.technologies ? JSON.parse(project.technologies) : [];
  } catch (error) {
    console.warn('Failed to parse technologies for project:', project.id);
    technologies = [];
  }

  try {
    highlights = project.highlights ? JSON.parse(project.highlights) : [];
  } catch (error) {
    console.warn('Failed to parse highlights for project:', project.id);
    highlights = [];
  }

  try {
    challenges = project.challenges ? JSON.parse(project.challenges) : [];
  } catch (error) {
    console.warn('Failed to parse challenges for project:', project.id);
    challenges = [];
  }

  try {
    learnings = project.learnings ? JSON.parse(project.learnings) : [];
  } catch (error) {
    console.warn('Failed to parse learnings for project:', project.id);
    learnings = [];
  }

  try {
    gallery = project.gallery ? JSON.parse(project.gallery) : [];
  } catch (error) {
    console.warn('Failed to parse gallery for project:', project.id);
    gallery = [];
  }

  const handleExternalClick = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Default State Card with 3D Pin */}
      <motion.div
        className={`absolute inset-0 transition-all duration-300 ${
          isHovered ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
        onMouseEnter={onHover}
      >
        <PinContainer
          title={project.title}
          className="w-full h-full cursor-pointer"
        >
          <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden h-full hover:border-violet-500/50 transition-all duration-300 group cursor-pointer w-full">
          {/* Image */}
          <div className="h-full overflow-hidden bg-slate-700">
            {project.imageUrl ? (
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                <span className="text-white font-medium">{project.title}</span>
              </div>
            )}
          </div>
          {/* Bottom Title Bar */}
          <div className="absolute left-0 right-0 bottom-0 bg-slate-950/80 backdrop-blur-sm border-t border-white/10 px-4 py-3">
            <h3 className="text-white font-semibold text-base truncate">
              {project.title}
            </h3>
          </div>
          </div>
        </PinContainer>
      </motion.div>

      {/* Hover State Card - Shows above the 3D pin */}
      <motion.div
        className={`absolute inset-0 z-[100] transition-all duration-300 ${
          isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        }`}
        onMouseLeave={onLeave}
      >
        <div className="bg-slate-900/95 backdrop-blur-md border border-violet-500/50 rounded-xl overflow-hidden h-full w-full max-w-full shadow-2xl shadow-violet-500/25 transform-gpu">
          <div className="flex flex-col h-full">
            {/* Top - Image */}
            <div className="relative overflow-hidden bg-slate-700 h-48">
              {project.imageUrl ? (
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                  <span className="text-white font-medium text-lg">{project.title}</span>
                </div>
              )}
            </div>

            {/* Bottom - Details */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{project.title}</h3>
                  {project.role && (
                    <p className="text-xs text-violet-400 font-medium">{project.role}</p>
                  )}
                </div>

                <p className="text-slate-300 text-xs leading-relaxed line-clamp-2">
                  {project.longDescription || project.description}
                </p>

                {/* Tech Stack */}
                {technologies.length > 0 && (
                  <div>
                    <div className="flex flex-wrap gap-1">
                      {technologies.slice(0, 4).map((tech, index) => (
                        <span
                          key={index}
                          className="px-1.5 py-0.5 text-xs bg-violet-500/20 text-violet-200 rounded border border-violet-500/30"
                        >
                          {tech}
                        </span>
                      ))}
                      {technologies.length > 4 && (
                        <span className="px-1.5 py-0.5 text-xs bg-slate-600/50 text-slate-400 rounded">
                          +{technologies.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-2">
                {project.liveUrl && (
                  <button
                    onClick={(e) => handleExternalClick(project.liveUrl!, e)}
                    className="flex-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white py-2 px-3 rounded-md text-xs font-medium hover:from-violet-600 hover:to-fuchsia-600 transition-all duration-200 flex items-center justify-center gap-1.5"
                  >
                    <ExternalLink size={12} />
                    Demo
                  </button>
                )}
                
                {project.githubUrl && (
                  <button
                    onClick={(e) => handleExternalClick(project.githubUrl!, e)}
                    className="px-3 py-2 rounded-md border border-slate-600 bg-slate-700/50 text-slate-100 text-xs font-medium hover:bg-slate-600/50 hover:border-slate-500 transition-all duration-200 flex items-center justify-center gap-1.5"
                  >
                    <Github size={12} />
                    Code
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
