# GreenHacker Admin Panel (Next.js)

A full-featured admin panel for the GreenHacker portfolio built with Next.js App Router, TypeScript, Tailwind CSS, and Aceternity UI–inspired components. It includes authenticated/authorized CRUD for portfolio content, audit logging, bulk operations, CSV export, and AI-assisted features.

## Features
- Secure admin area with NextAuth (Credentials) and role-based gate via middleware
- Full CRUD for Skills, Projects, Contacts, Education, Experience, Personal Info, Social Links, Media, Settings
- Public read endpoints for Skills and Projects
- Audit logging for admin actions (CREATE, UPDATE, DELETE, BULK_*, AI_*)
- Bulk operations (delete, status updates) and CSV export
- Responsive UI using Tailwind + Radix primitives; Aceternity-style components
- React Query data fetching, toasts, and optimistic UX patterns
- GitHub data integration with cache (optional Netlify Edge + Neon)
- AI endpoints (Gemini) for chatbot and contact-reply assistance

## Technology Stack
- Framework: Next.js 15 (App Router)
- Language: TypeScript, React 18
- Styling: Tailwind CSS, Radix UI, Aceternity-inspired components
- Auth: NextAuth (Credentials provider)
- Database: PostgreSQL via Prisma ORM (+ Prisma Accelerate extension)
- Data Fetching: @tanstack/react-query in admin UI
- AI: Google Generative AI (Gemini)

## Project Structure (high-level)
```
src/
  app/
    admin/                 # Admin pages (protected by middleware)
      dashboard/
      skills/ [page, new, [id]]
      projects/ [page, new, [id]]
      contacts/
      experience/
      education/
      personal/
      social/
      media/
      settings/
      audit/
      login/
      layout.tsx
      providers.tsx
    api/                   # App Router API
      skills/route.ts      # Public skills
      projects/route.ts    # Public projects
      auth/[...nextauth]/route.ts
      admin/...            # Authenticated admin endpoints
  components/
  lib/
  services/
prisma/
  schema.prisma
  seed.ts
```

## Getting Started
1) Install dependencies
```bash
npm install
```

2) Configure environment
- Copy .env.example to .env and fill values (see Environment Variables)
- Ensure a PostgreSQL database (Neon recommended) and set DATABASE_URL

3) Generate Prisma client and push schema
```bash
npm run db:generate
npm run db:push
```

4) Seed an admin user (optional; panel can bootstrap if none exists)
```bash
npm run db:seed
```

5) Run the dev server
```bash
npm run dev
```

6) Build and start
```bash
npm run build
npm start
```

## Environment Variables
See .env.example for a complete list. Common values:
- NEXTAUTH_SECRET, NEXTAUTH_URL
- DATABASE_URL
- DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD (bootstrap)
- ADMIN_EMAIL, ADMIN_PASSWORD (seeding fallback)
- GEMINI_API_KEY
- GITHUB_TOKEN, GITHUB_USERNAME (GitHub integration)
- SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE, OWNER_EMAIL
- NEXT_PUBLIC_SITE_URL
- NETLIFY_URL (if using Netlify cache admin)

## Authentication & Authorization
- Credentials auth via NextAuth at /api/auth; admin login page at /admin/login
- src/middleware.ts enforces admin access to /admin/** and redirects unauthenticated users to /admin/login
- Session strategy: JWT; token contains id, email, name, role

## Development Scripts
- dev: Start Next dev with Turbopack
- build: Prisma generate + Next build
- start: Next start
- db:generate, db:push, db:seed, db:studio
- cache:* scripts for GitHub cache utilities

## API and Guides
- API reference: docs/API.md
- Admin User Guide: docs/ADMIN_USER_GUIDE.md
- Developer Guide: docs/DEVELOPER_GUIDE.md
- Database Schema: docs/DATABASE_SCHEMA.md
- Deployment: docs/DEPLOYMENT.md
- Related: docs/DUAL_CLI_SYSTEM.md, docs/CLI_SYSTEM_GUIDE.md, docs/ENHANCED_CHATBOT_GUIDE.md, docs/GITHUB_CACHE_IMPLEMENTATION.md, docs/EMAIL_SIGNATURE_GUIDE.md

## Troubleshooting
- Prisma client errors: run `npm run db:generate` or `npm run db:push`
- Netlify builds: use `npm run build:netlify` (generates Prisma without engines)
- 401/redirects on admin: set NEXTAUTH_URL and NEXTAUTH_SECRET; ensure you’re logged in as admin
- No admin user: POST /api/admin/bootstrap or set DEFAULT_ADMIN_EMAIL/DEFAULT_ADMIN_PASSWORD and log in
- Missing AI features: set GEMINI_API_KEY
- Emails not sending: set SMTP_* and OWNER_EMAIL

## Screenshots/Diagrams
- See docs/ADMIN_USER_GUIDE.md for annotated screenshots
- Architecture diagram lives in docs/DEVELOPER_GUIDE.md
