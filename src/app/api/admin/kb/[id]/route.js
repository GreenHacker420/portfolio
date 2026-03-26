
import prisma from "@/lib/db";
import { withApiHandler, apiOk } from "@/lib/apiResponse";
import { requireAdmin } from "@/lib/guard";

export const PUT = withApiHandler(async (request, { params }) => {
    await requireAdmin();
    const { id } = await params;
    const json = await request.json();
    const { content, source, tags, isVisible } = json;

    const snippet = await prisma.knowledgeSnippet.update({
        where: { id },
        data: {
            content,
            source,
            tags: tags ? JSON.stringify(tags) : null,
            isVisible,
        },
    });

    return apiOk(snippet);
});

export const DELETE = withApiHandler(async (request, { params }) => {
    await requireAdmin();
    const { id } = await params;
    await prisma.knowledgeSnippet.delete({
        where: { id },
    });

    return apiOk({ success: true });
});
