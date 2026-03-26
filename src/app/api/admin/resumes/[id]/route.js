import prisma from "@/lib/db";
import { withApiHandler, apiOk } from "@/lib/apiResponse";
import { requireAdmin } from "@/lib/guard";
import { updateResumeAndCreateVersion } from "@/lib/resume/versioning";
import { ensureStructuredResume } from "@/lib/resume/structured";

export const GET = withApiHandler(async (req, { params }) => {
    await requireAdmin();
    const { id } = await params;
    const resume = await prisma.resume.findUnique({
        where: { id }
    });

    if (!resume) {
        throw new Error("Resume not found");
    }

    return apiOk(resume);
});

export const PUT = withApiHandler(async (req, { params }) => {
    await requireAdmin();
    const { id } = await params;
    const body = await req.json();
    const { title, latex, isDefault, source, structured } = body;
    const cleanTitle = typeof title === "string" ? title.trim() : "";
    const cleanLatex = typeof latex === "string" && latex.trim() ? latex : "% New Resume";

    if (!cleanTitle) {
        throw new Error("title is required");
    }

    const resume = await updateResumeAndCreateVersion({
        id,
        title: cleanTitle,
        latex: cleanLatex,
        isDefault: !!isDefault,
        source: source || "manual",
        structured: ensureStructuredResume({ latex: cleanLatex, structured }),
    });

    return apiOk(resume);
});

export const DELETE = withApiHandler(async (req, { params }) => {
    await requireAdmin();
    const { id } = await params;
    await prisma.resume.delete({
        where: { id }
    });

    return apiOk({ success: true });
});
