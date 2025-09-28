import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { GoogleGenerativeAI } from "@google/generative-ai"
import { z } from 'zod'

const generateTemplateSchema = z.object({
  type: z.enum(['auto-reply', 'notification', 'welcome', 'follow-up', 'custom']),
  purpose: z.string().min(10).max(500),
  tone: z.enum(['professional', 'friendly', 'casual', 'formal']).default('professional'),
  includePersonalization: z.boolean().default(true),
  brandVoice: z.string().optional(),
  additionalInstructions: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = generateTemplateSchema.parse(body)

    // Initialize Gemini AI
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 503 }
      )
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    // Create a detailed prompt for email template generation
    const prompt = `
Generate a professional email template with the following specifications:

**Template Type**: ${validatedData.type}
**Purpose**: ${validatedData.purpose}
**Tone**: ${validatedData.tone}
**Include Personalization**: ${validatedData.includePersonalization ? 'Yes' : 'No'}
${validatedData.brandVoice ? `**Brand Voice**: ${validatedData.brandVoice}` : ''}
${validatedData.additionalInstructions ? `**Additional Instructions**: ${validatedData.additionalInstructions}` : ''}

**Context**: This is for a portfolio website contact form system for Harsh Hirawat (GreenHacker), a Full Stack Developer.

Please generate:
1. A compelling subject line
2. HTML email content (responsive design)
3. Plain text version
4. List of available variables for personalization
5. Brief description of the template's purpose

**Available Variables** (use these in your template):
- {{name}} - Contact person's name
- {{email}} - Contact person's email
- {{subject}} - Original message subject
- {{message}} - Original message content
- {{date}} - Current date
- {{ownerName}} - Harsh Hirawat
- {{ownerAlias}} - GreenHacker
- {{ownerTitle}} - Full Stack Developer
- {{website}} - Portfolio website URL
- {{replyTime}} - Expected reply timeframe

**Requirements**:
- Use modern, clean HTML design
- Include proper email styling (inline CSS)
- Make it mobile-responsive
- Professional yet approachable tone
- Include call-to-action if appropriate
- Use placeholder variables where personalization is needed

Return the response in this exact JSON format:
{
  "subject": "Generated subject line",
  "htmlContent": "Complete HTML email template",
  "textContent": "Plain text version",
  "variables": ["list", "of", "variables", "used"],
  "description": "Brief description of template purpose"
}
`;

    const result = await model.generateContent(prompt)
    const response = result.response.text()
    
    // Try to parse the JSON response
    let generatedTemplate;
    try {
      // Extract JSON from the response if it's wrapped in markdown
      const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) || response.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : response;
      generatedTemplate = JSON.parse(jsonString);
    } catch (parseError) {
      // If JSON parsing fails, create a structured response
      generatedTemplate = {
        subject: `${validatedData.type.charAt(0).toUpperCase() + validatedData.type.slice(1)} Email Template`,
        htmlContent: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Generated Template</h2>
          <p>AI-generated content:</p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
            ${response.replace(/\n/g, '<br>')}
          </div>
        </div>`,
        textContent: response,
        variables: ['name', 'email', 'subject', 'message', 'date', 'ownerName'],
        description: `AI-generated ${validatedData.type} template for ${validatedData.purpose}`
      };
    }

    // Validate the generated template structure
    const templateResponse = {
      subject: generatedTemplate.subject || `${validatedData.type} Template`,
      htmlContent: generatedTemplate.htmlContent || '<p>Generated content not available</p>',
      textContent: generatedTemplate.textContent || 'Generated content not available',
      variables: Array.isArray(generatedTemplate.variables) ? generatedTemplate.variables : ['name', 'email'],
      description: generatedTemplate.description || `AI-generated ${validatedData.type} template`,
      category: validatedData.type === 'auto-reply' || validatedData.type === 'notification' ? 'contact' : 'marketing',
      name: `ai-${validatedData.type}-${Date.now()}`,
      isActive: false // Generated templates start as inactive
    }

    return NextResponse.json({ 
      success: true, 
      template: templateResponse,
      message: 'Email template generated successfully'
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error generating email template:', error)
    return NextResponse.json(
      { error: 'Failed to generate email template' },
      { status: 500 }
    )
  }
}
