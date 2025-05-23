
import { useState, useCallback, useEffect } from 'react';
import { KEYBOARD_LAYOUT } from '../data/keyboardData';
import { playKeySound, initAudio } from '../utils/soundUtils';

interface KeyboardControlsProps {
  onKeyPress: (keyId: string) => void;
  onEscape: () => void;
  showSkillInfo: boolean;
  soundType: 'blue' | 'brown' | 'red' | 'silent';
}

/**
 * Custom hook to handle keyboard controls
 */
export const useKeyboardControls = ({
  onKeyPress,
  onEscape,
  showSkillInfo,
  soundType
}: KeyboardControlsProps) => {
  const [lastPressed, setLastPressed] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      try {
        // Map keyboard keys to skill keys
        const key = e.key.toLowerCase();

        // Check for escape key to close skill info
        if (e.key === 'Escape' && showSkillInfo) {
          onEscape();
          return;
        }

        // Find matching key in layout
        const flatLayout = KEYBOARD_LAYOUT.flat();
        const matchingKey = flatLayout.find(k =>
          k.label.toLowerCase() === key ||
          k.id.toLowerCase() === key
        );

        if (matchingKey) {
          onKeyPress(matchingKey.id);
          setLastPressed(Date.now());
          
          // Initialize audio and play sound
          initAudio();
          playKeySound(soundType);
        }
      } catch (err) {
        console.error("Error processing key press:", err);
        setError("Failed to process key press.");
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [onKeyPress, onEscape, showSkillInfo, soundType]);

  return { lastPressed, error, setError };
};

export default useKeyboardControls;
