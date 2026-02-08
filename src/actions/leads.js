'use server';

import prisma from "@/lib/db";
import { fetchYCJobs, fetchWellfoundJobs, fetchGithubIssues, normalizeLead } from "@/lib/osint/sources";

async function upsertSource(name, kind) {
    const src = await prisma.jobSource.upsert({
        where: { name },
        update: { updatedAt: new Date(), kind },
        create: { name, kind }
    });
    return src.id;
}

export async function ingestOsintLeads() {
    const sources = [
        { name: "yc", kind: "yc", fetcher: fetchYCJobs },
        { name: "wellfound", kind: "wellfound", fetcher: fetchWellfoundJobs },
        { name: "github_issues", kind: "github", fetcher: fetchGithubIssues }
    ];

    let inserted = 0;
    for (const src of sources) {
        const sourceId = await upsertSource(src.name, src.kind);
        const raws = await src.fetcher();
        for (const raw of raws) {
            const lead = await normalizeLead(raw, src.name);
            await prisma.jobLead.upsert({
                where: { url: lead.url || `${lead.company}-${lead.title}` },
                update: {
                    title: lead.title,
                    company: lead.company,
                    location: lead.location,
                    remote: lead.remote,
                    tags: JSON.stringify(lead.tags),
                    sourceId
                },
                create: {
                    title: lead.title,
                    company: lead.company,
                    location: lead.location,
                    remote: lead.remote,
                    tags: JSON.stringify(lead.tags),
                    sourceId
                }
            });
            inserted += 1;
        }
    }
    return { inserted };
}
