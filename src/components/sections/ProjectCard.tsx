
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { projectCardHover } from '../../utils/animation';
import Interactive3DCard from '../effects/Interactive3DCard';

interface ProjectCardProps {
  project: {
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
  };
  delay?: number;
}

const ProjectCard = ({ project, delay = 0 }: ProjectCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <Interactive3DCard className="h-full">
        <div
          className="bg-github-dark border border-github-border rounded-lg overflow-hidden h-full transition-all duration-300"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="aspect-video w-full overflow-hidden">
            <motion.img
              src={project.image_url || project.imageUrl || '/images/placeholder-project.svg'}
              alt={project.title}
              className="w-full h-full object-cover object-center"
              animate={{
                scale: isHovered ? 1.05 : 1,
              }}
              transition={{ duration: 0.4 }}
            />
          </div>

          <div className="p-6">
            <div className="flex justify-between items-start">
              <motion.h3
                className="text-xl font-bold text-white"
                animate={{ x: isHovered ? 3 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {project.title}
              </motion.h3>

              <div className="flex flex-wrap gap-2">
                {(project.technologies || project.tags || []).map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className={`tech-badge px-2 py-1 text-xs rounded ${
                      tag === "HTML"
                        ? "bg-tech-html/20 text-tech-html border border-tech-html/30"
                        : tag === "CSS"
                        ? "bg-tech-css/20 text-tech-css border border-tech-css/30"
                        : tag === "TypeScript"
                        ? "bg-tech-ts/20 text-tech-ts border border-tech-ts/30"
                        : tag === "JavaScript"
                        ? "bg-yellow-500/20 text-yellow-500 border border-yellow-500/30"
                        : tag === "React"
                        ? "bg-blue-400/20 text-blue-400 border border-blue-400/30"
                        : tag === "Next.js"
                        ? "bg-black/40 text-white border border-white/30"
                        : tag === "Tailwind"
                        ? "bg-teal-500/20 text-teal-500 border border-teal-500/30"
                        : tag === "Design"
                        ? "bg-purple-500/20 text-purple-500 border border-purple-500/30"
                        : tag === "Cloud"
                        ? "bg-blue-600/20 text-blue-600 border border-blue-600/30"
                        : "bg-gray-500/20 text-gray-500 border border-gray-500/30"
                      }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <p className="mt-4 text-github-text">{project.description}</p>

            <motion.div
              className="mt-6 flex gap-3"
              animate={{ y: isHovered ? 0 : 10, opacity: isHovered ? 1 : 0.8 }}
              transition={{ duration: 0.3 }}
            >
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-neon-green/20 text-neon-green rounded-md hover:bg-neon-green/30 transition-colors"
                >
                  Demo
                </a>
              )}
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-github-light text-github-text rounded-md hover:bg-github-light/80 transition-colors"
                >
                  Source
                </a>
              )}
            </motion.div>
          </div>
        </div>
      </Interactive3DCard>
    </motion.div>
  );
};

export default ProjectCard;
