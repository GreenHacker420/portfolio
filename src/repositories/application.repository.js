
import prisma from "@/lib/db";

export async function getAllApplications() {
    return prisma.application.findMany({
        orderBy: { updatedAt: "desc" },
        include: { lead: true, recruiter: true }
    });
}

export async function getApplicationById(id) {
    return prisma.application.findUnique({
        where: { id },
        include: { lead: true, recruiter: true, events: true }
    });
}

export async function createApplicationRecord(data) {
    return prisma.application.create({ data });
}

export async function updateApplicationRecord(id, data) {
    return prisma.application.update({ where: { id }, data });
}

export async function createApplicationEventRecord(data) {
    return prisma.applicationEvent.create({ data });
}
