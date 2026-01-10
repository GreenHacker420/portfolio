
import prisma from '@/lib/db';

export default async function getData() {
    try {
        const projects = await prisma.project.findMany({
            orderBy: { displayOrder: 'asc' }
        });
        const experience = await prisma.workExperience.findMany({
            orderBy: { startDate: 'desc' }
        });
        const skills = await prisma.skill.findMany({
            orderBy: { level: 'desc' }, // or displayOrder
        });

        // If DB is empty, return null to trigger fallback
        if (projects.length === 0 && experience.length === 0) {
            return null;
        }

        return {
            projects,
            experience,
            skills
        };
    } catch (error) {
        console.error("Failed to fetch DB data:", error);
        return null;
    }
}
