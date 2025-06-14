import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface ChatContext {
  currentPage?: string;
  userAgent?: string;
  ipAddress?: string;
  sessionId: string;
}

export interface ChatResponse {
  success: boolean;
  response?: string;
  suggestions?: string[];
  relatedFAQs?: FAQ[];
  error?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  viewCount: number;
  helpful: number;
  notHelpful: number;
}

// Get comprehensive website context for AI
export async function getWebsiteContext(): Promise<string> {
  try {
    // Fetch real data from database
    const [personalInfo, skills, projects, socialLinks] = await Promise.all([
      prisma.personalInfo.findFirst(),
      prisma.skill.findMany({
        where: { isVisible: true },
        orderBy: { level: 'desc' },
        take: 10
      }),
      prisma.project.findMany({
        where: { status: 'published' },
        orderBy: { displayOrder: 'asc' },
        take: 5
      }),
      prisma.socialLink.findMany({
        where: { isVisible: true },
        orderBy: { displayOrder: 'asc' }
      })
    ]);

    // Build comprehensive context
    const context = {
      personal: personalInfo ? {
        name: personalInfo.fullName,
        title: personalInfo.title,
        bio: personalInfo.bio,
        email: personalInfo.email,
        location: personalInfo.location
      } : null,
      
      topSkills: skills.map(skill => ({
        name: skill.name,
        level: skill.level,
        experience: skill.experience,
        category: skill.category,
        description: skill.description,
        projects: skill.projects ? JSON.parse(skill.projects) : [],
        strengths: skill.strengths ? JSON.parse(skill.strengths) : []
      })),
      
      projects: projects.map(project => ({
        title: project.title,
        description: project.description,
        technologies: project.technologies ? JSON.parse(project.technologies) : [],
        category: project.category,
        githubUrl: project.githubUrl,
        liveUrl: project.liveUrl,
        highlights: project.highlights ? JSON.parse(project.highlights) : []
      })),
      
      socialLinks: socialLinks.map(link => ({
        platform: link.platform,
        url: link.url,
        username: link.username
      }))
    };

    return JSON.stringify(context, null, 2);
  } catch (error) {
    console.error('Error fetching website context:', error);
    return 'Unable to fetch current website data';
  }
}

// Search FAQs
export async function searchFAQs(query: string, category?: string): Promise<FAQ[]> {
  try {
    const whereClause: any = {
      isVisible: true,
      OR: [
        { question: { contains: query, mode: 'insensitive' } },
        { answer: { contains: query, mode: 'insensitive' } },
        { tags: { contains: query, mode: 'insensitive' } }
      ]
    };

    if (category && category !== 'all') {
      whereClause.category = category;
    }

    // Temporarily return empty array until FAQ model is fixed
    return [];

    /*
    const faqs = await prisma.faq.findMany({
      where: whereClause,
      orderBy: [
        { viewCount: 'desc' },
        { helpful: 'desc' },
        { displayOrder: 'asc' }
      ],
      take: 5
    });

    return faqs.map(faq => ({
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      tags: faq.tags ? JSON.parse(faq.tags) : [],
      viewCount: faq.viewCount,
      helpful: faq.helpful,
      notHelpful: faq.notHelpful
    }));
    */
  } catch (error) {
    console.error('Error searching FAQs:', error);
    return [];
  }
}

// Get FAQs by category
export async function getFAQsByCategory(category: string): Promise<FAQ[]> {
  try {
    // Temporarily return empty array until FAQ model is fixed
    return [];

    /*
    const faqs = await prisma.faq.findMany({
      where: {
        isVisible: true,
        category: category
      },
      orderBy: [
        { displayOrder: 'asc' },
        { viewCount: 'desc' }
      ]
    });
    */

  } catch (error) {
    console.error('Error fetching FAQs by category:', error);
    return [];
  }
}

// Log chat interaction
export async function logChatInteraction(
  sessionId: string,
  userMessage: string,
  botResponse: string,
  context?: ChatContext,
  responseTime?: number
): Promise<void> {
  try {
    // Temporarily disabled until ChatInteraction model is fixed
    console.log('Chat interaction logged:', { sessionId, userMessage: userMessage.substring(0, 50), responseTime });
  } catch (error) {
    console.error('Error logging chat interaction:', error);
  }
}

// Update FAQ view count
export async function updateFAQViewCount(faqId: string): Promise<void> {
  try {
    // Temporarily disabled until FAQ model is fixed
    console.log('FAQ view count updated:', faqId);
  } catch (error) {
    console.error('Error updating FAQ view count:', error);
  }
}

// Rate FAQ helpfulness
export async function rateFAQ(faqId: string, isHelpful: boolean): Promise<void> {
  try {
    // Temporarily disabled until FAQ model is fixed
    console.log('FAQ rated:', faqId, isHelpful);
  } catch (error) {
    console.error('Error rating FAQ:', error);
  }
}

// Get popular FAQs
export async function getPopularFAQs(limit: number = 5): Promise<FAQ[]> {
  try {
    // Temporarily return empty array until FAQ model is fixed
    return [];
  } catch (error) {
    console.error('Error fetching popular FAQs:', error);
    return [];
  }
}

// Get FAQ categories
export async function getFAQCategories(): Promise<Array<{category: string, count: number}>> {
  try {
    // Temporarily return empty array until FAQ model is fixed
    return [];
  } catch (error) {
    console.error('Error fetching FAQ categories:', error);
    return [];
  }
}

// Generate contextual suggestions based on current page
export function getContextualSuggestions(currentPage?: string): string[] {
  const suggestions: Record<string, string[]> = {
    'about': [
      "Tell me about Harsh's background",
      "What technologies does he specialize in?",
      "What's his experience level?"
    ],
    'skills': [
      "What are his strongest technical skills?",
      "How many years of experience does he have?",
      "What programming languages does he know?"
    ],
    'projects': [
      "Show me his recent projects",
      "What kind of applications has he built?",
      "Can I see his GitHub repositories?"
    ],
    'contact': [
      "How can I get in touch?",
      "Is he available for freelance work?",
      "What's the best way to contact him?"
    ],
    'github': [
      "What are his GitHub stats?",
      "What languages does he code in most?",
      "How active is he on GitHub?"
    ]
  };

  return suggestions[currentPage || 'general'] || [
    "Tell me about Harsh Hirawat",
    "What services does he offer?",
    "How can I contact him?",
    "Show me his projects"
  ];
}
