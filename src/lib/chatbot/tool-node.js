import { ToolMessage, isAIMessage } from "@langchain/core/messages";

export function createToolNode(tools) {
    const methods = tools.reduce((acc, tool) => {
        acc[tool.name] = tool;
        return acc;
    }, {});

    return async (input) => {
        let messages;
        if (Array.isArray(input)) {
            messages = input;
        } else if (input && typeof input === 'object' && Array.isArray(input.messages)) {
            messages = input.messages;
        } else {
            console.error("ToolNode Input Error. Received:", JSON.stringify(input, null, 2));
            throw new Error("ToolNode only accepts BaseMessage[] or { messages: BaseMessage[] } as input.");
        }

        const lastMessage = messages[messages.length - 1];

        if (!lastMessage || !isAIMessage(lastMessage) || !lastMessage.tool_calls) {
            console.warn("ToolNode received message satisfying criteria but check failed?", lastMessage);
            throw new Error("Last message is not an AIMessage with tool_calls");
        }

        const outputs = await Promise.all(lastMessage.tool_calls.map(async (call) => {
            const tool = methods[call.name];
            try {
                if (!tool) {
                    throw new Error(`Tool "${call.name}" not found.`);
                }
                const output = await tool.invoke(call.args);
                return new ToolMessage({
                    tool_call_id: call.id,
                    content: typeof output === 'string' ? output : JSON.stringify(output),
                    name: call.name,
                });
            } catch (e) {
                return new ToolMessage({
                    tool_call_id: call.id,
                    content: `Error: ${e.message}`,
                    name: call.name,
                    status: "error"
                });
            }
        }));

        return { messages: outputs };
    };
}
