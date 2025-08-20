# Deployment Guide

This project can be deployed to platforms like Vercel or Netlify. It uses Prisma with PostgreSQL and NextAuth credentials.

## Prerequisites
- PostgreSQL database and DATABASE_URL
- NEXTAUTH_SECRET and NEXTAUTH_URL set for your domain
- Optional: GEMINI_API_KEY (AI), GITHUB_TOKEN/USERNAME, SMTP_*

## Vercel
1. Import the repo into Vercel
2. Set Environment Variables (Production + Preview):
   - DATABASE_URL
   - NEXTAUTH_SECRET
   - NEXTAUTH_URL=https://your-domain.vercel.app
   - GEMINI_API_KEY (optional)
   - GITHUB_TOKEN, GITHUB_USERNAME (optional)
   - SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE, OWNER_EMAIL (optional)
3. Build & Output Settings: default for Next.js App Router
4. Post-deploy:
   - Run Prisma migration in a CI step or via "vercel exec" once:
     ```bash
     npx prisma db push
     npx prisma generate
     ```
   - Visit /admin/login to verify auth

## Netlify
This repo includes GitHub cache docs targeting Netlify Edge + Neon.

1. Connect the repo in Netlify
2. Set Environment Variables:
   - DATABASE_URL, NETLIFY_URL=https://<site>.netlify.app
   - NEXTAUTH_SECRET, NEXTAUTH_URL
   - Optional: GEMINI_API_KEY, GITHUB_TOKEN/USERNAME, SMTP_*
3. Build command:
   - If Prisma engines are an issue on Netlify, use the provided script:
     ```bash
     npm run build:netlify
     ```
4. After deploy, run migrations:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

## Database
- Use a managed PostgreSQL (e.g., Neon, Supabase, Railway)
- Ensure connection string is correct; check region/SSL requirements

## Security
- Use strong NEXTAUTH_SECRET
- Restrict admin to admin users only (default middleware enforces role)
- Do not expose tokens/secrets publicly

## Smoke Test Checklist
- / — site loads
- /api/test-env — reports configured env
- /admin/login — can sign in
- /admin — dashboard renders
- Create a skill, project — audit logs recorded

## Troubleshooting
- 500 on Prisma in serverless: ensure `npm run db:generate` ran and engines available
- 401 on admin routes: set NEXTAUTH_URL and cookie domain; check middleware matcher
- Build fails due to missing deps: run `npm run build:check-deps` or install prisma/tailwindcss
- AI features return 503: unset GEMINI_API_KEY or quota exceeded

