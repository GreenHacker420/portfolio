
import prisma from '@/lib/db';

import { unstable_cache } from 'next/cache';

export default async function getData() {
    try {
        const cachedFn = unstable_cache(
            async () => {
                try {
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

                    const education = await prisma.education.findMany({
                        orderBy: { startDate: 'desc' },
                        where: { isVisible: true }
                    });

                    const certifications = await prisma.certification.findMany({
                        orderBy: { issueDate: 'desc' },
                        where: { isVisible: true }
                    });

                    const faqs = await prisma.fAQ.findMany({
                        orderBy: { displayOrder: 'asc' },
                        where: { isVisible: true }
                    });



                    return { projects, experience, skills, personalInfo, socialLinks, education, certifications, faqs };
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

