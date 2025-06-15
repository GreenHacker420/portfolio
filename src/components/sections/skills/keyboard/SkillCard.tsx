
import React from 'react';
import { Skill } from '../../../../types/skills';
import { motion, AnimatePresence } from 'framer-motion';

interface SkillCardProps {
  skill: Skill | null;
  isVisible: boolean;
  onClose: () => void;
}

/**
 * Skill card component that displays detailed information about a selected skill
 */
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

export default SkillCard;
