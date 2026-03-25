
import prisma from "@/lib/db";

export async function getAllResumes() {
    return prisma.resume.findMany({ orderBy: { updatedAt: "desc" } });
}

export async function getResumeById(id) {
    return prisma.resume.findUnique({ where: { id } });
}

export async function getResumeVersionCounts() {
    return prisma.resumeVersion.groupBy({
        by: ["resumeId"],
        _count: { _all: true }
    });
}

export async function createResumeRecord(data) {
    return prisma.resume.create({ data });
}

export async function updateResumeRecord(id, data) {
    return prisma.resume.update({ where: { id }, data });
}

export async function deleteResumeRecord(id) {
    return prisma.resume.delete({ where: { id } });
}

export async function createResumeVersionRecord(data) {
    return prisma.resumeVersion.create({ data });
}

export async function getResumeVersions(resumeId) {
    return prisma.resumeVersion.findMany({
        where: { resumeId },
        orderBy: { createdAt: "desc" }
    });
}
