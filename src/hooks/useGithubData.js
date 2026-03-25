
"use client"

import { usePortfolioStore } from "@/store/useStore";

/**
 * Hook to consume GitHub stats and status from the store.
 */
export function useGithubData() {
    const stats = usePortfolioStore((state) => state.githubStats);
    const loading = usePortfolioStore((state) => state.githubLoading);
    const error = usePortfolioStore((state) => state.githubError);

    return { stats, loading, error };
}
