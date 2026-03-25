
import prisma from "@/lib/db";

export async function getGlobalStats() {
    const [
        projects,
        messages,
        pendingMessages,
        skills,
        resumes,
        kbSnippets,
        media,
        experience,
        certifications,
        education,
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

    return {
        projects,
        messages,
        pendingMessages,
        skills,
        resumes,
        kbSnippets,
        media,
        experience,
        certifications,
        education,
    };
}

export async function getRecentContacts(limit = 5) {
    return prisma.contact.findMany({
        take: limit,
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
}

export async function getRecentAuditLogs(limit = 5) {
    return prisma.auditLog.findMany({
        take: limit,
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
}

export async function getAdminUserByEmail(email) {
    return prisma.adminUser.findUnique({ where: { email } });
}

export async function createContactReply(data) {
    return prisma.contactReply.create({ data });
}

export async function updateContactReply(id, data) {
    return prisma.contactReply.update({ where: { id }, data });
}
