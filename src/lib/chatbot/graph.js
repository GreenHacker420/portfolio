import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StateGraph, START, END, Annotation } from "@langchain/langgraph";
import { createToolNode } from "./tool-node.js";
import { AIMessage, SystemMessage } from "@langchain/core/messages";
import { PrismaCheckpointer } from "./checkpointer.js";
import { SYSTEM_PROMPT } from "./prompt.js";
import { contactTool } from "./tools/contact-tool.js";
import { githubTool } from "./tools/github-tool.js";
import { matchTool } from "@/lib/langgraph/tools/match-tool";
import { recruiterTool } from "@/lib/langgraph/tools/recruiter-tool";
import { emailSendTool } from "@/lib/langgraph/tools/email-send-tool";
import { retrieverTool } from "@/lib/langgraph/tools/retriever";
import { googleSearchTool } from "@/lib/langgraph/tools/google-search-tool";

const tools = [retrieverTool, contactTool, githubTool, matchTool, recruiterTool, emailSendTool, googleSearchTool];

// Define the state
const GraphState = Annotation.Root({
    messages: Annotation({
        reducer: (x, y) => x.concat(y),
        default: () => [],
    }),
});

// Lazy-initialize model + graph to avoid build-time crash when GOOGLE_API_KEY is unavailable
let _graph;
export function getGraph() {
    if (_graph) return _graph;

    if (!process.env.GOOGLE_API_KEY) {
        throw new Error("GOOGLE_API_KEY is missing from environment variables");
    }

    const model = new ChatGoogleGenerativeAI({
        model: "gemini-flash-latest",
        apiKey: process.env.GOOGLE_API_KEY.trim(),
        streaming: true,
    });

    const modelWithTools = model.bindTools(tools);

    async function agent(state, config) {
        const { messages } = state;
        try {
            const messagesWithSystem = [new SystemMessage(SYSTEM_PROMPT), ...messages];
            const rawResponse = await modelWithTools.invoke(messagesWithSystem, config);

            const response = new AIMessage({
                content: rawResponse.content || "",
                tool_calls: rawResponse.tool_calls,
                id: rawResponse.id,
                response_metadata: rawResponse.response_metadata
            });

            return { messages: [response] };
        } catch (err) {
            console.error("🔥 Agent Error:", err);
            throw err;
        }
    }

    const toolNode = createToolNode(tools);

    function shouldContinue(state) {
        const messages = state.messages;
        const lastMessage = messages[messages.length - 1];
        if (lastMessage.tool_calls?.length) {
            return "tools";
        }
        return END;
    }

    const workflow = new StateGraph(GraphState)
        .addNode("agent", agent)
        .addNode("tools", toolNode)
        .addEdge(START, "agent")
        .addConditionalEdges("agent", shouldContinue)
        .addEdge("tools", "agent");

    const checkpointer = new PrismaCheckpointer();
    _graph = workflow.compile({ checkpointer });
    return _graph;
}

// Keep backward-compatible named export (lazy proxy)
export const graph = new Proxy({}, {
    get(_, prop) {
        return getGraph()[prop];
    }
});
