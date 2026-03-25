
'use server';

import { fetchRemoteOk } from "@/lib/osint/remoteok";
import { fetchYC } from "@/lib/osint/yc";
import { fetchAdzuna } from "@/lib/osint/adzuna";
import { fetchJSearch } from "@/lib/osint/jsearch";
import { fetchWellfoundJobs, fetchGithubIssues, normalizeLead } from "@/lib/osint/sources";
import { withErrorHandler } from "@/lib/response";
import { requireAdmin } from "@/lib/guard";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { cosineSimilarity } from "@/lib/utils/cosine";
import { upsertJobLead, upsertJobSource, runLinkedInIngestion } from "@/repositories/leads.repository";

export async function ingestOsintLeads() {
    return withErrorHandler(async () => {
        await requireAdmin();

        const embeddings = new GoogleGenerativeAIEmbeddings({
            modelName: "text-embedding-004",
            apiKey: process.env.GOOGLE_API_KEY
        });

        const sources = [
            { name: "remoteok", kind: "remoteok", fetcher: () => fetchRemoteOk("software engineer") },
            { name: "yc", kind: "yc", fetcher: () => fetchYC("software engineer") },
            { name: "adzuna", kind: "adzuna", fetcher: () => fetchAdzuna("software engineer") },
            { name: "jsearch", kind: "jsearch", fetcher: () => fetchJSearch("software engineer remote") },
            { name: "wellfound", kind: "wellfound", fetcher: fetchWellfoundJobs },
            { name: "github_issues", kind: "github", fetcher: fetchGithubIssues }
        ];

        let inserted = 0;
        for (const src of sources) {
            try {
                const source = await upsertJobSource(src.name, src.kind);
                const raws = await src.fetcher();
                for (const raw of raws) {
                    const lead = await normalizeLead(raw, src.name);
                    let relevance = 0;
                    try {
                        const [a, b] = await Promise.all([
                            embeddings.embedQuery("software engineer full-stack nextjs node"),
                            embeddings.embedQuery(`${lead.title} ${lead.company} ${lead.tags?.join(" ")}`)
                        ]);
                        relevance = cosineSimilarity(a, b);
                    } catch { }

                    await upsertJobLead({
                        url: lead.url || `${lead.company}-${lead.title}-${src.name}`,
                        title: lead.title,
                        company: lead.company,
                        location: lead.location,
                        remote: lead.remote,
                        tags: JSON.stringify(lead.tags),
                        sourceId: source.id,
                        matchScore: relevance
                    });
                    inserted += 1;
                }
            } catch (e) {
                console.error(`Failed to ingest from ${src.name}:`, e);
            }
        }
        
        const linkedInCount = await runLinkedInIngestion("software engineer remote");
        return { inserted: inserted + linkedInCount };
    });
}
