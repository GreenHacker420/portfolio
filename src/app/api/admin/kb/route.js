
import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Assuming auth options export

export async function GET(request) {
    try {
        // Check auth
        // const session = await getServerSession(authOptions);
        // if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const snippets = await prisma.knowledgeSnippet.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(snippets);
    } catch (error) {
        console.error("Error fetching snippets:", error);
        return NextResponse.json({ error: "Failed to fetch snippets" }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const json = await request.json();
        const { content, source, tags, isVisible } = json;

        const snippet = await prisma.knowledgeSnippet.create({
            data: {
                content,
                source,
                tags: tags ? JSON.stringify(tags) : null,
                isVisible: isVisible ?? true,
            },
        });

        return NextResponse.json(snippet);
    } catch (error) {
        console.error("Error creating snippet:", error);
        return NextResponse.json({ error: "Failed to create snippet" }, { status: 500 });
    }
}
