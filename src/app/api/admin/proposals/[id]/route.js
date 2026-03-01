import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { updateProposalAndCreateVersion } from "@/lib/proposals/versioning";
import { ensureProposalData } from "@/lib/proposals/defaults";

export async function GET(req, { params }) {
    try {
        const { id } = await params;
        const proposal = await prisma.proposal.findUnique({
            where: { id }
        });

        if (!proposal) {
            return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
        }

        return NextResponse.json(proposal);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch proposal", details: error.message }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const title = typeof body.title === "string" && body.title.trim() ? body.title.trim() : "GSOC Proposal";
        const organization = typeof body.organization === "string" ? body.organization.trim() : "";
        const projectIdea = typeof body.projectIdea === "string" ? body.projectIdea.trim() : "";
        const tone = typeof body.tone === "string" && body.tone.trim() ? body.tone.trim() : "academic";

        const proposal = await updateProposalAndCreateVersion({
            id,
            title,
            organization,
            projectIdea,
            tone,
            source: body.source || "manual",
            data: ensureProposalData(body.data, { title, organization, projectIdea })
        });

        return NextResponse.json(proposal);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update proposal", details: error.message }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const { id } = await params;
        await prisma.proposal.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete proposal", details: error.message }, { status: 500 });
    }
}
