'use client';

import React from 'react';

// Minimal Aceternity-style 3D Pin card approximation using Tailwind utilities
// This component keeps under 100 lines and focuses on interactivity/micro-interactions.

type Project = {
  id: string;
  title: string;
  description: string;
  category: string;
  technologies?: string[];
  tags?: string[];
  github_url?: string;
  live_url?: string;
  image_url?: string;
  imageUrl?: string;
};

type Props = { project: Project };

export default function ProjectPinCard({ project }: Props) {
  const img = project.image_url || project.imageUrl || '/images/placeholder-project.svg';
  const tags = project.technologies || project.tags || [];

  return (
    <div
      className="group relative h-full rounded-xl border border-github-border bg-github-dark/80 backdrop-blur-md overflow-hidden"
    >
      {/* Image layer with subtle 3D tilt via CSS perspective */}
      <div className="relative aspect-video w-full [perspective:1000px]">
        <div className="absolute inset-0 transition-transform duration-500 group-hover:[transform:rotateX(6deg)_rotateY(-6deg)]">
          <img src={img} alt={project.title} className="h-full w-full object-cover" loading="lazy" />
        </div>
        {/* Pin/Badge */}
        <div className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-xs text-white ring-1 ring-white/10">
          {project.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-white text-lg font-semibold tracking-tight">{project.title}</h3>
        <p className="mt-2 text-sm text-github-text line-clamp-3">{project.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.slice(0, 5).map((tag, i) => (
            <span key={i} className="rounded bg-github-light/40 px-2 py-1 text-xs text-github-text ring-1 ring-white/10">
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-5 flex gap-3">
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-neon-green/20 px-3 py-2 text-sm text-neon-green transition hover:bg-neon-green/30"
            >
              Demo
            </a>
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-github-light px-3 py-2 text-sm text-github-text transition hover:bg-github-light/80"
            >
              Source
            </a>
          )}
        </div>
      </div>

      {/* Glow accent */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute -inset-20 bg-[radial-gradient(circle_at_var(--x,50%)_var(--y,50%),_rgba(0,255,135,0.15),_transparent_60%)]" />
      </div>
    </div>
  );
}

