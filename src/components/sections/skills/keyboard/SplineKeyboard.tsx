
'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Skill } from '../../../../types/skills';
import LoadingScreen from './LoadingScreen';
import { RefreshCw, Maximize2 } from 'lucide-react';
import { getSkillByIdSync } from '../../../../services/skillsDataService';
import KeyboardSkills from '../KeyboardSkills';

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

  // Attach event listeners for load/error and clicks
  useEffect(() => {
    const el = viewerRef.current as HTMLElement | null;
    if (!el) return;

    const onLoad = () => {
      setLoading(false);
      setSummaryVisible(true);
    };
    const onError = () => {
      setError('Failed to load 3D keyboard');
      setLoading(false);
    };
    const onClick = (e: any) => {
      const name = (e?.detail?.target?.name || e?.target?.name || e?.detail?.name || '').toLowerCase();
      if (!name) return;
      const mapping: Record<string, string> = {
        javascript_key: 'javascript',   // JS
        typescript_key: 'typescript',   // TS
        html_key: 'html',               // HTML5
        css_key: 'css',                 // CSS3
        react_key: 'react',             // React
        vue_key: 'vue',                 // Vue.js
        nextjs_key: 'nextjs',           // Next.js
        tailwind_key: 'tailwindcss',    // Tailwind CSS
        nodejs_key: 'nodejs',           // Node.js
        express_key: 'express',         // Express.js
        postgres_key: 'postgresql',     // PostgreSQL
        mongodb_key: 'mongodb',         // MongoDB
        git_key: 'git',                 // Git
        github_key: 'github',           // GitHub
        code_key: 'code',               // Generic "code" symbol
        mui_key: 'mui',                 // MUI (Material UI)
        supabase_key: 'supabase',       // Supabase
        wordpress_key: 'wordpress',     // WordPress
        linux_key: 'linux',             // Linux (Tux)
        docker_key: 'docker',           // Docker
        nginx_key: 'nginx',             // Nginx
        aws_key: 'aws',                 // Amazon Web Services
        tensorflow_key: 'tensorflow',   // TensorFlow
        vercel_key: 'vercel',           // Vercel
      };
      const skillId = mapping[name];
      if (!skillId) return;
      const skill = getSkillByIdSync ? getSkillByIdSync(skillId) : null;
      if (skill && onSkillSelect) onSkillSelect(skill);
    };

    ;['load','ready'].forEach((evt)=> el.addEventListener(evt as any, onLoad as any));
    el.addEventListener('error', onError as any);
    el.addEventListener('click', onClick as any);
    el.addEventListener('pointerdown', onClick as any);

    return () => {
      ;['load','ready'].forEach((evt)=> el.removeEventListener(evt as any, onLoad as any));
      el.removeEventListener('error', onError as any);
      el.removeEventListener('click', onClick as any);
      el.removeEventListener('pointerdown', onClick as any);
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

  // Prefer keyboard.splinecode if present; fall back to scene.splinecode
  const localUrl = typeof window !== 'undefined' && document?.location ?
    (document.location.origin + (document.querySelector('link[href$="keyboard.splinecode"]') ? '/keyboard.splinecode' : '/scene.splinecode')) :
    '/keyboard.splinecode';
  const [legendOpen, setLegendOpen] = useState(true);
  const [clickBadge, setClickBadge] = useState<string | null>(null);
  const [pulse, setPulse] = useState(false);

  return (
    <div ref={containerRef} className={`relative w-full h-[600px] overflow-hidden rounded-2xl border ${pulse ? 'ring-2 ring-neon-green/50' : 'border-white/10'} bg-github-card/30 transition-all`}>
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
            const mapping: Record<string, string> = { react_key:'React', typescript_key:'TypeScript', nextjs_key:'Next.js', nodejs_key:'Node.js', python_key:'Python', javascript_key:'JavaScript', html_key:'HTML', css_key:'CSS', git_key:'Git', docker_key:'Docker' };
            setHoveredTech(mapping[name] || null);
          }}
          onPointerOut={() => setHoveredTech(null)}
          onClick={(e: any) => {
            const name = (e?.detail?.target?.name || e?.target?.name || e?.detail?.name || '').toLowerCase();
            if (!name) return;
            const mappingRaw: Record<string, string> = { react_key:'react', typescript_key:'typescript', nextjs_key:'nextjs', nodejs_key:'nodejs', python_key:'python', javascript_key:'javascript', html_key:'html', css_key:'css', git_key:'git', docker_key:'docker' };
            const mappingLabel: Record<string, string> = { react_key:'React', typescript_key:'TypeScript', nextjs_key:'Next.js', nodejs_key:'Node.js', python_key:'Python', javascript_key:'JavaScript', html_key:'HTML', css_key:'CSS', git_key:'Git', docker_key:'Docker' };
            const id = mappingRaw[name];
            if (id) {
              setSelectedTech(mappingLabel[name] || id);
              setPulse(true); setTimeout(()=>setPulse(false), 250);
              setClickBadge((mappingLabel[name] || id).toUpperCase()); setTimeout(()=>setClickBadge(null), 1200);
              try { const skill = getSkillByIdSync?.(id); if (skill) onSkillSelect?.(skill); } catch {}
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
