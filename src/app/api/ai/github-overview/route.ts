import { NextRequest, NextResponse } from 'next/server';
import { generateGitHubStatsOverview, GitHubStatsData } from '@/services/geminiService';

// Cache for GitHub overview to avoid excessive API calls
let overviewCache: { content: string; timestamp: number } | null = null;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export async function POST(request: NextRequest) {
  try {
    // Check cache first
    const now = Date.now();
    if (overviewCache && (now - overviewCache.timestamp) < CACHE_DURATION) {
      return NextResponse.json({
        success: true,
        overview: overviewCache.content,
        cached: true,
        cacheAge: Math.floor((now - overviewCache.timestamp) / 1000 / 60) // minutes
      });
    }

    const body = await request.json();
    const { githubData } = body as { githubData: GitHubStatsData };

    if (!githubData) {
      return NextResponse.json(
        { error: 'GitHub data is required' },
        { status: 400 }
      );
    }

    // Validate required GitHub data structure
    if (!githubData.profile || !githubData.repositories || !githubData.languages) {
      return NextResponse.json(
        { error: 'Invalid GitHub data structure' },
        { status: 400 }
      );
    }

    // Get client IP for rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';

    // Generate AI overview
    const result = await generateGitHubStatsOverview(githubData, `github-${clientIP}`);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to generate overview' },
        { status: 500 }
      );
    }

    // Cache the successful result
    overviewCache = {
      content: result.content!,
      timestamp: now
    };

    return NextResponse.json({
      success: true,
      overview: result.content,
      usage: result.usage,
      cached: false
    });

  } catch (error) {
    console.error('GitHub overview API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to check cache status and configuration
export async function GET() {
  try {
    const now = Date.now();
    const cacheStatus = overviewCache ? {
      exists: true,
      age: Math.floor((now - overviewCache.timestamp) / 1000 / 60), // minutes
      isValid: (now - overviewCache.timestamp) < CACHE_DURATION
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
    console.error('GitHub overview status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
