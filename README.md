## Green Hacker — Developer Portfolio (Next.js, TypeScript)

A modern, full‑stack developer portfolio and admin platform by Green Hacker. The public site showcases projects, skills, interactive 3D/animation, SEO‑optimized content, and GitHub analytics. A secure admin panel (credentials‑based) powers end‑to‑end content management with Prisma/PostgreSQL, audit logging, bulk operations, CSV export, and AI‑assisted tooling.

Live site: https://greenhacker.tech


### Highlights
- Next.js 15 App Router + TypeScript, Tailwind CSS, Radix/shadcn‑style & Aceternity‑inspired UI
- Admin with role‑gated access via NextAuth middleware
- Full CRUD for portfolio entities with audit logs, bulk ops, and CSV export
- GitHub analytics with caching and visualizations (heatmap, stats, AI insights)
- AI endpoints powered by Google Generative AI (Gemini)
- Production‑ready deployment configs for Netlify and Vercel
- Strong SEO, accessibility, and performance defaults


## Technology Stack

- Frontend
  - Next.js 15 (App Router), React 18, TypeScript
  - Tailwind CSS, tailwindcss-animate, Radix UI primitives, shadcn‑style components, lucide-react
  - Styled-components, Framer Motion, GSAP, Three.js, Cal-Heatmap, Embla Carousel
- Backend/API
  - Next.js Route Handlers (API routes)
  - Authentication: NextAuth (credentials)
  - Validation: zod
- Data and ORM
  - Prisma ORM with PostgreSQL (Neon recommended)
  - Prisma Accelerate extension
- Integrations
  - GitHub REST + GraphQL APIs (profile, repos, contribution calendar)
  - Google Generative AI (Gemini) for chatbot and contact‑reply assistance
  - Nodemailer (SMTP) for email
  - Google Analytics (optional)
- Tooling & DX
  - ESLint (next/eslint-config), TypeScript, tsx
  - Tailwind/PostCSS/Autoprefixer
- Deployment/Infra
  - Netlify (netlify.toml + custom build scripts), Vercel (vercel.json)
  - Next image remote patterns and optimized builds


## Project Structure

- src/app
  - Public pages: page.tsx, sitemap.xml, feed.xml
  - Admin app: /admin (dashboard, skills, projects, contacts, education, experience, personal, social, media, settings, audit)
  - API routes: /api (public: skills, projects; admin: full CRUD; AI, CLI, contact, FAQ, GitHub)
  - Global layout, providers, middleware
- src/components
  - Sections (Hero, About, Skills, Projects, Resume, Contact, GitHub Stats, Chatbots)
  - Admin UI (tables, dialogs, sidebar/header), UI primitives, SEO, analytics, effects, 3D
- src/services
  - GitHub service + cache, Gemini/chatbot, email, CLI command helpers, skill inference, retry strategies
- src/lib
  - auth (NextAuth options), db (Prisma client)
- src/styles, src/hooks, src/utils, src/types
- prisma
  - schema.prisma (skills, projects, contacts, education, experience, media, settings, audit logs, admin users), seed.ts
- scripts
  - Netlify build scripts, cache setup, admin seeding, utilities
- docs
  - Developer, API, deployment, guides and diagrams
- Config
  - next.config.js, tailwind.config.ts, postcss.config.js, tsconfig.json, eslint.config.js, netlify.toml, vercel.json


## Features

- Portfolio UX
  - Responsive, accessible UI with light/dark themes
  - Animated hero and interactive sections (GSAP/Three.js), particles, 3D card effects
  - SEO: structured data, sitemap, RSS feed, social cards, canonical links
  - GitHub analytics (contribution heatmap, stats, AI insights), performance metrics
  - Multiple chatbot experiences (standard and enhanced/CLI‑style)
- Admin CMS
  - Secure admin area with credentials auth and RBAC gate via middleware
  - CRUD for: Skills, Projects, Contacts, Education, Experience, Personal Info, Social Links, Media, Settings
  - Bulk operations, CSV export, audit logging
  - GitHub cache monitor and utilities
  - AI‑assisted contact reply and content helpers (Gemini)
- API
  - Public: /api/skills, /api/projects
  - Admin: /api/admin/** endpoints per entity with zod validation + auditing
  - AI: /api/ai/** (chat, contact‑reply, GitHub analysis/overview)


## Setup Instructions

Prerequisites
- Node.js 18+ (20 recommended), npm 10+
- PostgreSQL database (Neon recommended)

1) Install dependencies
- npm install

2) Configure environment
- Copy .env.example to .env and fill in values
- Required: NEXTAUTH_SECRET, NEXTAUTH_URL, DATABASE_URL
- Optional: GEMINI_API_KEY, GITHUB_TOKEN, GITHUB_USERNAME, SMTP_*, NEXT_PUBLIC_GA_MEASUREMENT_ID, GOOGLE_SITE_VERIFICATION, VERCEL_URL, NETLIFY_URL

3) Generate Prisma client and push schema
- npm run db:generate
- npm run db:push

4) (Optional) Seed data or admin
- npm run db:seed (if seed.ts covers your needs)
- or: npx tsx scripts/seed-admin.ts
- First‑run bootstrap: if no admin exists, DEFAULT_ADMIN_EMAIL/DEFAULT_ADMIN_PASSWORD can be used (see src/lib/auth.ts)

5) Run the dev server
- npm run dev
- Open http://localhost:3000

6) Build and start (production)
- npm run build
- npm start

Environment variables (see .env.example)
- Auth: NEXTAUTH_SECRET, NEXTAUTH_URL
- Database: DATABASE_URL
- Bootstrap: DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD
- Integrations: GEMINI_API_KEY, GITHUB_TOKEN, GITHUB_USERNAME, SMTP_HOST/PORT/USER/PASS, OWNER_EMAIL
- Analytics/SEO: NEXT_PUBLIC_GA_MEASUREMENT_ID, GOOGLE_SITE_VERIFICATION, YANDEX_VERIFICATION, BING_VERIFICATION
- Deployment: NETLIFY_URL, VERCEL_URL, NEXT_PUBLIC_SITE_URL


## Usage

Public site
- Explore sections: Hero, About, Skills, Projects, Resume, Contact, GitHub Stats (with AI analysis)
- Try chatbots (standard or CLI‑style) for interactive exploration
- Toggle theme and enjoy motion/3D effects

Admin
- Visit /admin/login and sign in
- Manage content across Skills, Projects, Contacts, Education, Experience, Personal, Social, Media, Settings
- Use bulk actions, CSV export, and review audit logs
- Optional AI tools for contact replies and content suggestions

API quick reference
- Public: GET /api/skills, GET /api/projects
- Admin: /api/admin/** per entity (secured)
- AI: /api/ai/chat, /api/ai/contact-reply, /api/ai/github-* (secured/controlled)


## Deployment

Netlify
- Build command: npm run build:netlify (uses scripts/netlify-build.sh and prisma generate without engines when needed)
- Set env vars: DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL, optional GEMINI_API_KEY, GITHUB_TOKEN/USERNAME, SMTP_*
- After deploy (if needed): npx prisma db push && npx prisma generate

Vercel
- Build command: npm run build; output: .next (see vercel.json)
- Functions config and headers are pre‑set; set the same environment variables

Images/Performance
- next.config.js includes remote image domains and fallbacks
- Types/ESLint can be skipped on CI by setting SKIP_TYPE_CHECK=true


## Contact — Green Hacker
- Website: https://greenhacker.tech
- Email: harsh@greenhacker.tech
- GitHub: https://github.com/GreenHacker420
- LinkedIn: https://linkedin.com/in/harsh-hirawat-b657061b7
- Twitter/X: https://twitter.com/greenhacker

If you have feedback, opportunities, or questions, feel free to reach out!