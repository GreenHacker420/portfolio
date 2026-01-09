
export const MOCK_GITHUB_STATS = {
    username: "GreenHacker420",
    totalCommits: 1243,
    totalPRs: 45,
    totalIssues: 28,
    totalStars: 156,
    contributions: Array.from({ length: 52 * 7 }, () => Math.floor(Math.random() * 5)), // 0-4 intensity
    languages: [
        { name: "JavaScript", percentage: 45, color: "#f7df1e" },
        { name: "TypeScript", percentage: 30, color: "#3178c6" },
        { name: "Python", percentage: 15, color: "#3572A5" },
        { name: "Rust", percentage: 5, color: "#dea584" },
        { name: "Other", percentage: 5, color: "#ededed" }
    ],
    recentActivity: [
        { type: "Push", repo: "portfolio-2024", message: "feat: implemented 3d skills", time: "2h ago" },
        { type: "PR", repo: "awesome-tools", message: "fix: typography issues", time: "5h ago" },
        { type: "Star", repo: "aceternity-ui", message: "Starred repository", time: "1d ago" },
        { type: "Create", repo: "nextjs-starter", message: "Created new repository", time: "2d ago" }
    ]
};

// MOCK DATA - Migrated from legacy JSON files

export const MOCK_PROJECTS = [
    {
        "id": "project_001",
        "title": "AI-Powered Portfolio",
        "description": "A modern portfolio website with AI chatbot integration and real-time GitHub analytics",
        "longDescription": "Built with Next.js 15, this portfolio showcases my work while featuring an intelligent AI chatbot powered by Google Gemini. The site includes real-time GitHub statistics, project showcases, and an admin dashboard for content management.",
        "category": "web-app",
        "technologies": ["Next.js", "React", "TypeScript", "PostgreSQL", "Prisma", "TailwindCSS", "Google Gemini AI"],
        "status": "published",
        "featured": true,
        "githubUrl": "https://github.com/greenhacker/portfolio",
        "liveUrl": "https://greenhacker.tech",
        "imageUrl": "/projects/portfolio.jpg",
        "gallery": [" /projects/portfolio-1.jpg", " /projects/portfolio-2.jpg"],
        "highlights": ["AI Chatbot Integration", "Real-time GitHub Analytics", "Admin Dashboard", "Responsive Design"],
        "challenges": ["Implementing efficient caching for GitHub API", "Optimizing AI response times", "Building a flexible CMS"],
        "learnings": ["Next.js 15 Server Components", "AI Integration Best Practices", "Performance Optimization"],
        "startDate": "2024-01-01T00:00:00.000Z",
        "endDate": null,
        "teamSize": 1,
        "role": "Full Stack Developer",
        "isVisible": true,
        "displayOrder": 1,
        "viewCount": 150,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
    }
];

export const MOCK_SKILLS = [
    {
        "id": "skill_001",
        "name": "JavaScript",
        "description": "Expert in modern JavaScript (ES6+), TypeScript, and Node.js",
        "category": "language",
        "level": 95,
        "color": "#F7DF1E",
        "logo": "/logos/javascript.svg",
        "experience": 5,
        "projects": ["Portfolio Website", "E-commerce Platform", "Real-time Chat App"],
        "strengths": ["Async/Await", "Closures", "Prototypes", "ES6+ Features"],
        "isVisible": true,
        "isFeatured": true,
        "displayOrder": 1,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
        "id": "skill_002",
        "name": "React",
        "description": "Building modern, responsive UIs with React and Next.js",
        "category": "frontend",
        "level": 90,
        "color": "#61DAFB",
        "logo": "/logos/react.svg",
        "experience": 4,
        "projects": ["Portfolio Website", "Dashboard App", "Social Media Platform"],
        "strengths": ["Hooks", "Context API", "Server Components", "Performance Optimization"],
        "isVisible": true,
        "isFeatured": true,
        "displayOrder": 2,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
        "id": "skill_003",
        "name": "Node.js",
        "description": "Backend development with Express, NestJS, and serverless",
        "category": "backend",
        "level": 88,
        "color": "#339933",
        "logo": "/logos/nodejs.svg",
        "experience": 4,
        "projects": ["REST API", "GraphQL Server", "Microservices"],
        "strengths": ["Express.js", "API Design", "Authentication", "Database Integration"],
        "isVisible": true,
        "isFeatured": true,
        "displayOrder": 3,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
        "id": "skill_004",
        "name": "PostgreSQL",
        "description": "Database design, optimization, and management",
        "category": "database",
        "level": 85,
        "color": "#336791",
        "logo": "/logos/postgresql.svg",
        "experience": 3,
        "projects": ["E-commerce Database", "Analytics Tool", "User Management System"],
        "strengths": ["Schema Design", "Complex Queries", "Performance Tuning", "Indexing"],
        "isVisible": true,
        "isFeatured": true,
        "displayOrder": 4,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
    }
];

export const MOCK_EXPERIENCE = [
    {
        "id": "work_001",
        "company": "Tech Innovations Inc.",
        "position": "Senior Software Engineer",
        "startDate": "2022-01-01T00:00:00.000Z",
        "endDate": "2023-12-31T00:00:00.000Z",
        "description": "Led development of key features for a large-scale SaaS product.",
        "achievements": ["Improved application performance by 60%", "Implemented CI/CD pipeline", "Mentored 5 junior developers", "Led migration to microservices architecture"],
        "technologies": ["React", "Node.js", "PostgreSQL", "Docker", "AWS", "TypeScript"],
        "companyLogo": "/logos/tech-innovations.png",
        "companyUrl": "https://techinnovations.example.com",
        "location": "San Francisco, CA",
        "employmentType": "Full-time",
        "isVisible": true,
        "displayOrder": 1,
        "createdAt": "2022-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
    }
];

export const MOCK_PERSONAL_INFO = {
    "id": "default",
    "fullName": "GreenHacker",
    "title": "Full Stack Developer & AI Engineer",
    "bio": "Passionate developer with expertise in modern web technologies, AI/ML, and cloud infrastructure. Building innovative solutions that make a difference.",
    "email": "contact@greenhacker.tech",
    "phone": "+1234567890",
    "location": "San Francisco, CA",
    "website": "https://greenhacker.tech",
    "avatar": "/images/avatar.jpg",
    "resume": "/files/resume.pdf",
    "isVisible": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
};
