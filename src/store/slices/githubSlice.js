
export const createGithubSlice = (set) => ({
    githubStats: null,
    githubLoading: false,
    githubError: null,

    setGithubStats: (stats) => set({ githubStats: stats, githubLoading: false, githubError: null }),
    setGithubLoading: (loading) => set({ githubLoading: loading }),
    setGithubError: (error) => set({ githubError: error, githubLoading: false }),
});
