
"use client"

import {
    useProjects,
    useSkills,
    useExperience,
    useEducation,
    useCertifications,
    usePersonalInfo,
    useSocialLinks
} from "@/store/useStore";

/**
 * Hook to consume portfolio data from the store.
 */
export function usePortfolioData() {
    const projects = useProjects();
    const skills = useSkills();
    const experience = useExperience();
    const education = useEducation();
    const certifications = useCertifications();
    const personalInfo = usePersonalInfo();
    const socialLinks = useSocialLinks();

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
