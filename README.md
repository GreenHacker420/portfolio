<div align="center">
  <img src="public/images/hero.png" alt="Hero Banner" width="100%" />

  # <img src="https://api.iconify.design/lucide/rocket.svg?color=%2310b981" width="28" height="28" align="top" /> GreenHacker Portfolio & CMS

  **A Next-Generation, Agentic Full-Stack Portfolio Platform**

  [![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react)](https://reactdev.com/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

  <p align="center">
    <a href="#key-features"><img src="https://api.iconify.design/lucide/sparkles.svg?color=%2310b981" width="16" height="16" align="top" /> Features</a> •
    <a href="#tech-stack-breakdown"><img src="https://api.iconify.design/lucide/laptop.svg?color=%2310b981" width="16" height="16" align="top" /> Tech Stack</a> •
    <a href="#getting-started"><img src="https://api.iconify.design/lucide/rocket.svg?color=%2310b981" width="16" height="16" align="top" /> Quick Start</a> •
    <a href="#architecture--data-flow"><img src="https://api.iconify.design/lucide/workflow.svg?color=%2310b981" width="16" height="16" align="top" /> Architecture</a> •
    <a href="#contributing--contact"><img src="https://api.iconify.design/lucide/handshake.svg?color=%2310b981" width="16" height="16" align="top" /> Contact</a>
  </p>
</div>

---

## <img src="https://api.iconify.design/lucide/sparkles.svg?color=%2310b981" width="24" height="24" align="top" /> Key Features

This platform is more than just a portfolio—it is a comprehensive Content Management System (CMS) designed for modern software engineers.

- **<img src="https://api.iconify.design/lucide/globe.svg?color=%2310b981" width="18" height="18" align="top" /> Immersive 3D Experiences**: Native integration of `Three.js` and `React Three Fiber`. Features stunning visual state management and interactive 3D models embedded via Spline.
- **<img src="https://api.iconify.design/lucide/bot.svg?color=%2310b981" width="18" height="18" align="top" /> Agentic AI Workflows**: Embedded AI interactions powered by `LangChain`, `LangGraph`, and `Google Gemini`. The AI is grounded via `Pinecone` (vector database) using RAG to ensure hallucination-free portfolio queries and automated resume structuring.
- **<img src="https://api.iconify.design/lucide/bar-chart.svg?color=%2310b981" width="18" height="18" align="top" /> Real-Time Analytics CMS**: Built-in administrative dashboard to manage skills, experiences, and projects. It also tracks user sessions and maps live GitHub contribution insights directly into the UI.
- **<img src="https://api.iconify.design/lucide/zap.svg?color=%2310b981" width="18" height="18" align="top" /> Blazing Fast Modern Stack**: Built on React 19 and Next.js 16 (App Router) with Tailwind CSS v4, utilizing `Framer Motion` and `GSAP` for silky smooth micro-interactions.
- **<img src="https://api.iconify.design/lucide/lock.svg?color=%2310b981" width="18" height="18" align="top" /> Enterprise-Grade Security & DB**: End-to-end type safety. Database operations run on `PostgreSQL` powered by `Neon`, strictly managed via `Prisma` ORM, with robust `NextAuth` for admin access.

---

## <img src="https://api.iconify.design/lucide/laptop.svg?color=%2310b981" width="24" height="24" align="top" /> Tech Stack Breakdown

### Frontend & UI
![Next JS](https://img.shields.io/badge/Next.js-white?style=for-the-badge&logo=next.js&logoColor=black)
![React](https://img.shields.io/badge/React-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Radix UI](https://img.shields.io/badge/Radix_UI-161618?style=for-the-badge&logo=radix-ui&logoColor=white)

### Backend & Database
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![NodeJS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)

### AI, Animation & Magic
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=google%20gemini&logoColor=white)
![Threejs](https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js&logoColor=white)
![Framer](https://img.shields.io/badge/Framer_Motion-gray?style=for-the-badge&logo=framer&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white)

---

## <img src="https://api.iconify.design/lucide/workflow.svg?color=%2310b981" width="24" height="24" align="top" /> Architecture & Data Flow

The application follows a highly normalized relational schema optimized for auditability and complex state management.

- **Public Interface**: An immersive frontend experience optimized for conversion. Exposes contact APIs, GitHub metrics mapping, and streaming endpoints for LangGraph-powered AI chats.
- **Administrative Command Center**: A secure `NextAuth` protected segment used for CMS operations. Direct connection routes perform complex DB mutations and metrics aggregation.
- **AI Orchestration**: Orchestrates LLMs via `LangChain` to streamline professional tasks, draft documents, and retrieve grounded knowledge vectors from `Pinecone`.

---

## <img src="https://api.iconify.design/lucide/rocket.svg?color=%2310b981" width="24" height="24" align="top" /> Getting Started

Ensure you have `Node.js` (v18+) and your package manager of choice installed.

### 1. Clone the repository
```bash
git clone https://github.com/GreenHacker420/portfolio.git
cd portfolio
```

### 2. Install dependencies
```bash
npm install
```

### 3. Database Setup
Push the Prisma schema to your configured Neon PostgreSQL database.
```bash
npx prisma db push
```

### 4. Start Development Server
```bash
npm run dev
```

<img src="https://api.iconify.design/lucide/check-circle.svg?color=%2310b981" width="18" height="18" align="top" /> **Locally Accessible!** Your application will now be running at `http://localhost:3000`.

---

## <img src="https://api.iconify.design/lucide/settings.svg?color=%2310b981" width="24" height="24" align="top" /> Environment Configuration

To run the application fully (including AI, database, and email workflows), set the following keys in your `.env` file:

| Variable | Description |
| :--- | :--- |
| `DATABASE_URL` | Neon PostgreSQL pooled connection string. |
| `NEXTAUTH_SECRET` | Secret hash used for session encryption. |
| `GITHUB_TOKEN` | Personal Access Token to map contribution data. |
| `GEMINI_API_KEY` | Key for Google Gemini LLM workflows. |
| `PINECONE_API_KEY` | Key for vector similarity indexing. |
| `SMTP_...` | Mail server configs (Host, Port, User, Pass). |
| `AZURE_CLIENT_ID` | Microsoft Graph API integrations. |

---

## <img src="https://api.iconify.design/lucide/folder-tree.svg?color=%2310b981" width="24" height="24" align="top" /> Detailed Project Structure

```bash
portfolio
 ┣ public/          # Static assets, hero images, and Spline 3D Models
 ┣ prisma/          # Database definitions (schema.prisma, config)
 ┣ src/             # Core application
 ┃ ┣ actions/       # Next.js Server Actions handling backend mutations
 ┃ ┣ app/           # App Router directory (Pages, Layouts, API Routes)
 ┃ ┣ components/    # Reusable modular UI components (Radix UI wrappers)
 ┃ ┣ data/          # Mock data and static fallback definitions
 ┃ ┣ emails/        # Transactional email React templates
 ┃ ┣ hooks/         # Custom React hooks (e.g., animation, state)
 ┃ ┣ lib/           # Core utilities Setup (DB Client, Pinecone, LLM instances)
 ┃ ┣ sections/      # Complex page segments (About Me, Hero, Work Experience)
 ┃ ┣ services/      # Abstractions for 3rd party APIs (GitHub, Microsoft Graph)
 ┃ ┗ store/         # Zustand global client-state management
 ┣ eslint.config.mjs# Linting definitions
 ┣ package.json     # Dependency tracking and executable scripts
 ┗ tailwind.config  # Custom Tailwind styling overrides
```

---

## <img src="https://api.iconify.design/lucide/terminal-square.svg?color=%2310b981" width="24" height="24" align="top" /> Available CLI Commands

- `npm run dev` — Boots Next.js development server.
- `npm run build` — Formats code, generates Prisma client types, and creates the optimized production build.
- `npm run start` — Hosts the generated production build locally.
- `npm run lint` — Validates code against custom ESLint rules.

---

## <img src="https://api.iconify.design/lucide/handshake.svg?color=%2310b981" width="24" height="24" align="top" /> Contributing & Contact

Found a bug or want to suggest an improvement? Feel free to open an issue or submit a Pull Request!

- **Creator / Developer:** [GreenHacker420](https://github.com/GreenHacker420)
- **License:** Licensed under the MIT License

<p align="center">
  <i>If you enjoy this visual style, consider leaving a <img src="https://api.iconify.design/lucide/star.svg?color=%2310b981" width="16" height="16" align="top" /> on the repository!</i>
</p>
