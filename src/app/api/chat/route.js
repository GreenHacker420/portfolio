
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

        const result = await graph.invoke(inputs, config);
        const lastMessage = result.messages[result.messages.length - 1];

        return NextResponse.json({
            response: lastMessage.content,
            threadId: config.configurable.thread_id,
        });
    } catch (error) {
        console.error("Chat Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
