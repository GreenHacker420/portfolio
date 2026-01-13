"use client"

import { useEffect, useRef } from 'react'
import { usePortfolioStore } from '@/store/useStore'

export default function ClientHydrator({
    projects,
    skills,
    experience,
    personalInfo,
    socialLinks,
    githubStats
}) {
    const store = usePortfolioStore()
    const initialized = useRef(false)

    useEffect(() => {
        if (!initialized.current) {
            store.setProjects(projects || [])
            store.setSkills(skills || [])
            store.setExperience(experience || [])
            store.setPersonalInfo(personalInfo || null)
            store.setSocialLinks(socialLinks || [])
            if (githubStats) store.setGithubStats(githubStats)

            initialized.current = true
        }
    }, [projects, skills, experience, personalInfo, socialLinks, githubStats, store])

    return null
}
