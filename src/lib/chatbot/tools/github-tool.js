import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

export const githubTool = new DynamicStructuredTool({
    name: "github_analyzer",
    description: "Analyze GitHub repositories. Can fetch list of repos, details of a specific repo, or file content.",
    schema: z.object({
        action: z.enum(["list_repos", "get_repo", "get_file"]).describe("The action to perform"),
        username: z.string().describe("GitHub username (default: GreenHacker420)"),
        repo: z.string().optional().describe("Repository name (required for get_repo/get_file)"),
        path: z.string().optional().describe("File path (required for get_file)"),
    }),
    func: async ({ action, username, repo, path }) => {
        const TOKEN = process.env.GITHUB_TOKEN;
        const headers = {
            "Accept": "application/vnd.github.v3+json",
            ...(TOKEN && { "Authorization": `token ${TOKEN}` })
        };
        const BASE_URL = "https://api.github.com";
        const targetUser = username || "GreenHacker420"; // Adjust default if needed

        try {
            if (action === "list_repos") {
                const res = await fetch(`${BASE_URL}/users/${targetUser}/repos?sort=updated&per_page=5`, { headers });
                if (!res.ok) throw new Error(`GitHub API Error: ${res.statusText}`);
                const data = await res.json();
                return data.map(r => `• ${r.name} (${r.language}): ${r.description} [⭐ ${r.stargazers_count}]`).join("\n");
            }

            if (action === "get_repo") {
                if (!repo) return "Error: Repository name is required.";
                const res = await fetch(`${BASE_URL}/repos/${targetUser}/${repo}`, { headers });
                if (!res.ok) throw new Error(`GitHub API Error: ${res.statusText}`);
                const data = await res.json();
                return `Repo: ${data.name}\nDesc: ${data.description}\nStars: ${data.stargazers_count}\nForks: ${data.forks_count}\nURL: ${data.html_url}`;
            }

            if (action === "get_file") {
                if (!repo || !path) return "Error: Repository and file path are required.";
                const res = await fetch(`${BASE_URL}/repos/${targetUser}/${repo}/contents/${path}`, { headers });
                if (!res.ok) throw new Error(`GitHub API Error: ${res.statusText}`);
                const data = await res.json();
                if (data.encoding === 'base64') {
                    const content = atob(data.content);
                    return `File: ${path}\n\n${content.slice(0, 5000)}`; // Truncate large files
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
