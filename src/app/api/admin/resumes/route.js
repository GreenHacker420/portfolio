import { getAllResumes, getResumeVersionCounts } from "@/repositories/resume.repository";
import { withApiHandler, apiOk } from "@/lib/apiResponse";
import { requireAdmin } from "@/lib/guard";
import { createResumeWithInitialVersion } from "@/lib/resume/versioning";
import { ensureStructuredResume } from "@/lib/resume/structured";

export const GET = withApiHandler(async () => {
    await requireAdmin();
    const [resumes, versionCountsByResumeId] = await Promise.all([
        getAllResumes(),
        getResumeVersionCounts().catch(() => ({}))
    ]);

    const payload = resumes.map((resume) => ({
        ...resume,
        _count: {
            versions: Number(versionCountsByResumeId[resume.id] || 0)
        }
    }));

    return apiOk(payload);
});

export const POST = withApiHandler(async (req) => {
    await requireAdmin();
    const body = await req.json();
    const { title, latex, structured } = body;
    const cleanTitle = typeof title === "string" ? title.trim() : "";
    const cleanLatex = typeof latex === "string" && latex.trim() ? latex : "% New Resume";

    if (!cleanTitle) {
        throw new Error("title is required");
    }

    const resume = await createResumeWithInitialVersion({
        title: cleanTitle,
        latex: cleanLatex,
        structured: ensureStructuredResume({ latex: cleanLatex, structured }),
        source: "create"
    });

    return apiOk(resume);
});
