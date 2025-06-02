
'use client';

import React, { Suspense, useState, useCallback, useEffect } from 'react';
import { Skill, getSkillById } from '../../../../data/skillsData';
import LoadingScreen from './LoadingScreen';

// Lazy load Spline component
const Spline = React.lazy(() => import('@splinetool/react-spline'));

interface SplineKeyboardProps {
  onSkillSelect?: (skill: Skill | null) => void;
}

const SplineKeyboard: React.FC<SplineKeyboardProps> = ({ onSkillSelect }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  const handleSplineLoad = useCallback(() => {
    setLoading(false);
    console.log('Spline keyboard loaded successfully');
  }, []);

  const handleSplineError = useCallback((error: any) => {
    console.error('Spline loading error:', error);
    setError('Failed to load 3D keyboard');
    setLoading(false);
  }, []);

  const handleObjectClick = useCallback((event: any) => {
    if (event.target && event.target.name) {
      const objectName = event.target.name.toLowerCase();
      
      // Map Spline object names to skill IDs
      const skillMapping: { [key: string]: string } = {
        'react_key': 'react',
        'typescript_key': 'typescript',
        'nextjs_key': 'nextjs',
        'nodejs_key': 'nodejs',
        'python_key': 'python',
        'javascript_key': 'javascript',
        'html_key': 'html',
        'css_key': 'css',
        'git_key': 'git',
        'docker_key': 'docker',
      };

      const skillId = skillMapping[objectName];
      if (skillId) {
        const skill = getSkillById(skillId);
        if (skill) {
          setSelectedSkill(skill);
          if (onSkillSelect) {
            onSkillSelect(skill);
          }
        }
      }
    }
  }, [onSkillSelect]);

  if (error) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-github-dark/50 rounded-lg">
        <div className="text-center p-6">
          <p className="text-red-400 mb-4">Error: {error}</p>
          <button
            onClick={() => {
              setError(null);
              setLoading(true);
            }}
            className="px-4 py-2 bg-github-light/30 text-neon-green rounded-md hover:bg-github-light/50 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[600px]">
      {loading && <LoadingScreen />}
      
      <Suspense fallback={<LoadingScreen />}>
        <Spline
          scene="https://prod.spline.design/bnffRvBtBHvfSiOW/scene.splinecode"
          onLoad={handleSplineLoad}
          onError={handleSplineError}
          onClick={handleObjectClick}
          style={{ width: '100%', height: '100%' }}
        />
      </Suspense>

      {selectedSkill && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-github-dark/95 border border-github-border rounded-lg p-4 max-w-sm">
          <h3 className="text-white font-semibold mb-2">{selectedSkill.name}</h3>
          <p className="text-github-text text-sm">{selectedSkill.description}</p>
        </div>
      )}
    </div>
  );
};

export default SplineKeyboard;
