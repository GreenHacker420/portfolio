require('dotenv').config({ path: '.env' });
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Start seeding...');

    // 1. Personal Info
    console.log('Seeding PersonalInfo...');
    await prisma.personalInfo.upsert({
        where: { id: 'default' },
        update: {
            fullName: "Harsh Hirawat",
            title: "AI Engineer & Full-Stack Developer",
            bio: "AI Engineer and Full-Stack Developer focused on building LLM-powered automation systems and scalable web platforms. Experienced with LangChain-based agent workflows, Next.js production applications, and high-performance Node.js backends.",
            email: "harsh@greenhacker.in",
            phone: "+91-9479733955",
            location: "India",
            website: "https://greenhacker.in",
            githubUsername: "GreenHacker420",
            avatar: null,
            resume: null,
            isVisible: true
        },
        create: {
            id: 'default',
            fullName: "Harsh Hirawat",
            title: "AI Engineer & Full-Stack Developer",
            bio: "AI Engineer and Full-Stack Developer focused on building LLM-powered automation systems and scalable web platforms. Experienced with LangChain-based agent workflows, Next.js production applications, and high-performance Node.js backends.",
            email: "harsh@greenhacker.in",
            phone: "+91-9479733955",
            location: "India",
            website: "https://greenhacker.in",
            githubUsername: "GreenHacker420",
            avatar: null,
            resume: null,
            isVisible: true
        }
    });

    // 2. Work Experience
    console.log('Seeding WorkExperience...');
    // Clear existing to avoid duplicates during dev seeding
    await prisma.workExperience.deleteMany({});

    const workExperiences = [
        {
            company: "CommKraft",
            position: "AI Engineer Intern (Full-Stack & LLM Systems)",
            startDate: new Date("2025-11-01"),
            endDate: null,
            description: "Worked on designing and deploying LLM-driven automation workflows with a focus on performance and reliability.",
            achievements: JSON.stringify([
                "Designed and deployed LLM-driven workflows using LangChain and LangGraph",
                "Reduced API response latency by 30%",
                "Improved reliability and reduced API costs using Redis caching",
                "Implemented structured prompting with GPT-4o and Gemini APIs"
            ]),
            technologies: JSON.stringify([
                "Node.js",
                "Express",
                "LangChain",
                "LangGraph",
                "Redis",
                "PostgreSQL",
                "OpenAI GPT-4o",
                "Gemini API"
            ]),
            employmentType: "Internship",
            location: "Remote",
            isVisible: true,
            displayOrder: 1
        },
        {
            company: "Webs Jyoti",
            position: "Frontend Developer Intern (Next.js & SSR)",
            startDate: new Date("2025-06-01"),
            endDate: new Date("2025-07-31"),
            description: "Built and optimized a production-grade SSR web platform.",
            achievements: JSON.stringify([
                "Built a production-ready platform using Next.js and React 19",
                "Developed an SSR admin dashboard and careers portal",
                "Handled 100+ applications through the platform",
                "Improved page load performance by 40%"
            ]),
            technologies: JSON.stringify([
                "Next.js",
                "React 19",
                "Tailwind CSS"
            ]),
            employmentType: "Internship",
            location: "Remote",
            isVisible: true,
            displayOrder: 2
        }
    ];

    for (const xp of workExperiences) {
        await prisma.workExperience.create({ data: xp });
    }

    // 3. Projects
    console.log('Seeding Projects...');
    await prisma.project.deleteMany({});

    const projects = [
        {
            title: "Green Hacker — Personal Portfolio CMS",
            description: "A unified developer CMS to centralize projects, analytics, and content.",
            longDescription: "A full-featured personal portfolio CMS with automated GitHub analytics, RBAC, and real-time indexing.",
            category: "web-app",
            techStack: [
                "Next.js",
                "Prisma",
                "PostgreSQL",
                "Docker",
                "GitHub Actions",
                "AWS",
                "GCP"
            ],
            status: "published",
            featured: true,
            repoUrl: "https://github.com/GreenHacker420",
            projectUrl: null,
            highlights: JSON.stringify([
                "Automated project indexing",
                "Role-based access control",
                "Real-time GitHub analytics"
            ]),
            role: "Full Stack Developer",
            isVisible: true,
            displayOrder: 1
        },
        {
            title: "Gesture Canvas — AI Gesture Drawing App",
            description: "Hands-free gesture-based drawing app focused on accessibility.",
            longDescription: "AI-powered canvas that enables drawing using real-time hand gesture recognition.",
            category: "ai-app",
            techStack: [
                "TensorFlow.js",
                "MediaPipe",
                "JavaScript",
                "Canvas API"
            ],
            status: "published",
            featured: true,
            repoUrl: "https://github.com/GreenHacker420",
            projectUrl: null,
            highlights: JSON.stringify([
                "Real-time hand tracking",
                "Low-latency gesture recognition",
                "Smooth rendering pipeline"
            ]),
            role: "AI / Frontend Developer",
            isVisible: true,
            displayOrder: 2
        }
    ];

    for (const proj of projects) {
        await prisma.project.create({ data: proj });
    }

    // 4. Education
    console.log('Seeding Education...');
    await prisma.education.deleteMany({});

    await prisma.education.create({
        data: {
            institution: "Newton School of Technology, ADYPU",
            degree: "B.Tech",
            fieldOfStudy: "Computer Science Engineering (AI & ML)",
            startDate: new Date("2024-08-01"),
            endDate: new Date("2028-05-01"),
            gpa: "8.86 / 10",
            description: "Undergraduate program focused on Artificial Intelligence, Machine Learning, and modern software engineering.",
            isVisible: true,
            displayOrder: 1
        }
    });

    // 5. Skills
    console.log('Seeding Skills...');
    await prisma.skill.deleteMany({});

    const skills = [
        { name: "JavaScript", category: "language", level: 90 },
        { name: "TypeScript", category: "language", level: 85 },
        { name: "Python", category: "language", level: 80 },

        { name: "Node.js", category: "backend", level: 85 },
        { name: "Express.js", category: "backend", level: 80 },
        { name: "REST APIs", category: "backend", level: 85 },

        { name: "React", category: "frontend", level: 85 },
        { name: "Next.js", category: "frontend", level: 90 },
        { name: "Tailwind CSS", category: "frontend", level: 80 },

        { name: "LangChain", category: "ai", level: 85 },
        { name: "LangGraph", category: "ai", level: 80 },
        { name: "OpenAI GPT-4o", category: "ai", level: 85 },
        { name: "Gemini API", category: "ai", level: 80 },

        { name: "PostgreSQL", category: "database", level: 80 },
        { name: "MongoDB", category: "database", level: 75 },
        { name: "Redis", category: "database", level: 75 },

        { name: "Docker", category: "devops", level: 75 },
        { name: "GitHub Actions", category: "devops", level: 70 },
        { name: "AWS", category: "cloud", level: 70 },
        { name: "Google Cloud Platform", category: "cloud", level: 70 }
    ];

    for (const skill of skills) {
        await prisma.skill.create({ data: skill });
    }

    // 6. Achievements
    console.log('Seeding Achievements...');
    await prisma.achievement.deleteMany({});

    const achievements = [
        {
            title: "Hacktoberfest 2025 Completion",
            description: "Completed Hacktoberfest 2025 with multiple open-source contributions.",
            category: "open-source",
            date: new Date("2025-10-01"),
            isVisible: true
        },
        {
            title: "AI Hackathon Finalist & Semi-Finalist",
            description: "Semi-Finalist in Google GenAI Hackathon and Finalist in Mumbai Hacks, ranking among top teams.",
            category: "hackathon",
            date: new Date("2025-09-01"),
            isVisible: true
        }
    ];

    for (const achievement of achievements) {
        await prisma.achievement.create({ data: achievement });
    }

    // 7. Social Links
    console.log('Seeding Social Links...');
    await prisma.socialLink.deleteMany({});

    const socials = [
        {
            platform: "github",
            url: "https://github.com/GreenHacker420",
            username: "GreenHacker420",
            displayOrder: 1
        },
        {
            platform: "website",
            url: "https://greenhacker.in",
            displayOrder: 2
        }
    ];

    for (const social of socials) {
        await prisma.socialLink.create({ data: social });
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
