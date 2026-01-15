'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Spline from '@splinetool/react-spline';
import { getKeyById, getKeyByHotkey } from '@/lib/keyboardLayout';
import { getMockData } from '@/lib/mockData';
import Link from "next/link";
import { BoxReveal } from "@/components/reveal-animations";
import { cn } from "@/lib/utils";
import gsap from 'gsap';

const SplineSkills = ({ data = [] }) => {
    const mockData = getMockData() || {};
    const MOCK_SKILLS = mockData.skills || mockData.MOCK_SKILLS || [];
    const [loading, setLoading] = useState(true);
    const splineApp = useRef(null);
    const timeoutRef = useRef(null);

    // Helper to resolve skill from key data
    const resolveSkill = useCallback((keyData) => {
        if (!keyData) return null;

        if (keyData.skillId) {
            const skillDetails = data.find(s => s.id === keyData.skillId || s.name.toLowerCase() === keyData.skillId)
                || MOCK_SKILLS.find(s => s.id === keyData.skillId || s.name.toLowerCase() === keyData.skillId);

            if (skillDetails) {
                return { ...skillDetails, ...keyData };
            }
        }
        return null; // Don't return default text for non-skill keys to allow "clearing" feel
    }, [data, MOCK_SKILLS]);

    const updateSplineText = useCallback((app, heading, desc) => {
        if (!app || !app.setVariable) return;

        try {

            if (app.getVariable('heading') === undefined || app.getVariable('desc') === undefined) {
                // Variables don't exist yet, simply return to avoid spamming the console
                return;
            }

            app.setVariable('heading', String(heading || ""));
            app.setVariable('desc', String(desc || ""));
        } catch (error) {
            // This catches runtime crashes
            if (process.env.NODE_ENV === 'development') {
                // console.warn("Spline variables missing in scene.", error); 
                // Suppressed for cleaner console
            }
        }
    }, []);

    const initFloatingAnimation = useCallback((app) => {
        const keyboardGroup = app.findObjectByName('keyboard') || app.findObjectByName('Group');

        if (keyboardGroup) {
            // Kill existing tweens to prevent conflicts
            gsap.killTweensOf(keyboardGroup.position);
            gsap.killTweensOf(keyboardGroup.rotation);

            // Initial Tilt setup for isometric look (0.44 rad ≈ 25 degrees)
            gsap.set(keyboardGroup.rotation, { x: 0.44, z: 0 });

            // Floating movement
            gsap.to(keyboardGroup.position, {
                y: 15,
                duration: 2.5,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });

            gsap.to(keyboardGroup.rotation, {
                x: 0.48, // Gentle tilt range around 25 degrees
                z: 0.05,
                duration: 4,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: 0.5
            });
        }
    }, []);

    const onSplineLoad = useCallback((app) => {
        console.log('Spline scene loaded');
        setLoading(false);
        splineApp.current = app;

        app.addEventListener('mouseHover', (e) => {
            const objectId = e.target.name || e.target.id;
            const keyData = getKeyById(objectId);

            if (keyData) {
                const skill = resolveSkill(keyData);
                if (skill) {
                    updateSplineText(app, skill.name, skill.description);

                    // Clear text after 3 seconds of no new interactions
                    if (timeoutRef.current) clearTimeout(timeoutRef.current);
                    timeoutRef.current = setTimeout(() => {
                        updateSplineText(app, "", "");
                    }, 3000);
                }
            }
        });

        initFloatingAnimation(app);

        // Handle Responsive Text Visibility
        const handleResize = () => {
            const mobileText = app.findObjectByName('text-mobile');
            const desktopText = app.findObjectByName('text-desktop');
            const isMobile = window.innerWidth < 768;

            if (mobileText) mobileText.visible = isMobile;
            if (desktopText) desktopText.visible = !isMobile;
        };

        // Initial check
        handleResize();

        // Listen for resize
        window.addEventListener('resize', handleResize);

        // Return cleanup function for this specific listener if needed, 
        // but since onSplineLoad is called once, we might want to store the cleanup or just rely on component unmount (though Spline component might not expose unmount hook for the app instance easily).
        // Since we don't have a direct "cleanup" for onSplineLoad, let's just leave the listener for now or use a ref to track it if we were stricter. 
        // A cleaner way in React is to put this in a useEffect that depends on `splineApp.current`.

    }, [resolveSkill, updateSplineText, initFloatingAnimation]);

    // Separate useEffect for Resize Listener to ensure proper cleanup
    useEffect(() => {
        const handleResize = () => {
            if (splineApp.current) {
                const app = splineApp.current;
                const mobileText = app.findObjectByName('text-mobile');
                const desktopText = app.findObjectByName('text-desktop');
                const isMobile = window.innerWidth < 768;

                if (mobileText) mobileText.visible = isMobile;
                if (desktopText) desktopText.visible = !isMobile;
            }
        };

        window.addEventListener('resize', handleResize);
        // Run once on mount/update to ensure state is correct
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, [loading]); // Re-run when loading finishes so splineApp.current is likely ready

    const onSplineError = useCallback((error) => {
        console.error('Spline load error:', error);
        setLoading(false);
    }, []);

    const onSplineMouseDown = useCallback((e) => {
        const objectId = e.target.name || e.target.id;
        console.log("Clicked:", objectId);
    }, []);


    // Handle global keyboard events
    useEffect(() => {
        const handleKeyDown = (e) => {
            const key = e.key.toLowerCase();
            const keyData = getKeyByHotkey(key);

            if (keyData && splineApp.current) {
                const skill = resolveSkill(keyData);
                if (skill) {
                    updateSplineText(splineApp.current, skill.name, skill.description);

                    // Reset clear timer on key press too
                    if (timeoutRef.current) clearTimeout(timeoutRef.current);
                    timeoutRef.current = setTimeout(() => {
                        if (splineApp.current) updateSplineText(splineApp.current, "", "");
                    }, 3000);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [resolveSkill, updateSplineText]);

    return (
        <section id="skills" className="w-full min-h-screen relative bg-transparent overflow-hidden">

            {/* Loading State */}
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center z-50 bg-black text-white">
                    <p className="animate-pulse">Loading 3D Experience...</p>
                </div>
            )}

            {/* Static Header only */}
            <div className="w-full flex flex-col items-center justify-start pt-20 relative z-10 pointer-events-none">
                <Link href={"#skills"} className="pointer-events-auto">
                    <BoxReveal width="100%">
                        <h2
                            className={cn(
                                "bg-clip-text text-4xl text-center text-transparent md:text-7xl font-bold",
                                "bg-gradient-to-b from-white/80 to-white/50"
                            )}
                        >
                            SKILLS
                        </h2>
                    </BoxReveal>
                </Link>
                <p className="mx-auto mt-4 line-clamp-4 max-w-3xl font-normal text-base text-center text-neutral-300 pointer-events-auto">
                    (hint: press a key)
                </p>
            </div>

            <div className="absolute inset-0 z-0 h-screen w-full">
                <Spline
                    className="w-full h-full"
                    scene="/scene_new.splinecode"
                    onLoad={onSplineLoad}
                    onError={onSplineError}
                    onMouseDown={onSplineMouseDown}
                />
            </div>
        </section>
    );
};

export default SplineSkills;
