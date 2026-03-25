
"use client"

import { useGithubStats, useGithubLoading, useGithubError } from "@/store/useStore";

/**
 * Hook to consume GitHub stats and status from the store.
 */
export function useGithubData() {
    const stats = useGithubStats();
    const loading = useGithubLoading();
    const error = useGithubError();

    return { stats, loading, error };
}
