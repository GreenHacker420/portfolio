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
        pendingMessagesCount,
        skillsCount,
        resumesCount,
        kbCount,
        mediaCount,
        experienceCount,
        certCount,
        educationCount,
    ] = await Promise.all([
        prisma.project.count(),
        prisma.contact.count(),
        prisma.contact.count({ where: { status: 'pending' } }),
        prisma.skill.count(),
        prisma.resume.count(),
        prisma.knowledgeSnippet.count(),
        prisma.media.count(),
        prisma.workExperience.count(),
        prisma.certification.count(),
        prisma.education.count(),
    ]);

    // Recent contacts (last 5)
    let recentContacts = [];
    try {
        recentContacts = await prisma.contact.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                email: true,
                subject: true,
                status: true,
                priority: true,
                inquiryType: true,
                createdAt: true,
            }
        });
    } catch (e) { /* graceful fallback */ }

    // Recent audit logs (last 5)
    let recentAuditLogs = [];
    try {
        recentAuditLogs = await prisma.auditLog.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                action: true,
                resource: true,
                resourceId: true,
                createdAt: true,
                user: { select: { name: true, email: true } }
            }
        });
    } catch (e) { /* graceful fallback */ }

    // System health: check which env vars are configured
    const systemHealth = {
        google: !!process.env.GOOGLE_API_KEY,
        pinecone: !!process.env.PINECONE_API_KEY,
        azure: !!(process.env.AZURE_CLIENT_ID && process.env.AZURE_TENANT_ID && process.env.AZURE_CLIENT_SECRET),
        github: !!process.env.GITHUB_TOKEN,
        email: !!process.env.EMAIL_USER,
        database: true, // If we got here, DB is connected
    };

    return {
        projects: projectsCount,
        messages: messagesCount,
        pendingMessages: pendingMessagesCount,
        skills: skillsCount,
        resumes: resumesCount,
        kbSnippets: kbCount,
        media: mediaCount,
        experience: experienceCount,
        certifications: certCount,
        education: educationCount,
        recentContacts,
        recentAuditLogs,
        systemHealth,
    };
}
