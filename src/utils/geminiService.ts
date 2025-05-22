
// Gemini AI Service for generating dynamic content
// This is a mock service that simulates API calls to Google's Gemini AI

interface GeminiHighlightResponse {
  highlight: string;
  category: string;
  icon: 'award' | 'book-open' | 'coffee';
}

// Predefined set of highlight templates for simulation purposes
const highlightTemplates = [
  {
    highlight: "Implemented serverless architecture using AWS Lambda, reducing operational costs by 40%",
    category: "Cloud Architecture",
    icon: "award"
  },
  {
    highlight: "Led a team of 5 developers to deliver a complex e-commerce platform in 3 months",
    category: "Leadership",
    icon: "coffee" 
  },
  {
    highlight: "Authored technical blog posts with over 100,000 monthly readers",
    category: "Content Creation",
    icon: "book-open"
  },
  {
    highlight: "Optimized database queries resulting in a 60% performance improvement",
    category: "Performance",
    icon: "award"
  },
  {
    highlight: "Designed and implemented a microservices architecture using Docker and Kubernetes",
    category: "DevOps",
    icon: "coffee"
  },
  {
    highlight: "Created custom data visualization libraries used by Fortune 500 companies",
    category: "Visualization",
    icon: "book-open"
  }
];

// Simulated Gemini AI API call
export const generateResumeHighlight = async (): Promise<GeminiHighlightResponse> => {
  // In a real implementation, this would make an API call to Gemini
  // For simulation, we'll randomly select from predefined highlights
  
  return new Promise((resolve) => {
    // Simulate API latency
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * highlightTemplates.length);
      resolve(highlightTemplates[randomIndex]);
    }, 1500);
  });
};

// In a real implementation, you would have a function like this:
/*
export const generateResumeHighlightWithGemini = async (apiKey: string, resumeText: string): Promise<GeminiHighlightResponse> => {
  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Based on this resume excerpt, generate one professional highlight that would stand out to recruiters:
            ${resumeText}
            
            Return your response in valid JSON format with these fields:
            - highlight: A concise professional highlight statement
            - category: A short category label for this highlight (1-2 words)
            - icon: One of these values: "award", "book-open", or "coffee"
            `
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 200,
        }
      })
    });

    const data = await response.json();
    const jsonResponse = JSON.parse(data.candidates[0].content.parts[0].text);
    return jsonResponse;
  } catch (error) {
    console.error('Error generating highlight with Gemini:', error);
    throw error;
  }
};
*/
