export function getMockData() {

    const MOCK_PERSONAL_INFO = {
        "id": "default",
        "fullName": "Harsh Hirawat",
        "title": "AI Engineer & Full-Stack Developer",
        "bio": "AI Engineer and Full-Stack Developer specializing in the design and deployment of LLM-powered automation systems and scalable web platforms. Proven expertise in engineering agentic workflows using LangChain and LangGraph, developing production-grade Next.js applications, and optimizing high-performance Node.js backends.",
        "email": "harsh@greenhacker.in",
        "phone": "+91-9479733955",
        "location": "India",
        "website": "https://greenhacker.in",
        "githubUsername": "GreenHacker420",
        "avatar": null,
        "resume": "/resume.pdf",
        "isVisible": true,
        "createdAt": "2026-01-13T16:14:26.480Z",
        "updatedAt": "2026-10-21T08:00:00.000Z"
    };

    const MOCK_PROJECTS = [
        {
            "id": "proj-shopcontrol",
            "title": "ShopControl — Enterprise Retail & Stock Operations Platform",
            "description": "Mobile-first multi-tenant shop operations platform with real-time Tally ERP synchronization and offline resilience.",
            "longDescription": "ShopControl is an end-to-end operations platform built for wholesale, retail, and distribution businesses. Featuring an offline-first React Native/Expo mobile app, a Node.js/Prisma backend with LangGraph AI agents, automated WhatsApp dispatch & invoicing, and a custom desktop agent that synchronizes bidirectional inventory and ledgers with Tally ERP 9 / Tally Prime in real time.",
            "category": "enterprise",
            "techStack": [
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
            "status": "production",
            "featured": true,
            "repoUrl": "https://github.com/GreenHacker420",
            "projectUrl": null,
            "imageUrl": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2670&auto=format&fit=crop",
            "highlights": JSON.stringify([
                "Multi-tenant data isolation for wholesale & retail distributors",
                "Offline-first mobile app with local SQLite/AsyncStorage sync",
                "Background desktop daemon for bidirectional Tally ERP 9 / Prime ledger sync",
                "Automated WhatsApp customer invoicing and delivery memos"
            ]),
            "role": "Lead Full Stack & Mobile Architect",
            "isVisible": true,
            "displayOrder": 1,
            "viewCount": 0
        },
        {
            "id": "proj-evergreen",
            "title": "Evergreen Classic — Multi-Channel AI Commerce Platform",
            "description": "Multi-channel AI commerce platform unifying customer interactions across WhatsApp voice, web chat, and admin CRM.",
            "longDescription": "Evergreen Classic unifies fragmented e-commerce engagement into a single AI orchestrator. It serves customers across WhatsApp voice calls, web chat, and administrative panels through a unified AI brain that understands context, executes transactions, manages catalogs, and hands off to human agents when appropriate.",
            "category": "ai",
            "techStack": [
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
            "status": "production",
            "featured": true,
            "repoUrl": "https://github.com/GreenHacker420/evergreen",
            "projectUrl": "https://evergreenclassic.in",
            "imageUrl": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2670&auto=format&fit=crop",
            "highlights": JSON.stringify([
                "Single AI brain handling WhatsApp voice, text, and web chat",
                "Real-time product recommendation and cart management",
                "Comprehensive admin CRM with automated broadcast scheduling",
                "Sub-second response caching with Redis"
            ]),
            "role": "AI & Full-Stack Architect",
            "isVisible": true,
            "displayOrder": 2,
            "viewCount": 0
        },
        {
            "id": "proj-askmynotes",
            "title": "AskMyNotes — Multi-Modal Corrective RAG Study Tutor",
            "description": "AI-powered study companion turning notes & PDFs into an intelligent tutor using Corrective RAG with zero hallucinations.",
            "longDescription": "AskMyNotes is an intelligent study assistant that ingests PDFs and notes, providing citation-backed answers through streaming text and real-time voice interactions. Powered by Google Gemini 2.5 Flash and Pinecone with a Corrective RAG (CRAG) architecture, it offers strict domain grounding and automated active recall quiz generation.",
            "category": "ai",
            "techStack": [
                "Next.js 16.1",
                "Node.js 22",
                "TypeScript",
                "Google Gemini 2.5 Flash",
                "Pinecone Vector DB",
                "LangChain",
                "PostgreSQL",
                "Tailwind CSS"
            ],
            "status": "published",
            "featured": false,
            "repoUrl": "https://github.com/GreenHacker420/ASKMYNOTES",
            "projectUrl": "https://askmynotes.greenhacker.in/",
            "imageUrl": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2670&auto=format&fit=crop",
            "highlights": JSON.stringify([
                "Corrective RAG (CRAG) pipeline with strict citation provenance",
                "Multi-modal interaction with real-time text and voice streaming",
                "Subject-isolated vector namespaces preventing hallucination",
                "Automated active recall quiz and flashcard generation"
            ]),
            "role": "AI Systems Engineer",
            "isVisible": true,
            "displayOrder": 3,
            "viewCount": 0
        },
        {
            "id": "proj-campusconnect",
            "title": "Campus Connect — Peer-to-Peer EdTech Mentorship Platform",
            "description": "Full-stack EdTech platform connecting college applicants with verified student mentors for 1-on-1 counseling.",
            "longDescription": "A scalable web platform facilitating verified student mentorship for higher education admissions. Features real-time mentor discovery, automated Google/Microsoft calendar appointment scheduling, integrated Razorpay payment escrow, and peer review systems.",
            "category": "fullstack",
            "techStack": [
                "Next.js 16.1",
                "React 19",
                "TypeScript",
                "Supabase",
                "PostgreSQL",
                "Razorpay",
                "Tailwind CSS"
            ],
            "status": "production",
            "featured": true,
            "repoUrl": "https://github.com/GreenHacker420/Campusconnect",
            "projectUrl": "https://campus-connect.co.in",
            "imageUrl": "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2670&auto=format&fit=crop",
            "highlights": JSON.stringify([
                "Live production platform connecting applicants and verified student mentors",
                "Automated calendar booking and appointment synchronization",
                "Secure payment escrow and payout workflows via Razorpay",
                "Optimized SSR frontend built with React 19 and Next.js 16"
            ]),
            "role": "Full Stack Architect",
            "isVisible": true,
            "displayOrder": 4,
            "viewCount": 0
        },
        {
            "id": "proj-nodesage",
            "title": "NodeSage — Local CRAG Codebase Q&A & Fixer CLI",
            "description": "Terminal-native Corrective RAG CLI to index, query, and automatically fix codebase issues locally and privately.",
            "longDescription": "A high-performance CLI tool implementing a 7-stage Corrective RAG pipeline (Enhance Query -> Retrieve -> Grade -> Correct -> Re-rank -> Optimize -> Generate) running entirely on local LLMs via Ollama and Vectra. Enables developers to query large repositories and generate automated bug-fix patches without leaking sensitive code to cloud APIs.",
            "category": "ai",
            "techStack": [
                "TypeScript",
                "Node.js 18+",
                "Ollama",
                "Vectra Vector Store",
                "Commander.js",
                "LangChain"
            ],
            "status": "published",
            "featured": false,
            "repoUrl": "https://github.com/GreenHacker420/NodeSage",
            "projectUrl": null,
            "imageUrl": "https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=2574&auto=format&fit=crop",
            "highlights": JSON.stringify([
                "7-stage production-grade CRAG pipeline for code analysis",
                "100% offline and private codebase indexing with Vectra and Ollama",
                "AST-aware automated patch generation for common syntax and logic bugs",
                "Interactive CLI terminal with streaming responses"
            ]),
            "role": "Developer & Author",
            "isVisible": true,
            "displayOrder": 5,
            "viewCount": 0
        },
        {
            "id": "proj-fleetai",
            "title": "FleetAI — Telemetry-Driven Vehicle Maintenance Engine",
            "description": "Predictive vehicle maintenance system predicting component breakdown risks from real-time telemetry streams.",
            "longDescription": "FleetAI processes vehicle IoT sensor streams to predict maintenance risks. Combines a tuned Random Forest pipeline for classification with deterministic diagnostic rule trees and a Google Gemini layer to generate human-readable maintenance recommendations.",
            "category": "ai",
            "techStack": [
                "Python 3.12",
                "Scikit-learn",
                "Pandas",
                "Google Gemini API",
                "FastAPI",
                "Docker"
            ],
            "status": "published",
            "featured": false,
            "repoUrl": "https://github.com/GreenHacker420/Vehicle_AIML",
            "projectUrl": null,
            "imageUrl": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2670&auto=format&fit=crop",
            "highlights": JSON.stringify([
                "Tuned Random Forest classifier with 92%+ precision on failure metrics",
                "Deterministic telemetry diagnostic engine for critical component alarms",
                "Generative root-cause analysis and repair advisory generation with Gemini",
                "Containerized microservice API built with FastAPI"
            ]),
            "role": "ML & Backend Engineer",
            "isVisible": true,
            "displayOrder": 6,
            "viewCount": 0
        },
        {
            "id": "proj-gesturecanvas",
            "title": "Gesture Canvas — Hands-Free AI Drawing Canvas",
            "description": "Accessible AI drawing application powered by low-latency computer vision and real-time hand gesture recognition.",
            "longDescription": "Gesture Canvas enables users to create art hands-free using real-time webcam tracking. Powered by MediaPipe's 21-point hand landmark model and TensorFlow.js, it translates gestures into drawing actions, color picking, and canvas control at a smooth 60 FPS.",
            "category": "ai",
            "techStack": [
                "TensorFlow.js",
                "MediaPipe",
                "JavaScript",
                "Canvas API",
                "React",
                "Vite"
            ],
            "status": "published",
            "featured": false,
            "repoUrl": "https://github.com/GreenHacker420/gesture-canvas",
            "projectUrl": null,
            "imageUrl": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
            "highlights": JSON.stringify([
                "Real-time 21-point hand landmark tracking directly in browser",
                "Low-latency gesture classification for drawing, erasing, and palette selection",
                "Optimized canvas rendering loop maintaining 60 FPS on standard hardware",
                "Designed with accessibility considerations for motor-impaired users"
            ]),
            "role": "Computer Vision & Frontend Developer",
            "isVisible": true,
            "displayOrder": 7,
            "viewCount": 0
        },
        {
            "id": "proj-alpha",
            "title": "WorldQuant BRAIN — Quantitative Alpha Research Vault",
            "description": "Systematic quantitative finance repository for alpha signal formulation, parameter optimization, and backtesting.",
            "longDescription": "A quantitative research compendium containing mathematical formulations and simulation-ready trading alphas for the WorldQuant BRAIN platform. Implements mathematical signals, statistical arbitrage filters, and Sharpe-ratio optimization techniques.",
            "category": "fintech",
            "techStack": [
                "Python",
                "WorldQuant Brain API",
                "NumPy",
                "Pandas",
                "Statistical Modeling"
            ],
            "status": "published",
            "featured": false,
            "repoUrl": "https://github.com/GreenHacker420/alpha",
            "projectUrl": null,
            "imageUrl": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2670&auto=format&fit=crop",
            "highlights": JSON.stringify([
                "Systematic signal development and mathematical parameter sweeps",
                "Market-neutral portfolio construction and risk factor mitigation",
                "Backtested against historical market data across global equity universes",
                "High Sharpe ratio and controlled turnover validation"
            ]),
            "role": "Quantitative Researcher",
            "isVisible": true,
            "displayOrder": 8,
            "viewCount": 0
        },
        {
            "id": "proj-tallysync",
            "title": "tally-sync-ts — Typed Tally ERP 9 & Prime XML/TDL Client",
            "description": "Robust, strongly typed TypeScript SDK interfacing with Tally Prime's XML/TDL server interface.",
            "longDescription": "An open-source TypeScript SDK that bridges modern web platforms with Tally ERP 9 and Tally Prime. Provides type-safe request generators, XML response parsers, and ledger/voucher reconciliation utilities for enterprise ERP integrations.",
            "category": "devtools",
            "techStack": [
                "TypeScript",
                "XML / TDL",
                "Node.js",
                "Axios",
                "Jest"
            ],
            "status": "published",
            "featured": false,
            "repoUrl": "https://github.com/GreenHacker420/tally-sync-ts",
            "projectUrl": null,
            "imageUrl": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop",
            "highlights": JSON.stringify([
                "Complete TypeScript definitions for Tally vouchers, ledgers, and masters",
                "Automated XML request serialization and response normalization",
                "Fault-tolerant connection handling for local LAN Tally servers",
                "Powers real-time synchronization in enterprise retail platforms"
            ]),
            "role": "Author & Open Source Maintainer",
            "isVisible": true,
            "displayOrder": 9,
            "viewCount": 0
        },
        {
            "id": "proj-signflow",
            "title": "SignFlow — Legally Compliant Aadhaar eSign Engine",
            "description": "Full-stack integration with Setu Aadhaar eSign for automated, legally binding digital document signing.",
            "longDescription": "SignFlow orchestrates legally compliant digital signing workflows using Setu's Aadhaar eSign APIs. Facilitates instant biometric/OTP authentication, document hash calculation, automated PDF tamper sealing, and audit-ready verification certificates.",
            "category": "fintech",
            "techStack": [
                "Next.js",
                "Node.js",
                "Setu APIs",
                "PostgreSQL",
                "Webhooks",
                "PDFKit"
            ],
            "status": "published",
            "featured": false,
            "repoUrl": "https://github.com/GreenHacker420/setu-proj",
            "projectUrl": null,
            "imageUrl": "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2670&auto=format&fit=crop",
            "highlights": JSON.stringify([
                "End-to-end integration with Setu Aadhaar eSign gateway",
                "Instant Aadhaar OTP verification and legal document sealing",
                "Webhook event processor with idempotent ledger tracking",
                "Automated audit trail generation and PDF certificate stamping"
            ]),
            "role": "Fintech Engineer",
            "isVisible": true,
            "displayOrder": 10,
            "viewCount": 0
        },
        {
            "id": "proj-portfolio",
            "title": "Green Hacker — Personal Portfolio CMS & AI Mainframe",
            "description": "Full-stack developer operating system with automated GitHub intelligence, LangGraph RAG assistant, and dynamic CMS.",
            "longDescription": "A production-grade developer platform with role-based CMS management, live GitHub GraphQL analytics, dynamic Spline 3D animations, GSAP cinematic scroll presentations, and an integrated LangGraph-powered conversational AI agent with real-time portfolio memory.",
            "category": "fullstack",
            "techStack": [
                "Next.js 16.1",
                "React 19",
                "Tailwind CSS v4",
                "Prisma",
                "PostgreSQL",
                "LangGraph",
                "Three.js",
                "GSAP",
                "Docker"
            ],
            "status": "published",
            "featured": false,
            "repoUrl": "https://github.com/GreenHacker420/portfolio",
            "projectUrl": "https://greenhacker.in",
            "imageUrl": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2670&auto=format&fit=crop",
            "highlights": JSON.stringify([
                "Automated GitHub contribution analytics using GraphQL API and caching",
                "Embedded LangGraph AI assistant with streaming responses and RAG",
                "Immersive 3D interactive Spline keyboard and GSAP scroll timelines",
                "Secured admin dashboard with RBAC and PostgreSQL persistence"
            ]),
            "role": "Full Stack Architect",
            "isVisible": true,
            "displayOrder": 11,
            "viewCount": 0
        },
        {
            "id": "proj-pathwiser",
            "title": "PathWiser — AI-Powered Hiring & Career Intelligence Platform",
            "description": "End-to-end AI hiring platform with multimodal interviews, ATS pipeline, automated scoring, and recruiter intelligence built on CampusConnect.",
            "longDescription": "PathWiser is the career intelligence layer of Campus Connect — a modular AI hiring engine replacing traditional recruiting workflows. The FastAPI backend orchestrates Google Gemini Live multimodal interviews via LiveKit WebRTC, automated candidate scoring, ATS pipeline management, and async job assessment workers. The recruiter portal (Next.js 16) gives hiring teams a full-featured dashboard for role creation, interview scheduling, candidate evaluation, and AI-generated performance reports.",
            "category": "ai",
            "techStack": [
                "FastAPI",
                "Python 3.13",
                "Google Gemini Live",
                "LiveKit WebRTC",
                "SQLAlchemy 2.0",
                "BullMQ",
                "Next.js 16",
                "TanStack Query v5",
                "PostgreSQL",
                "Redis"
            ],
            "status": "production",
            "featured": true,
            "repoUrl": "https://github.com/GreenHacker420/Campusconnect",
            "projectUrl": "https://pathwiser.in",
            "imageUrl": "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2670&auto=format&fit=crop",
            "highlights": JSON.stringify([
                "Multimodal AI interviewing via Gemini Live and LiveKit WebRTC — real-time voice & video analysis",
                "Automated candidate scoring and AI-generated evaluation reports",
                "Full ATS pipeline — job creation, applicant tracking, offer management",
                "Async job assessment workers with BullMQ and PostgreSQL durable queues"
            ]),
            "role": "AI Systems & Full-Stack Architect",
            "isVisible": true,
            "displayOrder": 3,
            "viewCount": 0
        },
        {
            "id": "proj-stockapp",
            "title": "ShopControl Stock App — Mobile-First Inventory & Operations Frontend",
            "description": "Offline-capable React Native/Expo mobile app for real-time shop inventory, sales, and staff operations with Tally ERP sync.",
            "longDescription": "The ShopControl Stock App is the field-operations companion for multi-tenant wholesale and retail businesses. Built with React Native/Expo for iOS and Android, it provides offline-first stock browsing, real-time order placement, delivery memo generation, and staff attendance management. Data stays consistent across disconnected environments through a local SQLite sync layer, then reconciles with the cloud backend and Tally ERP when connectivity returns. The admin panel (Next.js) mirrors operations in real time for remote owner monitoring.",
            "category": "enterprise",
            "techStack": [
                "React Native",
                "Expo",
                "TypeScript",
                "SQLite",
                "TanStack Query",
                "Next.js",
                "Tailwind CSS v4",
                "Node.js",
                "Prisma",
                "Tally XML/TDL"
            ],
            "status": "production",
            "featured": false,
            "repoUrl": "https://github.com/GreenHacker420",
            "projectUrl": null,
            "imageUrl": "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=2787&auto=format&fit=crop",
            "highlights": JSON.stringify([
                "Offline-first SQLite sync with automatic background reconciliation on reconnect",
                "Real-time inventory, order, and delivery memo management from mobile",
                "Multi-tenant role separation — Owner remote monitoring vs Staff operational access",
                "Bidirectional Tally ERP sync via background desktop daemon"
            ]),
            "role": "Mobile & Full-Stack Architect",
            "isVisible": true,
            "displayOrder": 13,
            "viewCount": 0
        }
    ];

    const MOCK_SKILLS = [
        // Row 1 - Core Languages
        { id: "typescript", name: "TypeScript", description: "Strict type safety for mission-critical production systems.", level: 92, category: "language" },
        { id: "python", name: "Python", description: "Powering AI pipelines, LangGraph workflows, and ML architectures.", level: 90, category: "language" },
        { id: "javascript", name: "JavaScript", description: "Deep fluency in modern ES6+, async engines, and web standards.", level: 95, category: "language" },
        { id: "sql", name: "SQL", description: "Complex joins, indexing, query optimization, and schema design.", level: 88, category: "database" },
        { id: "cpp", name: "C++", description: "Strong algorithmic foundations and low-level performance principles.", level: 75, category: "language" },

        // Row 2 - AI & LLM Systems
        { id: "langgraph", name: "LangGraph", description: "Cyclic stateful multi-agent architectures and durable workflow loops.", level: 94, category: "ai" },
        { id: "langchain", name: "LangChain", description: "Production RAG, chaining tools, memory, and semantic search.", level: 92, category: "ai" },
        { id: "gemini", name: "Google Gemini API", description: "Structured prompting, multimodal processing, and low-latency inference.", level: 90, category: "ai" },
        { id: "gpt4", name: "OpenAI GPT-4o", description: "Function calling, JSON schema outputs, and reasoning orchestration.", level: 90, category: "ai" },
        { id: "pinecone", name: "Pinecone", description: "Vector search, indexing, semantic similarity, and namespace isolation.", level: 86, category: "ai" },
        { id: "tensorflow", name: "TensorFlow.js", description: "Real-time browser-based computer vision and neural inference.", level: 80, category: "ai" },

        // Row 3 - Frontend & 3D
        { id: "nextjs", name: "Next.js 16", description: "App Router, SSR, Server Actions, streaming, and Turbopack.", level: 94, category: "frontend" },
        { id: "react", name: "React 19", description: "Modern React with Actions, transitions, and concurrent rendering.", level: 95, category: "frontend" },
        { id: "tailwind", name: "Tailwind CSS v4", description: "Design systems, fluid layouts, and cybernetic aesthetics.", level: 95, category: "frontend" },
        { id: "framer", name: "Framer Motion", description: "Micro-interactions, layout transitions, and fluid physics.", level: 90, category: "frontend" },
        { id: "gsap", name: "GSAP", description: "Cinematic scroll timelines, pinned scenes, and high-performance SVG motion.", level: 88, category: "frontend" },
        { id: "three", name: "Three.js / Spline", description: "Interactive 3D viewports, shaders, and spatial web graphics.", level: 82, category: "frontend" },

        // Row 4 - Backend & DevOps
        { id: "nodejs", name: "Node.js", description: "High-throughput asynchronous servers and event-driven architecture.", level: 92, category: "backend" },
        { id: "express", name: "Express.js", description: "RESTful API services, rate-limiting, and middleware orchestration.", level: 90, category: "backend" },
        { id: "postgres", name: "PostgreSQL", description: "Relational modeling, indexing, connection pooling, and ACID safety.", level: 88, category: "database" },
        { id: "prisma", name: "Prisma ORM", description: "Type-safe migrations, queries, and automated relationship mapping.", level: 92, category: "database" },
        { id: "redis", name: "Redis", description: "In-memory caching layers reducing API latency and operational costs.", level: 85, category: "database" },
        { id: "docker", name: "Docker", description: "Containerized reproducible deployment pipelines across cloud environments.", level: 84, category: "devops" },
        { id: "github", name: "GitHub Actions", description: "Automated CI/CD pipelines, linting, testing, and continuous deployment.", level: 88, category: "devops" },
        { id: "cloudflare", name: "Cloudflare", description: "Workers, Pages, DNS routing, and edge-level security protections.", level: 82, category: "cloud" }
    ];

    const MOCK_EXPERIENCE = [
        {
            "id": "exp-commkraft",
            "company": "CommKraft",
            "position": "AI Engineer Intern (Full-Stack & LLM Systems)",
            "startDate": "2025-11-01T00:00:00.000Z",
            "endDate": null,
            "description": "Engineered and deployed complex LLM-driven automation workflows utilizing LangChain and LangGraph to streamline operational tasks.",
            "achievements": JSON.stringify([
                "Engineered and deployed complex LLM-driven automation workflows utilizing LangChain and LangGraph to streamline operational tasks",
                "Achieved a 30% reduction in API response latency through architectural optimizations and asynchronous processing",
                "Reduced operational overhead and API consumption costs by implementing robust Redis caching layers",
                "Developed specialized structured prompting strategies for GPT-4o and Gemini models ensuring high-fidelity data extraction"
            ]),
            "technologies": JSON.stringify([
                "LangChain",
                "LangGraph",
                "Node.js",
                "Express",
                "Redis",
                "PostgreSQL",
                "OpenAI GPT-4o",
                "Google Gemini API"
            ]),
            "companyLogo": null,
            "companyUrl": null,
            "location": "Remote",
            "employmentType": "Internship",
            "isVisible": true,
            "displayOrder": 1,
            "createdAt": "2026-01-13T18:28:53.524Z",
            "updatedAt": "2026-10-21T08:00:00.000Z"
        },
        {
            "id": "exp-websjyoti",
            "company": "Webs Jyoti",
            "position": "Frontend Developer Intern (Next.js & SSR)",
            "startDate": "2025-06-01T00:00:00.000Z",
            "endDate": "2025-07-31T00:00:00.000Z",
            "description": "Developed and optimized a production-ready web platform for recruitment and internal operations using Next.js and React 19.",
            "achievements": JSON.stringify([
                "Developed and optimized a production-ready web platform for recruitment and internal operations using Next.js and React 19",
                "Architected a server-side rendered (SSR) admin dashboard and careers portal, facilitating the processing of 100+ applications",
                "Improved overall page load performance by 40% through advanced optimization techniques including image optimization and route pre-fetching"
            ]),
            "technologies": JSON.stringify([
                "Next.js",
                "React 19",
                "Tailwind CSS",
                "Node.js",
                "REST APIs"
            ]),
            "companyLogo": null,
            "companyUrl": null,
            "location": "Remote",
            "employmentType": "Internship",
            "isVisible": true,
            "displayOrder": 2,
            "createdAt": "2026-01-13T18:28:54.153Z",
            "updatedAt": "2026-10-21T08:00:00.000Z"
        }
    ];

    const MOCK_EDUCATION = [
        {
            "id": "edu-newton",
            "institution": "Newton School of Technology, ADYPU",
            "degree": "B.Tech in Computer Science Engineering",
            "fieldOfStudy": "Artificial Intelligence & Machine Learning",
            "startDate": "2024-08-01T00:00:00.000Z",
            "endDate": "2028-05-01T00:00:00.000Z",
            "gpa": "8.86 / 10",
            "honors": "Dean's List / Academic Excellence",
            "description": "Undergraduate program focused on Artificial Intelligence, Machine Learning paradigms, distributed systems, and modern software engineering.",
            "activities": "AI Hackathons, Open Source Leadership, Algorithmic Competitions",
            "isVisible": true,
            "displayOrder": 1,
            "createdAt": "2026-01-13T18:28:54.768Z",
            "updatedAt": "2026-10-21T08:00:00.000Z"
        }
    ];

    const MOCK_CERTIFICATIONS = [
        {
            "id": "cert-mumbaihacks",
            "name": "Finalist | Mumbai Hacks",
            "issuer": "Mumbai Hacks National AI Hackathon",
            "date": "2025",
            "link": "https://github.com/GreenHacker420",
            "color": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
            "credentialId": "MH-FINALIST-2025",
            "description": "Ranked among top finalist teams in a highly competitive national hackathon developing autonomous AI agent systems."
        },
        {
            "id": "cert-googlegenai",
            "name": "Semi-Finalist | Google GenAI Hackathon",
            "issuer": "Google Developers",
            "date": "2025",
            "link": "https://github.com/GreenHacker420",
            "color": "bg-blue-500/10 text-blue-400 border-blue-500/20",
            "credentialId": "GOOG-GENAI-2025",
            "description": "Recognized for innovative implementation of generative AI and multimodal agent workflows using Gemini models."
        },
        {
            "id": "cert-hacktoberfest",
            "name": "Hacktoberfest 2025 Contributor",
            "issuer": "DigitalOcean & GitHub",
            "date": "2025",
            "link": "https://github.com/GreenHacker420",
            "color": "bg-purple-500/10 text-purple-400 border-purple-500/20",
            "credentialId": "HFEST-2025",
            "description": "Successfully contributed multiple merged PRs to open-source developer ecosystems and AI tooling."
        },
        {
            "id": "cert-worldquant",
            "name": "Quantitative Alpha Researcher",
            "issuer": "WorldQuant BRAIN Platform",
            "date": "2026",
            "link": "https://platform.worldquantbrain.com",
            "color": "bg-amber-500/10 text-amber-400 border-amber-500/20",
            "credentialId": "WQ-BRAIN-ALPHA",
            "description": "Formulated statistical and market-neutral alpha trading models validated against quantitative risk parameters."
        }
    ];

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
        },
        {
            "id": "cmkcxe57t000sqis0t48qchd1",
            "platform": "linkedin",
            "url": "https://www.linkedin.com/in/harsh-hirawat/",
            "username": "harsh-hirawat",
            "isVisible": true,
            "displayOrder": 3,
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
