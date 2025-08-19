import React from 'react';
import type { Skill } from '../../../../../types/skills';

export interface SkillModalProps {
  skill: Skill;
  open: boolean;
  onClose: () => void;
}

const SkillModal: React.FC<SkillModalProps> = ({ skill, open, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" role="dialog" aria-modal="true">
      <div className="bg-github-dark border border-github-border rounded-xl w-[90vw] max-w-lg p-5 text-white shadow-2xl">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">{skill.name}</h3>
          <button onClick={onClose} className="text-github-text hover:text-white" aria-label="Close modal">Close</button>
        </div>
        <div className="text-github-text text-sm mb-3">
          Category: <span className="text-white/90 capitalize">{skill.category}</span>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            Proficiency: <span className="text-white/90">{skill.proficiency}/10</span>
          </div>
          <div>
            Experience: <span className="text-white/90">{skill.experience}+ years</span>
          </div>
        </div>
        <p className="text-github-text mt-3">{skill.description}</p>
        {skill.projects?.length > 0 && (
          <div className="mt-4">
            <div className="text-white/90 font-medium mb-1">Key Projects</div>
            <ul className="list-disc list-inside text-github-text space-y-1 max-h-32 overflow-auto">
              {skill.projects.slice(0, 5).map((p, idx) => (
                <li key={idx}>{p}</li>
              ))}
            </ul>
          </div>
        )}
        {skill.strengths?.length > 0 && (
          <div className="mt-3">
            <div className="text-white/90 font-medium mb-1">Related Strengths</div>
            <div className="flex flex-wrap gap-2">
              {skill.strengths.slice(0, 6).map((s, idx) => (
                <span key={idx} className="px-2 py-1 rounded-full bg-white/5 ring-1 ring-inset ring-white/10 text-xs">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="mt-5 text-right">
          <button onClick={onClose} className="px-3 py-1.5 rounded-md bg-neon-green text-black hover:bg-neon-green/90">
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillModal;

