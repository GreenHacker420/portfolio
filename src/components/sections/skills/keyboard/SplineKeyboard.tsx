
'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Spline from '@splinetool/react-spline';
import type { Skill } from '../../../../types/skills';
import LoadingScreen from './LoadingScreen';
import Controls from './ui/Controls';
// import Legend from './ui/Legend';
import InfoSummary from './ui/InfoSummary';
import SkillTooltip from './ui/SkillTooltip';
import SkillModal from './ui/SkillModal';
import { useHaptics } from './hooks/useHaptics';
import { useSkillInteractions } from './hooks/useSkillInteractions';

export interface SplineKeyboardProps {
  onSkillSelect?: (skill: Skill | null) => void;
}

const SplineKeyboard: React.FC<SplineKeyboardProps> = ({ onSkillSelect }) => {
  // Loading state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Interaction & haptics
  const { hover, click, handlePointerMove, handlePointerOver, handlePointerOut, handleClick, closeModal } = useSkillInteractions(onSkillSelect);
  const { enabled: hapticsEnabled, setEnabled: setHapticsEnabled, vibrate } = useHaptics();

  // UI state
  const [reloadKey, setReloadKey] = useState(0);
  const [legendOpen, setLegendOpen] = useState(true);
  const [summaryVisible, setSummaryVisible] = useState(true);
  const [pulse, setPulse] = useState(false);
  const viewerRef = useRef<any>(null);

  // Spline React component handles loading automatically

  // Spline event handlers
  const onSplineLoad = useCallback((spline: any) => {
    console.log('Spline scene loaded successfully');
    viewerRef.current = spline;
    setLoading(false);
    setSummaryVisible(true);
  }, []);

  const onSplineError = useCallback((error: any) => {
    console.error('Spline scene failed to load:', error);
    setError('Failed to load 3D keyboard');
    setLoading(false);
  }, []);

  const onSplineClick = useCallback((e: any) => {
    const name = (e?.target?.name || '').toLowerCase();
    if (!name) return;
    console.log('Spline object clicked:', name);
    setPulse(true);
    setTimeout(() => setPulse(false), 250);
    handleClick(name);
    vibrate([20, 30]);
  }, [handleClick, vibrate]);

  const onSplinePointerOver = useCallback((e: any) => {
    const name = (e?.target?.name || '').toLowerCase();
    if (!name) return;
    // Update both hovered key and tooltip position immediately
    handlePointerOver(name);
    if (typeof e?.clientX === 'number' && typeof e?.clientY === 'number') {
      handlePointerMove(e.clientX, e.clientY);
    }
    vibrate([10]);
  }, [handlePointerOver, handlePointerMove, vibrate]);

  const onSplinePointerOut = useCallback(() => {
    handlePointerOut();
  }, [handlePointerOut]);

  const handleRefresh = useCallback(() => {
    setLoading(true);
    setError(null);
    setReloadKey((k) => k + 1);
  }, []);

  const handleFullscreen = useCallback(() => {
    const container = document.getElementById('skills');
    if (!container) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else container.requestFullscreen().catch(() => {});
  }, []);

  // Use local scene file from public folder
  const localUrl = '/scene.splinecode';

  if (error) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-github-dark/50">
        <div className="text-center p-6">
          <p className="text-red-400 mb-4">Error: {error}</p>
          <button onClick={handleRefresh} className="px-4 py-2 bg-github-light/30 text-neon-green rounded-md hover:bg-github-light/50 transition-colors">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full min-h-screen overflow-hidden ${pulse ? 'ring-2 ring-neon-green/50' : ''} transition-all`}>
      <Controls onRefresh={handleRefresh} onFullscreen={handleFullscreen} />

      {/* Single loading screen - only show when actually loading */}
      {loading && <LoadingScreen />}

      {/* Selected pill + haptics - positioned below title */}
      <div className="absolute top-20 left-4 z-10 flex items-center gap-2">
        {click.selectedTech && (
          <div className="px-3 py-1 rounded-full bg-neon-green/20 text-neon-green border border-neon-green/40 text-xs">Selected: {click.selectedTech}</div>
        )}
        <label className="flex items-center gap-2 text-xs text-white/80 bg-white/5 ring-1 ring-inset ring-white/10 px-2 py-1 rounded-md">
          <input type="checkbox" checked={hapticsEnabled} onChange={(e) => setHapticsEnabled(e.target.checked)} />
          Haptics
        </label>
      </div>

      {/* <Legend open={legendOpen} onToggle={() => setLegendOpen((v) => !v)} /> */}

      <div className="w-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div
          className="skills-spline-wrapper cursor-grab active:cursor-grabbing"
          aria-label="Interactive 3D keyboard"
          onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
        >
          <Spline
            key={reloadKey}
            scene={localUrl}
            onLoad={onSplineLoad}
            onError={onSplineError}
            onClick={onSplineClick}
            onPointerOver={onSplinePointerOver}
            onPointerOut={onSplinePointerOut}
            className="skills-spline-canvas"
          />
        </div>
      </div>

      {/* Tooltip */}
      {hover.techLabel && hover.tooltip && (
        <SkillTooltip label={hover.techLabel} skill={hover.skill} x={hover.tooltip.x} y={hover.tooltip.y} />
      )}

      {/* Click badge */}
      {click.clickBadge && (
        <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 bg-neon-green/20 text-neon-green border border-neon-green/40 rounded-full px-3 py-1 text-xs shadow-lg">
          {click.clickBadge}
        </div>
      )}

      {/* Modal */}
      {click.selectedSkillForModal && (
        <SkillModal skill={click.selectedSkillForModal} open={click.showModal} onClose={closeModal} />
      )}

      <InfoSummary open={summaryVisible} onClose={() => setSummaryVisible(false)} />
    </div>
  );
};

export default SplineKeyboard;
