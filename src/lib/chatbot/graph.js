import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { StateGraph, START, END, Annotation } from "@langchain/langgraph";
import { createToolNode } from "./tool-node.js";
import { z } from "zod";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { AIMessage, SystemMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { SYSTEM_PROMPT } from "./prompt.js";

// Initialize Pinecone Client
if (!process.env.PINECONE_API_KEY) {
    throw new Error("PINECONE_API_KEY is missing from environment variables");
}
if (!process.env.GOOGLE_API_KEY) {
    throw new Error("GOOGLE_API_KEY is missing from environment variables");
}

const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
});

const pineconeIndex = pinecone.index(process.env.PINECONE_INDEX_NAME);

// Initialize Embeddings
const embeddings = new GoogleGenerativeAIEmbeddings({
    modelName: "text-embedding-004",
    apiKey: process.env.GOOGLE_API_KEY,
});

// Initialize Vector Store
const vectorStore = await PineconeStore.fromExistingIndex(
    embeddings,
    { pineconeIndex }
);

const retrieverTool = new DynamicStructuredTool({
    name: "portfolio_search",
    description: "Search for information about the portfolio owner's projects, skills, and experience. Use this tool finding answers to user questions.",
    schema: z.object({
        query: z.string().describe("The search query to find relevant information."),
    }),
    func: async ({ query }) => {
        const docs = await vectorStore.asRetriever().invoke(query);
        return docs.map(doc => doc.pageContent).join("\n\n");
    },
});

const tools = [retrieverTool];

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
const checkpointer = new MemorySaver();

// Compile the graph
export const graph = workflow.compile({ checkpointer });
