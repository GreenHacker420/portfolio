
import { graph } from "@/lib/chatbot/graph";
import { HumanMessage } from "@langchain/core/messages";
import { withApiHandler, apiOk } from "@/lib/apiResponse";
import { getClientIp, requireRateLimit } from "@/lib/guard";
import { buildSystemPrompt } from "@/lib/chatbot/prompt";
import { getPortfolioData } from "@/repositories/portfolio.repository";
import { getGithubStats } from "@/services/github/github.service";
import { getPineconeClient } from "@/lib/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

export const dynamic = 'force-dynamic';

export const POST = withApiHandler(async (req) => {
    const ip = await getClientIp();
    await requireRateLimit(`chat:${ip}`, 10, 60_000);

    const { message, threadId } = await req.json();

    if (!message) {
        throw new Error("Message is required");
    }

    // 1. Fetch Live Context (CRAG)
    const [portfolioData, githubStats] = await Promise.all([
        getPortfolioData().catch(() => null),
        getGithubStats("GreenHacker420").catch(() => null)
    ]);

    // 2. Vector Search for extra context
    let retrievedDocs = [];
    try {
        const pinecone = getPineconeClient();
        if (pinecone) {
            const embeddings = new GoogleGenerativeAIEmbeddings({
                modelName: "text-embedding-004",
                apiKey: process.env.GOOGLE_API_KEY
            });
            const index = pinecone.index(process.env.PINECONE_INDEX_NAME);
            const vectorStore = await PineconeStore.fromExistingIndex(embeddings, { pineconeIndex: index });
            const docs = await vectorStore.asRetriever({ k: 5 }).invoke(message);
            retrievedDocs = docs.map(d => d.pageContent);
        }
    } catch (e) {
        console.error("[Chat API] Pinecone retrieval failed:", e);
    }

    // 3. Build Dynamic System Prompt
    const dynamicPrompt = buildSystemPrompt({
        portfolioData,
        githubStats,
        retrievedDocs,
        currentDate: new Date().toDateString()
    });

    const config = {
        configurable: {
            thread_id: threadId || Date.now().toString(),
        },
    };

    const inputs = {
        messages: [new HumanMessage(message)],
        systemPrompt: dynamicPrompt,
    };

    // Create a streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        async start(controller) {
            try {
                const eventStream = await graph.streamEvents(inputs, {
                    ...config,
                    version: "v2",
                });

                for await (const { event, data } of eventStream) {
                    if (event === "on_chat_model_stream") {
                        if (data.chunk.content) {
                            controller.enqueue(encoder.encode(data.chunk.content));
                        }
                    }
                }
                controller.close();
            } catch (e) {
                console.error("[Chat Stream Error]", e);
                controller.error(e);
            }
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-cache, no-transform",
            "Connection": "keep-alive",
            "X-Thread-Id": config.configurable.thread_id,
        },
    });
});

export const GET = withApiHandler(async (req) => {
    const ip = await getClientIp();
    await requireRateLimit(`chat-history:${ip}`, 10, 60_000);

    const { searchParams } = new URL(req.url);
    const threadId = searchParams.get("threadId");

    if (!threadId) {
        throw new Error("Thread ID is required");
    }

    const config = {
        configurable: {
            thread_id: threadId,
        },
    };

    const state = await graph.getState(config);
    const messages = state.values.messages || [];

    const formattedMessages = messages.map(m => ({
        role: m.constructor.name === "HumanMessage" ? "user" : "assistant",
        content: m.content || (Array.isArray(m.content) ? m.content.map(c => c.text).join("") : ""),
    }));

    return apiOk({ messages: formattedMessages });
});
