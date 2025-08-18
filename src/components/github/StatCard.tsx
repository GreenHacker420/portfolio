'use client';

import React, { useEffect, useRef } from 'react';
import { countNumber } from '@/utils/animation-anime';

type StatCardProps = {
  icon: React.ReactNode;
  label: string;
  value: number;
  suffix?: string;
  className?: string;
  accentClass?: string;
};

export default function StatCard({ icon, label, value, suffix, className = '', accentClass = '' }: StatCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (numRef.current) countNumber(numRef.current, value, { formatter: (n)=> suffix ? `${Math.round(n)}${suffix}` : `${Math.round(n)}` });
  }, [value, suffix]);

  useEffect(() => {
    if (!ref.current) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    const card = ref.current; let rafId: number | null = null; const state = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2; const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2); const dy = (e.clientY - cy) / (rect.height / 2);
      state.tx = dx * 8; state.ty = -dy * 8;
      const mx = (e.clientX - rect.left - rect.width/2) * 0.15; const my = (e.clientY - rect.top - rect.height/2) * 0.15;
      card.style.setProperty('--mx', `${mx}px`); card.style.setProperty('--my', `${my}px`);
    };
    const animate = () => { state.x += (state.tx - state.x) * 0.14; state.y += (state.ty - state.y) * 0.14;
      card.style.setProperty('--rx', `${state.y}deg`); card.style.setProperty('--ry', `${state.x}deg`);
      rafId = requestAnimationFrame(animate); };
    rafId = requestAnimationFrame(animate); window.addEventListener('mousemove', onMove);
    return () => { if (rafId) cancelAnimationFrame(rafId); window.removeEventListener('mousemove', onMove); };
  }, []);

  return (
    <div
      ref={ref}
      className={`stat-card group relative p-4 rounded-lg bg-gradient-to-br from-github-light/40 to-github-light/20 border border-github-border hover:bg-github-light transition-colors ${className}`}
      style={{ transform: 'perspective(800px) rotateX(var(--rx,0)) rotateY(var(--ry,0)) translate(var(--mx,0), var(--my,0))', willChange: 'transform' }}
    >
      <div className="absolute inset-0 rounded-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ boxShadow: '0 0 40px rgba(63,185,80,0.15) inset' }} />
      <div className="flex items-center gap-2 mb-2">
        <span className={`transition-transform duration-200 group-hover:scale-110 ${accentClass}`}>{icon}</span>
        <p className="text-sm text-github-text">{label}</p>
      </div>
      <p ref={numRef} className="text-2xl font-bold text-white">0</p>
    </div>
  );
}

