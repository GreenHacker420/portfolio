
import prisma from '@/lib/db';

import { unstable_cache } from 'next/cache';

export default async function getData() {
    try {
        const cachedFn = unstable_cache(
            async () => {
                try {
                    // Explicitly select columns to avoid "column not found" errors if DB is desync
                    const projects = await prisma.project.findMany({
                        orderBy: { displayOrder: 'asc' },
                        where: { isVisible: true }
                    });

                    const experience = await prisma.workExperience.findMany({
                        orderBy: { startDate: 'desc' },
                        where: { isVisible: true }
                    });

                    const skills = await prisma.skill.findMany({
                        orderBy: { level: 'desc' },
                        where: { isVisible: true }
                    });

                    const personalInfo = await prisma.personalInfo.findUnique({
                        where: { id: "default" }
                    });

                    const socialLinks = await prisma.socialLink.findMany({
                        orderBy: { displayOrder: 'asc' },
                        where: { isVisible: true }
                    });

                    // Parse JSON fields safely if needed (Prisma adapter usually handles arrays, but text/json needs parsing if raw)
                    // Projects techStack is string[] so it comes as array.

                    return { projects, experience, skills, personalInfo, socialLinks };
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
