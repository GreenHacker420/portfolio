
import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { StateGraph, START, END, Annotation } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { PrismaCheckpointer } from "./checkpointer.js";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { createRetrieverTool } from "langchain/tools/retriever";

// Initialize Pinecone Client
const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
});

const pineconeIndex = pinecone.index(process.env.PINECONE_INDEX_NAME);

// Initialize Embeddings
const embeddings = new GoogleGenerativeAIEmbeddings({
    modelName: "embedding-001", // or "text-embedding-004"
    apiKey: process.env.GOOGLE_API_KEY,
});

// Initialize Vector Store
const vectorStore = await PineconeStore.fromExistingIndex(
    embeddings,
    { pineconeIndex }
);

// Create Retriever Tool
const retriever = vectorStore.asRetriever();
const retrieverTool = createRetrieverTool(retriever, {
    name: "portfolio_search",
    description: "Search for information about the portfolio owner's projects, skills, and experience.",
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
const model = new ChatGoogleGenerativeAI({
    modelName: "gemini-1.5-flash",
    maxOutputTokens: 2048,
    apiKey: process.env.GOOGLE_API_KEY,
}).bindTools(tools);

// Define the nodes
async function agent(state) {
    const { messages } = state;
    const response = await model.invoke(messages);
    return { messages: [response] };
}

// Define the tool node
const toolNode = new ToolNode(tools);

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
