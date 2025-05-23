
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Skill, getSkillById } from '../../../data/skillsData';
import { getKeyByIdFixed } from '../../../data/keyboardData';
import { motion } from 'framer-motion';
import SkillCard from './keyboard/SkillCard';
import KeyboardScene from './keyboard/KeyboardScene';
import { defaultTheme } from './keyboard/KeyboardThemes';
import useDevicePerformance from '../../../hooks/useDevicePerformance';
import useKeyboardControls from '../../../hooks/useKeyboardControls';

// Main KeyboardSkills Component
interface KeyboardSkillsProps {
  onSkillSelect?: (skill: Skill | null) => void;
}

const KeyboardSkills: React.FC<KeyboardSkillsProps> = ({ onSkillSelect }) => {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [showSkillInfo, setShowSkillInfo] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use device performance detection hook
  const performanceMode = useDevicePerformance();

  // Handle key selection
  const handleSelectKey = useCallback((key: string) => {
    try {
      // Find the key data
      const keyData = getKeyByIdFixed(key);
      
      if (keyData) {
        // Set the selected key
        setSelectedKey(prev => prev === key ? null : key);
        
        // Only show skill info if it's a skill key
        const hasSkill = keyData && keyData.skillId;
        setShowSkillInfo(Boolean(hasSkill));
      } else {
        console.warn(`Key not found: ${key}`);
      }
    } catch (err) {
      console.error("Error selecting key:", err);
      setError("Failed to select key.");
    }
  }, []);

  // Handle closing the skill card
  const handleCloseSkillCard = useCallback(() => {
    setShowSkillInfo(false);
    setSelectedKey(null);
  }, []);

  // Use keyboard controls hook
  const { error: keyboardError } = useKeyboardControls({
    onKeyPress: handleSelectKey,
    onEscape: handleCloseSkillCard,
    showSkillInfo,
    soundType: defaultTheme.soundType
  });

  // Update error state if keyboard hook reports an error
  useEffect(() => {
    if (keyboardError) {
      setError(keyboardError);
    }
  }, [keyboardError]);

  // Get selected skill data
  const selectedSkill = useMemo(() => {
    if (!selectedKey) return null;

    // Find the key in the keyboard layout
    const keyData = getKeyByIdFixed(selectedKey);
    if (!keyData || !keyData.skillId) return null;

    return getSkillById(keyData.skillId) || null;
  }, [selectedKey]);

  // Effect to notify parent component when skill changes
  useEffect(() => {
    if (onSkillSelect) {
      onSkillSelect(selectedSkill);
    }
  }, [selectedSkill, onSkillSelect]);

  // Error state display
  if (error) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-github-dark/50 rounded-lg">
        <div className="text-center p-6">
          <p className="text-red-400 mb-2">Error: {error}</p>
          <button 
            onClick={() => setError(null)} 
            className="px-4 py-2 bg-github-light/30 text-neon-green rounded-md hover:bg-github-light/50 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[600px] flex flex-col items-center justify-center">
      {/* 3D Canvas */}
      <div className="w-full h-full">
        <KeyboardScene
          onSelectKey={handleSelectKey}
          selectedKey={selectedKey}
          theme={defaultTheme}
          performanceMode={performanceMode}
        />
      </div>

      {/* Skill information card - positioned outside the Canvas for better visibility */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="pointer-events-auto">
          <SkillCard
            skill={selectedSkill}
            isVisible={showSkillInfo && !!selectedSkill}
            onClose={handleCloseSkillCard}
          />
        </div>
      </div>

      {/* Hint text */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-github-text text-sm">
        Press a key to explore my skills
      </div>
    </div>
  );
};

export default KeyboardSkills;
