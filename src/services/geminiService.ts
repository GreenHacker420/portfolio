import { GoogleGenerativeAI } from "@google/generative-ai";

/* -------------------- AI Initialization -------------------- */
if (!process.env.GEMINI_API_KEY) {
  console.warn("⚠️ GEMINI_API_KEY not set. AI features will be disabled.");
}
const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

/* -------------------- Rate Limiting -------------------- */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 min
const RATE_LIMIT_MAX_REQUESTS = 10;

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(identifier);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (userLimit.count >= RATE_LIMIT_MAX_REQUESTS) return false;
  userLimit.count++;
  return true;
}

/* -------------------- Types -------------------- */
export interface GitHubStatsData {
  profile: {
    login: string;
    name: string;
    bio: string;
    public_repos: number;
    followers: number;
    following: number;
    created_at: string;
  };
  repositories: Array<{
    name: string;
    description: string;
    language: string;
    stargazers_count: number;
    forks_count: number;
    size: number;
    created_at: string;
    updated_at: string;
    topics: string[];
  }>;
  languages: Record<string, number>;
  totalCommits?: number;
  contributionYears?: number[];
}

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface AIResponse {
  success: boolean;
  content?: string;
  error?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/* -------------------- Portfolio Context -------------------- */
const PORTFOLIO_CONTEXT = `
You are Green Hacker — a skilled Full Stack Developer with:
- **Frontend**: React, Next.js, TypeScript, Tailwind CSS, Three.js
- **Backend**: Node.js, Python, Express.js, GraphQL
- **Databases**: PostgreSQL, MongoDB
- **DevOps**: AWS, Docker, Git
- **Languages**: JavaScript, TypeScript, Python

Background:
- Built scalable production-grade web applications
- Strong focus on clean code & modern practices
- Works with international clients (based in India)
- Open for freelance & collaborations
- Passionate about UX & code quality

Communication style: **Professional, clear, approachable**.
`;

/* -------------------- GitHub Stats Overview -------------------- */
export async function generateGitHubStatsOverview(
  githubData: GitHubStatsData,
  identifier = "github-stats"
): Promise<AIResponse> {
  try {
    if (!checkRateLimit(identifier)) {
      return { success: false, error: "Rate limit exceeded. Try again later." };
    }

    if (!genAI) {
      return { success: false, error: "Gemini API key not configured" };
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Compute language distribution safely
    const totalBytes = Object.values(githubData.languages).reduce((a, b) => a + b, 0) || 1;
    const topLanguages = Object.entries(githubData.languages)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([lang, bytes]) => `- ${lang}: ${((bytes / totalBytes) * 100).toFixed(1)}%`)
      .join("\n");

    const topRepos = githubData.repositories
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 10)
      .map(
        (repo) =>
          `- **${repo.name}**: ${repo.description || "No description"} (${repo.language || "Unknown"}, ${repo.stargazers_count}★)`
      )
      .join("\n");

    const avgStars =
      githubData.repositories.length > 0
        ? (
            githubData.repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0) /
            githubData.repositories.length
          ).toFixed(1)
        : "0";

    const topics = Array.from(new Set(githubData.repositories.flatMap((r) => r.topics)))
      .slice(0, 10)
      .join(", ") || "None listed";

    const dataContext = `
GitHub Profile Data:
- Username: ${githubData.profile.login}
- Name: ${githubData.profile.name}
- Bio: ${githubData.profile.bio}
- Public Repositories: ${githubData.profile.public_repos}
- Followers: ${githubData.profile.followers}
- Following: ${githubData.profile.following}
- Account Age: ${new Date(githubData.profile.created_at).getFullYear()} (${Math.floor(
      (Date.now() - new Date(githubData.profile.created_at).getTime()) /
        (365.25 * 24 * 60 * 60 * 1000)
    )} years)

Top Languages:
${topLanguages}

Recent Repositories:
${topRepos}

Repository Stats:
- Total Repositories: ${githubData.repositories.length}
- Avg Stars per Repo: ${avgStars}
- Topics: ${topics}
`;

    const prompt = `
${PORTFOLIO_CONTEXT}

As an **AI analyst**, create a **portfolio-ready summary** of this developer's GitHub activity.

${dataContext}

Your response must be:
- Written in **engaging, professional markdown**
- Around **300–500 words**
- Structured with clear **sections**:
  1. Developer Profile Summary
  2. Technical Expertise
  3. Project Portfolio Insights
  4. Coding Activity & Growth
  5. Standout Achievements
  6. Skill Evolution & Career Potential

Make it **insightful, concise, and appealing** for potential clients, recruiters, or collaborators.
`;

    const result = await model.generateContent(prompt);
    const content = result.response.text();

    return {
      success: true,
      content: content.trim(),
      usage: {
        promptTokens: prompt.length,
        completionTokens: content.length,
        totalTokens: prompt.length + content.length,
      },
    };
  } catch (error) {
    console.error("Gemini API error (GitHub stats):", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "GitHub overview generation failed",
    };
  }
}

/* -------------------- Contact Reply -------------------- */
export async function generateContactReply(
  contactMessage: ContactMessage,
  mode: "auto-generate" | "enhance-draft",
  draftReply?: string,
  identifier = "contact-reply"
): Promise<AIResponse> {
  try {
    if (!checkRateLimit(identifier)) {
      return { success: false, error: "Rate limit exceeded. Try again later." };
    }

    if (!genAI) {
      return { success: false, error: "Gemini API key not configured" };
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const baseContext = `
${PORTFOLIO_CONTEXT}

Contact Inquiry:
- From: ${contactMessage.name} (${contactMessage.email})
- Subject: ${contactMessage.subject}
- Message: ${contactMessage.message}
- Received: ${new Date(contactMessage.createdAt).toLocaleDateString()}
`;

    const prompt =
      mode === "auto-generate"
        ? `
${baseContext}

Write a **polished, ready-to-send email reply** that:
1. Thanks them for reaching out
2. Responds directly to their inquiry
3. Shares relevant info (services, availability, etc.)
4. Suggests next steps if applicable
5. Maintains a **professional yet warm tone**
6. Ends with a clear call-to-action

Return **only the email body** (no headers).
`
        : `
${baseContext}

Here is my draft reply:
${draftReply}

Please **improve this draft** to:
- Be clearer & more professional
- Improve flow & tone
- Cover all important points
- Strengthen the call-to-action

Keep it similar in length.  
Return only the **enhanced email body**.
`;

    const result = await model.generateContent(prompt);
    const content = result.response.text();

    return {
      success: true,
      content: content.trim(),
      usage: {
        promptTokens: prompt.length,
        completionTokens: content.length,
        totalTokens: prompt.length + content.length,
      },
    };
  } catch (error) {
    console.error("Gemini API error (Contact reply):", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Contact reply generation failed",
    };
  }
}

/* -------------------- Utilities -------------------- */
export function isGeminiConfigured(): boolean {
  return !!process.env.GEMINI_API_KEY;
}
export function clearRateLimit(identifier: string): void {
  rateLimitMap.delete(identifier);
}

