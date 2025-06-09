import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5; // 5 requests per minute for AI

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitStore.get(ip);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    });
    return false;
  }

  if (userLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  userLimit.count++;
  return false;
}

export async function POST(request: Request) {
  try {
    // Basic rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    const { message, context } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    if (message.length > 1000) {
      return NextResponse.json(
        { error: 'Message too long. Please keep it under 1000 characters.' },
        { status: 400 }
      );
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (!geminiApiKey) {
      console.error('Gemini API key not configured');
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 503 }
      );
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Create a context-aware prompt
    const systemPrompt = `You are an AI assistant for Green Hacker's portfolio website. You are knowledgeable about:
- Full-stack web development (React, Next.js, TypeScript, Node.js)
- AI and machine learning technologies
- 3D web development with Three.js
- Modern web technologies and best practices
- Green Hacker's projects and skills

Keep responses helpful, professional, and concise. If asked about Green Hacker's background, mention their expertise in AI, web development, and creating innovative digital experiences.

Context: ${context || 'General portfolio inquiry'}

User message: ${message}`;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({
      success: true,
      response: text,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Gemini AI API error:', error);

    // Check if it's an API quota error
    if (error instanceof Error && error.message.includes('quota')) {
      return NextResponse.json(
        { error: 'AI service temporarily unavailable due to quota limits. Please try again later.' },
        { status: 503 }
      );
    }

    // Check if it's an authentication error
    if (error instanceof Error && error.message.includes('API key')) {
      console.error('Gemini API authentication error');
      return NextResponse.json(
        { error: 'AI service authentication failed' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'AI service temporarily unavailable' },
      { status: 500 }
    );
  }
}


