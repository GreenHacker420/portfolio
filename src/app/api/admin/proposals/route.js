import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { createProposalWithInitialVersion } from "@/lib/proposals/versioning";

export async function GET() {
    try {
        const proposals = await prisma.proposal.findMany({
            orderBy: { updatedAt: "desc" },
            include: {
                _count: {
                    select: { versions: true }
                }
            }
        });

        return NextResponse.json(proposals);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch proposals", details: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const body = await req.json();
        const title = typeof body.title === "string" && body.title.trim() ? body.title.trim() : "GSOC Proposal";
        const organization = typeof body.organization === "string" ? body.organization.trim() : "";
        const projectIdea = typeof body.projectIdea === "string" ? body.projectIdea.trim() : "";
        const tone = typeof body.tone === "string" && body.tone.trim() ? body.tone.trim() : "academic";

        const proposal = await createProposalWithInitialVersion({
            title,
            organization,
            projectIdea,
            tone,
            data: body.data || null,
            source: "create"
        });

        return NextResponse.json(proposal);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create proposal", details: error.message }, { status: 500 });
    }
}
