import { create } from 'zustand'

export const usePortfolioStore = create((set) => ({
    projects: [],
    skills: [],
    experience: [],
    personalInfo: null,
    socialLinks: [],
    githubStats: null,

    setProjects: (projects) => set({ projects }),
    setSkills: (skills) => set({ skills }),
    setExperience: (experience) => set({ experience }),
    setPersonalInfo: (personalInfo) => set({ personalInfo }),
    setSocialLinks: (socialLinks) => set({ socialLinks }),
    setGithubStats: (stats) => set({ githubStats: stats }),
}))
