
'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Skill } from '../../../../types/skills';
import LoadingScreen from './LoadingScreen';
import { RefreshCw, Maximize2 } from 'lucide-react';
import { getSkillByIdSync } from '../../../../services/skillsDataService';

// Allow TSX for the Spline web component without type errors (kept for fallback)
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'spline-viewer': any;
    }
  }
}

interface SplineKeyboardProps {
  onSkillSelect?: (skill: Skill | null) => void;
}

const SplineKeyboard: React.FC<SplineKeyboardProps> = ({ onSkillSelect }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summaryVisible, setSummaryVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{x:number;y:number}>({x:0,y:0});
  const [useR3FFallback, setUseR3FFallback] = useState(false);
  const loadWatchRef = useRef<number | null>(null);

  // Unified mapping of Spline object names to skill ids and labels
  const KEY_MAP: Record<string, { id: string; label: string }> = {
    javascript_key: { id: 'javascript', label: 'JavaScript' },
    typescript_key: { id: 'typescript', label: 'TypeScript' },
    html_key: { id: 'html', label: 'HTML' },
    css_key: { id: 'css', label: 'CSS' },
    react_key: { id: 'react', label: 'React' },
    vue_key: { id: 'vue', label: 'Vue.js' },
    nextjs_key: { id: 'nextjs', label: 'Next.js' },
    tailwind_key: { id: 'tailwindcss', label: 'Tailwind CSS' },
    nodejs_key: { id: 'nodejs', label: 'Node.js' },
    express_key: { id: 'express', label: 'Express.js' },
    postgres_key: { id: 'postgresql', label: 'PostgreSQL' },
    mongodb_key: { id: 'mongodb', label: 'MongoDB' },
    git_key: { id: 'git', label: 'Git' },
    github_key: { id: 'github', label: 'GitHub' },
    code_key: { id: 'code', label: 'Code' },
    mui_key: { id: 'mui', label: 'MUI' },
    supabase_key: { id: 'supabase', label: 'Supabase' },
    wordpress_key: { id: 'wordpress', label: 'WordPress' },
    linux_key: { id: 'linux', label: 'Linux' },
    docker_key: { id: 'docker', label: 'Docker' },
    nginx_key: { id: 'nginx', label: 'Nginx' },
    aws_key: { id: 'aws', label: 'AWS' },
    tensorflow_key: { id: 'tensorflow', label: 'TensorFlow' },
    vercel_key: { id: 'vercel', label: 'Vercel' },
  };

  // Load Spline web component script if not present
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hasViewer = !!customElements.get('spline-viewer');
    if (hasViewer) return;
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@splinetool/viewer@latest/build/spline-viewer.js';
    script.async = true;
    script.onload = () => {
      // Component ready; it will upgrade automatically
    };
    script.onerror = () => setError('Failed to load Spline viewer');
    document.head.appendChild(script);
    return () => {
      // do not remove script to avoid reloading multiple times
    };
  }, []);

  // Attach event listeners for load/error and clicks, and set a watchdog to fallback to R3F if stuck
  useEffect(() => {
    const el = viewerRef.current as HTMLElement | null;
    if (!el) return;

    const onLoad = () => {
      setLoading(false);
      setSummaryVisible(true);
      if (loadWatchRef.current) { window.clearTimeout(loadWatchRef.current); loadWatchRef.current = null; }
    };
    const onError = () => {
      setError('Failed to load 3D keyboard');
      setLoading(false);
      if (loadWatchRef.current) { window.clearTimeout(loadWatchRef.current); loadWatchRef.current = null; }
    };
    const onClick = (e: any) => {
      const name = (e?.detail?.target?.name || e?.target?.name || e?.detail?.name || '').toLowerCase();
      if (!name) return;
      const entry = KEY_MAP[name];
      if (!entry) return;
      try {
        const skill = getSkillByIdSync?.(entry.id);
        if (skill) onSkillSelect?.(skill);
        setSelectedTech(entry.label);
        setPulse(true); setTimeout(()=>setPulse(false), 250);
        setClickBadge(entry.label.toUpperCase()); setTimeout(()=>setClickBadge(null), 1200);
      } catch {}
    };

    ;['load','ready'].forEach((evt)=> el.addEventListener(evt as any, onLoad as any));
    el.addEventListener('error', onError as any);
    el.addEventListener('click', onClick as any);
    el.addEventListener('pointerdown', onClick as any);

    // Watchdog: if not loaded in 8s, fallback to R3F keyboard
    if (!loadWatchRef.current) {
      loadWatchRef.current = window.setTimeout(() => {
        setUseR3FFallback(true);
        setLoading(false);
      }, 8000);
    }

    return () => {
      ;['load','ready'].forEach((evt)=> el.removeEventListener(evt as any, onLoad as any));
      el.removeEventListener('error', onError as any);
      el.removeEventListener('click', onClick as any);
      el.removeEventListener('pointerdown', onClick as any);
      if (loadWatchRef.current) { window.clearTimeout(loadWatchRef.current); loadWatchRef.current = null; }
    };
  }, [onSkillSelect, reloadKey]);

  const handleRefresh = useCallback(() => {
    setLoading(true);
    setError(null);
    setReloadKey(k => k + 1);
  }, []);

  const handleFullscreen = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen().catch(() => {});
  }, []);

  if (error) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-github-dark/50 rounded-lg">
        <div className="text-center p-6">
          <p className="text-red-400 mb-4">Error: {error}</p>
          <button
            onClick={() => {
              setError(null);
              setLoading(true);
              handleRefresh();
            }}
            className="px-4 py-2 bg-github-light/30 text-neon-green rounded-md hover:bg-github-light/50 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Use the bundled Spline scene from /public
  const localUrl = '/scene.splinecode';
  const [legendOpen, setLegendOpen] = useState(true);
  const [clickBadge, setClickBadge] = useState<string | null>(null);
  const [pulse, setPulse] = useState(false);

  return (
    <div ref={containerRef} className={`relative w-full h-[600px] overflow-hidden rounded-2xl border ${pulse ? 'ring-2 ring-neon-green/50' : 'border-white/10'} bg-github-card/30 transition-all`}>
      {/* Fallback visual if Spline viewer fails to load in time */}
      {useR3FFallback && (
        <div className="absolute inset-0 z-0 flex items-center justify-center bg-github-dark/60">
          <div className="text-center">
            <img src="/image.png" alt="Keyboard preview" className="mx-auto mb-3 max-w-xs opacity-80" />
            <p className="text-white/90 font-medium">Interactive 3D temporarily unavailable</p>
            <p className="text-github-text text-sm">Try Reload or use a WebGL-enabled browser.</p>
          </div>
        </div>
      )}
      {/* Controls */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
        <button onClick={handleRefresh} className="p-2 rounded-md bg-white/5 ring-1 ring-inset ring-white/10 text-white hover:bg-white/10" title="Reload">
          <RefreshCw size={16} />
        </button>
        <button onClick={handleFullscreen} className="p-2 rounded-md bg-white/5 ring-1 ring-inset ring-white/10 text-white hover:bg-white/10" title="Fullscreen">
          <Maximize2 size={16} />
        </button>
      </div>

      {/* Selected pill */}
      {selectedTech && (
        <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full bg-neon-green/20 text-neon-green border border-neon-green/40 text-xs">
          Selected: {selectedTech}
        </div>
      )}

      {/* Legend toggle */}
      <div className="absolute top-3 left-3 z-10" style={{ left: selectedTech ? 'auto' : undefined, right: selectedTech ? 'auto' : undefined }}>
        <button onClick={() => setLegendOpen(v=>!v)} className="px-2 py-1 text-xs rounded-md bg-white/5 ring-1 ring-inset ring-white/10 text-white hover:bg-white/10">{legendOpen ? 'Hide Legend' : 'Show Legend'}</button>
      </div>

      {legendOpen && (
        <div className="absolute bottom-4 right-4 z-10 bg-github-dark/90 border border-github-border rounded-lg p-3 text-xs text-white space-y-1 w-48">
          <div className="font-semibold text-neon-green mb-1">Key → Tech</div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-github-text">
            <span>React</span><span className="text-white/90">react_key</span>
            <span>TypeScript</span><span className="text-white/90">typescript_key</span>
            <span>Next.js</span><span className="text-white/90">nextjs_key</span>
            <span>Node.js</span><span className="text-white/90">nodejs_key</span>
            <span>Python</span><span className="text-white/90">python_key</span>
            <span>JavaScript</span><span className="text-white/90">javascript_key</span>
            <span>HTML</span><span className="text-white/90">html_key</span>
            <span>CSS</span><span className="text-white/90">css_key</span>
            <span>Git</span><span className="text-white/90">git_key</span>
            <span>Docker</span><span className="text-white/90">docker_key</span>
          </div>
        </div>
      )}

      {loading && <LoadingScreen />}

      <div className="w-full h-full cursor-grab active:cursor-grabbing">
        {/* Spline web component viewer */}
        <spline-viewer
          key={reloadKey}
          ref={viewerRef}
          url={localUrl}
          style={{ width: '100%', height: '100%', display: 'block' }}
          onPointerMove={(e: any) => {
            // Update tooltip position with some offset
            setTooltipPos({ x: e.clientX + 12, y: e.clientY + 12 });
          }}
          onPointerOver={(e: any) => {
            const name = (e?.detail?.target?.name || e?.target?.name || e?.detail?.name || '').toLowerCase();
            setHoveredTech(KEY_MAP[name]?.label || null);
          }}
          onPointerOut={() => setHoveredTech(null)}
          onClick={(e: any) => {
            const name = (e?.detail?.target?.name || e?.target?.name || e?.detail?.name || '').toLowerCase();
            if (!name) return;
            const entry = KEY_MAP[name];
            if (entry) {
              setSelectedTech(entry.label);
              setPulse(true); setTimeout(()=>setPulse(false), 250);
              setClickBadge(entry.label.toUpperCase()); setTimeout(()=>setClickBadge(null), 1200);
              try { const skill = getSkillByIdSync?.(entry.id); if (skill) onSkillSelect?.(skill); } catch {}
            }
          }}
        />
      </div>
      {/* Hover tooltip */}
      {hoveredTech && (
        <div className="pointer-events-none fixed z-50 bg-github-dark/90 text-white border border-github-border rounded-md px-2 py-1 text-xs shadow-lg" style={{ left: tooltipPos.x, top: tooltipPos.y }}>
          {hoveredTech}
        </div>
      )}


      {/* Click badge */}
      {clickBadge && (
        <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 bg-neon-green/20 text-neon-green border border-neon-green/40 rounded-full px-3 py-1 text-xs shadow-lg">
          {clickBadge}
        </div>
      )}

      {summaryVisible && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-github-dark/95 border border-github-border rounded-lg p-4 max-w-md shadow-xl">
          <h3 className="text-white font-semibold mb-2">Interactive Skills Keyboard</h3>
          <p className="text-github-text text-sm">
            Explore my skills in 3D. Drag to orbit, scroll to zoom. Click highlighted keys to learn more.
          </p>
          <div className="mt-3 text-right">
            <button onClick={() => setSummaryVisible(false)} className="text-neon-green text-sm hover:underline">Got it</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SplineKeyboard;
