import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { PineconeStore } from "@langchain/pinecone";
import { getPineconeClient } from "@/lib/pinecone";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { withTimeout } from "@/lib/utils/timeout";

let _embeddings;
function getEmbeddings() {
    if (!_embeddings) {
        _embeddings = new GoogleGenerativeAIEmbeddings({
            modelName: "text-embedding-004",
            apiKey: process.env.GOOGLE_API_KEY
        });
    }
    return _embeddings;
}

async function getStore() {
    const pinecone = getPineconeClient();
    if (!pinecone) throw new Error("Pinecone client not initialized");
    const indexName = process.env.PINECONE_INDEX_NAME;
    if (!indexName) throw new Error("PINECONE_INDEX_NAME not defined");
    const index = pinecone.index(indexName);
    return PineconeStore.fromExistingIndex(getEmbeddings(), { pineconeIndex: index });
}

export const retrieverTool = new DynamicStructuredTool({
    name: "portfolio_search",
    description: "Search portfolio knowledge base for relevant content",
    schema: z.object({ query: z.string() }),
    func: async ({ query }) => {
        try {
            const store = await getStore();
            const docs = await withTimeout(store.asRetriever().invoke(query), 10000, "Knowledge Base");
            return docs.map(d => d.pageContent).join("\n\n");
        } catch (e) {
            console.error("[RetrieverTool] Error:", e);
            return `Search failed: ${e.message}`;
        }
    }
});
