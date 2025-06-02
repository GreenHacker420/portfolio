import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Skill } from '../../../data/skillsData';
import Spline from '@splinetool/react-spline';
import { Application } from '@splinetool/runtime';
import { toast } from '@/components/ui/use-toast';
import { skills, skillsMap, getSkillById } from '../../../data/skillsData';
import { KEYBOARD_LAYOUT, getKeyByIdFixed } from '../../../data/keyboardData';
import LoadingScreen from './keyboard/LoadingScreen';

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
  );
};

const KeyboardSkillsView = () => {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [showSkillInfo, setShowSkillInfo] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const splineRef = useRef<Application | null>(null);
  
  // Handle skill selection when a key is pressed in the Spline scene
  const onSplineLoad = (splineApp: Application) => {
    splineRef.current = splineApp;
    setLoading(false);
    
    try {
      // Find all keyboard keys in the Spline model
      const keyObjects = KEYBOARD_LAYOUT.flatMap(row => row.map(key => key.id));
      
      // Set up interaction handlers for each key - using Spline's event system
      keyObjects.forEach(keyId => {
        try {
          const keyObject = splineApp.findObjectByName(keyId);
          
          if (keyObject) {
            // Use Spline's emitEvent system for interactions
            splineApp.addEventListener('mouseDown', (e) => {
              if (e.target && e.target.name === keyId) {
                handleKeyPress(keyId);
              }
            });
          }
        } catch (keyErr) {
          console.warn(`Could not set up interaction for key: ${keyId}`, keyErr);
        }
      });
      
    } catch (err) {
      console.error("Error setting up Spline interactions:", err);
      setError("Failed to set up keyboard interactions.");
      toast({
        title: "Error",
        description: "Failed to load keyboard interactions. Please try refreshing the page.",
        variant: "destructive"
      });
    }
  };

  const handleKeyPress = (keyId: string) => {
    try {
      // Find the key data
      const keyData = getKeyByIdFixed(keyId);
      
      if (keyData) {
        // Only show skill info if it's a skill key
        const skillId = keyData.skillId;
        if (skillId) {
          const skillData = getSkillById(skillId);
          setSelectedSkill(skillData);
          setShowSkillInfo(true);
        }
      }
    } catch (err) {
      console.error("Error selecting key:", err);
      setError("Failed to select key.");
    }
  };

  // Handle closing the skill card
  const handleCloseSkillCard = () => {
    setShowSkillInfo(false);
    setSelectedSkill(null);
  };

  // Handle keyboard input for accessibility
  useEffect(() => {
    const handleKeyboardPress = (e: KeyboardEvent) => {
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
          handleKeyPress(matchingKey.id);
        }
      } catch (err) {
        console.error("Error processing key press:", err);
      }
    };

    window.addEventListener('keydown', handleKeyboardPress);

    return () => {
      window.removeEventListener('keydown', handleKeyboardPress);
    };
  }, [showSkillInfo]);

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
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="my-4 w-full flex flex-col items-center justify-center"
      >
        {/* Display selected skill info at the top */}
        {selectedSkill && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-center"
          >
            <h3 className="text-2xl font-bold text-white mb-2">{selectedSkill.name}</h3>
            <p className="text-github-text max-w-xl">{selectedSkill.description}</p>
          </motion.div>
        )}
        
        {/* Spline 3D keyboard */}
        <div className="w-full max-w-4xl mx-auto relative h-[600px]">
          {/* Loading overlay */}
          {loading && <LoadingScreen />}
          
          {/* Spline component with the new URL */}
          <Spline 
            scene="https://prod.spline.design/bnffRvBtBHvfSiOW/scene.splinecode" 
            onLoad={onSplineLoad}
            style={{ width: '100%', height: '100%' }}
          />
          
          {/* Skill information card - positioned on top of Spline for better visibility */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="pointer-events-auto">
              <SkillCard
                skill={selectedSkill}
                isVisible={showSkillInfo && !!selectedSkill}
                onClose={handleCloseSkillCard}
              />
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Hint text */}
      <motion.div 
        className="text-center mt-2 text-white/70 font-medium"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <p>(hint: click on a key to explore skills)</p>
      </motion.div>
    </>
  );
};

export default KeyboardSkillsView;
