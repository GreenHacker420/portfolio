
import { getAllSnippets, createSnippetRecord } from "@/repositories/kb.repository";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const snippets = await getAllSnippets();
        return NextResponse.json(snippets);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const body = await req.json();
        const snippet = await createSnippetRecord(body);
        return NextResponse.json(snippet);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
