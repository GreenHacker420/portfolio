
import { BaseCheckpointSaver } from "@langchain/langgraph-checkpoint";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class PrismaCheckpointer extends BaseCheckpointSaver {
    constructor() {
        super();
    }

    async getTuple(config) {
        const thread_id = config.configurable?.thread_id;
        const checkpoint_ns = config.configurable?.checkpoint_ns || "";
        const checkpoint_id = config.configurable?.checkpoint_id;

        if (!thread_id) return undefined;

        const where = {
            thread_id,
            checkpoint_ns,
        };

        if (checkpoint_id) {
            where.checkpoint_id = checkpoint_id;
        }

        // Find the latest checkpoint if no specific ID is provided
        const checkpoint = await prisma.chatCheckpoint.findFirst({
            where,
            orderBy: {
                checkpoint_id: 'desc',
            },
        });

        if (!checkpoint) return undefined;

        return {
            config: {
                configurable: {
                    thread_id: checkpoint.thread_id,
                    checkpoint_ns: checkpoint.checkpoint_ns,
                    checkpoint_id: checkpoint.checkpoint_id,
                },
            },
            checkpoint: checkpoint.checkpoint,
            metadata: checkpoint.metadata,
            parentConfig: checkpoint.parent_checkpoint_id
                ? {
                    configurable: {
                        thread_id: checkpoint.thread_id,
                        checkpoint_ns: checkpoint.checkpoint_ns,
                        checkpoint_id: checkpoint.parent_checkpoint_id,
                    },
                }
                : undefined,
        };
    }

    async *list(config, options) {
        const thread_id = config.configurable?.thread_id;
        const checkpoint_ns = config.configurable?.checkpoint_ns || "";

        if (!thread_id) return;

        const checkpoints = await prisma.chatCheckpoint.findMany({
            where: {
                thread_id,
                checkpoint_ns,
            },
            orderBy: {
                checkpoint_id: 'desc',
            },
            take: options?.limit,
            // Handle before/after logic if needed, but simple list for now
        });

        for (const cp of checkpoints) {
            yield {
                config: {
                    configurable: {
                        thread_id: cp.thread_id,
                        checkpoint_ns: cp.checkpoint_ns,
                        checkpoint_id: cp.checkpoint_id,
                    },
                },
                checkpoint: cp.checkpoint,
                metadata: cp.metadata,
                parentConfig: cp.parent_checkpoint_id
                    ? {
                        configurable: {
                            thread_id: cp.thread_id,
                            checkpoint_ns: cp.checkpoint_ns,
                            checkpoint_id: cp.parent_checkpoint_id,
                        },
                    }
                    : undefined,
            };
        }
    }

    async put(config, checkpoint, metadata) {
        const thread_id = config.configurable?.thread_id;
        const checkpoint_ns = config.configurable?.checkpoint_ns || "";
        const checkpoint_id = checkpoint.id;
        const parent_checkpoint_id = config.configurable?.checkpoint_id;

        if (!thread_id) return undefined;

        await prisma.chatCheckpoint.upsert({
            where: {
                thread_id_checkpoint_ns_checkpoint_id: {
                    thread_id,
                    checkpoint_ns,
                    checkpoint_id,
                },
            },
            create: {
                thread_id,
                checkpoint_ns,
                checkpoint_id,
                parent_checkpoint_id,
                type: "checkpoint",
                checkpoint: checkpoint,
                metadata: metadata,
            },
            update: {
                checkpoint: checkpoint,
                metadata: metadata,
            },
        });

        return {
            configurable: {
                thread_id,
                checkpoint_ns,
                checkpoint_id,
            },
        };
    }

    async putWrites(config, writes, taskId) {
        // Implementation for saving writes - Optional for basic persistence but recommended
        // skipping for now as it adds complexity and getTuple works fine without recovering in-progress steps for this simple chatbot
        return;
    }
}
