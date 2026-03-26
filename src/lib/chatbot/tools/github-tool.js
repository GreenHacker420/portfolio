import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { fetchWithTimeout } from "@/lib/utils/timeout";
import { fetchRepoReadme, fetchRecentCommits } from "@/services/github/github.fetcher";
import { getGithubStats } from "@/services/github/github.service";

export const githubTool = new DynamicStructuredTool({
    name: "github_analyzer",
    description: "Analyze GitHub repositories. Can fetch list of repos, details of a specific repo, file content, or deep repo analysis.",
    schema: z.object({
        action: z.enum(["list_repos", "get_repo", "get_file", "deep_repo_analysis"]).describe("The action to perform"),
        username: z.string().describe("GitHub username (default: GreenHacker420)"),
        repo: z.string().optional().describe("Repository name (required for get_repo/get_file/deep_repo_analysis)"),
        path: z.string().optional().describe("File path (required for get_file)"),
    }),
    func: async ({ action, username, repo, path }) => {
        const TOKEN = process.env.GITHUB_TOKEN;
        const headers = {
            "Accept": "application/vnd.github.v3+json",
            ...(TOKEN && { "Authorization": `token ${TOKEN}` })
        };
        const BASE_URL = "https://api.github.com";
        const targetUser = username || "GreenHacker420";

        try {
            if (action === "list_repos") {
                const res = await fetchWithTimeout(`${BASE_URL}/users/${targetUser}/repos?sort=updated&per_page=10`, { headers }, 10000, "GitHub");
                if (!res.ok) throw new Error(`GitHub API Error: ${res.statusText}`);
                const data = await res.json();
                return data.map(r => `• ${r.name} (${r.language}): ${r.description} [⭐ ${r.stargazers_count}]`).join("\n");
            }

            if (action === "deep_repo_analysis" || (action === "get_repo" && repo)) {
                if (!repo) return "Error: Repository name is required.";
                
                const [repoRes, readme, commits] = await Promise.all([
                    fetchWithTimeout(`${BASE_URL}/repos/${targetUser}/${repo}`, { headers }, 10000, "GitHub"),
                    fetchRepoReadme(targetUser, repo, headers),
                    fetchRecentCommits(targetUser, repo, 5, headers)
                ]);

                if (!repoRes.ok) throw new Error(`GitHub API Error: ${repoRes.statusText}`);
                const data = await repoRes.json();

                const summary = [
                    `NAME: ${data.name}`,
                    `DESCRIPTION: ${data.description || "No description"}`,
                    `STARS: ${data.stargazers_count} | FORKS: ${data.forks_count}`,
                    `STACK: ${data.language || "Unknown"}`,
                    readme ? `README EXCERPT:\n${readme.slice(0, 1000)}` : "README: Not available",
                    commits.length > 0 ? `RECENT COMMITS:\n${commits.map(c => `- ${c.message} (${c.date})`).join("\n")}` : "COMMITS: No recent activity"
                ].join("\n\n");

                return summary;
            }

            if (action === "get_file") {
                if (!repo || !path) return "Error: Repository and file path are required.";
                const res = await fetchWithTimeout(`${BASE_URL}/repos/${targetUser}/${repo}/contents/${path}`, { headers }, 10000, "GitHub");
                if (!res.ok) throw new Error(`GitHub API Error: ${res.statusText}`);
                const data = await res.json();
                if (data.encoding === 'base64') {
                    const content = atob(data.content);
                    return `File: ${path}\n\n${content.slice(0, 5000)}`;
                }
                return "Error: Unable to read file content.";
            }

            return "Invalid action.";
        } catch (error) {
            console.error("[GitHubTool] Error:", error);
            return `GitHub Analysis Failed: ${error.message}`;
        }
    },
});
