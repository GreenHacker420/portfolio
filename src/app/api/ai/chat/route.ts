import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getWebsiteContext, logChatInteraction, searchFAQs, getContextualSuggestions } from '@/services/chatbotService';

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

    // Get real-time website context
    const websiteContext = await getWebsiteContext();

    // Search for relevant FAQs
    const relatedFAQs = await searchFAQs(message);

    // Initialize Gemini AI with 2.0-flash model
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    // Create a comprehensive context-aware prompt with real data
    const systemPrompt = `You are an AI assistant for Harsh Hirawat's (aka GreenHacker) portfolio website at greenhacker.tech. You have comprehensive knowledge about:

REAL-TIME WEBSITE DATA:
${websiteContext}

RELATED FAQ INFORMATION:
${relatedFAQs.length > 0 ? relatedFAQs.map(faq => `Q: ${faq.question}\nA: ${faq.answer}`).join('\n\n') : 'No directly related FAQs found.'}

COMPREHENSIVE KNOWLEDGE BASE:

PERSONAL INFORMATION:
- Name: Harsh Hirawat (professionally known as GreenHacker)
- Title: Full Stack Developer & AI Enthusiast
- Location: India (working with international clients)
- Email: Contact through the website's contact form
- Website: greenhacker.tech

TECHNICAL EXPERTISE:
- Frontend: React, Next.js, TypeScript, Tailwind CSS, Three.js, Framer Motion
- Backend: Node.js, Express.js, Python, FastAPI, GraphQL
- Databases: PostgreSQL, MongoDB, Prisma ORM
- AI/ML: PyTorch, TensorFlow, Computer Vision, Natural Language Processing
- DevOps: Docker, AWS, Git, CI/CD, Kubernetes
- Languages: JavaScript, TypeScript, Python
- Other: WebGL, React Three Fiber, GSAP, WebRTC, Socket.io

CURRENT PROJECTS & EXPERIENCE:
- Portfolio Website: Interactive 3D portfolio with AI-powered features
- AI Photo Platform: Face recognition for intelligent photo organization
- ML Research Tool: NLP for scientific paper analysis
- Real-time Collaboration App: WebRTC and WebSockets platform
- Various full-stack web applications and AI-powered solutions

WEBSITE FEATURES:
- Interactive 3D elements using Three.js and Spline
- Real-time GitHub stats with AI analysis
- Comprehensive skills showcase with proficiency levels
- Project portfolio with detailed case studies
- AI-powered contact system with smart replies
- Admin dashboard for content management
- SEO optimized with structured data

PROFESSIONAL BACKGROUND:
- Experienced in building scalable web applications
- Strong focus on modern development practices and clean code
- Available for freelance projects and collaborations
- Passionate about AI, web development, and creating innovative digital experiences
- Open source contributor and continuous learner

COMMUNICATION STYLE:
- Professional yet friendly and approachable
- Technical when appropriate, but accessible to non-technical users
- Helpful and informative
- Enthusiastic about technology and problem-solving

Context: ${context || 'General portfolio inquiry'}
Current page context: ${context}

User message: ${message}

Respond as Harsh Hirawat's AI assistant, providing helpful, accurate information about his skills, projects, experience, and availability. If asked about specific technical details, provide comprehensive but accessible explanations. For business inquiries, guide users to the contact form.`;

    const result = await model.generateContent(systemPrompt);
    const response = result.response;
    const text = response.text();

    // Calculate response time
    const responseTime = Date.now() - startTime;

    // Generate contextual suggestions
    const suggestions = getContextualSuggestions(context);

    // Log the interaction (async, don't wait)
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
      relatedFAQs: relatedFAQs.slice(0, 3), // Return top 3 related FAQs
      responseTime,
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


