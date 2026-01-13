
'use client';

import React, { useState, useRef, useCallback } from 'react';
import Spline from '@splinetool/react-spline';
import { motion, AnimatePresence } from 'framer-motion';
import { getKeyById, getSkillKeys } from '@/lib/keyboardLayout';
import { getMockData } from '@/lib/mockData';

const SplineSkills = ({ data = [] }) => {
    const { MOCK_SKILLS } = getMockData();
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
        // e.target.name or e.target.id might be available from Spline event
        const objectId = e.target.name || e.target.id;
        console.log('Spline Object Clicked:', objectId);

        // Find key in layout that matches this object ID (assuming Spline objects are named like 'key-react', 'react', etc.)
        // Step 618 showed ids like 'js', 'react', 'key-v', etc.
        // We will try to match objectId to our keys.

        // We can search our flat keyboard layout
        const keyData = getKeyById(objectId);

        if (keyData && keyData.skillId) {
            // Found a skill key!
            // Find the skill details from data or MOCK_SKILLS
            const skillDetails = data.find(s => s.id === keyData.skillId || s.name.toLowerCase() === keyData.skillId)
                || MOCK_SKILLS.find(s => s.id === keyData.skillId || s.name.toLowerCase() === keyData.skillId); // Fallback

            if (skillDetails) {
                setSelectedSkill({ ...skillDetails, ...keyData });
            } else {
                // Fallback if data not found but key is defined
                setSelectedSkill({
                    name: keyData.label,
                    description: `Experience with ${keyData.label}`,
                    level: 80, // Mock level
                    ...keyData
                });
            }
        } else {
            // Clicked something else, maybe close overlay?
            // setSelectedSkill(null);
        }
    };

    return (
        <div className="relative w-full min-h-screen bg-transparent flex flex-col items-center justify-center py-20 pointer-events-none">
            {/* Title - positioned absolutely to be non-intrusive or relative at top */}
            <div className="absolute top-20 z-10 text-center pointer-events-auto">
                <h1 className="text-6xl font-bold text-white mb-4">Skills</h1>
                <p className="text-white/50 text-sm">(Click on the keys)</p>
            </div>

            {/* 3D Scene Container */}
            <div className="absolute inset-0 z-0">
                <Spline
                    className="w-full h-full pointer-events-auto"
                    scene="/scene.splinecode"
                    onLoad={onSplineLoad}
                    onError={onSplineError}
                    onMouseDown={onSplineMouseDown}
                />
            </div>

            {/* Skill Overlay */}
            <AnimatePresence>
                {selectedSkill && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-md border border-white/10 p-6 rounded-xl max-w-sm w-full mx-4 shadow-2xl z-20 pointer-events-auto"
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

                        <p className="text-gray-300 mb-4">{selectedSkill.description || "Detailed proficiency in this technology."}</p>

                        <div className="w-full bg-gray-700 rounded-full h-2.5 mb-1">
                            <div
                                className="bg-neon-green h-2.5 rounded-full bg-green-500"
                                style={{ width: `${selectedSkill.level || 50}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400">
                            <span>Proficiency</span>
                            <span>{selectedSkill.level || 50}%</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SplineSkills;
