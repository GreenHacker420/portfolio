/**
 * GitHub AI Analysis API Route
 * Generates intelligent insights about GitHub activity using Gemini 2.0-flash
 */

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GitHubData, GitHubAIAnalysis } from '@/types/github';

// Cache for AI analysis results
let analysisCache: {
  content: GitHubAIAnalysis;
  timestamp: number;
  githubDataHash: string;
} | null = null;

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

// Rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5; // 5 requests per minute

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(identifier);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (userLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  userLimit.count++;
  return true;
}

function generateDataHash(githubData: GitHubData): string {
  const key = `${githubData.profile.login}-${githubData.stats.totalStars}-${githubData.stats.totalRepos}-${githubData.repositories.length}`;
  return Buffer.from(key).toString('base64');
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';

    // Check rate limit
    if (!checkRateLimit(`github-analysis-${clientIP}`)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Rate limit exceeded. Please try again later.' 
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { githubData, forceRefresh } = body as { 
      githubData: GitHubData; 
      forceRefresh?: boolean 
    };

    if (!githubData) {
      return NextResponse.json(
        { success: false, error: 'GitHub data is required' },
        { status: 400 }
      );
    }

    // Validate GitHub data structure
    if (!githubData.profile || !githubData.repositories || !githubData.stats) {
      return NextResponse.json(
        { success: false, error: 'Invalid GitHub data structure' },
        { status: 400 }
      );
    }

    // Check cache first (unless force refresh)
    const dataHash = generateDataHash(githubData);
    const now = Date.now();
    
    if (!forceRefresh && analysisCache && 
        analysisCache.githubDataHash === dataHash &&
        (now - analysisCache.timestamp) < CACHE_DURATION) {
      return NextResponse.json({
        success: true,
        analysis: analysisCache.content,
        cached: true,
        cacheAge: Math.floor((now - analysisCache.timestamp) / 1000 / 60) // minutes
      });
    }

    // Check if Gemini API is configured
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'AI service not configured' },
        { status: 503 }
      );
    }

    // Generate AI analysis
    const analysis = await generateGitHubAnalysis(githubData, `analysis-${clientIP}`);

    if (!analysis.success) {
      return NextResponse.json(
        { success: false, error: analysis.error || 'Failed to generate analysis' },
        { status: 500 }
      );
    }

    // Parse the analysis content
    const parsedAnalysis = parseAnalysisContent(analysis.content!);

    // Cache the successful result
    analysisCache = {
      content: parsedAnalysis,
      timestamp: now,
      githubDataHash: dataHash,
    };

    return NextResponse.json({
      success: true,
      analysis: parsedAnalysis,
      usage: analysis.usage,
      cached: false
    });

  } catch (error) {
    console.error('GitHub analysis API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const now = Date.now();
    const cacheStatus = analysisCache ? {
      exists: true,
      age: Math.floor((now - analysisCache.timestamp) / 1000 / 60), // minutes
      isValid: (now - analysisCache.timestamp) < CACHE_DURATION
    } : {
      exists: false,
      age: 0,
      isValid: false
    };

    return NextResponse.json({
      cache: cacheStatus,
      apiConfigured: !!process.env.GEMINI_API_KEY,
      cacheDuration: CACHE_DURATION / 1000 / 60 / 60 // hours
    });

  } catch (error) {
    console.error('GitHub analysis status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function generateGitHubAnalysis(
  githubData: GitHubData,
  identifier: string
): Promise<{
  success: boolean;
  content?: string;
  error?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}> {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Prepare comprehensive GitHub data for analysis
    const topLanguages = githubData.languages.slice(0, 5).map(lang => lang.name).join(', ');
    const topRepos = githubData.topRepositories.slice(0, 3).map(repo => 
      `${repo.name} (${repo.stargazers_count} stars, ${repo.forks_count} forks)`
    ).join(', ');

    const prompt = `
Analyze this GitHub developer profile and provide intelligent insights:

PROFILE DATA:
- Username: ${githubData.profile.login}
- Name: ${githubData.profile.name || 'Not specified'}
- Bio: ${githubData.profile.bio || 'No bio provided'}
- Account created: ${new Date(githubData.profile.created_at).getFullYear()}
- Years coding: ${githubData.stats.yearOfCoding}
- Location: ${githubData.profile.location || 'Not specified'}

STATISTICS:
- Public repositories: ${githubData.stats.totalRepos}
- Original repositories: ${githubData.stats.contributedRepos}
- Total stars received: ${githubData.stats.totalStars}
- Total forks: ${githubData.stats.totalForks}
- Followers: ${githubData.profile.followers}
- Following: ${githubData.profile.following}

TOP LANGUAGES: ${topLanguages}

TOP REPOSITORIES: ${topRepos}

RECENT ACTIVITY:
${githubData.recentActivity.slice(0, 5).map(activity => 
  `- ${activity.type}: ${activity.description} (${activity.repo})`
).join('\n')}

Please provide a comprehensive analysis in the following JSON format:
{
  "overview": "A 2-3 sentence professional summary of this developer's GitHub presence and coding expertise",
  "insights": ["Key insight 1", "Key insight 2", "Key insight 3", "Key insight 4", "Key insight 5"],
  "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"],
  "strengths": ["Strength 1", "Strength 2", "Strength 3", "Strength 4"],
  "techStack": ["Tech 1", "Tech 2", "Tech 3", "Tech 4", "Tech 5"],
  "activitySummary": "Brief summary of recent activity patterns",
  "careerHighlights": ["Highlight 1", "Highlight 2", "Highlight 3"]
}

Focus on:
1. Technical expertise and language proficiency
2. Project diversity and complexity
3. Community engagement (stars, forks, followers)
4. Coding consistency and activity patterns
5. Professional growth and potential
6. Unique strengths and specializations

Make insights specific, actionable, and valuable for potential employers or collaborators.
Respond ONLY with valid JSON, no additional text.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text();

    return {
      success: true,
      content: content.trim(),
      usage: {
        promptTokens: prompt.length,
        completionTokens: content.length,
        totalTokens: prompt.length + content.length
      }
    };

  } catch (error) {
    console.error('Gemini API error for GitHub analysis:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate GitHub analysis'
    };
  }
}

function parseAnalysisContent(content: string): GitHubAIAnalysis {
  try {
    // Clean the content and parse JSON
    const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
    const parsed = JSON.parse(cleanContent);
    
    return {
      overview: parsed.overview || 'Analysis overview not available',
      insights: Array.isArray(parsed.insights) ? parsed.insights : [],
      recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      techStack: Array.isArray(parsed.techStack) ? parsed.techStack : [],
      activitySummary: parsed.activitySummary || 'Activity summary not available',
      careerHighlights: Array.isArray(parsed.careerHighlights) ? parsed.careerHighlights : [],
    };
  } catch (error) {
    console.error('Error parsing AI analysis content:', error);
    
    // Fallback analysis
    return {
      overview: 'AI analysis is temporarily unavailable. Please try again later.',
      insights: ['Unable to generate insights at this time'],
      recommendations: ['Please refresh to try again'],
      strengths: ['Analysis pending'],
      techStack: ['Unable to determine'],
      activitySummary: 'Activity analysis unavailable',
      careerHighlights: ['Analysis pending'],
    };
  }
}
