
import { getProjectById } from "@/repositories/portfolio.repository";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    const { id } = await params;
    try {
        const project = await getProjectById(id);
        if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
        return NextResponse.json(project);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
    }
}
