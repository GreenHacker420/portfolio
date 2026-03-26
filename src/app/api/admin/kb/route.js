
import { getAllSnippets, createSnippetRecord } from "@/repositories/kb.repository";
import { withApiHandler, apiOk } from "@/lib/apiResponse";
import { requireAdmin } from "@/lib/guard";

export const GET = withApiHandler(async () => {
    await requireAdmin();
    const snippets = await getAllSnippets();
    return apiOk(snippets);
});

export const POST = withApiHandler(async (req) => {
    await requireAdmin();
    const body = await req.json();
    const snippet = await createSnippetRecord(body);
    return apiOk(snippet);
});
