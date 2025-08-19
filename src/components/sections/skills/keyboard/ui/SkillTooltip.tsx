import React from 'react';
import type { Skill } from '../../../../../types/skills';

export interface SkillTooltipProps {
  label: string;
  skill?: Skill | null;
  x: number;
  y: number;
}

const SkillTooltip: React.FC<SkillTooltipProps> = ({ label, skill, x, y }) => {
  return (
    <div
      className="pointer-events-none fixed z-50 bg-github-dark/95 text-white border border-github-border rounded-md px-3 py-2 text-xs shadow-xl"
      style={{ left: x, top: y }}
      role="tooltip"
      aria-label={`Details for ${label}`}
    >
      <div className="font-semibold text-neon-green">{label}</div>
      {skill && (
        <div className="mt-1 text-github-text space-y-1">
          <div>
            Proficiency: <span className="text-white/90">{skill.proficiency}/10</span>
          </div>
          <div className="line-clamp-2 max-w-[240px]">{skill.description}</div>
        </div>
      )}
    </div>
  );
};

export default SkillTooltip;

