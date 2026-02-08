import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import prisma from "@/lib/db";
import { scoreLeadAgainstCv } from "@/lib/match/jd";

export const matchTool = new DynamicStructuredTool({
    name: "score_lead_cv",
    description: "Compute similarity score between a stored job lead and a CV text",
    schema: z.object({
        leadId: z.string().describe("Job lead ID"),
        cvText: z.string().describe("Raw CV/resume text")
    }),
    func: async ({ leadId, cvText }) => {
        const lead = await prisma.jobLead.findUnique({ where: { id: leadId } });
        if (!lead) return "Lead not found";
        const score = await scoreLeadAgainstCv(lead, cvText);
        await prisma.jobLead.update({ where: { id: leadId }, data: { matchScore: score } });
        return `Match score: ${(score * 100).toFixed(1)}%`;
    }
});
