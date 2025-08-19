import { useCallback, useMemo, useState } from 'react';
import { getAllSkills, getSkillBySlugSync } from '../../../../../services/skillsDataService';
import type { Skill } from '../../../../../types/skills';
import { resolveKeyEntry } from '../constants/keyMap';

export interface HoverState {
  techLabel: string | null;
  skill: Skill | null;
  tooltip: { x: number; y: number } | null;
}

export interface ClickState {
  selectedTech: string | null;
  clickBadge: string | null;
  selectedSkillForModal: Skill | null;
  showModal: boolean;
}

export function useSkillInteractions(onSkillSelect?: (skill: Skill | null) => void) {
  const [hover, setHover] = useState<HoverState>({ techLabel: null, skill: null, tooltip: null });
  const [click, setClick] = useState<ClickState>({ selectedTech: null, clickBadge: null, selectedSkillForModal: null, showModal: false });

  // Warm skills cache
  useMemo(() => { getAllSkills().catch(() => {}); }, []);

  const handlePointerMove = useCallback((clientX: number, clientY: number) => {
    setHover((h) => ({ ...h, tooltip: { x: clientX + 12, y: clientY + 12 } }));
  }, []);

  const handlePointerOver = useCallback((rawName: string) => {
    const entry = resolveKeyEntry(rawName);
    if (!entry) {
      if (process.env.NODE_ENV !== 'production') {
        console.debug('[Skills] Unmapped Spline object on hover:', rawName);
      }
      setHover({ techLabel: null, skill: null, tooltip: null });
      return;
    }
    const skill = getSkillBySlugSync(entry.slug) || null;
    setHover({ techLabel: entry.label, skill, tooltip: null });
  }, []);

  const handlePointerOut = useCallback(() => {
    setHover({ techLabel: null, skill: null, tooltip: null });
  }, []);

  const handleClick = useCallback((rawName: string) => {
    const entry = resolveKeyEntry(rawName);
    if (!entry) {
      if (process.env.NODE_ENV !== 'production') {
        console.debug('[Skills] Unmapped Spline object on click:', rawName);
      }
      return;
    }
    const skill = getSkillBySlugSync(entry.slug) || null;
    if (skill) onSkillSelect?.(skill);
    setClick({
      selectedTech: entry.label,
      clickBadge: entry.label.toUpperCase(),
      selectedSkillForModal: skill,
      showModal: !!skill,
    });
    window.setTimeout(() => setClick((c) => ({ ...c, clickBadge: null })), 1200);
  }, [onSkillSelect]);

  // Allow selecting skills directly from 2D grid fallback
  const selectSkillDirect = useCallback((skill: Skill) => {
    onSkillSelect?.(skill);
    setClick({
      selectedTech: skill.name,
      clickBadge: skill.name.toUpperCase(),
      selectedSkillForModal: skill,
      showModal: true,
    });
    window.setTimeout(() => setClick((c) => ({ ...c, clickBadge: null })), 1200);
  }, [onSkillSelect]);

  const closeModal = useCallback(() => setClick((c) => ({ ...c, showModal: false })), []);

  return { hover, click, handlePointerMove, handlePointerOver, handlePointerOut, handleClick, selectSkillDirect, closeModal } as const;
}

