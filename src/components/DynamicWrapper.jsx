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
