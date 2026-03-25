
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { createPortfolioSlice } from './slices/portfolioSlice';
import { createGithubSlice } from './slices/githubSlice';

export const usePortfolioStore = create(
    devtools(
        (set, get) => ({
            ...createPortfolioSlice(set, get),
            ...createGithubSlice(set, get),
        }),
        { name: "PortfolioStore" }
    )
);

// Named Selectors for performance and cleaner imports
export const useProjects = () => usePortfolioStore((state) => state.projects);
export const useSkills = () => usePortfolioStore((state) => state.skills);
export const useExperience = () => usePortfolioStore((state) => state.experience);
export const useEducation = () => usePortfolioStore((state) => state.education);
export const useCertifications = () => usePortfolioStore((state) => state.certifications);
export const usePersonalInfo = () => usePortfolioStore((state) => state.personalInfo);
export const useSocialLinks = () => usePortfolioStore((state) => state.socialLinks);
export const useGithubStats = () => usePortfolioStore((state) => state.githubStats);
export const useGithubLoading = () => usePortfolioStore((state) => state.githubLoading);
export const useGithubError = () => usePortfolioStore((state) => state.githubError);

// Actions
export const useHydratePortfolio = () => usePortfolioStore((state) => state.hydratePortfolio);
export const useSetGithubStats = () => usePortfolioStore((state) => state.setGithubStats);

export default usePortfolioStore;
