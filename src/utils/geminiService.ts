
// Gemini AI Service for generating resume highlights
// This service provides AI-powered highlight generation for resume/portfolio content

interface GeminiHighlightResponse {
  highlight: string;
  category: string;
  icon: 'award' | 'book-open' | 'coffee';
}

// Real Gemini AI API integration for resume highlights
export const generateResumeHighlightWithGemini = async (resumeContext?: string): Promise<GeminiHighlightResponse> => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('Gemini API key not configured');
  }

  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + apiKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Generate a professional resume highlight for a Full Stack Developer with expertise in React, Next.js, TypeScript, Node.js, and AI integration.

            ${resumeContext ? `Context: ${resumeContext}` : ''}

            Return your response in valid JSON format with these fields:
            - highlight: A concise professional highlight statement (max 80 characters)
            - category: A short category label (1-2 words like "Development", "Leadership", "AI/ML")
            - icon: One of these values: "award", "book-open", or "coffee"

            Make it specific, impressive, and relevant to modern web development.

            Example response:
            {
              "highlight": "Built scalable React apps serving 100K+ users with 99.9% uptime",
              "category": "Development",
              "icon": "award"
            }`
          }]
        }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 200,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const textResponse = data.candidates[0].content.parts[0].text;

    // Parse the JSON response
    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from Gemini API');
    }

    const jsonResponse = JSON.parse(jsonMatch[0]);

    // Validate response structure
    if (!jsonResponse.highlight || !jsonResponse.category || !jsonResponse.icon) {
      throw new Error('Incomplete response from Gemini API');
    }

    // Validate icon value
    const validIcons = ['award', 'book-open', 'coffee'];
    if (!validIcons.includes(jsonResponse.icon)) {
      jsonResponse.icon = 'award'; // Default fallback
    }

    return jsonResponse;
  } catch (error) {
    console.error('Error generating highlight with Gemini:', error);
    throw error;
  }
};

// Main function for generating resume highlights
export const generateResumeHighlight = async (resumeContext?: string): Promise<GeminiHighlightResponse> => {
  try {
    return await generateResumeHighlightWithGemini(resumeContext);
  } catch (error) {
    console.error('Gemini AI service error:', error);

    // Throw a descriptive error instead of returning mock data
    if (error instanceof Error && error.message.includes('API key')) {
      throw new Error('AI highlight generation requires Gemini API configuration. Please add your GEMINI_API_KEY to environment variables.');
    }

    throw new Error('AI service temporarily unavailable. Please try again later.');
  }
};

// Utility function to check if Gemini service is available
export const isGeminiServiceAvailable = (): boolean => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  return !!apiKey;
};

// Function to get service status
export const getGeminiServiceStatus = (): { available: boolean; message: string } => {
  const available = isGeminiServiceAvailable();

  return {
    available,
    message: available
      ? 'Gemini AI service is configured and ready'
      : 'Gemini AI service requires API key configuration'
  };
};

// Export types for use in components
export type { GeminiHighlightResponse };
