import prisma from "@/lib/db";
import { ensureStructuredResume } from "./structured";

function hasResumeVersionDelegate() {
    return Boolean(prisma?.resumeVersion && typeof prisma.resumeVersion === "object");
}

function isRecoverableSchemaError(error) {
    const code = typeof error?.code === "string" ? error.code : "";
    if (code === "P2021" || code === "P2022") return true;

    const message = String(error?.message || "").toLowerCase();
    return (
        message.includes("cannot read properties of undefined") && message.includes("resumeversion") ||
        message.includes("cannot read properties of undefined") && message.includes("create") ||
        message.includes("cannot read properties of undefined") && message.includes("findfirst") ||
        message.includes("cannot read properties of undefined") && message.includes("findmany") ||
        message.includes("cannot read properties of undefined") && message.includes("groupby") ||
        message.includes("resume_versions") ||
        message.includes("column") && (message.includes("structured") || message.includes("isdefault")) ||
        message.includes("table") && message.includes("resume_versions") ||
        message.includes("unknown argument `structured`") ||
        message.includes("unknown argument `isdefault`")
    );
}

async function createResumeDefensively({ title, latex, isDefault, structured }) {
    const attempts = [
        { title, latex, isDefault, structured },
        { title, latex, isDefault },
        { title, latex },
    ];

    let lastError = null;
    for (const data of attempts) {
        try {
            return await prisma.resume.create({ data });
        } catch (error) {
            lastError = error;
            if (!isRecoverableSchemaError(error)) throw error;
        }
    }

    throw lastError || new Error("Failed to create resume");
}

async function updateResumeDefensively({ id, title, latex, isDefault, structured }) {
    if (isDefault) {
        try {
            await prisma.resume.updateMany({
                where: { id: { not: id } },
                data: { isDefault: false }
            });
        } catch (error) {
            if (!isRecoverableSchemaError(error)) throw error;
        }
    }

    const attempts = [
        { title, latex, structured, isDefault },
        { title, latex, isDefault },
        { title, latex },
    ];

    let lastError = null;
    for (const data of attempts) {
        try {
            return await prisma.resume.update({
                where: { id },
                data
            });
        } catch (error) {
            lastError = error;
            if (!isRecoverableSchemaError(error)) throw error;
        }
    }

    throw lastError || new Error("Failed to update resume");
}

async function createResumeVersionIfPossible({ resumeId, title, latex, structured, source }) {
    if (!hasResumeVersionDelegate()) return;

    const attempts = [
        { resumeId, title, latex, structured, source },
        { resumeId, title, latex, source },
    ];

    for (const data of attempts) {
        try {
            await prisma.resumeVersion.create({ data });
            return;
        } catch (error) {
            if (!isRecoverableSchemaError(error)) throw error;
        }
    }
}

export async function createResumeWithInitialVersion({ title, latex, isDefault = false, source = "manual", structured = null }) {
    const normalizedStructured = ensureStructuredResume({ latex, structured });
    const resume = await createResumeDefensively({
        title,
        latex,
        isDefault,
        structured: normalizedStructured
    });

    await createResumeVersionIfPossible({
        resumeId: resume.id,
        title: resume.title,
        latex: resume.latex,
        structured: resume.structured,
        source,
    });

    return resume;
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
    const updatedResume = await updateResumeDefensively({
        id,
        title,
        latex,
        isDefault,
        structured: normalizedStructured
    });

    await createResumeVersionIfPossible({
        resumeId: updatedResume.id,
        title: updatedResume.title,
        latex: updatedResume.latex,
        structured: updatedResume.structured,
        source,
    });

    return updatedResume;
}

export async function restoreResumeVersion({ resumeId, versionId }) {
    if (!hasResumeVersionDelegate()) return null;

    let version = null;
    try {
        version = await prisma.resumeVersion.findFirst({
            where: { id: versionId, resumeId }
        });
    } catch (error) {
        if (isRecoverableSchemaError(error)) return null;
        throw error;
    }

    if (!version) return null;

    const updatedResume = await updateResumeDefensively({
        id: resumeId,
        title: version.title,
        latex: version.latex,
        isDefault: undefined,
        structured: version.structured
    });

    await createResumeVersionIfPossible({
        resumeId,
        title: updatedResume.title,
        latex: updatedResume.latex,
        structured: updatedResume.structured,
        source: "restore"
    });

    return updatedResume;
}
