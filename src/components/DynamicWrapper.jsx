"use client";

import dynamic from 'next/dynamic';

export const ParallaxStars = dynamic(() => import('@/components/canvas/ParallaxStars'), {
    ssr: false,
    loading: () => <div className="fixed inset-0 bg-black -z-50" />
});

export const SplineSkills = dynamic(() => import('@/sections/SplineSkills'), {
    ssr: false,
    loading: () => <div className="h-screen w-full flex items-center justify-center text-white/20">Loading 3D Scene...</div>
});

export const Hero3D = dynamic(() => import('@/components/canvas/Hero3D'), {
    ssr: false,
    loading: () => <div className="h-[500px] w-full bg-black/20 animate-pulse rounded-3xl" />
});

export const Experience3D = dynamic(() => import('@/components/canvas/Experience3D'), {
    ssr: false,
    loading: () => <div className="h-[400px] w-full bg-black/20 animate-pulse rounded-3xl" />
});

export const FloatingProjects = dynamic(() => import('@/components/canvas/FloatingProjects'), {
    ssr: false,
    loading: () => <div className="h-[600px] w-full bg-black/20 animate-pulse rounded-3xl" />
});

export const GSAPProjects = dynamic(() => import('@/components/ui/GSAPProjects').then(mod => mod.GSAPProjects), {
    ssr: false,
    loading: () => <div className="h-screen w-full bg-black/10 animate-pulse" />
});

export const ChatWidget = dynamic(() => import('@/components/ui/ChatWidget'), {
    ssr: false
});

export const AnimatedBackground = dynamic(() => import('@/components/AnimatedBackground'), {
    ssr: false,
    loading: () => <div className="fixed inset-0 bg-black -z-50" />
});
