"use client";
import React, { Suspense, useEffect, useRef, useState } from "react";
// import { Application, SPEObject, SplineEvent } from "@splinetool/runtime";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// const Spline = React.lazy(() => import("@splinetool/react-spline")); // Dynamic import needs to be handled
import Spline from "@splinetool/react-spline";

import { Skill, SkillNames, SKILLS } from "@/data/constants";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePreloader } from "./preloader";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

const STATES = {
    hero: {
        desktop: {
            scale: { x: 0.25, y: 0.25, z: 0.25 },
            position: { x: 400, y: -200, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
        },
        mobile: {
            scale: { x: 0.15, y: 0.15, z: 0.15 },
            position: { x: 0, y: -200, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
        },
    },
    about: {
        desktop: {
            scale: { x: 0.4, y: 0.4, z: 0.4 },
            position: { x: 0, y: -40, z: 0 },
            rotation: {
                x: 0,
                y: Math.PI / 12,
                z: 0,
            },
        },
        mobile: {
            scale: { x: 0.2, y: 0.2, z: 0.2 },
            position: { x: 0, y: -40, z: 0 },
            rotation: {
                x: 0,
                y: Math.PI / 6,
                z: 0,
            },
        },
    },
    skills: {
        desktop: {
            scale: { x: 0.4, y: 0.4, z: 0.4 },
            position: { x: 0, y: -40, z: 0 },
            rotation: {
                x: 0,
                y: Math.PI / 12,
                z: 0,
            },
        },
        mobile: {
            scale: { x: 0.2, y: 0.2, z: 0.2 },
            position: { x: 0, y: -40, z: 0 },
            rotation: {
                x: 0,
                y: Math.PI / 6,
                z: 0,
            },
        },
    },
    projects: {
        desktop: {
            scale: { x: 0.3, y: 0.3, z: 0.3 },
            position: { x: 0, y: -40, z: 0 },
            rotation: {
                x: Math.PI,
                y: Math.PI / 3,
                z: Math.PI,
            },
        },
        mobile: {
            scale: { x: 0.18, y: 0.18, z: 0.18 },
            position: { x: 0, y: -40, z: 0 },
            rotation: {
                x: Math.PI,
                y: Math.PI / 3,
                z: Math.PI,
            },
        },
    },
};

const AnimatedBackground = () => {
    const [splineApp, setSplineApp] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const isMobileQuery = useMediaQuery("(max-width: 768px)");
    const { bypassLoading, isLoading } = usePreloader();
    const splineContainer = useRef(null);
    const { theme } = useTheme();

    useEffect(() => {
        setIsMobile(isMobileQuery);
    }, [isMobileQuery]);

    useEffect(() => {
        if (!splineApp) return;

        let ctx = gsap.context(() => {
            const state = isMobile ? STATES.hero.mobile : STATES.hero.desktop;
            const hero = splineApp.findObjectByName("Hero_Wrapper");
            if (hero) {
                gsap.to(hero.scale, {
                    x: state.scale.x,
                    y: state.scale.y,
                    z: state.scale.z,
                    duration: 1,
                    ease: "power2.inOut",
                });
                gsap.to(hero.position, {
                    x: state.position.x,
                    y: state.position.y,
                    z: state.position.z,
                    duration: 1,
                    ease: "power2.inOut",
                });
                gsap.to(hero.rotation, {
                    x: state.rotation.x,
                    y: state.rotation.y,
                    z: state.rotation.z,
                    duration: 1,
                    ease: "power2.inOut",
                });
            }
        }, splineContainer);

        return () => ctx.revert();
    }, [splineApp, isMobile]);

    useEffect(() => {
        if (!splineApp) return;

        let ctx = gsap.context(() => {
            // About Section
            const aboutScroll = ScrollTrigger.create({
                trigger: "#about",
                start: "top bottom",
                end: "bottom top",
                onEnter: () => {
                    const state = isMobile ? STATES.about.mobile : STATES.about.desktop;
                    const hero = splineApp.findObjectByName("Hero_Wrapper");
                    if (hero) {
                        gsap.to(hero.scale, { ...state.scale, duration: 1.5 });
                        gsap.to(hero.position, { ...state.position, duration: 1.5 });
                        gsap.to(hero.rotation, { ...state.rotation, duration: 1.5 });
                    }
                },
                onLeaveBack: () => {
                    const state = isMobile ? STATES.hero.mobile : STATES.hero.desktop;
                    const hero = splineApp.findObjectByName("Hero_Wrapper");
                    if (hero) {
                        gsap.to(hero.scale, { ...state.scale, duration: 1.5 });
                        gsap.to(hero.position, { ...state.position, duration: 1.5 });
                        gsap.to(hero.rotation, { ...state.rotation, duration: 1.5 });
                    }
                }
            });

            // Skills Section
            const skillsScroll = ScrollTrigger.create({
                trigger: "#skills",
                start: "top bottom",
                end: "bottom top",
                onEnter: () => {
                    const state = isMobile ? STATES.skills.mobile : STATES.skills.desktop;
                    const hero = splineApp.findObjectByName("Hero_Wrapper");
                    // Add logic for keyboard interactivity enable if needed
                    const { start } = getKeycapsAnimation();
                    start();

                    if (hero) {
                        gsap.to(hero.scale, { ...state.scale, duration: 1.5 });
                        gsap.to(hero.position, { ...state.position, duration: 1.5 });
                        gsap.to(hero.rotation, { ...state.rotation, duration: 1.5 });
                    }
                },
                onLeave: () => {
                    const { stop } = getKeycapsAnimation();
                    stop();
                },
                onLeaveBack: () => {
                    const { stop } = getKeycapsAnimation();
                    stop();
                    // Go back to about logic handled by about's onEnterBack or simple fall through?
                    // Actually usually we want strict transitions.
                    // For now, let's trust simple triggers.
                    const state = isMobile ? STATES.about.mobile : STATES.about.desktop;
                    const hero = splineApp.findObjectByName("Hero_Wrapper");
                    if (hero) {
                        gsap.to(hero.scale, { ...state.scale, duration: 1.5 });
                        gsap.to(hero.position, { ...state.position, duration: 1.5 });
                        gsap.to(hero.rotation, { ...state.rotation, duration: 1.5 });
                    }
                }
            });

            // Projects Section
            const projectsScroll = ScrollTrigger.create({
                trigger: "#projects",
                start: "top bottom",
                end: "bottom top",
                onEnter: () => {
                    const state = isMobile ? STATES.projects.mobile : STATES.projects.desktop;
                    const hero = splineApp.findObjectByName("Hero_Wrapper");
                    if (hero) {
                        gsap.to(hero.scale, { ...state.scale, duration: 1.5 });
                        gsap.to(hero.position, { ...state.position, duration: 1.5 });
                        gsap.to(hero.rotation, { ...state.rotation, duration: 1.5 });
                    }
                },
                onLeaveBack: () => {
                    const state = isMobile ? STATES.skills.mobile : STATES.skills.desktop;
                    const hero = splineApp.findObjectByName("Hero_Wrapper");
                    if (hero) {
                        gsap.to(hero.scale, { ...state.scale, duration: 1.5 });
                        gsap.to(hero.position, { ...state.position, duration: 1.5 });
                        gsap.to(hero.rotation, { ...state.rotation, duration: 1.5 });
                    }
                }
            });

        }, splineContainer);

        return () => ctx.revert();
    }, [splineApp, isMobile]);

    // Keycaps Animation Logic
    const getKeycapsAnimation = () => {
        if (!splineApp) return { start: () => { }, stop: () => { } };

        let tweens = [];
        const start = () => {
            removePrevTweens();
            Object.values(SKILLS)
                .sort(() => Math.random() - 0.5)
                .forEach((skill, idx) => {
                    const keycap = splineApp.findObjectByName(skill.name);
                    if (!keycap) return;
                    const t = gsap.to(keycap?.position, {
                        y: Math.random() * 200 + 200,
                        duration: Math.random() * 2 + 2,
                        delay: idx * 0.6,
                        repeat: -1,
                        yoyo: true,
                        yoyoEase: "none",
                        ease: "elastic.out(1,0.3)",
                    });
                    tweens.push(t);
                });
        };
        const stop = () => {
            removePrevTweens();
            Object.values(SKILLS).forEach((skill) => {
                const keycap = splineApp.findObjectByName(skill.name);
                if (!keycap) return;
                const t = gsap.to(keycap?.position, {
                    y: 0,
                    duration: 4,
                    repeat: 1,
                    ease: "elastic.out(1,0.8)",
                });
                tweens.push(t);
            });
            setTimeout(removePrevTweens, 1000);
        };
        const removePrevTweens = () => {
            tweens.forEach((t) => t.kill());
        };
        return { start, stop };
    };

    return (
        <div className="fixed inset-0 -z-50 w-full h-full pointer-events-none">
            <Spline
                ref={splineContainer}
                onLoad={(app) => {
                    setSplineApp(app);
                    // bypassLoading(); // Calling this here might close loader too early?
                    // The original code called it.
                    // Let's call it after a slight delay or rely on the Preloader's own time.
                    // Actually original code passed `setSplineApp` and called `bypassLoading`.
                    bypassLoading();
                }}
                scene="/assets/skills-keyboard.spline"
            />
        </div>
    );
};

export default AnimatedBackground;
