'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger, making sure we only do it on the client
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export function GSAPProjects({ projects, onProjectClick }) {
    const containerRef = useRef(null);
    const slidesRef = useRef([]);

    useEffect(() => {
        if (!containerRef.current || slidesRef.current.length === 0) return;

        const slides = slidesRef.current;
        const totalSlides = slides.length;

        // Ensure elements are set up correctly
        gsap.set(slides, { zIndex: (i, target, targets) => targets.length - i });

        // If only 1 project, just fade it up, no massive pinning needed
        if (totalSlides === 1) {
            gsap.fromTo(slides[0],
                { opacity: 0, y: 100 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.5,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top center",
                    }
                }
            );
            return;
        }

        // Create the scroll trigger for multiple slides
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: `+=${100 * (totalSlides - 1)}%`, // Scroll distance based on number of slides
                pin: true,
                scrub: 1, // Smooth scrubbing
                anticipatePin: 1
            }
        });

        // The animation: Slice the front slide to reveal the one behind it
        slides.forEach((slide, i) => {
            if (i === totalSlides - 1) return; // Don't animate the last one away

            tl.to(slide, {
                clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)", // Wipes up
                ease: "none",
                duration: 1
            });
        });

        // Cleanup
        return () => {
            if (tl.scrollTrigger) tl.scrollTrigger.kill();
            tl.kill();
        };
    }, [projects]);

    if (!projects || projects.length === 0) return null;

    return (
        <div ref={containerRef} className="relative w-full h-[100dvh] bg-transparent overflow-hidden">
            {projects.map((project, i) => (
                <div
                    key={project.id || i}
                    ref={el => slidesRef.current[i] = el}
                    className="absolute top-0 left-0 w-full h-full flex flex-col md:flex-row items-center justify-center pt-24 pb-8 md:pt-20 md:pb-0"
                    style={{
                        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" // Full screen initially
                    }}
                >

                    {/* No Background Image/Graphic to keep it clean and blended */}

                    {/* Left: Text Content */}
                    <div className="z-10 w-full md:w-1/2 px-6 sm:px-10 md:pl-24 flex flex-col justify-center h-1/2 md:h-full mt-auto md:mt-0">
                        <span className="text-indigo-500 font-mono text-xs sm:text-sm uppercase tracking-widest mb-2 sm:mb-4">
                            Project 0{i + 1}
                        </span>
                        <h2 className="text-3xl sm:text-5xl md:text-7xl font-bold text-white mb-3 sm:mb-6 tracking-tight leading-tight">
                            {project.title.split(' — ')[0] || project.title}
                        </h2>
                        <p className="text-sm sm:text-lg md:text-2xl text-neutral-400 font-light mb-6 md:mb-12 max-w-xl line-clamp-3 md:line-clamp-none">
                            {project.description}
                        </p>

                        <div className="hidden sm:flex gap-2 sm:gap-4 flex-wrap mb-6 md:mb-12">
                            {project.techStack?.slice(0, 4).map((tech, idx) => (
                                <span key={idx} className="px-3 py-1.5 md:px-4 md:py-2 border border-white/20 rounded-full text-white/80 text-[10px] sm:text-sm">
                                    {tech}
                                </span>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-4 mb-4">
                            <button
                                onClick={() => onProjectClick(project)}
                                className="group w-fit relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-white px-8 font-medium text-black transition-all duration-300 hover:bg-neutral-200 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] active:scale-95 cursor-pointer"
                            >
                                <span className="mr-2">Explore Project</span>
                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1">
                                    <path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                                </svg>
                            </button>

                            {(project.githubUrl || project.repoUrl) && (
                                <button
                                    onClick={() => window.open(project.githubUrl || project.repoUrl, "_blank")}
                                    className="group w-fit relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-transparent px-8 font-medium text-white transition-all duration-300 hover:bg-white/10 hover:border-white/40 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95 cursor-pointer whitespace-nowrap"
                                >
                                    <span className="mr-2">View GitHub</span>
                                </button>
                            )}

                            {(project.liveUrl || project.projectUrl) && (
                                <button
                                    onClick={() => window.open(project.liveUrl || project.projectUrl, "_blank")}
                                    className="group w-fit relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-indigo-600 px-8 font-medium text-white transition-all duration-300 hover:bg-indigo-500 hover:scale-105 hover:shadow-[0_0_20px_rgba(79,70,229,0.5)] active:scale-95 cursor-pointer whitespace-nowrap"
                                >
                                    <span className="mr-2">Live Demo</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Right: Asset/Image Visualization */}
                    <div className="z-10 w-full md:w-1/2 px-6 sm:px-10 h-1/2 md:h-full flex items-center justify-center mb-auto md:mb-0">
                        <div className="relative w-full max-w-[280px] sm:max-w-md md:max-w-lg aspect-square lg:aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-neutral-900 group">
                            {project.imageUrl ? (
                                <img
                                    src={project.imageUrl}
                                    alt={project.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-900/50 to-black">
                                    <span className="text-white/20 font-bold text-6xl md:text-9xl">
                                        {project.title.charAt(0)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            ))}
        </div>
    );
}
