'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react'; // Added useState, useEffect, useRef
import { GSAPProjects } from '@/components/DynamicWrapper';
import { ExpandableCard } from '@/components/ui/expandable-card';
import { getMockData } from '@/lib/mockData';

export default function Projects({ data = [] }) {
    const [active, setActive] = useState(null);
    const ref = useRef(null);

    // Use provided data or fallback to mock data
    const mockData = getMockData() || {};
    const MOCK_PROJECTS = mockData.projects || [];
    const projects = data && data.length > 0 ? data : MOCK_PROJECTS;

    // Skeleton loader if no data
    if (!projects || projects.length === 0) {
        return (
            <section id="projects" className="py-20 w-full bg-neutral-950">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="h-12 w-64 bg-white/5 animate-pulse rounded-lg mb-8" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-64 bg-white/5 animate-pulse rounded-3xl" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    // We still want the ExpandableCard modal logic when a card is clicked
    useEffect(() => {
        function onKeyDown(event) {
            if (event.key === "Escape") {
                setActive(null);
            }
        }

        if (active && typeof active === "object") {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [active]);

    // Separate featured project from the rest (assuming index 0 is best)
    const featuredProject = projects[0];
    const remainingProjects = projects.slice(1);

    return (
        <section id="projects" className="relative w-full bg-neutral-950 font-sans z-50 bg-transparent">

            {/* 1. The Featured Highlight (100vw GSAP Cinematic Scroll) */}
            <GSAPProjects
                projects={[featuredProject].filter(Boolean)}
                onProjectClick={(p) => setActive({
                    ...p,
                    id: p.id || Math.random().toString(),
                    src: p.imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
                })}
            />

            <div className="max-w-7xl mx-auto px-4 md:px-8 mt-20 mb-[-1rem]">
                <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                    Explore Other Works
                </h2>
                <p className="text-neutral-400 mt-2 font-mono text-sm uppercase tracking-widest">
                    Click to view details
                </p>
            </div>

            {/* 2. The Native UI Gallery for the Rest */}
            <div className="py-20 w-full relative z-90">
                <ExpandableCard
                    active={active}
                    setActive={setActive}
                    cards={remainingProjects.map(p => ({
                        id: p.id || Math.random().toString(),
                        src: p.imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
                        title: p.title,
                        description: p.description,
                        longDescription: p.longDescription,
                        techStack: p.techStack,
                        projectUrl: p.projectUrl,
                        repoUrl: p.repoUrl
                    }))}
                />
            </div>
        </section>
    );
}
