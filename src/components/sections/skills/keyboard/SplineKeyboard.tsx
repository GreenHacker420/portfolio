
'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Skill } from '../../../../types/skills';
import LoadingScreen from './LoadingScreen';
import { RefreshCw, Maximize2 } from 'lucide-react';

interface SplineKeyboardProps {
  onSkillSelect?: (skill: Skill | null) => void;
}

const SplineKeyboard: React.FC<SplineKeyboardProps> = ({ onSkillSelect }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summaryVisible, setSummaryVisible] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [frameKey, setFrameKey] = useState(0);

  const handleFrameLoad = useCallback(() => {
    setLoading(false);
    setSummaryVisible(true); // auto show summary first time load
  }, []);

  const handleRefresh = useCallback(() => {
    setLoading(true);
    setFrameKey(k => k + 1);
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
            }}
            className="px-4 py-2 bg-github-light/30 text-neon-green rounded-md hover:bg-github-light/50 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const embedUrl = process.env.NEXT_PUBLIC_SPLINE_EMBED_URL || 'https://my.spline.design/bnffrvbtbhvfsiow/';
  return (
    <div ref={containerRef} className="relative w-full h-[600px] overflow-hidden rounded-2xl border border-white/10 bg-github-card/30">
      {/* Controls */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
        <button onClick={handleRefresh} className="p-2 rounded-md bg-white/5 ring-1 ring-inset ring-white/10 text-white hover:bg-white/10">
          <RefreshCw size={16} />
        </button>
        <button onClick={handleFullscreen} className="p-2 rounded-md bg-white/5 ring-1 ring-inset ring-white/10 text-white hover:bg-white/10">
          <Maximize2 size={16} />
        </button>
      </div>

      {loading && <LoadingScreen />}

      <div className="w-full h-full cursor-grab active:cursor-grabbing">
        <iframe
          key={frameKey}
          ref={iframeRef}
          src={embedUrl}
          title="3D Keyboard"
          className="w-full h-full"
          style={{ border: 'none' }}
          onLoad={handleFrameLoad}
        />
      </div>

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
