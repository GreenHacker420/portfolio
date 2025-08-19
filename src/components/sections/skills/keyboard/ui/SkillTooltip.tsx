import React, { useMemo } from 'react';
import type { Skill } from '../../../../../types/skills';

export interface SkillTooltipProps {
  label: string;
  skill?: Skill | null;
  x: number;
  y: number;
}

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

const SkillTooltip: React.FC<SkillTooltipProps> = ({ label, skill, x, y }) => {
  const [left, top] = useMemo(() => {
    if (typeof window === 'undefined') return [x, y];
    const pad = 12;
    const maxW = 260; // approximate tooltip width
    const maxH = 140; // approximate tooltip height
    const lx = clamp(x, pad, window.innerWidth - maxW - pad);
    const ly = clamp(y, pad, window.innerHeight - maxH - pad);
    return [lx, ly];
  }, [x, y]);

  const level100 = skill ? (skill.level ?? skill.proficiency ?? 0) : 0;
  const desc = skill?.description ? String(skill.description) : '';

  return (
    <div
      className="pointer-events-none fixed z-[60] bg-github-dark/95 text-white border border-github-border rounded-md px-3 py-2 text-xs shadow-xl max-w-[260px]"
      style={{ left, top }}
      role="tooltip"
      aria-label={`Details for ${label}`}
    >
      <div className="font-semibold text-neon-green">{label}</div>
      {skill && (
        <div className="mt-1 text-github-text space-y-1">
          <div>
            Proficiency: <span className="text-white/90">{Math.round(level100)}/100</span>
          </div>
          {desc && (
            <div className="line-clamp-3">{desc}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SkillTooltip;

