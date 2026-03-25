
import { getAllProposals, createProposalRecord, createProposalVersionRecord } from "@/repositories/proposal.repository";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const proposals = await getAllProposals();
        return NextResponse.json(proposals);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const body = await req.json();
        const proposal = await createProposalRecord({
            title: body.title,
            organization: body.organization,
            projectIdea: body.projectIdea,
            tone: body.tone || "academic",
            data: body.data || {}
        });

        await createProposalVersionRecord({
            proposalId: proposal.id,
            title: proposal.title,
            tone: proposal.tone,
            data: proposal.data,
            source: "create"
        });

        return NextResponse.json(proposal);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
