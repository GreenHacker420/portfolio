
import { graph } from "@/lib/chatbot/graph";
import { HumanMessage } from "@langchain/core/messages";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
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

        return new NextResponse(stream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "X-Thread-Id": config.configurable.thread_id,
            },
        });

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
