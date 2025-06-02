import React, { Suspense, useState, useCallback } from 'react';
import Spline from '@splinetool/react-spline';
import { motion } from 'framer-motion';
import LoadingScreen from './LoadingScreen';

interface SplineKeyboardProps {
  selectedSkill: string | null;
  onSkillSelect: (skill: string | null) => void;
  theme: string;
  showSkillInfo: boolean;
  onToggleSkillInfo: () => void;
}

const SplineKeyboard: React.FC<SplineKeyboardProps> = ({
  selectedSkill,
  onSkillSelect,
  theme,
  showSkillInfo,
  onToggleSkillInfo
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSplineLoad = useCallback(() => {
    console.log('Spline keyboard loaded successfully');
    setIsLoading(false);
  }, []);

  const handleSplineError = useCallback((error: any) => {
    console.error('Spline keyboard error:', error);
    setError('Failed to load 3D keyboard');
    setIsLoading(false);
  }, []);

  const handleSplineMouseDown = useCallback((e: any) => {
    // Handle interactions with the Spline scene
    if (e.target && e.target.name) {
      const keyName = e.target.name;
      console.log('Spline object clicked:', keyName);
      
      // Map Spline object names to skills
      const skillMapping: { [key: string]: string } = {
        'react_key': 'React',
        'typescript_key': 'TypeScript',
        'nextjs_key': 'Next.js',
        'nodejs_key': 'Node.js',
        'python_key': 'Python',
        'javascript_key': 'JavaScript',
        'html_key': 'HTML',
        'css_key': 'CSS',
        'git_key': 'Git',
        'docker_key': 'Docker',
        // Add more mappings as needed
      };

      const skill = skillMapping[keyName];
      if (skill) {
        onSkillSelect(selectedSkill === skill ? null : skill);
      }
    }
  }, [selectedSkill, onSkillSelect]);

  const retryLoad = useCallback(() => {
    setError(null);
    setIsLoading(true);
  }, []);

  const ErrorFallback = () => (
    <div className="flex items-center justify-center h-96 bg-github-darker rounded-lg border border-github-border">
      <div className="text-center p-6">
        <h3 className="text-lg font-semibold text-red-400 mb-2">
          3D Keyboard Error
        </h3>
        <p className="text-github-text-secondary text-sm mb-4">
          Failed to load 3D keyboard from Spline
        </p>
        <button
          onClick={retryLoad}
          className="px-4 py-2 bg-neon-green text-github-dark rounded-md hover:bg-neon-green/80 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );

  if (error) {
    return <ErrorFallback />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative w-full h-96 bg-black rounded-lg border border-github-border overflow-hidden"
    >
      {isLoading && <LoadingScreen />}
      
      <Suspense fallback={<LoadingScreen />}>
        <Spline
          scene="https://prod.spline.design/bnffRvBtBHvfSiOW/scene.splinecode"
          onLoad={handleSplineLoad}
          onError={handleSplineError}
          onMouseDown={handleSplineMouseDown}
          style={{
            width: '100%',
            height: '100%',
            background: 'black'
          }}
        />
      </Suspense>

      {/* Skill information overlay */}
      {selectedSkill && showSkillInfo && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="absolute top-4 right-4 bg-github-dark/90 backdrop-blur-sm border border-github-border rounded-lg p-4 max-w-xs z-10"
        >
          <h3 className="text-neon-green font-semibold mb-2">{selectedSkill}</h3>
          <p className="text-github-text-secondary text-sm">
            Click on keyboard keys to explore different skills and technologies.
          </p>
          <button
            onClick={() => onSkillSelect(null)}
            className="mt-2 text-xs text-github-text-secondary hover:text-neon-green transition-colors"
          >
            Close
          </button>
        </motion.div>
      )}

      {/* Instructions overlay */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="absolute bottom-4 left-4 bg-github-dark/80 backdrop-blur-sm border border-github-border rounded-lg p-3 max-w-sm"
      >
        <p className="text-github-text-secondary text-xs">
          🖱️ Click and drag to rotate • 🔍 Scroll to zoom • ⌨️ Click keys to see skills
        </p>
      </motion.div>
    </motion.div>
  );
};

export default SplineKeyboard;
