import { NextResponse } from "next/server";
import { restoreResumeVersion } from "@/lib/resume/versioning";

export async function POST(req, { params }) {
    try {
        const { id } = await params;
        const { versionId } = await req.json();

        if (!versionId) {
            return NextResponse.json({ error: "versionId is required" }, { status: 400 });
        }

        const restored = await restoreResumeVersion({ resumeId: id, versionId });
        if (!restored) {
            return NextResponse.json({ error: "Version not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, resume: restored });
    } catch (error) {
        return NextResponse.json({ error: "Failed to restore version", details: error.message }, { status: 500 });
    }
}
