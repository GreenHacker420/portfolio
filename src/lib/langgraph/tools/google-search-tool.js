import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

/**
 * Google Custom Search tool using CSE ID + API key.
 */
export const googleSearchTool = new DynamicStructuredTool({
    name: "google_custom_search",
    description: "Search the web using Google CSE for fresh results",
    schema: z.object({
        query: z.string().describe("Search query"),
        num: z.number().int().min(1).max(10).optional()
    }),
    func: async ({ query, num = 5 }) => {
        const apiKey = process.env.GOOGLE_API_KEY;
        const cseId = process.env.GOOGLE_CSE_ID;
        if (!apiKey || !cseId) {
            return "Google CSE not configured";
        }
        const url = new URL("https://www.googleapis.com/customsearch/v1");
        url.searchParams.set("key", apiKey);
        url.searchParams.set("cx", cseId);
        url.searchParams.set("q", query);
        url.searchParams.set("num", String(num));
        const res = await fetch(url.toString(), { cache: "no-store" });
        if (!res.ok) return `Google search failed: ${res.statusText}`;
        const data = await res.json();
        const items = data.items || [];
        return items.map((i, idx) => `${idx + 1}. ${i.title} — ${i.link}`).join("\n");
    }
});
