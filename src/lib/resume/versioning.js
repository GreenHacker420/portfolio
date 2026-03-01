import prisma from "@/lib/db";
import { ensureStructuredResume } from "./structured";

export async function createResumeWithInitialVersion({ title, latex, isDefault = false, source = "manual", structured = null }) {
    const normalizedStructured = ensureStructuredResume({ latex, structured });

    return prisma.$transaction(async (tx) => {
        const resume = await tx.resume.create({
            data: {
                title,
                latex,
                structured: normalizedStructured,
                isDefault,
            }
        });

        await tx.resumeVersion.create({
            data: {
                resumeId: resume.id,
                title: resume.title,
                latex: resume.latex,
                structured: resume.structured,
                source,
            }
        });

        return resume;
    });
}

export async function updateResumeAndCreateVersion({
    id,
    title,
    latex,
    isDefault,
    source = "manual",
    structured = null
}) {
    const normalizedStructured = ensureStructuredResume({ latex, structured });

    return prisma.$transaction(async (tx) => {
        if (isDefault) {
            await tx.resume.updateMany({
                where: { id: { not: id } },
                data: { isDefault: false }
            });
        }

        const updatedResume = await tx.resume.update({
            where: { id },
            data: {
                title,
                latex,
                structured: normalizedStructured,
                isDefault
            }
        });

        await tx.resumeVersion.create({
            data: {
                resumeId: updatedResume.id,
                title: updatedResume.title,
                latex: updatedResume.latex,
                structured: updatedResume.structured,
                source,
            }
        });

        return updatedResume;
    });
}

export async function restoreResumeVersion({ resumeId, versionId }) {
    return prisma.$transaction(async (tx) => {
        const version = await tx.resumeVersion.findFirst({
            where: { id: versionId, resumeId }
        });

        if (!version) return null;

        const updatedResume = await tx.resume.update({
            where: { id: resumeId },
            data: {
                title: version.title,
                latex: version.latex,
                structured: version.structured
            }
        });

        await tx.resumeVersion.create({
            data: {
                resumeId,
                title: updatedResume.title,
                latex: updatedResume.latex,
                structured: updatedResume.structured,
                source: "restore"
            }
        });

        return updatedResume;
    });
}
