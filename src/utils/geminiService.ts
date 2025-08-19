// (Optional) Gemini client import removed; using direct REST call

// Gemini AI Service for generating resume highlights
// This service provides AI-powered highlight generation for resume/portfolio content

interface GeminiHighlightResponse {
  highlight: string;
  category: string;
  icon: 'award' | 'book-open' | 'coffee';
}

// Real Gemini AI API integration for resume highlights
export const generateResumeHighlightWithGemini = async (resumeContext?: string): Promise<GeminiHighlightResponse> => {
  // Prefer client-exposed key in browser; fall back to server key if available
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

  // If no key configured, return a graceful local fallback to avoid console errors
  if (!apiKey) {
    console.warn('Gemini API key not configured. Using local fallback highlight.');
    return {
      highlight: 'Built scalable AI features across full-stack apps',
      category: 'AI/ML',
      icon: 'award',
    };
  }

  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + encodeURIComponent(apiKey),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an AI assistant generating personalized resume highlights.

                      Candidate Profile:
                      - Full Stack Developer with strong AI/ML background
                      - Skilled in React, Next.js, TypeScript, Node.js, Express, MongoDB
                      - Experienced with AI frameworks (TensorFlow, Mediapipe, OpenCV) and LLM integration (Gemini, APIs)
                      - Built ERP, fintech, wellness, and real-time apps with microservices, Docker, and cloud deployments
                      - Hackathon projects and open-source contributions in AI-powered platforms and scalable systems

                      Task:
                      - Create ONE professional highlight that reflects the candidate’s work style.
                      - Highlight must be specific, impactful, and measurable (e.g., users served, performance gained, scalability).
                      - Keep it <= 80 characters.
                      - Do not include quotes, explanations, or extra text—return only valid JSON.

                      Rules:
                      - JSON fields required: "highlight", "category", "icon"
                      - "category": 1-2 word label (e.g., "AI/ML", "Full Stack", "Leadership")
                      - "icon": must be exactly one of: "award", "book-open", "coffee"
                      - No markdown, no text before/after JSON.

                      Example valid outputs:
                      {
                        "highlight": "Built AI-powered ERP syncing 1M+ Tally entries in real-time",
                        "category": "Full Stack",
                        "icon": "award"
                      }
                      {
                        "highlight": "Developed wellness app with TensorFlow serving 10K+ users",
                        "category": "AI/ML",
                        "icon": "coffee"
                      }
                      {
                        "highlight": "Created stock analysis platform with Gemini AI for 5K investors",
                        "category": "AI/ML",
                        "icon": "book-open"
                      }

                      Optional Context:
                      ${resumeContext ? `Candidate-specific context: ${resumeContext}` : 'No extra context'}

                      Now generate the JSON response.`
            }]
          }],
          generationConfig: { temperature: 0.8, maxOutputTokens: 200 }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const textResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

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
    // Return a soft fallback instead of throwing so UI remains smooth
    return {
      highlight: 'Delivered production-grade features with measurable impact',
      category: 'Full Stack',
      icon: 'award',
    };
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
