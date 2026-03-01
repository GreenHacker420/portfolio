import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { getGithubStats } from "@/services/github/github.service";

function safeTag(value) {
    return String(value || "")
        .toLowerCase()
        .replace(/[^a-z0-9\-\_\+\.]/g, "")
        .trim();
}

export async function POST(req) {
    try {
        const body = await req.json().catch(() => ({}));
        const explicitUsername = body?.username;
        const info = await prisma.personalInfo.findUnique({ where: { id: "default" } });
        const username = explicitUsername || info?.githubUsername;

        if (!username) {
            return NextResponse.json({ error: "GitHub username not configured" }, { status: 400 });
        }

        const stats = await getGithubStats(username, true);
        if (!stats) {
            return NextResponse.json({ error: "Failed to fetch GitHub stats" }, { status: 500 });
        }

        const source = `GitHub:${username}`;
        await prisma.knowledgeSnippet.deleteMany({
            where: { source }
        });

        const snippets = [];

        if (stats?.profile) {
            snippets.push({
                content: `GitHub profile: ${stats.profile.name} (${username}) with ${stats.publicRepos} repos, ${stats.followers} followers, and ${stats.totalStars} total stars.`,
                source,
                tags: JSON.stringify(["github", "profile", safeTag(username)]),
                isVisible: true
            });
        }

        (stats?.showcaseRepos || []).slice(0, 6).forEach((repo) => {
            snippets.push({
                content: `Repository ${repo.name}: ${repo.description || "No description"}. Stack: ${repo.language || "Unknown"}. Stars: ${repo.stars}, Forks: ${repo.forks}. URL: ${repo.url}`,
                source,
                tags: JSON.stringify(["github", "repo", safeTag(repo.language), safeTag(repo.name)]),
                isVisible: true
            });
        });

        (stats?.languages || []).slice(0, 6).forEach((lang) => {
            snippets.push({
                content: `Language signal: ${lang.name} appears in ${lang.percentage}% of repositories.`,
                source,
                tags: JSON.stringify(["github", "language", safeTag(lang.name)]),
                isVisible: true
            });
        });

        if (snippets.length === 0) {
            return NextResponse.json({ success: true, message: "No GitHub snippets generated", count: 0 });
        }

        const created = await prisma.knowledgeSnippet.createMany({
            data: snippets
        });

        return NextResponse.json({
            success: true,
            message: `Synced ${created.count} GitHub knowledge snippets.`,
            username,
            count: created.count
        });
    } catch (error) {
        return NextResponse.json({ error: error.message || "GitHub sync failed" }, { status: 500 });
    }
}
