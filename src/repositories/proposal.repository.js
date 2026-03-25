
import prisma from "@/lib/db";

export async function getAllProposals() {
    return prisma.proposal.findMany({ 
        orderBy: { updatedAt: "desc" },
        include: { _count: { select: { versions: true } } }
    });
}

export async function getProposalById(id) {
    return prisma.proposal.findUnique({ 
        where: { id },
        include: { versions: { orderBy: { createdAt: "desc" } } }
    });
}

export async function createProposalRecord(data) {
    return prisma.proposal.create({ data });
}

export async function updateProposalRecord(id, data) {
    return prisma.proposal.update({ where: { id }, data });
}

export async function deleteProposalRecord(id) {
    return prisma.proposal.delete({ where: { id } });
}

export async function createProposalVersionRecord(data) {
    return prisma.proposalVersion.create({ data });
}

export async function getProposalVersionById(id) {
    return prisma.proposalVersion.findUnique({ where: { id } });
}
