import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getWebsiteContext, logChatInteraction, searchFAQs, getContextualSuggestions } from '@/services/chatbotService';

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5;   // 5 requests per minute for AI

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
  const startTime = Date.now();

  try {
    // Basic rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    const { message, context, sessionId } = await request.json();
    const userAgent = request.headers.get('user-agent') || 'unknown';

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

    // Gather contextual data
    const websiteContext = await getWebsiteContext();
    const relatedFAQs = await searchFAQs(message);

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    // Strongly structured prompt
    const systemPrompt = `You are the official AI assistant for Harsh Hirawat (aka GreenHacker)'s portfolio website (greenhacker.tech).
Your job is to provide accurate, professional, and approachable answers about Harsh's skills, experience, and projects.

=====================
REAL-TIME WEBSITE DATA:
${websiteContext}

=====================
RELATED FAQ INFORMATION:
${relatedFAQs.length > 0 
  ? relatedFAQs.map(faq => `Q: ${faq.question}\nA: ${faq.answer}`).join('\n\n') 
  : 'No directly related FAQs found.'}

=====================
KNOWLEDGE BASE:
PERSONAL INFO:
- Name: Harsh Hirawat (GreenHacker)
- Role: Full Stack Developer & AI Enthusiast
- Location: Pune, India (works with international clients)
- Contact: via portfolio contact form
- Website: greenhacker.tech

TECHNICAL STACK:
- Frontend: React, Next.js, TypeScript, Tailwind CSS, Three.js, Framer Motion
- Backend: Node.js, Express.js, Python, FastAPI, GraphQL
- Databases: PostgreSQL, MongoDB, Prisma ORM
- AI/ML: PyTorch, TensorFlow, Computer Vision, NLP
- DevOps: Docker, AWS, Git, CI/CD, Kubernetes
- Other: WebGL, React Three Fiber, GSAP, WebRTC, Socket.io

PROJECTS & EXPERIENCE:
- Portfolio Website → Interactive 3D portfolio with AI features
- AI Photo Platform → Face recognition for intelligent photo organization
- ML Research Tool → NLP-based scientific paper analysis
- Realtime Collaboration App → WebRTC & WebSockets
- Various full-stack web apps + AI-powered solutions

PROFESSIONAL BACKGROUND:
- Builds scalable, production-ready applications
- Strong advocate for clean code & modern practices
- Open source contributor
- Available for freelance and collaborations

=====================
COMMUNICATION STYLE:
- Friendly, professional, and approachable
- Use simple language for non-technical users
- Technical depth when required
- Enthusiastic about technology

=====================
USER CONTEXT:
Page context: ${context || 'General portfolio inquiry'}
User message: ${message}

=====================
INSTRUCTIONS:
1. Always answer in a helpful, concise, and professional tone. 
2. If the query is about technical skills → explain clearly with examples when possible.  
3. If the query is about availability or hiring → politely guide them to the contact form.  
4. If the query is general/about Harsh → summarize confidently.  
5. Never invent details beyond the provided context.`;

    // Send to Gemini
    const result = await model.generateContent(systemPrompt);
    const response = result.response;
    const text = response.text();

    // Response time
    const responseTime = Date.now() - startTime;

    // Generate contextual suggestions
    const suggestions = getContextualSuggestions(context);

    // Log interaction
    const chatSessionId = sessionId || `session-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    logChatInteraction(
      chatSessionId,
      message,
      text,
      {
        currentPage: context,
        userAgent,
        ipAddress: ip,
        sessionId: chatSessionId
      },
      responseTime
    ).catch(error => console.error('Failed to log chat interaction:', error));

    return NextResponse.json({
      success: true,
      response: text,
      suggestions,
      relatedFAQs: relatedFAQs.slice(0, 3), // top 3
      responseTime,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Gemini AI API error:', error);

    // Improved error classification
    const errorMessage = error instanceof Error ? error.message : String(error);

    if (errorMessage.includes('quota')) {
      return NextResponse.json(
        { error: 'AI service temporarily unavailable due to quota limits. Please try again later.' },
        { status: 503 }
      );
    }

    if (errorMessage.includes('API key')) {
      return NextResponse.json(
        { error: 'AI service authentication failed' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'AI service temporarily unavailable. Please try again later.' },
      { status: 500 }
    );
  }
}
