
'use client';

import React, { useState, useRef, useCallback } from 'react';
import Spline from '@splinetool/react-spline';
import { motion, AnimatePresence } from 'framer-motion';
import { IconCloud } from '@/components/ui/interactive-icon-cloud';
import { getKeyById } from '@/lib/keyboardLayout';
import { getMockData } from '@/lib/mockData';

const SplineSkills = ({ data = [] }) => {

    const { MOCK_SKILLS } = getMockData();
    const [loading, setLoading] = useState(true);
    const [selectedSkill, setSelectedSkill] = useState(null);
    const splineRef = useRef(null);

    // If data provided, extract simple slugs for Cloud if possible, or just default to common tech
    // Since skills list might not map 1:1 to simple icon slugs, we might keep hardcoded or map carefully.
    // For now, let's keep the hardcoded list as updated by the user's skills is a bit complex for SimpleIcons slugs.
    // But we can update the Cloud if we have a mapping.
    // However, the USER asked to add data source.
    // Let's assume 'data' contains skills with 'name' or 'icon' property.

    // We can try to map data names to slugs.
    const skillSlugs = data.length > 0
        ? data.map(s => s.name.toLowerCase().replace(/\./g, 'dot').replace(/\s+/g, ''))
        : [
            "typescript", "javascript", "react", "html5", "css3", "nodedotjs",
            "express", "nextdotjs", "prisma", "amazonaws", "postgresql",
            "firebase", "docker", "git", "github", "visualstudiocode", "figma"
        ];

    const onSplineLoad = (spline) => {
        console.log('Spline scene loaded');
        setLoading(false);
        splineRef.current = spline;
    };

    const onSplineError = (error) => {
        console.error('Spline load error:', error);
        setLoading(false);
    };

    return (
        <div className="relative w-full min-h-screen bg-transparent flex flex-col items-center gap-8 py-20">
            <h1 className="text-6xl font-bold text-white mb-8">Skills</h1>
            <div className="relative w-full h-[400px] flex items-center justify-center p-4">
                <div className="w-full max-w-lg opacity-80 hover:opacity-100 transition-opacity duration-500">
                    <IconCloud iconSlugs={skillSlugs} />
                </div>
            </div>
        </div>
    );
};

export default SplineSkills;
