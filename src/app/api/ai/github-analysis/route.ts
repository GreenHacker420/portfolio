/**
 * GitHub AI Analysis API Route
 * Generates intelligent insights about GitHub activity using Gemini 2.0-flash
 */

import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GitHubData, GitHubAIAnalysis } from "@/types/github";

/* -------------------- Cache -------------------- */
let analysisCache:
  | {
      content: GitHubAIAnalysis;
      timestamp: number;
      githubDataHash: string;
    }
  | null = null;

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

/* -------------------- Rate Limiting -------------------- */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5;

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(identifier);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return true;
  }

  if (userLimit.count >= RATE_LIMIT_MAX_REQUESTS) return false;
  userLimit.count++;
  return true;
}

/* -------------------- Helpers -------------------- */
function generateDataHash(githubData: GitHubData): string {
  const key = JSON.stringify({
    login: githubData.profile.login,
    stars: githubData.stats.totalStars,
    repos: githubData.stats.totalRepos,
    count: githubData.repositories.length,
  });
  return Buffer.from(key).toString("base64");
}

/* -------------------- Helpers: Fallback Analysis -------------------- */
function buildFallbackAnalysis(githubData: GitHubData): GitHubAIAnalysis {
  const topLangs = (githubData.languages || []).slice(0, 5).map(l => l.name);
  const topRepo = (githubData.topRepositories || [])[0];
  const overview = `Profile: ${githubData.profile.name || githubData.profile.login}. ` +
    `Repos: ${githubData.stats.totalRepos}, Stars: ${githubData.stats.totalStars}, Forks: ${githubData.stats.totalForks}. ` +
    (topLangs.length ? `Primary stack: ${topLangs.join(', ')}.` : '');

  const insights = [
    topLangs.length ? `Most used languages: ${topLangs.join(', ')}` : 'Languages pending',
    `Original repositories: ${githubData.stats.contributedRepos}`,
    topRepo ? `Top repo: ${topRepo.name} (${topRepo.stargazers_count}★, ${topRepo.forks_count} forks)` : 'Top repo data unavailable',
    `Followers: ${githubData.profile.followers}, Following: ${githubData.profile.following}`,
    `Member since ${new Date(githubData.profile.created_at).getFullYear()}`,
  ];

  const recommendations = [
    'Pin top repositories and add concise READMEs',
    'Add topics and project tags for discoverability',
    'Keep active repos updated to signal ongoing maintenance',
  ];

  const strengths = [
    ...(topLangs.length ? topLangs.slice(0, 3) : ['Full Stack']),
    'Open source contributions',
    'Practical project delivery',
  ];

  const techStack = topLangs.length ? topLangs : ['JavaScript', 'TypeScript'];

  const activitySummary = `${githubData.stats.totalRepos} repos with ${githubData.stats.totalStars} total stars and ${githubData.stats.totalForks} forks. ` +
    `Recent activity across ${Math.min((githubData.recentActivity || []).length, 5)} projects.`;

  const careerHighlights = [
    topRepo ? `${topRepo.name}: ${topRepo.stargazers_count}★` : 'Growing public portfolio',
  ];

  return {
    overview,
    insights,
    recommendations,
    strengths,
    techStack,
    activitySummary,
    careerHighlights,
  };
}

/* -------------------- API Routes -------------------- */
export async function POST(request: NextRequest) {
  try {
    const clientIP =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (!checkRateLimit(`github-analysis-${clientIP}`)) {
      return NextResponse.json(
        {
          success: false,
          error: "Rate limit exceeded. Please try again later.",
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { githubData, forceRefresh } = body as {
      githubData: GitHubData;
      forceRefresh?: boolean;
    };

    if (!githubData?.profile || !githubData?.repositories || !githubData?.stats) {
      return NextResponse.json(
        { success: false, error: "Invalid GitHub data structure" },
        { status: 400 }
      );
    }

    const dataHash = generateDataHash(githubData);
    const now = Date.now();

    if (
      !forceRefresh &&
      analysisCache &&
      analysisCache.githubDataHash === dataHash &&
      now - analysisCache.timestamp < CACHE_DURATION
    ) {
      return NextResponse.json({
        success: true,
        analysis: analysisCache.content,
        cached: true,
        cacheAge: Math.floor((now - analysisCache.timestamp) / 1000 / 60),
      });
    }

    // If no Gemini key, return a locally generated analysis so the first load shows content
    if (!process.env.GEMINI_API_KEY) {
      const parsedAnalysis = buildFallbackAnalysis(githubData);
      analysisCache = {
        content: parsedAnalysis,
        timestamp: now,
        githubDataHash: dataHash,
      };
      return NextResponse.json({ success: true, analysis: parsedAnalysis, cached: false });
    }

    const analysis = await generateGitHubAnalysis(githubData);

    if (!analysis.success) {
      return NextResponse.json(
        { success: false, error: analysis.error || "Failed to generate analysis" },
        { status: 500 }
      );
    }

    const parsedAnalysis = parseAnalysisContent(analysis.content!);

    analysisCache = {
      content: parsedAnalysis,
      timestamp: now,
      githubDataHash: dataHash,
    };

    return NextResponse.json({
      success: true,
      analysis: parsedAnalysis,
      usage: analysis.usage,
      cached: false,
    });
  } catch (error) {
    console.error("GitHub analysis API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const now = Date.now();
    const cacheStatus = analysisCache
      ? {
          exists: true,
          age: Math.floor((now - analysisCache.timestamp) / 1000 / 60),
          isValid: now - analysisCache.timestamp < CACHE_DURATION,
        }
      : {
          exists: false,
          age: 0,
          isValid: false,
        };

    return NextResponse.json({
      cache: cacheStatus,
      apiConfigured: !!process.env.GEMINI_API_KEY,
      cacheDuration: CACHE_DURATION / 1000 / 60 / 60,
    });
  } catch (error) {
    console.error("GitHub analysis status error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/* -------------------- AI Analysis -------------------- */
async function generateGitHubAnalysis(githubData: GitHubData) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const topLanguages = githubData.languages
      .slice(0, 5)
      .map((lang) => lang.name)
      .join(", ");
    const topRepos = githubData.topRepositories
      .slice(0, 3)
      .map(
        (repo) =>
          `${repo.name} (${repo.stargazers_count}★, ${repo.forks_count} forks)`
      )
      .join(", ");

    const prompt = `
You are an expert GitHub profile analyst. 
Your task is to evaluate a developer's GitHub data and generate professional, employer-friendly insights.

Return ONLY valid JSON, without commentary or explanations.

DATA:
- Username: ${githubData.profile.login}
- Name: ${githubData.profile.name || "Not specified"}
- Bio: ${githubData.profile.bio || "No bio provided"}
- Created: ${new Date(githubData.profile.created_at).getFullYear()}
- Years coding: ${githubData.stats.yearOfCoding}
- Location: ${githubData.profile.location || "Not specified"}

STATS:
- Public repos: ${githubData.stats.totalRepos}
- Contributions: ${githubData.stats.contributedRepos}
- Stars: ${githubData.stats.totalStars}
- Forks: ${githubData.stats.totalForks}
- Followers: ${githubData.profile.followers}
- Following: ${githubData.profile.following}

TOP LANGUAGES: ${topLanguages}
TOP REPOS: ${topRepos}

RECENT ACTIVITY:
${githubData.recentActivity
  .slice(0, 5)
  .map((a) => `- ${a.type}: ${a.description} (${a.repo})`)
  .join("\n")}

Respond strictly in this JSON structure:
{
  "overview": "2–3 sentence summary",
  "insights": ["Insight 1", "Insight 2", "Insight 3", "Insight 4", "Insight 5"],
  "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"],
  "strengths": ["Strength 1", "Strength 2", "Strength 3", "Strength 4"],
  "techStack": ["Tech 1", "Tech 2", "Tech 3", "Tech 4", "Tech 5"],
  "activitySummary": "Brief summary of activity",
  "careerHighlights": ["Highlight 1", "Highlight 2", "Highlight 3"]
}
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
    console.error("Gemini API error for GitHub analysis:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to generate GitHub analysis",
    };
  }
}

/* -------------------- JSON Parser -------------------- */
function parseAnalysisContent(content: string): GitHubAIAnalysis {
  try {
    const clean = content.replace(/```json\n?|\n?```/g, "").trim();
    const parsed = JSON.parse(clean);

    return {
      overview: parsed.overview || "No overview available",
      insights: Array.isArray(parsed.insights) ? parsed.insights : [],
      recommendations: Array.isArray(parsed.recommendations)
        ? parsed.recommendations
        : [],
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      techStack: Array.isArray(parsed.techStack) ? parsed.techStack : [],
      activitySummary:
        parsed.activitySummary || "Activity summary not available",
      careerHighlights: Array.isArray(parsed.careerHighlights)
        ? parsed.careerHighlights
        : [],
    };
  } catch (error) {
    console.error("Error parsing AI analysis content:", error);

    return {
      overview: "AI analysis unavailable. Please retry later.",
      insights: ["Unable to generate insights"],
      recommendations: ["Please refresh to try again"],
      strengths: ["Pending"],
      techStack: ["Unavailable"],
      activitySummary: "Activity unavailable",
      careerHighlights: ["Pending"],
    };
  }
}

