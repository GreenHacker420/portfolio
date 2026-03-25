
export const createPortfolioSlice = (set, get) => ({
    projects: [],
    skills: [],
    experience: [],
    education: [],
    certifications: [],
    personalInfo: null,
    socialLinks: [],

    hydratePortfolio: (data) => {
        if (!data) return;
        set({
            projects: data.projects || [],
            skills: data.skills || [],
            experience: data.experience || [],
            education: data.education || [],
            certifications: data.certifications || [],
            personalInfo: data.personalInfo || null,
            socialLinks: data.socialLinks || [],
        });
    },

    getVisibleProjects: () => {
        return get().projects.filter(p => p.isVisible);
    }
});
