
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from "@langchain/pinecone";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Document } from "@langchain/core/documents";

export async function POST() {
    try {
        // 1. Fetch from DB
        const snippets = await prisma.knowledgeSnippet.findMany();

        if (snippets.length === 0) {
            return NextResponse.json({
                success: true,
                message: "No snippets found in database to sync.",
                count: 0
            });
        }

        // 2. Convert to LangChain Documents
        const docs = snippets.map(s => {
            // Parse tags if they are a string, otherwise keep raw
            let validTags = [];
            try {
                validTags = s.tags ? JSON.parse(s.tags) : [];
            } catch (e) {
                validTags = [s.tags];
            }

            return new Document({
                pageContent: s.content,
                metadata: {
                    db_id: s.id,
                    source: s.source || "admin-kb",
                    tags: Array.isArray(validTags) ? validTags.join(", ") : validTags,
                    type: 'knowledge_snippet'
                }
            });
        });

        // 3. Initialize Pinecone & Embeddings
        if (!process.env.PINECONE_API_KEY || !process.env.PINECONE_INDEX_NAME || !process.env.GOOGLE_API_KEY) {
            throw new Error("Missing API Keys");
        }

        const pinecone = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY
        });
        const pineconeIndex = pinecone.index(process.env.PINECONE_INDEX_NAME);

        const embeddings = new GoogleGenerativeAIEmbeddings({
            modelName: "text-embedding-004",
            apiKey: process.env.GOOGLE_API_KEY,
            taskType: "RETRIEVAL_DOCUMENT"
        });

        // 4. Upsert (Overwrite/Add)
        // Note: This doesn't delete old vectors validation-wise, but good enough for now.
        await PineconeStore.fromDocuments(docs, embeddings, {
            pineconeIndex,
            maxConcurrency: 5,
        });

        return NextResponse.json({
            success: true,
            message: `Successfully synced ${docs.length} snippets to AI Memory.`,
            count: docs.length
        });

    } catch (error) {
        console.error("Sync Error:", error);
        return NextResponse.json({ error: error.message || "Failed to sync" }, { status: 500 });
    }
}
