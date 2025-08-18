'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { countNumber } from '@/utils/animation-anime';

type StatCardProps = {
  icon: React.ReactNode;
  label: string;
  value: number;
  suffix?: string;
  className?: string;
  accentClass?: string;
  sparkline?: number[];
  sparklineColor?: string; // e.g. '#10b981'
  compact?: boolean; // use compact number formatting (e.g., 1.3K)
};

function formatCompact(n: number) {
  try {
    return Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(n);
  } catch {
    if (n >= 1000) return (Math.round((n/1000)*10)/10) + 'K';
    return String(n);
  }
}

function buildSparkPath(series: number[], w = 120, h = 28, pad = 2) {
  if (!series.length) return '';
  const min = Math.min(...series);
  const max = Math.max(...series);
  const range = Math.max(1, max - min);
  const stepX = (w - pad * 2) / Math.max(1, series.length - 1);
  const values = series.map((v, i) => {
    const x = pad + i * stepX;
    const y = h - pad - ((v - min) / range) * (h - pad * 2);
    return [x, y] as const;
  });
  return values.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ');
}

export default function StatCard({ icon, label, value, suffix, className = '', accentClass = '', sparkline = [], sparklineColor = '#10b981', compact = true }: StatCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (numRef.current) {
      countNumber(numRef.current, value, {
        formatter: (n) => {
          const base = compact ? formatCompact(n) : Math.round(n).toString();
          return suffix ? `${base}${suffix}` : base;
        }
      });
    }
  }, [value, suffix]);

  const path = useMemo(() => buildSparkPath(sparkline), [sparkline]);

  return (
    <div
      ref={ref}
      className={`stat-card group relative p-4 rounded-xl bg-github-card/60 backdrop-blur-sm border border-white/10 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(16,185,129,0.10)] ${className}`}
    >
      <div className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ boxShadow: '0 0 40px rgba(63,185,80,0.12) inset' }} />
      <div className="flex items-center gap-3 mb-3">
        <span className={`h-9 w-9 rounded-md bg-white/5 ring-1 ring-inset ring-white/10 flex items-center justify-center transition-transform duration-200 group-hover:scale-110 ${accentClass}`}>{icon}</span>
        <p className="text-sm text-github-text tracking-wide">{label}</p>
      </div>
      <p ref={numRef} className="text-3xl font-extrabold text-white drop-shadow-[0_1px_0_rgba(255,255,255,0.04)]">0</p>

      {sparkline.length > 0 && (
        <svg width={120} height={28} className="mt-2 block opacity-80">
          <defs>
            <linearGradient id="sparkGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={sparklineColor} stopOpacity="0.2" />
              <stop offset="100%" stopColor={sparklineColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <path d={path} fill="none" stroke={sparklineColor} strokeWidth={1.6} strokeLinecap="round" />
        </svg>
      )}
    </div>
  );
}

