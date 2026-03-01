import prisma from "@/lib/db";
import { createDefaultProposalData, ensureProposalData } from "./defaults";

export async function createProposalWithInitialVersion({
    title,
    organization = "",
    projectIdea = "",
    tone = "academic",
    data = null,
    source = "create"
}) {
    const normalizedData = ensureProposalData(
        data || createDefaultProposalData({ title, organization, projectIdea }),
        { title, organization, projectIdea }
    );

    return prisma.$transaction(async (tx) => {
        const proposal = await tx.proposal.create({
            data: {
                title,
                organization,
                projectIdea,
                tone,
                data: normalizedData
            }
        });

        await tx.proposalVersion.create({
            data: {
                proposalId: proposal.id,
                title: proposal.title,
                tone: proposal.tone,
                data: proposal.data,
                source
            }
        });

        return proposal;
    });
}

export async function updateProposalAndCreateVersion({
    id,
    title,
    organization = "",
    projectIdea = "",
    tone = "academic",
    data,
    source = "manual"
}) {
    const normalizedData = ensureProposalData(data, { title, organization, projectIdea });

    return prisma.$transaction(async (tx) => {
        const proposal = await tx.proposal.update({
            where: { id },
            data: {
                title,
                organization,
                projectIdea,
                tone,
                data: normalizedData
            }
        });

        await tx.proposalVersion.create({
            data: {
                proposalId: proposal.id,
                title: proposal.title,
                tone: proposal.tone,
                data: proposal.data,
                source
            }
        });

        return proposal;
    });
}

export async function restoreProposalVersion({ proposalId, versionId }) {
    return prisma.$transaction(async (tx) => {
        const version = await tx.proposalVersion.findFirst({
            where: { id: versionId, proposalId }
        });

        if (!version) return null;

        const proposal = await tx.proposal.update({
            where: { id: proposalId },
            data: {
                title: version.title,
                tone: version.tone,
                data: version.data
            }
        });

        await tx.proposalVersion.create({
            data: {
                proposalId,
                title: proposal.title,
                tone: proposal.tone,
                data: proposal.data,
                source: "restore"
            }
        });

        return proposal;
    });
}
