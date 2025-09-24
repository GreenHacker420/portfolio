'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Loader2, RotateCcw } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface ResumeAIExplainerProps {
  title: string
  contextLabel: 'cv' | 'pid'
  parameters?: Record<string, string | number>
}

async function fetchExplanation(contextLabel: 'cv' | 'pid', parameters?: Record<string, string | number>) {
  const base =
    contextLabel === 'cv'
      ? `Explain to a non-technical recruiter what the on-page Computer Vision demo shows.
Use friendly, concise language (4-6 sentences max). Emphasize practical value for products and teams.
Mention what the controls do if provided.`
      : `Explain to a non-technical recruiter what the PID control demo shows.
Use friendly, concise language (4-6 sentences max). Emphasize stability, tuning, and engineering maturity.
Mention what the controls do if provided.`

  const paramsText = parameters
    ? Object.entries(parameters)
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ')
    : 'no additional parameters'

  const message = `${base}\nCurrent parameters: ${paramsText}`
  const res = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, context: 'Resume AI Explainer' })
  })
  if (!res.ok) throw new Error('AI endpoint error')
  const json = await res.json()
  return (json?.response as string) || 'No explanation available.'
}

export default function ResumeAIExplainer({ title, contextLabel, parameters }: ResumeAIExplainerProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [text, setText] = useState<string | null>(null)

  const run = async () => {
    setLoading(true)
    setError(null)
    try {
      const t = await fetchExplanation(contextLabel, parameters)
      setText(t)
    } catch (e) {
      setError('AI explanation is temporarily unavailable. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className="mt-4 rounded-xl border border-neon-blue/25 bg-black/30 p-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-neon-blue">
          <Sparkles size={16} />
          <h4 className="font-mono text-sm">{title}</h4>
        </div>
        <button
          onClick={run}
          disabled={loading}
          className="rounded-md border border-neon-blue/40 px-3 py-1 text-xs text-neon-blue hover:bg-black/40 disabled:opacity-60"
        >
          {loading ? (
            <span className="inline-flex items-center gap-1"><Loader2 size={12} className="animate-spin"/>Generating</span>
          ) : text ? (
            <span className="inline-flex items-center gap-1"><RotateCcw size={12}/>Regenerate</span>
          ) : (
            <span className="inline-flex items-center gap-1"><Sparkles size={12}/>What’s happening?</span>
          )}
        </button>
      </div>

      {error && (
        <p className="mt-3 text-xs text-yellow-300">{error}</p>
      )}

      {text && (
        <div className="mt-3 prose prose-invert max-w-none prose-p:leading-relaxed">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
        </div>
      )}
    </motion.div>
  )
}
