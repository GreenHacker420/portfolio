
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const json = await request.json();
        const { content, source, tags, isVisible } = json;

        const snippet = await prisma.knowledgeSnippet.update({
            where: { id },
            data: {
                content,
                source,
                tags: tags ? JSON.stringify(tags) : null,
                isVisible,
            },
        });

        return NextResponse.json(snippet);
    } catch (error) {
        console.error("Error updating snippet:", error);
        return NextResponse.json({ error: "Failed to update snippet" }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        await prisma.knowledgeSnippet.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting snippet:", error);
        return NextResponse.json({ error: "Failed to delete snippet" }, { status: 500 });
    }
}
