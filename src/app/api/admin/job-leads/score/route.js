import prisma from "@/lib/db";
import { scoreLeadAgainstCv } from "@/lib/match/jd";
import { withApiHandler, apiOk } from "@/lib/apiResponse";
import { requireAdmin } from "@/lib/guard";

export const POST = withApiHandler(async (req) => {
    await requireAdmin();
    const body = await req.json();
    const { leadId, cvText } = body;
    if (!leadId || !cvText) throw new Error("leadId and cvText required");

    const lead = await prisma.jobLead.findUnique({ where: { id: leadId } });
    if (!lead) throw new Error("Lead not found");

    const { score, missingSkills } = await scoreLeadAgainstCv(lead, cvText);
    await prisma.jobLead.update({
        where: { id: leadId },
        data: { matchScore: score, missingSkills: missingSkills.length ? missingSkills.join(",") : null }
    });
    return apiOk({ score, missingSkills });
});
