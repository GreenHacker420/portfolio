'use server';

import prisma from "@/lib/db";
import { fetchYCJobs, fetchWellfoundJobs, fetchGithubIssues, normalizeLead } from "@/lib/osint/sources";
import { ingestLinkedIn } from "@/lib/osint/linkedin";
import { fetchRemoteOk } from "@/lib/osint/remoteok";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { cosineSimilarity } from "@/lib/utils/cosine";

async function upsertSource(name, kind) {
    const src = await prisma.jobSource.upsert({
        where: { name },
        update: { updatedAt: new Date(), kind },
        create: { name, kind }
    });
    return src.id;
}

export async function ingestOsintLeads() {
    const embeddings = new GoogleGenerativeAIEmbeddings({
        modelName: "text-embedding-004",
        apiKey: process.env.GOOGLE_API_KEY
    });

    const sources = [
        { name: "remoteok", kind: "remoteok", fetcher: fetchRemoteOk },
        { name: "yc", kind: "yc", fetcher: fetchYCJobs },
        { name: "wellfound", kind: "wellfound", fetcher: fetchWellfoundJobs },
        { name: "github_issues", kind: "github", fetcher: fetchGithubIssues }
    ];

    let inserted = 0;
    for (const src of sources) {
        const sourceId = await upsertSource(src.name, src.kind);
        const raws = await src.fetcher("software engineer");
        for (const raw of raws) {
            const lead = await normalizeLead(raw, src.name);
            // Simple relevance scoring to "software engineer" query
            let relevance = 0;
            try {
                const [a, b] = await Promise.all([
                    embeddings.embedQuery("software engineer full-stack nextjs node"),
                    embeddings.embedQuery(`${lead.title} ${lead.company} ${lead.tags?.join(" ")}`)
                ]);
                relevance = cosineSimilarity(a, b);
            } catch { }

            await prisma.jobLead.upsert({
                where: { url: lead.url || `${lead.company}-${lead.title}-${src.name}` },
                update: {
                    title: lead.title,
                    company: lead.company,
                    location: lead.location,
                    remote: lead.remote,
                    tags: JSON.stringify(lead.tags),
                    sourceId,
                    matchScore: relevance
                },
                create: {
                    title: lead.title,
                    company: lead.company,
                    location: lead.location,
                    remote: lead.remote,
                    tags: JSON.stringify(lead.tags),
                    sourceId,
                    matchScore: relevance
                }
            });
            inserted += 1;
        }
    }
    // LinkedIn query stub
    inserted += await ingestLinkedIn(prisma, "software engineer remote");
    return { inserted };
}
