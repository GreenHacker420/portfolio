import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasGitHubToken: !!process.env.GITHUB_TOKEN,
    tokenLength: process.env.GITHUB_TOKEN ? process.env.GITHUB_TOKEN.length : 0,
    tokenPrefix: process.env.GITHUB_TOKEN ? process.env.GITHUB_TOKEN.substring(0, 10) + '...' : 'none',
    hasGitHubUsername: !!process.env.GITHUB_USERNAME,
    username: process.env.GITHUB_USERNAME || 'not set',
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
}
