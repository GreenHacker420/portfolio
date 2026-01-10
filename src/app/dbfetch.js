
import prisma from '@/lib/db';

import { unstable_cache } from 'next/cache';

export default async function getData() {
    try {
        const cachedFn = unstable_cache(
            async () => {
                try {
                    // Explicitly select columns to avoid "column not found" errors if DB is desync
                    const projects = await prisma.project.findMany({
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            imageUrl: true,
                            repoUrl: true,
                            projectUrl: true,
                            techStack: true,
                            featured: true
                        }
                    });

                    const experience = await prisma.workExperience.findMany({
                        select: {
                            id: true,
                            company: true,
                            position: true,
                            location: true,
                            startDate: true,
                            endDate: true,
                            description: true,
                            technologies: true
                        }
                    });

                    const skills = await prisma.skill.findMany({
                        select: {
                            id: true,
                            name: true,
                            level: true,
                            category: true,
                            icon: true
                        }
                    });

                    // Safe access in case schema changes again
                    projects.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
                    experience.sort((a, b) => new Date(b.startDate || 0) - new Date(a.startDate || 0));
                    skills.sort((a, b) => (b.level || 0) - (a.level || 0));

                    if (projects.length === 0 && experience.length === 0) {
                        return null;
                    }

                    return { projects, experience, skills };
                } catch (innerError) {
                    console.error("DB Fetch Inner Error:", innerError);
                    return null;
                }
            },
            ['portfolio_data'],
            { revalidate: 3600 }
        );

        return await cachedFn();
    } catch (error) {
        console.error("Failed to fetch DB data (Cache Error):", error);
        return null;
    }
}
