export function getMockData() {

    const MOCK_PERSONAL_INFO = {
        "id": "default",
        "fullName": "Harsh Hirawat",
        "title": "AI Engineer & Full-Stack Developer",
        "bio": "AI Engineer and Full-Stack Developer focused on building LLM-powered automation systems and scalable web platforms. Experienced with LangChain-based agent workflows, Next.js production applications, and high-performance Node.js backends.",
        "email": "harsh@greenhacker.in",
        "phone": "+91-9479733955",
        "location": "India",
        "website": "https://greenhacker.in",
        "githubUsername": "GreenHacker420",
        "avatar": null,
        "resume": null,
        "isVisible": true,
        "createdAt": "2026-01-13T16:14:26.480Z",
        "updatedAt": "2026-01-13T18:28:52.200Z"
    };

    const MOCK_PROJECTS = [
        {
            "id": "cmkcxe2b70002qis0ym0kglt4",
            "title": "Green Hacker — Personal Portfolio CMS",
            "description": "A unified developer CMS to centralize projects, analytics, and content.",
            "longDescription": "A full-featured personal portfolio CMS with automated GitHub analytics, RBAC, and real-time indexing.",
            "category": "web-app",
            "techStack": [
                "Next.js",
                "Prisma",
                "PostgreSQL",
                "Docker",
                "GitHub Actions",
                "AWS",
                "GCP"
            ],
            "status": "published",
            "featured": true,
            "repoUrl": "https://github.com/GreenHacker420",
            "projectUrl": null,
            "imageUrl": null,
            "gallery": null,
            "highlights": "[\"Automated project indexing\",\"Role-based access control\",\"Real-time GitHub analytics\"]",
            "challenges": null,
            "learnings": null,
            "startDate": null,
            "endDate": null,
            "teamSize": null,
            "role": "Full Stack Developer",
            "isVisible": true,
            "displayOrder": 1,
            "viewCount": 0,
            "createdAt": "2026-01-13T18:28:54.451Z",
            "updatedAt": "2026-01-13T18:28:54.451Z"
        },
        {
            "id": "cmkcxe2ec0003qis0e12ee6ud",
            "title": "Gesture Canvas — AI Gesture Drawing App",
            "description": "Hands-free gesture-based drawing app focused on accessibility.",
            "longDescription": "AI-powered canvas that enables drawing using real-time hand gesture recognition.",
            "category": "ai-app",
            "techStack": [
                "TensorFlow.js",
                "MediaPipe",
                "JavaScript",
                "Canvas API"
            ],
            "status": "published",
            "featured": true,
            "repoUrl": "https://github.com/GreenHacker420",
            "projectUrl": null,
            "imageUrl": null,
            "gallery": null,
            "highlights": "[\"Real-time hand tracking\",\"Low-latency gesture recognition\",\"Smooth rendering pipeline\"]",
            "challenges": null,
            "learnings": null,
            "startDate": null,
            "endDate": null,
            "teamSize": null,
            "role": "AI / Frontend Developer",
            "isVisible": true,
            "displayOrder": 2,
            "viewCount": 0,
            "createdAt": "2026-01-13T18:28:54.564Z",
            "updatedAt": "2026-01-13T18:28:54.564Z"
        }
    ];

    const MOCK_SKILLS = [
        // Row 1
        { id: "javascript", name: "JavaScript", description: "yeeting code into the DOM since '95, no cap!", level: 90, category: "language" },
        { id: "typescript", name: "TypeScript", description: "JavaScript but with trust issues and fewer runtime errors.", level: 85, category: "language" },
        { id: "html", name: "HTML5", description: "The skeleton of the web. Not a programming language, don't @ me.", level: 95, category: "frontend" },
        { id: "css", name: "CSS3", description: "Making things pretty and centering divs since forever.", level: 90, category: "frontend" },
        { id: "react", name: "React", description: "Components, hooks, virtual DOM. It's just JavaScript, right?", level: 90, category: "frontend" },
        { id: "vue", name: "Vue.js", description: "The progressive framework. Like React but with better separation of concerns.", level: 80, category: "frontend" },

        // Row 2
        { id: "nextjs", name: "Next.js", description: "React on steroids. SSR, ISR, and all the acronyms you need.", level: 85, category: "frontend" },
        { id: "tailwind", name: "Tailwind CSS", description: "Inline styles with extra steps (and we love it).", level: 90, category: "frontend" },
        { id: "node", name: "Node.js", description: "JavaScript on the server? Yes please. Async all the way.", level: 85, category: "backend" },
        { id: "express", name: "Express.js", description: "Minimalist web framework. Use it before you switch to NestJS.", level: 85, category: "backend" },
        { id: "database", name: "PostgreSQL", description: "The world's most advanced open source relational database.", level: 80, category: "database" },
        { id: "mongodb", name: "MongoDB", description: "flexin' with that NoSQL drip, respectfully!", level: 80, category: "database" },

        // Row 3
        { id: "git", name: "Git", description: "Saving your code (and your sanity) one commit at a time.", level: 85, category: "devops" },
        { id: "github", name: "GitHub", description: "Where code lives, and where green squares give use dopamine.", level: 90, category: "devops" },
        { id: "prettier", name: "Prettier", description: "Because arguing about code formatting is a waste of time.", level: 90, category: "devops" },
        { id: "npm", name: "NPM", description: "Installing half the internet into your node_modules folder.", level: 85, category: "devops" },
        { id: "openai", name: "OpenAI API", description: "Making your apps smarter than you are (scary stuff).", level: 80, category: "ai" },
        { id: "langchain", name: "LangChain", description: "Chaining LLMs like a boss. RAG to riches.", level: 75, category: "ai" },

        // Row 4
        { id: "linux", name: "Linux", description: "I use Arch, btw. (Just kidding, probably Ubuntu or Debian).", level: 70, category: "devops" },
        { id: "docker", name: "Docker", description: "It works on my machine... and now on yours too.", level: 75, category: "devops" },
        { id: "nginx", name: "Nginx", description: "Reverse proxying like a pro. Load balancing for days.", level: 70, category: "devops" },
        { id: "aws", name: "AWS", description: "Amazon's way of taking all your money for cloud services.", level: 65, category: "cloud" },
        { id: "tensorflow", name: "TensorFlow", description: "Machine learning for when you have too much data.", level: 60, category: "ai" },
        { id: "vercel", name: "Vercel", description: "Deploying sites faster than you can say 'serverless'.", level: 90, category: "cloud" }
    ];

    const MOCK_EXPERIENCE = [
        {
            "id": "cmkcxe1lg0000qis0wwafpgoh",
            "company": "CommKraft",
            "position": "AI Engineer Intern (Full-Stack & LLM Systems)",
            "startDate": "2025-11-01T00:00:00.000Z",
            "endDate": null,
            "description": "Worked on designing and deploying LLM-driven automation workflows with a focus on performance and reliability.",
            "achievements": "[\"Designed and deployed LLM-driven workflows using LangChain and LangGraph\",\"Reduced API response latency by 30%\",\"Improved reliability and reduced API costs using Redis caching\",\"Implemented structured prompting with GPT-4o and Gemini APIs\"]",
            "technologies": "[\"Node.js\",\"Express\",\"LangChain\",\"LangGraph\",\"Redis\",\"PostgreSQL\",\"OpenAI GPT-4o\",\"Gemini API\"]",
            "companyLogo": null,
            "companyUrl": null,
            "location": "Remote",
            "employmentType": "Internship",
            "isVisible": true,
            "displayOrder": 1,
            "createdAt": "2026-01-13T18:28:53.524Z",
            "updatedAt": "2026-01-13T18:28:53.524Z"
        },
        {
            "id": "cmkcxe22x0001qis0wh6ge98k",
            "company": "Webs Jyoti",
            "position": "Frontend Developer Intern (Next.js & SSR)",
            "startDate": "2025-06-01T00:00:00.000Z",
            "endDate": "2025-07-31T00:00:00.000Z",
            "description": "Built and optimized a production-grade SSR web platform.",
            "achievements": "[\"Built a production-ready platform using Next.js and React 19\",\"Developed an SSR admin dashboard and careers portal\",\"Handled 100+ applications through the platform\",\"Improved page load performance by 40%\"]",
            "technologies": "[\"Next.js\",\"React 19\",\"Tailwind CSS\"]",
            "companyLogo": null,
            "companyUrl": null,
            "location": "Remote",
            "employmentType": "Internship",
            "isVisible": true,
            "displayOrder": 2,
            "createdAt": "2026-01-13T18:28:54.153Z",
            "updatedAt": "2026-01-13T18:28:54.153Z"
        }
    ];

    const MOCK_EDUCATION = [
        {
            "id": "cmkcxe2k00004qis0xrr59i5i",
            "institution": "Newton School of Technology, ADYPU",
            "degree": "B.Tech",
            "fieldOfStudy": "Computer Science Engineering (AI & ML)",
            "startDate": "2024-08-01T00:00:00.000Z",
            "endDate": "2028-05-01T00:00:00.000Z",
            "gpa": "8.86 / 10",
            "honors": null,
            "description": "Undergraduate program focused on Artificial Intelligence, Machine Learning, and modern software engineering.",
            "activities": null,
            "isVisible": true,
            "displayOrder": 1,
            "createdAt": "2026-01-13T18:28:54.768Z",
            "updatedAt": "2026-01-13T18:28:54.768Z"
        }
    ];

    const MOCK_CERTIFICATIONS = [];

    const MOCK_SOCIAL_LINKS = [
        {
            "id": "cmkcxe54z000rqis0ahmfor7b",
            "platform": "github",
            "url": "https://github.com/GreenHacker420",
            "username": "GreenHacker420",
            "isVisible": true,
            "displayOrder": 1,
            "createdAt": "2026-01-13T18:28:58.115Z",
            "updatedAt": "2026-01-13T18:28:58.115Z"
        },
        {
            "id": "cmkcxe57t000sqis0t48qchd0",
            "platform": "website",
            "url": "https://greenhacker.in",
            "username": null,
            "isVisible": true,
            "displayOrder": 2,
            "createdAt": "2026-01-13T18:28:58.217Z",
            "updatedAt": "2026-01-13T18:28:58.217Z"
        }
    ];

    const MOCK_GITHUB_STATS = {
        followers: 100,
        following: 50,
        public_repos: 20,
        total_commits: 500,
        total_stars: 100,
        total_forks: 20,
        total_issues: 10,
        total_prs: 30,
        contributions: 1000
    };

    return {
        skills: MOCK_SKILLS,
        personalInfo: MOCK_PERSONAL_INFO,
        projects: MOCK_PROJECTS,
        experience: MOCK_EXPERIENCE,
        education: MOCK_EDUCATION,
        certifications: MOCK_CERTIFICATIONS,
        socialLinks: MOCK_SOCIAL_LINKS,
        MOCK_GITHUB_STATS
    };
}
