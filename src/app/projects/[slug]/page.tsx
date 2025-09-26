'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'

// Placeholder data structure (wire to Prisma later)
function useProject(slug: string) {
  return useMemo(() => {
    const title = slug
      .split('-')
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(' ')

    const project = {
      slug,
      title: title || 'Project Title',
      status: 'Active',
      category: 'Web',
      startDate: '2024-01-01',
      endDate: null as string | null,
      imageUrl: '/images/placeholder-project.svg',
      gallery: [
        '/images/placeholder-project.svg',
        'https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1521747116042-5a810fda9664?q=80&w=1200&auto=format&fit=crop',
      ],
      longDescription:
        'This is a clean, responsive, and accessible project detail layout. Replace this copy with your Prisma-backed long description to explain the problem, solution, and impact. Include notable features and decisions.',
      technologies: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL'],
      highlights: [
        'Implemented 3D pin interactions with accessible fallbacks.',
        'Added Quick View modal with image-left/details-right layout.',
        'Optimized images and added structured data for SEO.',
      ],
      challenges: [
        'Balancing animations with accessibility (reduced motion).',
        'Ensuring hydration-safe markup for nested interactive components.',
      ],
      learnings: [
        'Effective state management for UI/UX components.',
        'Performance tuning for image-heavy pages.',
      ],
      links: {
        live: 'https://example.com',
        source: 'https://github.com/GreenHacker420/portfolio',
      },
    }

    return project
  }, [slug])
}

function formatRange(start?: string | null, end?: string | null) {
  const fmt = (d?: string | null) => (d ? new Date(d).toLocaleString(undefined, { month: 'short', year: 'numeric' }) : null)
  const s = fmt(start)
  const e = fmt(end)
  if (!s && !e) return null
  return `${s ?? ''}${s && e ? ' – ' : ''}${e ?? 'Present'}`
}

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const project = useProject(slug)
  const [activeIndex, setActiveIndex] = useState(0)

  const dateRange = formatRange(project.startDate, project.endDate)

  return (
    <main className="container mx-auto max-w-6xl px-4 py-10">
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/projects" className="hover:underline">Projects</Link>
        <span className="mx-2">/</span>
        <span aria-current="page" className="text-foreground">{project.title}</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
        {/* Left: Sticky Gallery */}
        <section className="md:col-span-5">
          <div className="sticky top-24">
            <div className="overflow-hidden rounded-xl border border-white/10 bg-black/30">
              <img
                src={project.gallery[activeIndex]}
                alt={`${project.title} screenshot ${activeIndex + 1}`}
                className="h-auto w-full object-cover"
              />
            </div>
            {project.gallery.length > 1 && (
              <div className="mt-3 grid grid-cols-5 gap-2">
                {project.gallery.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    aria-label={`Show image ${i + 1}`}
                    className={`overflow-hidden rounded-lg border ${i === activeIndex ? 'border-violet-500' : 'border-white/10'} bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500`}
                  >
                    <img src={src} alt={`${project.title} thumbnail ${i + 1}`} className="h-20 w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Right: Content */}
        <article className="md:col-span-7">
          <header>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full border border-white/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-white/80">
                {project.status}
              </span>
              {dateRange && (
                <span className="text-sm text-white/60">{dateRange}</span>
              )}
              <span className="ml-auto rounded-full border border-white/10 px-2.5 py-0.5 text-[11px] text-white/70">
                {project.category}
              </span>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
              {project.title}
            </h1>
          </header>

          {/* Overview */}
          <section className="mt-6">
            <h2 className="text-base font-semibold text-white/90">Overview</h2>
            <p className="mt-2 text-[15px] leading-7 text-white/80">
              {project.longDescription}
            </p>
          </section>

          {/* Technologies */}
          {project.technologies?.length ? (
            <section className="mt-6">
              <h2 className="text-base font-semibold text-white/90">Technologies</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {project.technologies.map((t) => (
                  <span key={t} className="rounded bg-white/5 px-2 py-1 text-xs text-white/80 ring-1 ring-white/10">{t}</span>
                ))}
              </div>
            </section>
          ) : null}

          {/* Highlights */}
          {project.highlights?.length ? (
            <section className="mt-6">
              <h2 className="text-base font-semibold text-white/90">Highlights</h2>
              <ul className="mt-2 space-y-1.5 text-[15px] text-white/80">
                {project.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-violet-500" />
                    <span className="leading-7">{h}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {/* Challenges */}
          {project.challenges?.length ? (
            <section className="mt-6">
              <h2 className="text-base font-semibold text-white/90">Challenges</h2>
              <ul className="mt-2 list-disc pl-6 text-[15px] leading-7 text-white/80">
                {project.challenges.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {/* Learnings */}
          {project.learnings?.length ? (
            <section className="mt-6">
              <h2 className="text-base font-semibold text-white/90">Learnings</h2>
              <ul className="mt-2 list-disc pl-6 text-[15px] leading-7 text-white/80">
                {project.learnings.map((l, i) => (
                  <li key={i}>{l}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {/* Links */}
          <section className="mt-8 flex flex-wrap gap-3">
            {project.links.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-violet-400/40 bg-violet-500/10 px-4 py-2 text-sm text-violet-200 hover:bg-violet-500/20"
              >
                View Live
              </a>
            )}
            {project.links.source && (
              <a
                href={project.links.source}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-white/15 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
              >
                View Code
              </a>
            )}
          </section>
        </article>
      </div>
    </main>
  )
}
