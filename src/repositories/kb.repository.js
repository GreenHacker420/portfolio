
import prisma from "@/lib/db";

export async function getAllSnippets() {
    return prisma.knowledgeSnippet.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getSnippetById(id) {
    return prisma.knowledgeSnippet.findUnique({ where: { id } });
}

export async function createSnippetRecord(data) {
    return prisma.knowledgeSnippet.create({ data });
}

export async function updateSnippetRecord(id, data) {
    return prisma.knowledgeSnippet.update({ where: { id }, data });
}

export async function deleteSnippetRecord(id) {
    return prisma.knowledgeSnippet.delete({ where: { id } });
}

export async function deleteAllSnippets() {
    return prisma.knowledgeSnippet.deleteMany();
}

export async function createManySnippets(data) {
    return prisma.knowledgeSnippet.createMany({ data });
}
