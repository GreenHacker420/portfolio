import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StateGraph, START, END, Annotation } from "@langchain/langgraph";
import { createToolNode } from "./tool-node.js";
import { AIMessage, SystemMessage } from "@langchain/core/messages";
// Prefer persistent checkpoints for multi-agent flows
import { PrismaCheckpointer } from "./checkpointer.js";
import { SYSTEM_PROMPT } from "./prompt.js";
import { contactTool } from "./tools/contact-tool.js";
import { githubTool } from "./tools/github-tool.js";
import { matchTool } from "./tools/match-tool.js";
import { recruiterTool } from "./tools/recruiter-tool.js";
import { emailSendTool } from "./tools/email-send-tool.js";
import { retrieverTool } from "./tools/retriever.js";
import { googleSearchTool } from "./tools/google-search-tool.js";

if (!process.env.GOOGLE_API_KEY) {
    throw new Error("GOOGLE_API_KEY is missing from environment variables");
}

const tools = [retrieverTool, contactTool, githubTool, matchTool, recruiterTool, emailSendTool, googleSearchTool];

// Define the state
const GraphState = Annotation.Root({
    messages: Annotation({
        reducer: (x, y) => x.concat(y),
        default: () => [],
    }),
});

// Initialize the model
console.log("🤖 Initializing ChatGoogleGenerativeAI...", {
    modelName: "gemini-3-flash-preview",
    apiKeyLength: process.env.GOOGLE_API_KEY?.length
});

const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    apiKey: process.env.GOOGLE_API_KEY ? process.env.GOOGLE_API_KEY.trim() : undefined,
});

const modelWithTools = model.bindTools(tools);

// Define the nodes
async function agent(state) {
    const { messages } = state;
    console.log("🕵️‍♂️ Agent invoking model with messages:", messages.length);

    try {
        const messagesWithSystem = [new SystemMessage(SYSTEM_PROMPT), ...messages];
        const rawResponse = await modelWithTools.invoke(messagesWithSystem);

        const response = new AIMessage({
            content: rawResponse.content || "",
            tool_calls: rawResponse.tool_calls,
            id: rawResponse.id,
            response_metadata: rawResponse.response_metadata
        });

        console.log("🕵️‍♂️ Agent received response:");
        console.log("   Type:", typeof response);
        console.log("   Constructor:", response?.constructor?.name);
        console.log("   Content:", response?.content);
        console.log("   Tool Calls:", JSON.stringify(response?.tool_calls));

        return { messages: [response] };
    } catch (err) {
        console.error("🔥 Agent Error:", err);
        throw err;
    }
}

const toolNode = createToolNode(tools);

// Define conditional edges
function shouldContinue(state) {
    const messages = state.messages;
    const lastMessage = messages[messages.length - 1];

    if (lastMessage.tool_calls?.length) {
        return "tools";
    }
    return END;
}

// Create the graph
const workflow = new StateGraph(GraphState)
    .addNode("agent", agent)
    .addNode("tools", toolNode)
    .addEdge(START, "agent")
    .addConditionalEdges("agent", shouldContinue)
    .addEdge("tools", "agent"); // Loop back to agent after tool execution

// Initialize checkpointer
const checkpointer = new PrismaCheckpointer();

// Compile the graph
export const graph = workflow.compile({ checkpointer });
