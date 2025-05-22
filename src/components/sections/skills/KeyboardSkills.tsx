
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Html,
} from '@react-three/drei';
import { Suspense } from 'react';
import { skills, skillsMap, getSkillById, Skill } from '../../../data/skillsData';
import { KEYBOARD_LAYOUT, getKeyByIdFixed } from '../../../data/keyboardData';
import { playKeySound, initAudio } from '../../../utils/soundUtils';
import { calculateKeyColor } from '../../../utils/keyboardUtils';
import { motion, AnimatePresence } from 'framer-motion';
import KeyboardBase from './KeyboardBase';
import KeyCap from './KeyCap';

// Define keyboard theme
interface KeyboardTheme {
  name: string;
  baseColor: string;
  keycapColor: string;
  textColor: string;
  accentColor: string;
  rgbLight: boolean;
  soundType: 'blue' | 'brown' | 'red' | 'silent';
}

// Loading screen component
const LoadingScreen = () => {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-neon-green border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-white text-lg">Loading Keyboard...</p>
      </div>
    </Html>
  );
};

// WebGL context recovery component
const WebGLContextRecovery = () => {
  const { gl } = useThree();

  useEffect(() => {
    const canvas = gl.domElement;
    const handleContextLoss = (event: Event) => {
      event.preventDefault();
      console.warn('WebGL context loss detected in recovery component');
    };
    canvas.addEventListener('webglcontextlost', handleContextLoss);
    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLoss);
    };
  }, [gl]);

  return null;
};

// Key component
interface KeyProps {
  keyData: any;
  isPressed: boolean;
  onClick: () => void;
  theme: KeyboardTheme;
  performanceMode: boolean;
}

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

// Keyboard component props
interface KeyboardProps {
  onSelectKey: (key: string) => void;
  selectedKey: string | null;
  theme: KeyboardTheme;
  performanceMode: boolean;
}

const Keyboard = ({ onSelectKey, selectedKey, theme, performanceMode }: KeyboardProps) => {
  const groupRef = useRef<THREE.Group>(null);

  // Calculate base size dynamically
  const getKeyboardDimensions = () => {
    let maxRowWidth = 0;
    KEYBOARD_LAYOUT.forEach(row => {
      const width = row.reduce((sum, key, idx) => {
        const keyWidth = (key.physical?.size?.[0] || 1);
        return sum + keyWidth + (idx < row.length - 1 ? 0.15 : 0);
      }, 0);
      if (width > maxRowWidth) maxRowWidth = width;
    });
    const totalRows = KEYBOARD_LAYOUT.length;
    const rowDepth = 1 + 0.15; // 1 unit depth per key, 0.15 spacing
    const totalDepth = totalRows * rowDepth - 0.15;
    return { baseWidth: maxRowWidth, baseDepth: totalDepth };
  };

  const { baseWidth, baseDepth } = getKeyboardDimensions();

  // Create keyboard layout with keys
  const keySpacing = 0.15;
  const keySize: [number, number, number] = [1, 0.35, 1];
  
  const keyboardLayout = KEYBOARD_LAYOUT.map((row, rowIndex) => {
    // Calculate row width
    const rowWidth = row.reduce((sum, key, idx) => {
      const width = (key.physical?.size?.[0] || 1) * keySize[0];
      return sum + width + (idx < row.length - 1 ? keySpacing : 0);
    }, 0);

    // Center row on X, position row on Z
    const rowZ = (rowIndex * (keySize[2] + keySpacing));

    return (
      <group key={`row-${rowIndex}`} position={[0, 0, rowZ]}>
        {row.map((key, keyIndex) => {
          // X position for each key
          let posX = 0;
          for (let i = 0; i < keyIndex; i++) {
            posX += ((row[i].physical?.size?.[0] || 1) * keySize[0]) + keySpacing;
          }
          const keyWidth = (key.physical?.size?.[0] || 1) * keySize[0];
          const finalX = posX + keyWidth / 2 - rowWidth / 2;

          return (
            <Key
              key={key.id}
              keyData={key}
              isPressed={selectedKey === key.id}
              onClick={() => onSelectKey(key.id)}
              theme={theme}
              performanceMode={performanceMode}
            />
          );
        })}
      </group>
    );
  });

  return (
    <group ref={groupRef} position={[0, 0.2, 0]} rotation={[-0.1, 0, 0]}>
      {/* Keyboard base */}
      <KeyboardBase
        width={baseWidth}
        height={2.5}
        depth={baseDepth}
        rgbGlow={[0.0, 0.8, 0.4]}
      />

      {/* Key layout - positioned on top of the base */}
      <group position={[0, 0.15, -2]}>
        {keyboardLayout}
      </group>
    </group>
  );
};

// Skill card component to display when a key is pressed
interface SkillCardProps {
  skill: Skill | null;
  isVisible: boolean;
  onClose: () => void;
}

const SkillCard = ({ skill, isVisible, onClose }: SkillCardProps) => {
  if (!skill) return null;

  // Calculate experience level text
  const getExperienceLevel = (years: number): string => {
    if (years < 1) return 'Beginner';
    if (years < 2) return 'Intermediate';
    if (years < 4) return 'Advanced';
    return 'Expert';
  };

  // Calculate proficiency color
  const getProficiencyColor = (proficiency: number): string => {
    if (proficiency < 60) return '#f97316'; // Orange
    if (proficiency < 80) return '#22c55e'; // Green
    return '#3b82f6'; // Blue
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
            duration: 0.4
          }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-github-dark/95 border border-github-border rounded-lg p-5 w-full max-w-md z-50 shadow-xl"
          style={{ backdropFilter: 'blur(12px)' }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-github-text hover:text-white transition-colors"
            aria-label="Close skill details"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          {/* Header with logo and name */}
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-16 h-16 rounded-lg flex items-center justify-center text-white text-2xl font-bold shadow-md"
              style={{ backgroundColor: skill.color }}
            >
              {skill.logo}
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-1">{skill.name}</h3>
              <div className="flex items-center gap-2">
                <span className="text-github-text font-medium">{getExperienceLevel(skill.experience)}</span>
                <span className="text-github-text text-sm">•</span>
                <span className="text-github-text">{skill.experience} years</span>
              </div>
            </div>
          </div>

          {/* Proficiency bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-white font-medium">Proficiency</span>
              <span className="text-white font-bold">{skill.proficiency}%</span>
            </div>
            <div className="h-3 bg-github-light/30 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${skill.proficiency}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ backgroundColor: getProficiencyColor(skill.proficiency) }}
              />
            </div>
          </div>

          {/* Description */}
          <p className="text-github-text mb-4 leading-relaxed">{skill.description}</p>

          {/* Projects */}
          {skill.projects && skill.projects.length > 0 && (
            <div className="mb-4">
              <h4 className="text-white font-medium mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                </svg>
                Projects
              </h4>
              <ul className="space-y-1 text-github-text">
                {skill.projects.map((project, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-xs mr-2 mt-1">•</span>
                    {project}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Key Strengths */}
          {skill.strengths && skill.strengths.length > 0 && (
            <div>
              <h4 className="text-white font-medium mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                  <path d="M2 17l10 5 10-5"></path>
                  <path d="M2 12l10 5 10-5"></path>
                </svg>
                Key Strengths
              </h4>
              <div className="flex flex-wrap gap-2">
                {skill.strengths.map((strength, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: `${skill.color}22`,
                      color: skill.color,
                      border: `1px solid ${skill.color}44`
                    }}
                  >
                    {strength}
                  </motion.span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Main KeyboardSkills Component
interface KeyboardSkillsProps {
  onSkillSelect?: (skill: Skill | null) => void;
}

const KeyboardSkills: React.FC<KeyboardSkillsProps> = ({ onSkillSelect }) => {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [lastPressed, setLastPressed] = useState<number>(0);
  
  // Default theme
  const currentTheme: KeyboardTheme = {
    name: 'Default',
    baseColor: '#111111', // Very dark gray, almost black for mechanical keyboard base
    keycapColor: '#222222', // Dark gray for non-skill keycaps
    textColor: '#ffffff',
    accentColor: '#00ff88', // Bright green accent for RGB effects
    rgbLight: true, // Enable RGB lighting effects
    soundType: 'blue', // Clicky blue switch sound
  };

  const [performanceMode, setPerformanceMode] = useState<boolean>(false);
  const [showSkillInfo, setShowSkillInfo] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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

  // Handle key selection
  const handleSelectKey = useCallback((key: string) => {
    try {
      // Find the key data
      const keyData = getKeyByIdFixed(key);
      
      if (keyData) {
        // Set the selected key
        setSelectedKey(prev => prev === key ? null : key);
        setLastPressed(Date.now());
        
        // Only show skill info if it's a skill key
        const hasSkill = keyData && keyData.skillId;
        setShowSkillInfo(Boolean(hasSkill));

        // Initialize audio and play sound
        initAudio();
        playKeySound(currentTheme.soundType);
      } else {
        console.warn(`Key not found: ${key}`);
      }
    } catch (err) {
      console.error("Error selecting key:", err);
      setError("Failed to select key.");
    }
  }, [currentTheme.soundType]);

  // Handle closing the skill card
  const handleCloseSkillCard = useCallback(() => {
    setShowSkillInfo(false);
    setSelectedKey(null);
  }, []);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      try {
        // Map keyboard keys to skill keys
        const key = e.key.toLowerCase();

        // Check for escape key to close skill info
        if (e.key === 'Escape' && showSkillInfo) {
          handleCloseSkillCard();
          return;
        }

        // Find matching key in layout
        const flatLayout = KEYBOARD_LAYOUT.flat();
        const matchingKey = flatLayout.find(k =>
          k.label.toLowerCase() === key ||
          k.id.toLowerCase() === key
        );

        if (matchingKey) {
          handleSelectKey(matchingKey.id);
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
  }, [handleSelectKey, showSkillInfo, handleCloseSkillCard]);

  // Toggle performance mode based on device capabilities
  useEffect(() => {
    // Check if device is likely to have performance issues
    const isLowPerfDevice =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      (window.innerWidth < 768);

    setPerformanceMode(isLowPerfDevice);
  }, []);

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
        <Canvas
          camera={{ position: [0, 4, 10], fov: 45 }}
          dpr={performanceMode ? 1 : [1, 2]}
          style={{ background: 'transparent' }}
          gl={{
            antialias: !performanceMode,
            alpha: true,
            powerPreference: 'high-performance'
          }}
        >
          <Suspense fallback={<LoadingScreen />}>
            {/* WebGL context recovery component */}
            <WebGLContextRecovery />

            {/* Optimized lighting based on performance mode */}
            <ambientLight intensity={0.6} color="#ffffff" />
            <directionalLight
              position={[5, 5, 5]}
              intensity={1.0}
              color="#ffffff"
              castShadow={!performanceMode}
            />

            {/* Environment for reflections */}
            <Environment preset="studio" />

            {/* Keyboard with error handling */}
            <Keyboard
              onSelectKey={handleSelectKey}
              selectedKey={selectedKey}
              theme={currentTheme}
              performanceMode={performanceMode}
            />

            {/* Shadows */}
            {!performanceMode && (
              <ContactShadows
                position={[0, -0.5, 0]}
                opacity={0.5}
                scale={20}
                blur={1.5}
                far={1}
              />
            )}

            {/* Camera controls */}
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              enableRotate={true}
              rotateSpeed={0.3}
              minPolarAngle={Math.PI / 3}
              maxPolarAngle={Math.PI / 2}
              maxAzimuthAngle={Math.PI / 4}
              minAzimuthAngle={-Math.PI / 4}
              dampingFactor={0.1}
              enableDamping={true}
              autoRotate={false}
            />
          </Suspense>
        </Canvas>
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
