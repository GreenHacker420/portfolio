'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import ResumeAIExplainer from './ResumeAIExplainer'
import { Gauge, SlidersHorizontal, Play, Pause, RefreshCw } from 'lucide-react'

// Simple PID simulation of a 1D plant: x'' = u with damping
// Discrete-time Euler integration for demonstration purposes
function simulatePID(
  kp: number,
  ki: number,
  kd: number,
  dt: number,
  steps: number,
  setpoint: number,
) {
  let x = 0 // position
  let v = 0 // velocity
  let integral = 0
  let prevError = setpoint - x

  const out: number[] = []
  for (let i = 0; i < steps; i++) {
    const error = setpoint - x
    integral += error * dt
    const derivative = (error - prevError) / dt
    const u = kp * error + ki * integral + kd * derivative

    // simple plant dynamics with light damping
    const damping = 0.15
    v += (u - damping * v) * dt
    x += v * dt

    prevError = error
    out.push(x)
  }
  return out
}

export default function RobotControl() {
  const [kp, setKp] = useState(1.2)
  const [ki, setKi] = useState(0.0)
  const [kd, setKd] = useState(0.08)
  const [setpoint, setSetpoint] = useState(10)
  const [running, setRunning] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const W = 520
  const H = 180

  const render = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    // background
    ctx.fillStyle = '#0b0f19'
    ctx.fillRect(0, 0, W, H)

    // grid
    ctx.strokeStyle = '#1f2937'
    ctx.lineWidth = 1
    for (let x = 40; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke() }
    for (let y = 20; y < H; y += 20) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke() }

    // run sim
    const dt = 0.02
    const steps = Math.floor((W - 60) / 2)
    const data = simulatePID(kp, ki, kd, dt, steps, setpoint)

    // axes
    ctx.strokeStyle = '#334155'
    ctx.beginPath(); ctx.moveTo(40, H - 30); ctx.lineTo(W - 20, H - 30); ctx.stroke()

    // draw setpoint line
    ctx.strokeStyle = '#22c55e'
    ctx.setLineDash([6, 6])
    const spY = H - 30 - setpoint * 5
    ctx.beginPath(); ctx.moveTo(40, spY); ctx.lineTo(W - 20, spY); ctx.stroke()
    ctx.setLineDash([])

    // plot response
    ctx.strokeStyle = '#a855f7'
    ctx.lineWidth = 2
    ctx.beginPath()
    for (let i = 0; i < data.length; i++) {
      const x = 40 + i * 2
      const y = H - 30 - data[i] * 5
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()

    // labels
    ctx.fillStyle = '#9ca3af'
    ctx.font = '11px ui-monospace, SFMono-Regular, Menlo, monospace'
    ctx.fillText('Position response', 44, 16)
    ctx.fillStyle = '#22c55e'; ctx.fillText('Setpoint', W - 110, spY - 6)
  }

  useEffect(() => {
    render()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kp, ki, kd, setpoint])

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className="rounded-2xl border border-neon-purple/25 bg-black/30 p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-neon-purple">
          <Gauge size={18} />
          <h3 className="font-mono text-sm">Robotics — PID Control Simulator</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRunning((r) => !r)}
            className="rounded-md border border-neon-purple/40 px-3 py-1 text-xs text-neon-purple hover:bg-black/40"
          >
            {running ? (<span className="inline-flex items-center gap-1"><Pause size={12}/>Pause</span>) : (<span className="inline-flex items-center gap-1"><Play size={12}/>Play</span>)}
          </button>
          <button
            onClick={() => { setKp(1.2); setKi(0); setKd(0.08); setSetpoint(10); }}
            className="rounded-md border border-neon-purple/40 px-3 py-1 text-xs text-neon-purple hover:bg-black/40"
          >
            <span className="inline-flex items-center gap-1"><RefreshCw size={12}/>Reset</span>
          </button>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-github-border bg-github-dark">
        <canvas ref={canvasRef} width={W} height={H} />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        <label className="flex items-center gap-3 text-sm text-gray-300">
          <SlidersHorizontal size={16} className="text-neon-purple" />
          Kp
          <input type="range" min={0} max={4} step={0.05} value={kp} onChange={(e) => setKp(parseFloat(e.target.value))} className="flex-1 accent-neon-purple" />
          <span className="w-12 text-right tabular-nums">{kp.toFixed(2)}</span>
        </label>
        <label className="flex items-center gap-3 text-sm text-gray-300">
          <SlidersHorizontal size={16} className="text-neon-purple" />
          Ki
          <input type="range" min={0} max={1} step={0.01} value={ki} onChange={(e) => setKi(parseFloat(e.target.value))} className="flex-1 accent-neon-purple" />
          <span className="w-12 text-right tabular-nums">{ki.toFixed(2)}</span>
        </label>
        <label className="flex items-center gap-3 text-sm text-gray-300">
          <SlidersHorizontal size={16} className="text-neon-purple" />
          Kd
          <input type="range" min={0} max={1} step={0.01} value={kd} onChange={(e) => setKd(parseFloat(e.target.value))} className="flex-1 accent-neon-purple" />
          <span className="w-12 text-right tabular-nums">{kd.toFixed(2)}</span>
        </label>
        <label className="flex items-center gap-3 text-sm text-gray-300">
          <SlidersHorizontal size={16} className="text-neon-purple" />
          Setpoint
          <input type="range" min={0} max={20} step={0.5} value={setpoint} onChange={(e) => setSetpoint(parseFloat(e.target.value))} className="flex-1 accent-neon-purple" />
          <span className="w-12 text-right tabular-nums">{setpoint.toFixed(1)}</span>
        </label>
      </div>

      <ResumeAIExplainer
        title="What’s happening in the PID demo?"
        contextLabel="pid"
        parameters={{ kp: kp.toFixed(2), ki: ki.toFixed(2), kd: kd.toFixed(2), setpoint: setpoint.toFixed(1) }}
      />
    </motion.div>
  )
}
