'use client'

import { motion } from 'framer-motion'
import { GraduationCap, Cpu, Bot, Camera } from 'lucide-react'

const tiles = [
  {
    title: 'Engineer-in-Progress',
    desc: 'College student building production-grade apps while acing core CS and math.',
    icon: GraduationCap,
  },
  {
    title: 'Full‑Stack Developer',
    desc: 'Next.js 15, TypeScript, PostgreSQL, Prisma, CI/CD and performance-first thinking.',
    icon: Cpu,
  },
  {
    title: 'Robotics Enthusiast',
    desc: 'Hands-on with controllers, sensors and embedded logic—bridging software with motion.',
    icon: Bot,
  },
  {
    title: 'Computer Vision Expert',
    desc: 'OpenCV, TensorFlow, MediaPipe—shipping real CV features that run fast and look crisp.',
    icon: Camera,
  },
]

export default function ResumeIntro() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="rounded-2xl border border-neon-green/20 bg-github-light p-8 shadow-lg shadow-neon-green/10"
    >
      <div className="space-y-4">
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.4em] text-neon-green">
          <span className="h-1 w-8 rounded-full bg-neon-green" /> Profile
        </span>
        <h3 className="text-2xl md:text-3xl font-semibold text-white">
          Harsh Hirawat (GreenHacker): College innovator crafting AI‑powered products that feel instant and look polished.
        </h3>
        <p className="text-github-text text-base leading-relaxed">
          From robotics clubs to production web apps, I blend Computer Vision, systems thinking, and product taste to
          deliver features users love. I optimize for clarity, speed, and maintainability—so teams move faster without
          breaking quality.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map(({ title, desc, icon: Icon }) => (
          <div
            key={title}
            className="rounded-xl border border-github-border/60 bg-black/40 p-5 transition-all duration-300 hover:border-neon-green/40 hover:bg-black/60"
          >
            <div className="flex items-center gap-3 text-neon-green">
              <Icon size={18} className="shrink-0" />
              <h4 className="font-semibold text-white tracking-tight">{title}</h4>
            </div>
            <p className="mt-2 text-sm text-github-text leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
