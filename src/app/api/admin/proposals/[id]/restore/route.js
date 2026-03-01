import { NextResponse } from "next/server";
import { restoreProposalVersion } from "@/lib/proposals/versioning";

export async function POST(req, { params }) {
    try {
        const { id } = await params;
        const { versionId } = await req.json();

        if (!versionId) {
            return NextResponse.json({ error: "versionId is required" }, { status: 400 });
        }

        const restored = await restoreProposalVersion({ proposalId: id, versionId });
        if (!restored) {
            return NextResponse.json({ error: "Proposal version not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, proposal: restored });
    } catch (error) {
        return NextResponse.json({ error: "Failed to restore proposal version", details: error.message }, { status: 500 });
    }
}
