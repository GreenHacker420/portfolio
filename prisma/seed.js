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
            title: "ShopControl — Enterprise Retail & Stock Operations Platform",
            description: "Mobile-first multi-tenant shop operations platform with real-time Tally ERP synchronization and offline resilience.",
            longDescription: "ShopControl is an end-to-end operations platform built for wholesale, retail, and distribution businesses. Featuring an offline-first React Native/Expo mobile app, a Node.js/Prisma backend with LangGraph AI agents, automated WhatsApp dispatch & invoicing, and a custom desktop agent that synchronizes bidirectional inventory and ledgers with Tally ERP 9 / Tally Prime in real time.",
            category: "enterprise",
            techStack: [
                "React Native",
                "Expo",
                "Node.js",
                "Prisma",
                "PostgreSQL",
                "LangGraph",
                "Google GenAI",
                "Tally XML/TDL",
                "AWS S3",
                "Cloudflare"
            ],
            status: "published",
            featured: true,
            repoUrl: "https://github.com/GreenHacker420",
            projectUrl: null,
            imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2670&auto=format&fit=crop",
            highlights: JSON.stringify([
                "Multi-tenant data isolation for wholesale & retail distributors",
                "Offline-first mobile app with local SQLite/AsyncStorage sync",
                "Background desktop daemon for bidirectional Tally ERP 9 / Prime ledger sync",
                "Automated WhatsApp customer invoicing and delivery memos"
            ]),
            role: "Lead Full Stack & Mobile Architect",
            isVisible: true,
            displayOrder: 1
        },
        {
            title: "Evergreen Classic — Multi-Channel AI Commerce Platform",
            description: "Multi-channel AI commerce platform unifying customer interactions across WhatsApp voice, web chat, and admin CRM.",
            longDescription: "Evergreen Classic unifies fragmented e-commerce engagement into a single AI orchestrator. It serves customers across WhatsApp voice calls, web chat, and administrative panels through a unified AI brain that understands context, executes transactions, manages catalogs, and hands off to human agents when appropriate.",
            category: "ai",
            techStack: [
                "Next.js",
                "React 19",
                "Node.js",
                "LangChain",
                "LangGraph",
                "WhatsApp Business API",
                "PostgreSQL",
                "Redis",
                "Tailwind CSS"
            ],
            status: "published",
            featured: true,
            repoUrl: "https://github.com/GreenHacker420/evergreen",
            projectUrl: "https://evergreenclassic.in",
            imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2670&auto=format&fit=crop",
            highlights: JSON.stringify([
                "Single AI brain handling WhatsApp voice, text, and web chat",
                "Real-time product recommendation and cart management",
                "Comprehensive admin CRM with automated broadcast scheduling",
                "Sub-second response caching with Redis"
            ]),
            role: "AI & Full-Stack Architect",
            isVisible: true,
            displayOrder: 2
        },
        {
            title: "AskMyNotes — Multi-Modal Corrective RAG Study Tutor",
            description: "AI-powered study companion turning notes & PDFs into an intelligent tutor using Corrective RAG with zero hallucinations.",
            longDescription: "AskMyNotes is an intelligent study assistant that ingests PDFs and notes, providing citation-backed answers through streaming text and real-time voice interactions. Powered by Google Gemini 2.5 Flash and Pinecone with a Corrective RAG (CRAG) architecture, it offers strict domain grounding and automated active recall quiz generation.",
            category: "ai",
            techStack: [
                "Next.js 16.1",
                "Node.js 22",
                "TypeScript",
                "Google Gemini 2.5 Flash",
                "Pinecone Vector DB",
                "LangChain",
                "PostgreSQL",
                "Tailwind CSS"
            ],
            status: "published",
            featured: true,
            repoUrl: "https://github.com/GreenHacker420/ASKMYNOTES",
            projectUrl: null,
            imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2670&auto=format&fit=crop",
            highlights: JSON.stringify([
                "Corrective RAG (CRAG) pipeline with strict citation provenance",
                "Multi-modal interaction with real-time text and voice streaming",
                "Subject-isolated vector namespaces preventing hallucination",
                "Automated active recall quiz and flashcard generation"
            ]),
            role: "AI Systems Engineer",
            isVisible: true,
            displayOrder: 3
        },
        {
            title: "Campus Connect — Peer-to-Peer EdTech Mentorship Platform",
            description: "Full-stack EdTech platform connecting college applicants with verified student mentors for 1-on-1 counseling.",
            longDescription: "A scalable web platform facilitating verified student mentorship for higher education admissions. Features real-time mentor discovery, automated Google/Microsoft calendar appointment scheduling, integrated Razorpay payment escrow, and peer review systems.",
            category: "fullstack",
            techStack: [
                "Next.js 16.1",
                "React 19",
                "TypeScript",
                "Supabase",
                "PostgreSQL",
                "Razorpay",
                "Tailwind CSS"
            ],
            status: "published",
            featured: true,
            repoUrl: "https://github.com/GreenHacker420/Campusconnect",
            projectUrl: "https://campus-connect.co.in",
            imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2670&auto=format&fit=crop",
            highlights: JSON.stringify([
                "Live production platform connecting applicants and verified student mentors",
                "Automated calendar booking and appointment synchronization",
                "Secure payment escrow and payout workflows via Razorpay",
                "Optimized SSR frontend built with React 19 and Next.js 16"
            ]),
            role: "Full Stack Architect",
            isVisible: true,
            displayOrder: 4
        },
        {
            title: "NodeSage — Local CRAG Codebase Q&A & Fixer CLI",
            description: "Terminal-native Corrective RAG CLI to index, query, and automatically fix codebase issues locally and privately.",
            longDescription: "A high-performance CLI tool implementing a 7-stage Corrective RAG pipeline (Enhance Query -> Retrieve -> Grade -> Correct -> Re-rank -> Optimize -> Generate) running entirely on local LLMs via Ollama and Vectra.",
            category: "ai",
            techStack: [
                "TypeScript",
                "Node.js 18+",
                "Ollama",
                "Vectra Vector Store",
                "Commander.js",
                "LangChain"
            ],
            status: "published",
            featured: false,
            repoUrl: "https://github.com/GreenHacker420/NodeSage",
            projectUrl: null,
            imageUrl: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=2574&auto=format&fit=crop",
            highlights: JSON.stringify([
                "7-stage production-grade CRAG pipeline for code analysis",
                "100% offline and private codebase indexing with Vectra and Ollama",
                "AST-aware automated patch generation for common syntax and logic bugs",
                "Interactive CLI terminal with streaming responses"
            ]),
            role: "Developer & Author",
            isVisible: true,
            displayOrder: 5
        },
        {
            title: "FleetAI — Telemetry-Driven Vehicle Maintenance Engine",
            description: "Predictive vehicle maintenance system predicting component breakdown risks from real-time telemetry streams.",
            longDescription: "FleetAI processes vehicle IoT sensor streams to predict maintenance risks using tuned Random Forest pipelines and Google Gemini.",
            category: "ai",
            techStack: [
                "Python 3.12",
                "Scikit-learn",
                "Pandas",
                "Google Gemini API",
                "FastAPI",
                "Docker"
            ],
            status: "published",
            featured: false,
            repoUrl: "https://github.com/GreenHacker420/Vehicle_AIML",
            projectUrl: null,
            imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2670&auto=format&fit=crop",
            highlights: JSON.stringify([
                "Tuned Random Forest classifier with 92%+ precision on failure metrics",
                "Deterministic telemetry diagnostic engine for critical alarms",
                "Generative root-cause analysis with Gemini"
            ]),
            role: "ML & Backend Engineer",
            isVisible: true,
            displayOrder: 6
        },
        {
            title: "Gesture Canvas — Hands-Free AI Drawing Canvas",
            description: "Accessible AI drawing application powered by low-latency computer vision and real-time hand gesture recognition.",
            longDescription: "Hands-free gesture-based drawing app focused on accessibility using MediaPipe and TensorFlow.js.",
            category: "ai-app",
            techStack: [
                "TensorFlow.js",
                "MediaPipe",
                "JavaScript",
                "Canvas API",
                "React",
                "Vite"
            ],
            status: "published",
            featured: false,
            repoUrl: "https://github.com/GreenHacker420/gesture-canvas",
            projectUrl: null,
            imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
            highlights: JSON.stringify([
                "Real-time 21-point hand tracking in browser",
                "Low-latency gesture classification",
                "Smooth 60 FPS rendering pipeline"
            ]),
            role: "AI / Frontend Developer",
            isVisible: true,
            displayOrder: 7
        },
        {
            title: "WorldQuant BRAIN — Quantitative Alpha Research Vault",
            description: "Systematic quantitative finance repository for alpha signal formulation, parameter optimization, and backtesting.",
            longDescription: "Quantitative alpha research compendium containing mathematical formulations and simulation-ready trading alphas.",
            category: "fintech",
            techStack: [
                "Python",
                "WorldQuant Brain API",
                "NumPy",
                "Pandas",
                "Statistical Modeling"
            ],
            status: "published",
            featured: false,
            repoUrl: "https://github.com/GreenHacker420/alpha",
            projectUrl: null,
            imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2670&auto=format&fit=crop",
            highlights: JSON.stringify([
                "Systematic signal development and parameter optimization",
                "Market-neutral portfolio construction",
                "Validated Sharpe ratio and risk factor metrics"
            ]),
            role: "Quantitative Researcher",
            isVisible: true,
            displayOrder: 8
        },
        {
            title: "tally-sync-ts — Typed Tally ERP 9 & Prime XML/TDL Client",
            description: "Robust, strongly typed TypeScript SDK interfacing with Tally Prime's XML/TDL server interface.",
            longDescription: "An open-source TypeScript SDK that bridges modern web platforms with Tally ERP 9 and Tally Prime.",
            category: "devtools",
            techStack: [
                "TypeScript",
                "XML / TDL",
                "Node.js",
                "Axios"
            ],
            status: "published",
            featured: false,
            repoUrl: "https://github.com/GreenHacker420/tally-sync-ts",
            projectUrl: null,
            imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop",
            highlights: JSON.stringify([
                "Complete TypeScript definitions for Tally vouchers and ledgers",
                "Automated XML request serialization",
                "Powers real-time synchronization in retail platforms"
            ]),
            role: "Author & Maintainer",
            isVisible: true,
            displayOrder: 9
        },
        {
            title: "SignFlow — Legally Compliant Aadhaar eSign Engine",
            description: "Full-stack integration with Setu Aadhaar eSign for automated, legally binding digital document signing.",
            longDescription: "SignFlow orchestrates legally compliant digital signing workflows using Setu's Aadhaar eSign APIs.",
            category: "fintech",
            techStack: [
                "Next.js",
                "Node.js",
                "Setu APIs",
                "PostgreSQL",
                "Webhooks"
            ],
            status: "published",
            featured: false,
            repoUrl: "https://github.com/GreenHacker420/setu-proj",
            projectUrl: null,
            imageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2670&auto=format&fit=crop",
            highlights: JSON.stringify([
                "Aadhaar OTP verification and legal document sealing",
                "Webhook event processor with idempotent ledger tracking",
                "Audit-ready verification certificate generation"
            ]),
            role: "Fintech Engineer",
            isVisible: true,
            displayOrder: 10
        },
        {
            title: "Green Hacker — Personal Portfolio CMS & AI Mainframe",
            description: "Full-stack developer operating system with automated GitHub intelligence, LangGraph RAG assistant, and dynamic CMS.",
            longDescription: "A full-featured personal portfolio CMS with automated GitHub analytics, RBAC, and real-time indexing.",
            category: "web-app",
            techStack: [
                "Next.js",
                "Prisma",
                "PostgreSQL",
                "Docker",
                "LangGraph",
                "Three.js"
            ],
            status: "published",
            featured: false,
            repoUrl: "https://github.com/GreenHacker420/portfolio",
            projectUrl: "https://greenhacker.in",
            imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2670&auto=format&fit=crop",
            highlights: JSON.stringify([
                "Automated project indexing and GitHub analytics",
                "LangGraph conversational agent with live system context",
                "Dynamic 3D Spline and GSAP presentation"
            ]),
            role: "Full Stack Developer",
            isVisible: true,
            displayOrder: 11
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
