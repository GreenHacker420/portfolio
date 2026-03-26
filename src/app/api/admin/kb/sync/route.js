
import prisma from "@/lib/db";
import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from "@langchain/pinecone";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Document } from "@langchain/core/documents";
import { withApiHandler, apiOk } from "@/lib/apiResponse";
import { requireAdmin } from "@/lib/guard";
import { fetchRepoReadme, fetchRecentCommits } from "@/services/github/github.fetcher";
import { getGithubStats, buildGithubHeaders } from "@/services/github/github.service";

export const POST = withApiHandler(async () => {
    await requireAdmin();
    // 1. Fetch from DB
    const snippets = await prisma.knowledgeSnippet.findMany();

    // 2. Convert to LangChain Documents
    const snippetDocs = snippets.map(s => {
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

    // 4. GitHub Enrichment
    const githubStats = await getGithubStats("GreenHacker420", true);
    const githubHeaders = buildGithubHeaders();
    const repoDocs = [];

    if (githubStats && Array.isArray(githubStats.showcaseRepos)) {
        for (const repo of githubStats.showcaseRepos) {
            const [readme, commits] = await Promise.all([
                fetchRepoReadme("GreenHacker420", repo.name, githubHeaders),
                fetchRecentCommits("GreenHacker420", repo.name, 5, githubHeaders)
            ]);

            const repoContent = [
                `REPO: ${repo.name}`,
                `DESCRIPTION: ${repo.description}`,
                `STACK: ${repo.language || "Unknown"}`,
                readme ? `README SUMMARY: ${readme.slice(0, 500)}` : "",
                commits.length > 0 ? `RECENT ACTIVITY:\n${commits.map(c => `- ${c.message} (${c.date})`).join("\n")}` : ""
            ].filter(Boolean).join("\n");

            repoDocs.push(new Document({
                pageContent: repoContent,
                metadata: {
                    type: 'repo',
                    repoName: repo.name,
                    language: repo.language || 'Unknown',
                    source: 'github'
                }
            }));
        }
    }

    const allDocs = [...snippetDocs, ...repoDocs];

    // 5. Upsert (Overwrite/Add)
    await PineconeStore.fromDocuments(allDocs, embeddings, {
        pineconeIndex,
        maxConcurrency: 5,
    });

    return apiOk({
        success: true,
        message: `Successfully synced ${snippetDocs.length} snippets and ${repoDocs.length} repos to AI Memory.`,
        count: allDocs.length
    });
});
