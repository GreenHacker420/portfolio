# 🌐 Green Hacker — Developer Portfolio & Admin Platform

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)  
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)  
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)](https://www.prisma.io/)  
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql)](https://www.postgresql.org/)  
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com/)  
[![Netlify](https://img.shields.io/badge/Deploy-Netlify-00C7B7?logo=netlify)](https://www.netlify.com/)  

> A modern **full-stack developer portfolio** + **admin CMS** built with **Next.js 15 & TypeScript**.  
Showcases projects, skills, animations, GitHub analytics, and includes a secure admin panel with **Prisma/PostgreSQL**, audit logging, bulk operations, CSV export, and AI-powered tooling.

🔗 **Live Site:** [greenhacker.tech](https://greenhacker.tech)

---

## 🚀 Tech Stack

### **Frontend**
<p align="left">
  <img src="https://skillicons.dev/icons?i=nextjs,react,ts,tailwind,styledcomponents,threejs,framer,gsap" />
</p>

- **Frameworks:** Next.js 15 (App Router), React 18, TypeScript  
- **Styling & UI:** Tailwind CSS, Radix UI, shadcn-style, Styled-components  
- **Animations/3D:** Framer Motion, GSAP, Three.js, Cal-Heatmap, Embla Carousel  

---

### **Backend / API**
<p align="left">
  <img src="https://skillicons.dev/icons?i=nodejs,prisma,postgres" />
</p>

- **API:** Next.js Route Handlers (API routes)  
- **Auth:** NextAuth (credentials, RBAC)  
- **Validation:** zod  
- **Database & ORM:** Prisma + PostgreSQL (Neon recommended)  

---

### **Integrations**
<p align="left">
  <img src="https://skillicons.dev/icons?i=github,google,gmail" />
</p>

- GitHub REST + GraphQL APIs (profile, repos, contribution calendar)  
- Google Generative AI (Gemini) for chatbot & content replies  
- Nodemailer (SMTP) for email  
- Google Analytics (optional)  

---

### **Deployment & Tooling**
<p align="left">
  <img src="https://skillicons.dev/icons?i=vercel,netlify,eslint" />
</p>

- **Hosting:** Vercel & Netlify (with optimized configs)  
- **Tooling:** ESLint, TypeScript, Tailwind CLI, PostCSS, tsx  
- **Infra:** Prisma Accelerate, caching, retry strategies  

---

## ✨ Features

### **Portfolio UX**
- Responsive, accessible UI (light/dark themes)  
- Animated hero, GSAP/Three.js interactions, 3D card effects  
- SEO-optimized: sitemap, RSS feed, structured data, OpenGraph cards  
- GitHub analytics (heatmap, stats, AI insights)  
- Multiple chatbot experiences (standard + CLI-style)  

### **Admin CMS**
- Secure admin area with RBAC (NextAuth middleware)  
- CRUD for Skills, Projects, Education, Experience, Media, Settings, Contacts  
- Bulk operations + CSV export  
- Audit logging for all changes  
- AI-assisted tooling (contact replies, content helpers)  

### **API**
- **Public:** `/api/skills`, `/api/projects`  
- **Admin:** `/api/admin/**` (CRUD with zod + audit logs)  
- **AI:** `/api/ai/**` (chat, contact reply, GitHub insights)  

---

## 📂 Project Structure
```
src/
 ├── app/            # App Router pages
 │   ├── admin/      # Admin dashboard
 │   ├── api/        # API routes
 │   └── layout.tsx  # Global layout
 ├── components/     # UI sections, admin tables, SEO, 3D, etc.
 ├── services/       # GitHub, Gemini, email, utils
 ├── lib/            # Auth + Prisma client
 ├── prisma/         # schema.prisma, seed
 ├── styles/         # Tailwind + global styles
 └── utils/          # Helpers, hooks, types
```

---

## ⚡ Setup Instructions

### Prerequisites
- Node.js **18+** (20 recommended)  
- PostgreSQL (Neon recommended)  

### Install & Configure
```bash
# Clone repo & install deps
npm install

# Setup env
cp .env.example .env

# Generate Prisma client & push schema
npm run db:generate
npm run db:push

# (Optional) Seed data / admin
npm run db:seed
```

First-run admin bootstrap:  
Use `DEFAULT_ADMIN_EMAIL` and `DEFAULT_ADMIN_PASSWORD` (configured in `.env`).  

### Run Dev
```bash
npm run dev
```
Visit → `http://localhost:3000`

### Production Build
```bash
npm run build
npm start
```

---

## 🌍 Deployment

### **Vercel**
- Build command: `npm run build`  
- Env vars: `DATABASE_URL, NEXTAUTH_SECRET, GEMINI_API_KEY, GITHUB_TOKEN, SMTP_*`  

### **Netlify**
- Build command: `npm run build:netlify`  
- Post-deploy:  
  ```bash
  npx prisma db push
  npx prisma generate
  ```  

---

## 📬 Contact

- 🌐 Website: [greenhacker.tech](https://greenhacker.tech)  
- 📧 Email: [harsh@greenhacker.tech](mailto:harsh@greenhacker.tech)  
- 💻 GitHub: [GreenHacker420](https://github.com/GreenHacker420)  
- 🔗 LinkedIn: [Harsh Hirawat](https://linkedin.com/in/harsh-hirawat-b657061b7)  
- 🐦 Twitter: [@greenhacker](https://twitter.com/greenhacker)  

---
