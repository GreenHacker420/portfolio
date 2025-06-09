import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Rate limiting for API calls
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10; // 10 requests per minute

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

// Portfolio owner context for personalized responses
const PORTFOLIO_CONTEXT = `
You are responding as Green Hacker, a skilled Full Stack Developer with expertise in:
- Frontend: React, Next.js, TypeScript, Tailwind CSS, Three.js
- Backend: Node.js, Python, Express.js, GraphQL
- Databases: PostgreSQL, MongoDB
- DevOps: AWS, Docker, Git
- Languages: JavaScript, TypeScript, Python

Professional background:
- Experienced in building scalable web applications
- Strong focus on modern development practices
- Available for freelance projects and collaborations
- Passionate about clean code and user experience
- Based in India, working with international clients

Communication style: Professional, friendly, and technical when appropriate.
`;

export async function generateGitHubStatsOverview(
  githubData: GitHubStatsData,
  identifier: string = 'github-stats'
): Promise<AIResponse> {
  try {
    // Check rate limit
    if (!checkRateLimit(identifier)) {
      return {
        success: false,
        error: 'Rate limit exceeded. Please try again later.'
      };
    }

    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return {
        success: false,
        error: 'Gemini API key not configured'
      };
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Prepare GitHub data summary for analysis
    const dataContext = `
GitHub Profile Analysis Data:
- Username: ${githubData.profile.login}
- Name: ${githubData.profile.name}
- Bio: ${githubData.profile.bio}
- Public Repositories: ${githubData.profile.public_repos}
- Account Age: ${new Date(githubData.profile.created_at).getFullYear()} (${Math.floor((Date.now() - new Date(githubData.profile.created_at).getTime()) / (365.25 * 24 * 60 * 60 * 1000))} years)
- Followers: ${githubData.profile.followers}

Top Languages Used:
${Object.entries(githubData.languages)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 8)
  .map(([lang, bytes]) => `- ${lang}: ${((bytes / Object.values(githubData.languages).reduce((a, b) => a + b, 0)) * 100).toFixed(1)}%`)
  .join('\n')}

Recent Notable Repositories:
${githubData.repositories
  .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
  .slice(0, 10)
  .map(repo => `- ${repo.name}: ${repo.description || 'No description'} (${repo.language || 'Unknown'}, ${repo.stargazers_count} stars)`)
  .join('\n')}

Repository Statistics:
- Total Repositories: ${githubData.repositories.length}
- Average Stars per Repo: ${(githubData.repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0) / githubData.repositories.length).toFixed(1)}
- Most Used Topics: ${Array.from(new Set(githubData.repositories.flatMap(r => r.topics))).slice(0, 10).join(', ')}
`;

    const prompt = `
As an AI analyst, provide a comprehensive and engaging overview of this developer's GitHub profile and coding activity. 

${dataContext}

Please generate a professional summary that includes:

1. **Developer Profile Summary**: Brief overview of the developer's experience and focus areas
2. **Technical Expertise**: Analysis of programming languages and technology stack
3. **Project Portfolio Insights**: Quality and diversity of repositories
4. **Coding Activity Patterns**: Development consistency and growth trends
5. **Standout Achievements**: Notable projects, stars, or technical accomplishments
6. **Skill Development Trajectory**: How their skills have evolved over time

Format the response in a engaging, professional tone suitable for a portfolio website. Use markdown formatting with appropriate headers and bullet points. Keep it concise but informative (aim for 300-500 words).

Focus on insights that would be valuable to potential clients, employers, or collaborators. Highlight unique strengths and technical capabilities.
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
    console.error('Gemini API error for GitHub stats:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate GitHub overview'
    };
  }
}

export async function generateContactReply(
  contactMessage: ContactMessage,
  mode: 'auto-generate' | 'enhance-draft',
  draftReply?: string,
  identifier: string = 'contact-reply'
): Promise<AIResponse> {
  try {
    // Check rate limit
    if (!checkRateLimit(identifier)) {
      return {
        success: false,
        error: 'Rate limit exceeded. Please try again later.'
      };
    }

    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return {
        success: false,
        error: 'Gemini API key not configured'
      };
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    let prompt: string;

    if (mode === 'auto-generate') {
      prompt = `
${PORTFOLIO_CONTEXT}

You received the following contact form submission:

From: ${contactMessage.name} (${contactMessage.email})
Subject: ${contactMessage.subject}
Message: ${contactMessage.message}
Received: ${new Date(contactMessage.createdAt).toLocaleDateString()}

Please generate a professional, personalized reply email that:

1. **Acknowledges** their message and thanks them for reaching out
2. **Addresses** their specific inquiry or request appropriately
3. **Provides** relevant information about your services/availability if applicable
4. **Suggests** next steps or follow-up actions if appropriate
5. **Maintains** a professional yet friendly tone
6. **Includes** a clear call-to-action or invitation for further discussion

The reply should be:
- Professional but warm and approachable
- Specific to their inquiry (not generic)
- Actionable with clear next steps
- Appropriately detailed (not too brief or too lengthy)
- Formatted as a complete email ready to send

Do not include email headers (To, From, Subject) - just the email body content.
`;
    } else {
      prompt = `
${PORTFOLIO_CONTEXT}

Original contact message:
From: ${contactMessage.name} (${contactMessage.email})
Subject: ${contactMessage.subject}
Message: ${contactMessage.message}

Current draft reply:
${draftReply}

Please enhance this draft reply to make it more professional, clear, and engaging while maintaining the original intent and tone. Improve:

1. **Clarity**: Make the message clearer and easier to understand
2. **Professionalism**: Enhance the professional tone while keeping it friendly
3. **Structure**: Improve the flow and organization of ideas
4. **Completeness**: Ensure all important points are addressed
5. **Call-to-action**: Strengthen the next steps or follow-up invitation

Keep the enhanced version similar in length to the original draft. Maintain the personal voice and any specific details the author included.

Return only the enhanced email body content (no headers).
`;
    }

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
    console.error('Gemini API error for contact reply:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate reply'
    };
  }
}

// Utility function to validate API configuration
export function isGeminiConfigured(): boolean {
  return !!process.env.GEMINI_API_KEY;
}

// Clear rate limit for testing purposes
export function clearRateLimit(identifier: string): void {
  rateLimitMap.delete(identifier);
}
