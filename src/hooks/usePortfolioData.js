
"use client"

import { usePortfolioStore } from "@/store/useStore";

/**
 * Hook to consume portfolio data from the store.
 */
export function usePortfolioData() {
    const projects = usePortfolioStore((state) => state.projects);
    const skills = usePortfolioStore((state) => state.skills);
    const experience = usePortfolioStore((state) => state.experience);
    const education = usePortfolioStore((state) => state.education);
    const certifications = usePortfolioStore((state) => state.certifications);
    const personalInfo = usePortfolioStore((state) => state.personalInfo);
    const socialLinks = usePortfolioStore((state) => state.socialLinks);

    return {
        projects,
        skills,
        experience,
        education,
        certifications,
        personalInfo,
        socialLinks
    };
}
