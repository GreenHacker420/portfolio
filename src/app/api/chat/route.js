
import { graph } from "@/lib/chatbot/graph";
import { HumanMessage } from "@langchain/core/messages";
import { NextResponse } from "next/server";
import { rateLimit, rateLimitResponse } from "@/lib/rateLimit";

export const dynamic = 'force-dynamic';

export async function POST(req) {
    try {
        const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
        const rl = rateLimit(`chat:${ip}`, 30, 60_000);
        if (!rl.ok) {
            const res = NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
            rateLimitResponse(res, rl);
            return res;
        }

        const { message, threadId } = await req.json();

        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        const config = {
            configurable: {
                thread_id: threadId || Date.now().toString(),
            },
        };

        const inputs = {
            messages: [new HumanMessage(message)],
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
                            // data.chunk is an AIMessageChunk
                            if (data.chunk.content) {
                                controller.enqueue(encoder.encode(data.chunk.content));
                            }
                        }
                    }
                    controller.close();
                } catch (e) {
                    controller.error(e);
                }
            },
        });

        const res = new Response(stream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Cache-Control": "no-cache, no-transform",
                "Connection": "keep-alive",
                "X-Thread-Id": config.configurable.thread_id,
            },
        });
        rateLimitResponse(res, rl);
        return res;

    } catch (error) {
        console.error("Chat Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const threadId = searchParams.get("threadId");

        if (!threadId) {
            return NextResponse.json({ error: "Thread ID is required" }, { status: 400 });
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

        return NextResponse.json({ messages: formattedMessages });
    } catch (error) {
        console.error("Fetch History Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
