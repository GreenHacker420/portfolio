import prisma from "@/lib/db";
import { withApiHandler, apiOk } from "@/lib/apiResponse";
import { requireAdmin } from "@/lib/guard";

export const GET = withApiHandler(async () => {
    await requireAdmin();
    const leads = await prisma.jobLead.findMany({
        orderBy: { createdAt: "desc" },
        take: 200,
        include: { source: true }
    });
    return apiOk(leads);
});

export const POST = withApiHandler(async (req) => {
    await requireAdmin();
    const body = await req.json();
    const { title, company, sourceName = "manual", url, description, location, remote, tags } = body;

    const source = await prisma.jobSource.upsert({
        where: { name: sourceName },
        update: { updatedAt: new Date() },
        create: { name: sourceName, kind: "manual" }
    });

    const lead = await prisma.jobLead.create({
        data: {
            title,
            company,
            url,
            description,
            location,
            remote: !!remote,
            tags: tags ? JSON.stringify(tags) : null,
            sourceId: source.id
        }
    });

    return apiOk(lead);
});
