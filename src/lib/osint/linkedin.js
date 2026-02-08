import { normalizeLead } from "./sources";

// Placeholder scraper using a public search query; replace with official API or proxy later.
export async function fetchLinkedInJobs(query = "software engineer remote") {
    // In production, integrate a compliant search API or internal scraper.
    // Here we return a stub to keep pipeline flowing.
    return [
        {
            title: "Software Engineer",
            company: "LinkedIn Co",
            url: "https://linkedin.com/jobs/view/123",
            location: "Remote",
            tags: query.split(" ")
        }
    ];
}

export async function ingestLinkedIn(prisma, query) {
    const src = await prisma.jobSource.upsert({
        where: { name: "linkedin" },
        update: { kind: "linkedin" },
        create: { name: "linkedin", kind: "linkedin" }
    });
    const raws = await fetchLinkedInJobs(query);
    let inserted = 0;
    for (const raw of raws) {
        const lead = await normalizeLead(raw, "linkedin");
        await prisma.jobLead.upsert({
            where: { url: lead.url || `${lead.company}-${lead.title}-linkedin` },
            update: {
                title: lead.title,
                company: lead.company,
                location: lead.location,
                remote: lead.remote,
                tags: JSON.stringify(lead.tags),
                sourceId: src.id
            },
            create: {
                title: lead.title,
                company: lead.company,
                location: lead.location,
                remote: lead.remote,
                tags: JSON.stringify(lead.tags),
                sourceId: src.id
            }
        });
        inserted += 1;
    }
    return inserted;
}
