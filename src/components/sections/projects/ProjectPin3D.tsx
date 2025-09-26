'use client'

import Link from 'next/link'
import { PinContainer } from '@/components/ui/shadcn-io/3d-pin'

export type ProjectPin3DProps = {
  slug: string
  title: string
  subtitle?: string
  imageUrl?: string
  gradient?: string // tailwind gradient classes, fallback provided
}

export default function ProjectPin3D({ slug, title, subtitle = '', imageUrl, gradient }: ProjectPin3DProps) {
  const href = `/projects/${slug}`

  return (
    <div className="flex items-center justify-center">
      <Link href={href} aria-label={`Open project: ${title}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-violet-500 rounded-xl">
        <PinContainer title={title} href={href}>
          <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/70 sm:basis-1/2 w-[20rem] h-[20rem]">
            <h3 className="max-w-xs !pb-2 !m-0 font-bold text-base text-slate-100">{title}</h3>
            {subtitle && (
              <div className="text-sm !m-0 !p-0 font-normal">
                <span className="text-slate-400">{subtitle}</span>
              </div>
            )}
            {imageUrl ? (
              <div className="flex-1 mt-4 overflow-hidden rounded-lg border border-white/10 bg-black/40">
                <img src={imageUrl} alt={title} className="h-full w-full object-cover" />
              </div>
            ) : (
              <div className={`flex flex-1 w-full rounded-lg mt-4 ${gradient || 'bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500'}`} />
            )}
          </div>
        </PinContainer>
      </Link>
    </div>
  )
}
