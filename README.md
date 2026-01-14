# 🚀 Next.js 3D Portfolio

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![React](https://img.shields.io/badge/React-19-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)
![Prisma](https://img.shields.io/badge/Prisma-6.0-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

A high-performance, visually stunning developer portfolio template built with **Next.js 16**, **Three.js**, and **Tailwind CSS**. Features a dynamic 3D user interface, a fully functional content management system (CMS) for easy updates, and robust backend integration with PostgreSQL and Prisma.

---

## 🌟 Key Features

### 🎨 **Frontend & UI**
- **Immersive 3D Experiences**: Integrated **Spline** and **Three.js/Fiber** for interactive 3D elements (Skills galaxy, flowing paths).
- **Modern Animations**: Powered by **Framer Motion** and **GSAP** for buttery smooth transitions, scroll animations, and text reveals.
- **Aceternity UI**: Custom, high-quality components like Bento Grids, Spotlights, and Moving Borders.
- **Responsive Design**: Mobile-first approach using **Tailwind CSS v4** styling.
- **Client/Server Optimization**: Efficient hydration strategies to mix React Server Components (RSC) with interactive client islands.
- **Dynamic Sections**:
  - **Hero**: Animated background paths and typing effects.
  - **About**: Personal bio with detailed layout.
  - **Skills**: 3D interactive skill cloud/galaxy.
  - **Projects**: Filterable gallery with rich media support.
  - **Experience/Education**: Timeline-based visualization.
  - **GitHub Stats**: Real-time analysis of your GitHub profile.
  - **Contact**: Interactive form with immediate feedback.

### ⚙️ **Backend & CMS**
- **Admin Dashboard**: Full CRUD interface to manage all portfolio content (Projects, Skills, Experience, etc.) without touching code.
- **Authentication**: Secure admin access (likely NextAuth.js).
- **Prisma ORM**: Type-safe database interactions with a **PostgreSQL** database.
- **Email Integration**: Automated contact form emails via **Nodemailer**.
- **Media Management**: Support for image uploads and media gallery handling.

---

## 🛠️ Tech Stack

### **Core**
- **[Next.js 16](https://nextjs.org/)**: React framework with App Router, Server Actions, and partial prerendering.
- **[React 19](https://react.dev/)**: The latest React features including robust hook support.
- **[Node.js](https://nodejs.org/)**: Javascript runtime environment.

### **Styling & Animation**
- **[Tailwind CSS](https://tailwindcss.com/)**: Utility-first CSS framework.
- **[Framer Motion](https://www.framer.com/motion/)**: Production-ready animation library for React.
- **[GSAP](https://greensock.com/gsap/)**: Professional-grade JavaScript animation for complex sequences.
- **[Lucide React](https://lucide.dev/)**: Beautiful, consistent icons.

### **3D & Graphics**
- **[@react-three/fiber](https://docs.pmnd.rs/react-three-fiber)**: React renderer for Three.js.
- **[@react-three/drei](https://github.com/pmndrs/drei)**: Useful helpers for R3F.
- **[@splinetool/react-spline](https://spline.design/)**: Easy integration of Spline 3D scenes.
- **[Maath](https://github.com/pmndrs/maath)**: Mathematics helpers for 3D.

### **Backend & Database**
- **[Prisma](https://www.prisma.io/)**: Next-generation Node.js and TypeScript ORM.
- **[PostgreSQL](https://www.postgresql.org/)**: Robust open-source relational database.
- **[Zod](https://zod.dev/)**: TypeScript-first schema validation.

---

## 📂 Project Structure

```bash
├── public/              # Static assets (images, fonts, icons)
├── prisma/              # Database schema and migrations
│   └── schema.prisma    # Data model definition
├── src/                 # Source code
│   ├── actions/         # Server Actions for form submissions/mutations
│   ├── app/             # Next.js App Router pages
│   │   ├── admin/       # Admin dashboard routes
│   │   ├── api/         # Backend API routes
│   │   ├── auth/        # Authentication routes
│   │   ├── layout.js    # Root layout
│   │   └── page.js      # Main Landing Page
│   ├── components/      # React components
│   │   ├── admin/       # Components specific to Admin Dashboard
│   │   ├── canvas/      # 3D/Canvas components (Three.js stuff)
│   │   ├── sections/    # Main landing page sections (Hero, About, etc.)
│   │   └── ui/          # Reusable design system components
│   ├── lib/             # Utility functions and shared helpers
│   ├── services/        # Business logic and database access layers
│   └── store/           # Global state management (Zustand)
├── .env                 # Environment variables
├── next.config.mjs      # Next.js configuration
├── tailwind.config.ts   # Tailwind configuration
└── package.json         # Dependencies and scripts
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+ recommended)
- **PostgreSQL** Database (Local or Cloud like Neon/Supabase)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add the following:
   ```env
   # Database Connection
   DATABASE_URL="postgresql://user:password@localhost:5432/portfolio?schema=public"

   # Authentication (NextAuth)
   NEXTAUTH_SECRET="your-super-secret-key-CHANGE-ME"
   NEXTAUTH_URL="http://localhost:3000"

   # Admin User Setup (Optional, for seeding)
   ADMIN_EMAIL="admin@example.com"
   ADMIN_PASSWORD="securepassword"

   # Email Service (Nodemailer - Gmail example)
   EMAIL_USER="your-email@gmail.com"
   EMAIL_PASS="your-app-specific-password"

   # GitHub (for Stats)
   GITHUB_TOKEN="your-github-personal-access-token"
   ```

4. **Initialize Database**
   Push the schema to your database and generate the Prisma Client.
   ```bash
   npx prisma generate
   npx prisma db push
   ```
   *(Optional) Seed initial data:*
   ```bash
   node prisma/seed.js
   ```

5. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🎮 Usage

### Admin Dashboard
Access the admin panel at `/admin`. Here you can:
- **Profile**: Update your bio, title, and contact info.
- **Projects**: Add new projects, set status to `Draft` or `Published`, text descriptions, and upload images.
- **Skills**: Manage your tech stack and categorize skills (e.g., "Frontend", "Backend").
- **Experience**: Add job history and education details.
- **Messages**: View and reply to messages received from the contact form.

### Customizing the Scene
- **3D Models**: Replace Spline URLs in `src/sections/SplineSkills.jsx` or similar components to use your own 3D assets.
- **Colors**: Adjust `src/app/globals.css` or Tailwind config to change the primary color scheme.

---

## 🚢 Deployment

### Vercel (Recommended)
1. Push your code to a GitHub repository.
2. Login to Vercel and Import the project.
3. Add your **Environment Variables** in the Vercel dashboard.
4. Click **Deploy**. Vercel will automatically detect Next.js and build your site.

### Netlify
1. Connect your repo to Netlify.
2. Set build command to `npm run build` (or `next build`).
3. Set publish directory to `.next`.
4. Configure environment variables in Netlify settings.

---

## 🧪 Running Tests
*(If applicable)*
```bash
npm run test
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
