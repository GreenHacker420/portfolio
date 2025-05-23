
import React from 'react';
import { calculateKeyColor } from '../../../../utils/keyboardUtils';
import { KeyboardTheme } from './KeyboardThemes';
import { KeyboardKey } from '../../../../data/keyboardData';
import { getSkillById } from '../../../../data/skillsData';
import KeyCap from '../KeyCap';

interface KeyProps {
  keyData: KeyboardKey;
  isPressed: boolean;
  onClick: () => void;
  theme: KeyboardTheme;
  performanceMode: boolean;
}

/**
 * Individual key component for the keyboard
 */
const Key = ({ keyData, isPressed, onClick, theme, performanceMode }: KeyProps) => {
  // Find skill data if this is a skill key
  const skillData = keyData.skillId ? getSkillById(keyData.skillId) : undefined;
  
  // Calculate RGB color
  const time = new Date().getTime() / 1000;
  const [x, y] = [keyData.physical.position[0], keyData.physical.position[1]];
  const rgbColor = calculateKeyColor(
    {
      accentColor: theme.accentColor,
      baseColor: theme.baseColor,
      keyColors: 'rainbow',
      animation: 'wave',
      intensity: 0.8,
      speed: 1.0
    },
    x, y, time, isPressed, Boolean(skillData)
  );

  return (
    <KeyCap
      keyData={keyData}
      skill={skillData}
      isPressed={isPressed}
      onClick={onClick}
      rgbColor={rgbColor}
      keySound={undefined}
    />
  );
};

export default Key;
