
'use client';

import React, { Suspense, useState, useCallback, useEffect } from 'react';
import { Skill } from '../../../../types/skills';
import { getSkillByIdSync } from '../../../../services/skillsDataService';
import LoadingScreen from './LoadingScreen';
import '../../../../styles/spline-overrides.css';

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

    // Hide Spline watermark after load
    setTimeout(() => {
      const hideSplineWatermark = () => {
        // Find and hide elements containing Spline branding
        const elementsToHide = document.querySelectorAll('a[href*="spline.design"], [class*="watermark"], [class*="spline-logo"]');
        elementsToHide.forEach(el => {
          (el as HTMLElement).style.display = 'none';
          (el as HTMLElement).style.visibility = 'hidden';
          (el as HTMLElement).style.opacity = '0';
        });

        // Hide any text nodes containing "Made with Spline"
        const walker = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT,
          null
        );

        let node: Node | null;
        while (node = walker.nextNode()) {
          if (node.textContent && node.textContent.includes('Made with Spline')) {
            const parent = node.parentElement;
            if (parent) {
              parent.style.display = 'none';
            }
          }
        }
      };

      hideSplineWatermark();
      // Run again after a delay to catch dynamically loaded elements
      setTimeout(hideSplineWatermark, 2000);
    }, 1000);
  }, []);

  const handleSplineError = useCallback((error: any) => {
    console.error('Spline loading error:', error);
    setError('Failed to load 3D keyboard');
    setLoading(false);
  }, []);

  const handleObjectClick = useCallback((event: any) => {
    if (event.target && event.target.name) {
      const objectName = event.target.name.toLowerCase();
      console.log('Clicked object:', objectName);
      
      // Map Spline object names to skill IDs
      const skillMapping: { [key: string]: string } = {
        'react_key': 'react',
        'react': 'react',
        'typescript_key': 'ts',
        'typescript': 'ts',
        'nextjs_key': 'nextjs',
        'nextjs': 'nextjs',
        'nodejs_key': 'node',
        'nodejs': 'node',
        'node_key': 'node',
        'python_key': 'python',
        'python': 'python',
        'javascript_key': 'js',
        'javascript': 'js',
        'js_key': 'js',
        'html_key': 'html',
        'html': 'html',
        'css_key': 'css',
        'css': 'css',
        'git_key': 'git',
        'git': 'git',
        'docker_key': 'docker',
        'docker': 'docker',
        'aws_key': 'aws',
        'aws': 'aws',
        'mongodb_key': 'mongodb',
        'mongodb': 'mongodb',
        'postgres_key': 'postgres',
        'postgres': 'postgres',
        'graphql_key': 'graphql',
        'graphql': 'graphql',
        'threejs_key': 'threejs',
        'threejs': 'threejs',
        'three_key': 'threejs',
        'three': 'threejs',
      };

      const skillId = skillMapping[objectName];
      console.log('Mapped skill ID:', skillId);

      if (skillId) {
        const skill = getSkillByIdSync(skillId);
        console.log('Found skill:', skill);

        if (skill) {
          setSelectedSkill(skill);
          if (onSkillSelect) {
            onSkillSelect(skill);
          }
        } else {
          console.warn(`Skill not found for ID: ${skillId}`);
        }
      } else {
        console.warn(`No skill mapping found for object: ${objectName}`);
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
    <div className="relative w-full h-[700px]">
      {loading && <LoadingScreen />}

      <Suspense fallback={<LoadingScreen />}>
        <div className="w-full h-full relative">
          <Spline
            scene="https://prod.spline.design/bnffRvBtBHvfSiOW/scene.splinecode"
            onLoad={handleSplineLoad}
            onError={handleSplineError}
            onClick={handleObjectClick}
            style={{
              width: '100%',
              height: '100%',
              minWidth: '800px' // Ensure minimum width for better visibility
            }}
          />
          {/* Hide Spline watermark */}
          <style jsx>{`
            :global(.spline-watermark),
            :global([class*="watermark"]),
            :global([class*="spline-logo"]),
            :global(a[href*="spline.design"]) {
              display: none !important;
              visibility: hidden !important;
              opacity: 0 !important;
            }
          `}</style>
        </div>
      </Suspense>

      {selectedSkill && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-github-dark/95 backdrop-blur-sm border border-github-border rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-lg font-bold shadow-md"
                style={{ backgroundColor: selectedSkill.color }}
              >
                {selectedSkill.logo}
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-1">{selectedSkill.name}</h3>
                <span className="text-neon-green text-sm font-medium">{selectedSkill.category.toUpperCase()}</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedSkill(null)}
              className="text-github-text hover:text-white transition-colors p-1"
            >
              ✕
            </button>
          </div>

          <p className="text-github-text text-sm mb-4 leading-relaxed">{selectedSkill.description}</p>

          {/* Proficiency and Experience */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-white text-sm font-medium">Proficiency</span>
                <span className="text-neon-green text-sm font-bold">{selectedSkill.proficiency}%</span>
              </div>
              <div className="h-2 bg-github-light/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-neon-green rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${selectedSkill.proficiency}%` }}
                />
              </div>
            </div>
            <div>
              <span className="text-white text-sm font-medium">Experience</span>
              <p className="text-neon-green text-sm font-bold">{selectedSkill.experience} years</p>
            </div>
          </div>

          {/* Projects */}
          {selectedSkill.projects && selectedSkill.projects.length > 0 && (
            <div className="mb-4">
              <span className="text-white text-sm font-medium mb-2 block">Recent Projects</span>
              <div className="flex flex-wrap gap-1">
                {selectedSkill.projects.slice(0, 3).map((project, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-neon-green/20 text-neon-green text-xs rounded-md"
                  >
                    {project}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Strengths */}
          {selectedSkill.strengths && selectedSkill.strengths.length > 0 && (
            <div>
              <span className="text-white text-sm font-medium mb-2 block">Key Strengths</span>
              <div className="flex flex-wrap gap-1">
                {selectedSkill.strengths.slice(0, 4).map((strength, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-github-border/30 text-github-text text-xs rounded-md"
                  >
                    {strength}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SplineKeyboard;
