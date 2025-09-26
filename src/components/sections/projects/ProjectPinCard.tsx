'use client';

import React, { useState, useId, useCallback, useEffect, useRef } from 'react';

// Minimal Aceternity-style 3D Pin card approximation using Tailwind utilities
// This component keeps under 100 lines and focuses on interactivity/micro-interactions.

type Project = {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  category: string;
  technologies?: string[];
  tags?: string[];
  github_url?: string;
  live_url?: string;
  image_url?: string;
  imageUrl?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  highlights?: string[];
};

type Props = { project: Project };

export default function ProjectPinCard({ project }: Props) {
  const img = project.image_url || project.imageUrl || '/images/placeholder-project.svg';
  const tags = project.technologies || project.tags || [];
  const status = project.status || 'Active';
  const start = project.start_date ? new Date(project.start_date) : null;
  const end = project.end_date ? new Date(project.end_date) : null;
  const dateRange = start
    ? `${start.toLocaleString(undefined, { month: 'short', year: 'numeric' })} – ${end ? end.toLocaleString(undefined, { month: 'short', year: 'numeric' }) : 'Present'}`
    : undefined;
  const highlights = (project.highlights || []).slice(0, 3);
  const [open, setOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [styleVars, setStyleVars] = useState<React.CSSProperties>({});

  // Mouse-based 3D tilt with CSS variables (shadcn/aceternity style)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0..1
    const py = (e.clientY - rect.top) / rect.height; // 0..1
    const rx = (py - 0.5) * -10; // rotateX
    const ry = (px - 0.5) * 10;  // rotateY
    setStyleVars({
      '--rx': `${rx}deg`,
      '--ry': `${ry}deg`,
      '--px': `${px * 100}%`,
      '--py': `${py * 100}%`,
    } as React.CSSProperties);
  };
  const handleMouseLeave = () => {
    setStyleVars({ '--rx': `0deg`, '--ry': `0deg`, '--px': `50%`, '--py': `50%` } as React.CSSProperties);
  };
  const titleId = useId();
  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') setOpen(false);
  }, []);
  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', onKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onKeyDown]);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={styleVars}
      className="group relative h-full rounded-xl border border-github-border bg-github-dark/80 backdrop-blur-md overflow-hidden focus-within:ring-2 focus-within:ring-neon-green/40 [transform-style:preserve-3d] will-change-transform"
    >
      {/* Image layer with subtle 3D tilt via CSS perspective */}
      <div className="relative aspect-video w-full [perspective:1000px]">
        <div className="absolute inset-0 transition-transform duration-300 [transform:rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))]">
          <img src={img} alt={project.title} className="h-full w-full object-cover" loading="lazy" />
        </div>
        {/* Pin/Badge */}
        <div className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-xs text-white ring-1 ring-white/10 transition-transform duration-300 [transform:translateZ(30px)]">
          {project.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 transition-transform duration-300 [transform:translateZ(20px)]">
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
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-white/90 hover:bg-white/10"
          >
            Quick view
          </button>
        </div>
      </div>

      {/* Hover Details Panel (Quick View) */}
      <div className="pointer-events-none absolute inset-0 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
        <div className="pointer-events-auto absolute inset-x-3 top-3 rounded-xl border border-white/10 bg-black/85 backdrop-blur-lg p-4 shadow-2xl [transform:translateZ(40px)]">
          {/* Header row */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full border border-white/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/80">
                {status}
              </span>
              {dateRange && (
                <span className="text-[11px] text-white/60">{dateRange}</span>
              )}
            </div>
            <div className="flex gap-2">
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md border border-neon-green/30 bg-neon-green/10 px-2.5 py-1 text-[11px] text-neon-green hover:bg-neon-green/20"
                >
                  View
                </a>
              )}
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] text-white hover:bg-white/10"
                >
                  Code
                </a>
              )}
            </div>
          </div>

          {/* Long description */}
          {(project.longDescription || project.description) && (
            <div className="mt-3 text-[12px] leading-5 text-white/80 line-clamp-4">
              {project.longDescription || project.description}
            </div>
          )}

          {/* Tech tags expanded */}
          {tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {tags.slice(0, 10).map((t, i) => (
                <span key={i} className="rounded bg-white/5 px-2 py-0.5 text-[11px] text-white/80 ring-1 ring-white/10">{t}</span>
              ))}
            </div>
          )}

          {/* Highlights */}
          {highlights.length > 0 && (
            <ul className="mt-3 space-y-1">
              {highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2 text-[12px] text-white/75">
                  <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-neon-green/70" />
                  <span className="leading-5">{h}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Glow accent */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute -inset-20 bg-[radial-gradient(circle_at_var(--px,50%)_var(--py,50%),_rgba(0,255,135,0.15),_transparent_60%)]" />
      </div>

      {/* Modal Popup */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="fixed inset-0 z-[100] flex items-center justify-center"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} />
          {/* Dialog content */}
          <div className="relative z-[101] mx-4 w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-github-dark/95 backdrop-blur-xl shadow-2xl">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/80 hover:bg-white/10"
            >
              Close
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Left: Image */}
              <div className="relative h-64 md:h-full bg-black/40">
                <img src={img} alt={project.title} className="h-full w-full object-cover" />
              </div>
              {/* Right: Details */}
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full border border-white/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/80">
                    {status}
                  </span>
                  {dateRange && (
                    <span className="text-[11px] text-white/60">{dateRange}</span>
                  )}
                </div>
                <h3 id={titleId} className="mt-2 text-xl font-semibold text-white">
                  {project.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/80">
                  {project.longDescription || project.description}
                </p>

                {highlights.length > 0 && (
                  <ul className="mt-4 space-y-1.5">
                    {highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-[13px] text-white/80">
                        <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-neon-green/70" />
                        <span className="leading-5">{h}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {tags.map((t, i) => (
                      <span key={i} className="rounded bg-white/5 px-2 py-0.5 text-[12px] text-white/80 ring-1 ring-white/10">{t}</span>
                    ))}
                  </div>
                )}

                <div className="mt-6 flex flex-wrap gap-2">
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-md border border-neon-green/30 bg-neon-green/10 px-3 py-2 text-sm text-neon-green hover:bg-neon-green/20"
                    >
                      View Live
                    </a>
                  )}
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-white hover:bg-white/10"
                    >
                      View Code
                    </a>
                  )}
                  <button
                    onClick={() => setOpen(false)}
                    className="ml-auto rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-white/80 hover:bg-white/10"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

