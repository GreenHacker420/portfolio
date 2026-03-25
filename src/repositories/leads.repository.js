
import prisma from "@/lib/db";
import { ingestLinkedIn as libIngestLinkedIn } from "@/lib/osint/linkedin";

export async function upsertJobSource(name, kind) {
    return prisma.jobSource.upsert({
        where: { name },
        update: { updatedAt: new Date(), kind },
        create: { name, kind }
    });
}

export async function upsertJobLead(data) {
    const { url, ...rest } = data;
    return prisma.jobLead.upsert({
        where: { url },
        update: rest,
        create: data
    });
}

export async function runLinkedInIngestion(query) {
    return libIngestLinkedIn(prisma, query);
}
