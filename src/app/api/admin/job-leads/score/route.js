import prisma from "@/lib/db";
import { scoreLeadAgainstCv } from "@/lib/match/jd";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();
        const { leadId, cvText } = body;
        if (!leadId || !cvText) return NextResponse.json({ error: "leadId and cvText required" }, { status: 400 });

        const lead = await prisma.jobLead.findUnique({ where: { id: leadId } });
        if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

        const { score, missingSkills } = await scoreLeadAgainstCv(lead, cvText);
        await prisma.jobLead.update({
            where: { id: leadId },
            data: { matchScore: score, missingSkills: missingSkills.length ? missingSkills.join(",") : null }
        });
        return NextResponse.json({ score, missingSkills });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
