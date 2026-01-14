'use server'

import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getAdminStats() {
    const session = await getServerSession(authOptions);
    if (!session) return { error: "Unauthorized" };

    const [
        projectsCount,
        messagesCount,
        unreadMessagesCount,
        skillsCount
    ] = await Promise.all([
        prisma.project.count(),
        prisma.contact.count(),
        prisma.contact.count({ where: { status: 'pending' } }),
        prisma.skill.count()
    ]);

    return {
        projects: projectsCount,
        messages: messagesCount,
        unreadMessages: unreadMessagesCount,
        skills: skillsCount
    };
}
