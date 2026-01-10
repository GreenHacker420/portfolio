
import prisma from '@/lib/db';

import { unstable_cache } from 'next/cache';

export default async function getData() {
    return await unstable_cache(
        async () => {
            try {
                const projects = await prisma.project.findMany();
                const experience = await prisma.workExperience.findMany();
                const skills = await prisma.skill.findMany();

                // Sort in memory to avoid "column not found" errors if DB is out of sync
                projects.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
                experience.sort((a, b) => new Date(b.startDate) - new Date(a.startDate)); // Descending
                skills.sort((a, b) => (b.level || 0) - (a.level || 0)); // Descending

                if (projects.length === 0 && experience.length === 0) {
                    return null;
                }

                return { projects, experience, skills };
            } catch (error) {
                console.error("Failed to fetch DB data:", error);
                return null;
            }
        },
        ['portfolio_data'],
        { revalidate: 3600 }
    )();
}
