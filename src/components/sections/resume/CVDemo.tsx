'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Camera, SlidersHorizontal, Image as ImageIcon, Layers } from 'lucide-react'
import ResumeAIExplainer from './ResumeAIExplainer'

// Lightweight Canvas-based edge detection (Sobel) — no WASM deps
function sobelEdge(src: ImageData, width: number, height: number) {
  const gray = new Uint8ClampedArray(width * height)
  for (let i = 0, j = 0; i < src.data.length; i += 4, j++) {
    const r = src.data[i], g = src.data[i + 1], b = src.data[i + 2]
    gray[j] = (0.299 * r + 0.587 * g + 0.114 * b) | 0
  }

  const gxKernel = [-1, 0, 1, -2, 0, 2, -1, 0, 1]
  const gyKernel = [-1, -2, -1, 0, 0, 0, 1, 2, 1]

  const out = new Uint8ClampedArray(width * height)
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let gx = 0, gy = 0
      let idx = 0
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const val = gray[(y + ky) * width + (x + kx)]
          gx += gxKernel[idx] * val
          gy += gyKernel[idx] * val
          idx++
        }
      }
      out[y * width + x] = Math.min(255, Math.hypot(gx, gy))
    }
  }

  const dst = new ImageData(width, height)
  for (let i = 0, j = 0; i < dst.data.length; i += 4, j++) {
    const v = out[j]
    dst.data[i] = v
    dst.data[i + 1] = v
    dst.data[i + 2] = v
    dst.data[i + 3] = 255
  }
  return dst
}

export default function CVDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [threshold, setThreshold] = useState(30)
  const [scale, setScale] = useState(1)
  const [mode, setMode] = useState<'source' | 'edges'>('edges')
  const W = 480, H = 270

  // Draw a simple synthetic scene (grid + shapes) if no image is provided
  const drawScene = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#0b0f19'
    ctx.fillRect(0, 0, W, H)

    // grid
    ctx.strokeStyle = '#1f2937'
    ctx.lineWidth = 1
    for (let x = 0; x < W; x += 24) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
    }
    for (let y = 0; y < H; y += 24) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
    }

    // shapes
    ctx.fillStyle = '#00ff88'
    ctx.fillRect(60, 60, 120, 60)
    ctx.beginPath(); ctx.arc(320, 140, 45, 0, Math.PI * 2); ctx.fill()

    // text
    ctx.fillStyle = '#86efac'
    ctx.font = 'bold 20px ui-monospace, SFMono-Regular, Menlo, monospace'
    ctx.fillText('GreenHacker CV Demo', 140, 30)
  }

  const render = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    // render source
    drawScene(ctx)

    if (mode === 'edges') {
      const src = ctx.getImageData(0, 0, W, H)
      const edges = sobelEdge(src, W, H)
      // simple threshold
      for (let i = 0; i < edges.data.length; i += 4) {
        const v = edges.data[i]
        const t = v > threshold ? 255 : 0
        edges.data[i] = edges.data[i + 1] = edges.data[i + 2] = t
      }
      ctx.putImageData(edges, 0, 0)
    }
  }

  useEffect(() => {
    render()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threshold, mode])

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className="rounded-2xl border border-neon-green/25 bg-black/30 p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-neon-green">
          <Camera size={18} />
          <h3 className="font-mono text-sm">Computer Vision — Edge Detection (Sobel)</h3>
        </div>
        <span className="rounded-full border border-neon-green/30 px-3 py-0.5 text-[10px] text-neon-green uppercase tracking-[0.25em]">Live</span>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-github-border bg-github-dark">
        <div className="relative w-full">
          <canvas ref={canvasRef} width={W} height={H} style={{ width: W * scale, height: H * scale }} />
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <label className="flex items-center gap-3 text-sm text-gray-300">
          <SlidersHorizontal size={16} className="text-neon-green" />
          Threshold
          <input
            type="range"
            min={0}
            max={128}
            value={threshold}
            onChange={(e) => setThreshold(parseInt(e.target.value))}
            className="flex-1 accent-neon-green"
          />
          <span className="w-10 text-right tabular-nums">{threshold}</span>
        </label>
        <label className="flex items-center gap-3 text-sm text-gray-300">
          <Layers size={16} className="text-neon-green" />
          Mode
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as any)}
            className="flex-1 rounded-md border border-github-border bg-black/40 p-1 text-gray-200"
          >
            <option value="source">Source</option>
            <option value="edges">Edges</option>
          </select>
        </label>
        <label className="flex items-center gap-3 text-sm text-gray-300">
          <ImageIcon size={16} className="text-neon-green" />
          Scale
          <select
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
            className="flex-1 rounded-md border border-github-border bg-black/40 p-1 text-gray-200"
          >
            <option value={1}>1x</option>
            <option value={1.5}>1.5x</option>
            <option value={2}>2x</option>
          </select>
        </label>
      </div>

      <ResumeAIExplainer
        title="What’s happening in the CV demo?"
        contextLabel="cv"
        parameters={{ mode, threshold, scale }}
      />
    </motion.div>
  )
}
