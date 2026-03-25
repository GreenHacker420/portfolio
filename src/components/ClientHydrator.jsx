
"use client"

import { useEffect, useRef } from 'react'
import { usePortfolioStore } from '@/store/useStore'

/**
 * Hydrates the client-side Zustand store with data fetched on the server.
 * This component returns null and only performs an atomic update once.
 */
export default function ClientHydrator({ data, githubStats }) {
    const hydratePortfolio = usePortfolioStore(state => state.hydratePortfolio)
    const setGithubStats = usePortfolioStore(state => state.setGithubStats)
    const initialized = useRef(false)

    useEffect(() => {
        if (!initialized.current) {
            if (data) {
                hydratePortfolio(data);
            }
            if (githubStats) {
                setGithubStats(githubStats);
            }
            initialized.current = true;
        }
    }, []); // Empty dependencies ensure this only runs once on mount

    return null;
}
