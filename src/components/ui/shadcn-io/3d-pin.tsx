'use client'

import * as React from 'react'
import Link from 'next/link'

type PinContainerProps = {
  href?: string
  title?: string
  children: React.ReactNode
  className?: string
}

// Lightweight local PinContainer fallback inspired by shadcn/aceternity 3D card
// Provides a 3D tilt with CSS variables and an optional title/footer link
export function PinContainer({ href, title, children, className }: PinContainerProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [vars, setVars] = React.useState<React.CSSProperties>({
    ['--rx' as any]: '0deg',
    ['--ry' as any]: '0deg',
    ['--px' as any]: '50%',
    ['--py' as any]: '50%',
  })

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    const rx = (py - 0.5) * -10
    const ry = (px - 0.5) * 10
    setVars({
      ['--rx' as any]: `${rx}deg`,
      ['--ry' as any]: `${ry}deg`,
      ['--px' as any]: `${px * 100}%`,
      ['--py' as any]: `${py * 100}%`,
    })
  }
  const onLeave = () => {
    setVars({
      ['--rx' as any]: '0deg',
      ['--ry' as any]: '0deg',
      ['--px' as any]: '50%',
      ['--py' as any]: '50%',
    })
  }

  const Wrapper = href ? Link : 'div'
  const wrapperProps: any = href ? { href } : {}

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={vars}
      className={`relative rounded-2xl border border-white/10 bg-black/30 p-[1px] [transform-style:preserve-3d] ${className || ''}`}
    >
      {/* Glow */}
      <div className="pointer-events-none absolute -inset-6 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden>
        <div className="absolute -inset-12 bg-[radial-gradient(circle_at_var(--px)_var(--py),_rgba(124,58,237,0.25),_transparent_60%)]" />
      </div>
      <Wrapper {...wrapperProps} className="group block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/0 p-0.5">
          <div className="rounded-2xl bg-black/40 [transform:rotateX(var(--rx))_rotateY(var(--ry))] transition-transform duration-300">
            {children}
          </div>
        </div>
        {title && (
          <div className="mt-2 text-xs text-white/60">{title}</div>
        )}
      </Wrapper>
    </div>
  )
}
