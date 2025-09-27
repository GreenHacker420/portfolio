'use client'

import { PinContainer } from '@/components/ui/3d-pin'
import { m } from 'framer-motion'
import * as React from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

export type ProjectPin3DProps = {
  slug: string
  title: string
  subtitle?: string
  imageUrl?: string
  gradient?: string // tailwind gradient classes, fallback provided
  technologies?: string[]
  githubUrl?: string
  liveUrl?: string
  role?: string
  isActive?: boolean
}

export default function ProjectPin3D({ slug, title, subtitle = '', imageUrl, gradient, technologies = [], githubUrl, liveUrl, role, isActive = false }: ProjectPin3DProps) {
  const href = `/projects/${slug}`
  const router = useRouter()
  const openExternal = (url?: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    if (!url) return
    window.open(url, '_blank', 'noopener,noreferrer')
  }
  const goToProject = () => router.push(href)
  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      goToProject()
    }
  }

  return (
    <m.div
      initial={false}
      animate={{
        scale: isActive ? 1.05 : 1,
        boxShadow: isActive
          ? '0 20px 40px rgba(124, 58, 237, 0.25)'
          : '0 8px 20px rgba(0, 0, 0, 0.25)'
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      layout
      role="link"
      tabIndex={0}
      aria-label={`Open project: ${title}`}
      onClick={goToProject}
      onKeyDown={onKeyDown}
      className="flex items-center justify-center cursor-pointer"
    >
      <PinContainer
        title={title}
        className="block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-violet-500 w-full max-w-[600px] h-[400px]"
      >
        <div className="w-full h-full min-h-[350px] relative">
          {/* Default State - Compact Card */}
          <m.div
            className={cn(
              'absolute inset-0 transition-all duration-500 ease-out',
              isActive ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            )}
          >
            <div className="h-full flex flex-col bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              {/* Image Section */}
              <div className="h-48 overflow-hidden relative">
                {imageUrl ? (
                  <img 
                    src={imageUrl} 
                    alt={title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                ) : (
                  <div className={`w-full h-full ${gradient || 'bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500'}`} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              
              {/* Content Section */}
              <div className="flex-1 p-6 flex flex-col">
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{title}</h3>
                {role && (
                  <p className="text-xs text-violet-300 font-medium uppercase tracking-wide mb-2">{role}</p>
                )}
                <p className="text-sm text-slate-300 leading-relaxed mb-4 line-clamp-3 flex-1">
                  {subtitle || 'No description available'}
                </p>
                
                {/* Tech Stack */}
                {technologies && technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="text-xs px-2 py-1 rounded-full bg-violet-500/20 text-violet-200 border border-violet-500/30"
                      >
                        {tech}
                      </span>
                    ))}
                    {technologies.length > 4 && (
                      <span className="text-xs px-2 py-1 rounded-full bg-slate-700/50 text-slate-300">
                        +{technologies.length - 4}
                      </span>
                    )}
                  </div>
                )}
                
                {/* Action Button */}
                <button
                  type="button"
                  onClick={openExternal(liveUrl || href)}
                  className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white py-2.5 px-4 rounded-lg font-medium hover:from-violet-600 hover:to-fuchsia-600 transition-all duration-200 shadow-lg hover:shadow-violet-500/25"
                >
                  View Project
                </button>
              </div>
            </div>
          </m.div>

          {/* Hover State - Expanded Card */}
          <m.div
            className={cn(
              'absolute inset-0 transition-all duration-500 ease-out',
              isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            )}
          >
            <div className="h-full grid grid-cols-1 lg:grid-cols-5 gap-6 bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl p-6">
              {/* Left - Image */}
              <div className="lg:col-span-2 h-full min-h-[200px] lg:min-h-full">
                <div className="h-full rounded-xl overflow-hidden border border-white/10">
                  {imageUrl ? (
                    <img 
                      src={imageUrl} 
                      alt={title} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className={`w-full h-full ${gradient || 'bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500'}`} />
                  )}
                </div>
              </div>
              
              {/* Right - Details */}
              <div className="lg:col-span-3 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
                  {role && (
                    <p className="text-sm text-violet-300 font-medium uppercase tracking-wide mb-3">{role}</p>
                  )}
                  <p className="text-slate-300 leading-relaxed mb-6">
                    {subtitle || 'No description available'}
                  </p>
                  
                  {/* Full Tech Stack */}
                  {technologies && technologies.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-slate-200 mb-3">Technologies</h4>
                      <div className="flex flex-wrap gap-2">
                        {technologies.map((tech) => (
                          <span
                            key={tech}
                            className="text-xs px-3 py-1.5 rounded-full bg-violet-500/20 text-violet-200 border border-violet-500/30 hover:bg-violet-500/30 transition-colors"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={openExternal(liveUrl || href)}
                    className="flex-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white py-3 px-6 rounded-lg font-medium hover:from-violet-600 hover:to-fuchsia-600 transition-all duration-200 shadow-lg hover:shadow-violet-500/25"
                  >
                    View Live Demo
                  </button>
                  {githubUrl && (
                    <button
                      type="button"
                      onClick={openExternal(githubUrl)}
                      className="px-6 py-3 rounded-lg border border-white/20 bg-white/5 text-slate-100 font-medium hover:bg-white/10 hover:border-white/30 transition-all duration-200 backdrop-blur"
                    >
                      GitHub
                    </button>
                  )}
                </div>
              </div>
            </div>
          </m.div>
        </div>
      </PinContainer>
    </m.div>
  )
}
