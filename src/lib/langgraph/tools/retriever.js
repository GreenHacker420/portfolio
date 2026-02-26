import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

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
    const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
    const index = pinecone.index(process.env.PINECONE_INDEX_NAME);
    return PineconeStore.fromExistingIndex(getEmbeddings(), { pineconeIndex: index });
}

export const retrieverTool = new DynamicStructuredTool({
    name: "portfolio_search",
    description: "Search portfolio knowledge base for relevant content",
    schema: z.object({ query: z.string() }),
    func: async ({ query }) => {
        const store = await getStore();
        const docs = await store.asRetriever().invoke(query);
        return docs.map(d => d.pageContent).join("\n\n");
    }
});
