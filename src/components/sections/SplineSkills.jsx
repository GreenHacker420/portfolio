
'use client';

import React, { useState, useRef, useCallback } from 'react';
import Spline from '@splinetool/react-spline';
import { motion, AnimatePresence } from 'framer-motion';
import { getKeyById } from '../../lib/keyboardLayout';
import { getMockData } from '../../lib/mockData';

const SplineSkills = () => {

    const {MOCK_SKILLS} = getMockData();
    const [loading, setLoading] = useState(true);
    const [selectedSkill, setSelectedSkill] = useState(null);
    const splineRef = useRef(null);

    const onSplineLoad = (spline) => {
        console.log('Spline scene loaded');
        setLoading(false);
        splineRef.current = spline;
    };

    const onSplineError = (error) => {
        console.error('Spline load error:', error);
        setLoading(false);
    };

    const onSplineMouseDown = (e) => {
        if (!e.target || !e.target.name) return;

        const objectName = e.target.name.toLowerCase();
        console.log('Clicked object:', objectName);

        // Find key in layout
        const key = getKeyById(objectName);

        if (key && key.skillId) {
            // Find skill data
            const skill = MOCK_SKILLS.find(s => s.id === `skill_00${key.skillId === 'js' ? '1' : key.skillId === 'react' ? '2' : key.skillId === 'node' ? '3' : '4'}`); // Basic mapping for mock data
            // Better mapping:
            const mappedSkill = MOCK_SKILLS.find(s => s.category === key.skillId || s.name.toLowerCase().includes(key.skillId));

            // For now, let's just use the skillId to find in mock or fallback
            const foundSkill = MOCK_SKILLS.find(s =>
                s.name.toLowerCase() === (key.label || '').toLowerCase() ||
                s.id === key.skillId
            );

            if (foundSkill) {
                setSelectedSkill(foundSkill);
            } else {
                // Fallback if mock data doesn't match exactly yet
                setSelectedSkill({
                    name: key.label || objectName,
                    description: `Experience with ${key.label}`,
                    level: 80,
                    category: 'dev'
                });
            }
        }
    };

    return (
        <div className="relative w-full h-[600px] md:h-screen bg-transparent">
            {/* Loading State */}
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center text-white z-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-green"></div>
                </div>
            )}

            {/* 3D Scene */}
            <Spline
                scene="/scene.splinecode"
                onLoad={onSplineLoad}
                onError={onSplineError}
                onMouseDown={onSplineMouseDown}
                className="w-full h-full"
            />

            {/* Skill Overlay */}
            <AnimatePresence>
                {selectedSkill && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-md border border-white/10 p-6 rounded-xl max-w-sm w-full mx-4 shadow-2xl z-20"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-2xl font-bold text-white">{selectedSkill.name}</h3>
                            <button
                                onClick={() => setSelectedSkill(null)}
                                className="text-white/50 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>

                        <p className="text-gray-300 mb-4">{selectedSkill.description}</p>

                        <div className="w-full bg-gray-700 rounded-full h-2.5 mb-1">
                            <div
                                className="bg-neon-green h-2.5 rounded-full"
                                style={{ width: `${selectedSkill.level || 50}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400">
                            <span>Proficiency</span>
                            <span>{selectedSkill.level}%</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="absolute bottom-4 left-4 text-xs text-white/30 pointer-events-none">
                Click on keys to explore skills
            </div>
        </div>
    );
};

export default SplineSkills;
