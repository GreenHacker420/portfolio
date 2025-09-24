'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Loader2, Cpu, Bot, Camera, GraduationCap, Quote } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface InsightData {
  summary: string
  strengths: string[]
  roboticsAndCV: string
  impact: string[]
  quote: string
}

const FALLBACK: InsightData = {
  summary:
    "Harsh (GreenHacker) is a college innovator blending full‑stack engineering with practical AI and Computer Vision. He ships polished, production‑ready features with an eye for speed, reliability, and UX.",
  strengths: [
    'Strong foundations in algorithms, systems, and math; learns rapidly and iterates fast',
    'Production experience with Next.js 15, TypeScript, PostgreSQL, Prisma, CI/CD',
    'Balances product sense with engineering rigor, testing, and observability',
  ],
  roboticsAndCV:
    'Hands‑on with robotics controllers, sensors, and control loops. Comfortable with OpenCV, TensorFlow, and MediaPipe; has delivered CV features like detection, tracking, and real‑time inference with attention to accuracy and latency.',
  impact: [
    'Built AI‑augmented portfolio with CLI assistant powered by Gemini and GitHub analytics',
    'Optimized database schema and caching for snappy queries and real usage at scale',
    'Mentored peers and led small teams to deliver features under tight timelines',
  ],
  quote:
    '“Harsh is the kind of builder who unblocks teams—he fuses Computer Vision, clean architecture, and product focus into momentum.”',
}

export default function ResumeAIInsights() {
  const [data, setData] = useState<InsightData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    const run = async () => {
      try {
        const prompt = `You are analyzing a resume for Harsh Hirawat (GreenHacker): a college student, full‑stack developer, robotics enthusiast, and Computer Vision expert.
Return a concise, structured summary in JSON with keys: summary (1–2 sentences), strengths (array of 3 bullets), roboticsAndCV (1 paragraph), impact (array of 3 bullets), quote (<=140 chars, a hiring‑manager style compliment). Keep the tone confident and specific. No markdown, return only JSON.`

        const res = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: prompt, context: 'Resume AI Insights generator' }),
        })

        if (!res.ok) throw new Error('AI endpoint error')
        const json = await res.json()
        const text: string = json?.response || ''
        const parsed = JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] || '{}')

        const normalized: InsightData = {
          summary: parsed.summary || FALLBACK.summary,
          strengths: Array.isArray(parsed.strengths) && parsed.strengths.length ? parsed.strengths.slice(0, 3) : FALLBACK.strengths,
          roboticsAndCV: parsed.roboticsAndCV || FALLBACK.roboticsAndCV,
          impact: Array.isArray(parsed.impact) && parsed.impact.length ? parsed.impact.slice(0, 3) : FALLBACK.impact,
          quote: parsed.quote || FALLBACK.quote,
        }

        if (active) setData(normalized)
      } catch (e) {
        if (active) setData(FALLBACK)
      } finally {
        if (active) setLoading(false)
      }
    }

    run()
    return () => {
      active = false
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
      viewport={{ once: true }}
      className="rounded-2xl border border-neon-purple/20 bg-gradient-to-br from-black/40 via-github-dark to-black/40 p-8 shadow-lg shadow-neon-purple/10"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-neon-purple">
            <Sparkles size={14} className="text-neon-purple" /> AI Insights
          </span>
          <h3 className="text-2xl font-semibold text-white">Why GreenHacker stands out</h3>
        </div>
        <span className="rounded-full border border-neon-purple/30 bg-black/50 px-4 py-1 text-xs text-neon-purple">Live</span>
      </div>

      {loading || !data ? (
        <div className="mt-6 flex items-center gap-2 text-github-text/80 text-sm">
          <Loader2 className="h-4 w-4 animate-spin" /> Generating persona‑aware insights…
        </div>
      ) : (
        <div className="mt-6 space-y-8">
          <p className="text-base leading-relaxed text-github-text/90">{data.summary}</p>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-github-border/60 bg-black/40 p-5">
              <div className="flex items-center gap-2 text-neon-green text-xs font-semibold uppercase tracking-[0.25em]"><GraduationCap size={14} /> Student</div>
              <p className="mt-2 text-sm text-github-text">{data.strengths[0]}</p>
            </div>
            <div className="rounded-xl border border-github-border/60 bg-black/40 p-5">
              <div className="flex items-center gap-2 text-neon-green text-xs font-semibold uppercase tracking-[0.25em]"><Cpu size={14} /> Developer</div>
              <p className="mt-2 text-sm text-github-text">{data.strengths[1]}</p>
            </div>
            <div className="rounded-xl border border-github-border/60 bg-black/40 p-5">
              <div className="flex items-center gap-2 text-neon-green text-xs font-semibold uppercase tracking-[0.25em]"><Bot size={14} /> Robotics</div>
              <p className="mt-2 text-sm text-github-text">{data.strengths[2]}</p>
            </div>
          </div>

          <div className="rounded-xl border border-neon-green/25 bg-black/30 p-6">
            <div className="flex items-center gap-2 text-neon-green text-xs font-semibold uppercase tracking-[0.25em]"><Camera size={14} /> Computer Vision</div>
            <div className="mt-2 text-sm text-github-text leading-relaxed">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{data.roboticsAndCV}</ReactMarkdown>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {data.impact.map((line, i) => (
              <div key={i} className="rounded-xl border border-neon-green/20 bg-black/30 p-6">
                <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-neon-green/80">Impact {i + 1}</h4>
                <p className="mt-2 text-sm text-github-text">{line}</p>
              </div>
            ))}
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-neon-purple/30 bg-black/40 p-6">
            <Quote className="absolute -left-4 -top-4 h-20 w-20 text-neon-purple/10" />
            <p className="relative text-lg font-medium text-neon-purple/90">{data.quote}</p>
          </div>
        </div>
      )}
    </motion.div>
  )
}
