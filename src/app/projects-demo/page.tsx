'use client';

import { useState } from 'react';
import ProjectGrid from '@/components/sections/projects/ProjectGrid';
import ProjectFilters from '@/components/sections/projects/ProjectFilters';

// Mock data that matches the exact Prisma Project model structure
const mockProjects = [
  {
    id: 'project-1',
    title: 'AI Portfolio Assistant',
    description: 'An intelligent chatbot that helps visitors learn about my skills and experience.',
    longDescription: 'A sophisticated AI-powered chatbot built with Next.js and Google Gemini API. Features real-time conversation, context awareness, and dynamic content generation. Integrates seamlessly with the portfolio database to provide accurate information about projects, skills, and experience.',
    category: 'web-app',
    technologies: JSON.stringify(['Next.js', 'TypeScript', 'Gemini AI', 'Prisma', 'PostgreSQL', 'Tailwind CSS']),
    status: 'published' as const,
    featured: true,
    githubUrl: 'https://github.com/example/ai-portfolio',
    liveUrl: 'https://portfolio-demo.vercel.app',
    imageUrl: '/images/placeholder-project.svg',
    gallery: JSON.stringify(['/images/placeholder-project.svg', '/images/particle.png']),
    highlights: JSON.stringify(['Real-time AI chat', 'Context-aware responses', 'Database integration']),
    challenges: JSON.stringify(['AI prompt engineering', 'Real-time performance', 'Context management']),
    learnings: JSON.stringify(['Advanced AI integration', 'Performance optimization', 'User experience design']),
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-03-01'),
    teamSize: 1,
    role: 'Full Stack Developer',
    isVisible: true,
    displayOrder: 1,
    viewCount: 150,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-03-01'),
  },
  {
    id: 'project-2',
    title: 'E-Commerce Platform',
    description: 'A modern e-commerce solution with advanced features.',
    longDescription: 'A comprehensive e-commerce platform built with React and Node.js. Features include user authentication, payment processing, inventory management, and real-time order tracking. Designed with scalability and performance in mind.',
    category: 'web-app',
    technologies: JSON.stringify(['React', 'Node.js', 'MongoDB', 'Stripe', 'Redis', 'Docker']),
    status: 'published' as const,
    featured: true,
    githubUrl: 'https://github.com/example/ecommerce',
    liveUrl: 'https://ecommerce-demo.vercel.app',
    imageUrl: '/images/placeholder-project.svg',
    gallery: JSON.stringify(['/images/placeholder-project.svg']),
    highlights: JSON.stringify(['Payment integration', 'Real-time updates', 'Scalable architecture']),
    challenges: JSON.stringify(['Payment security', 'Performance optimization', 'State management']),
    learnings: JSON.stringify(['Payment systems', 'Microservices', 'Performance tuning']),
    startDate: new Date('2023-06-01'),
    endDate: new Date('2023-12-01'),
    teamSize: 3,
    role: 'Lead Developer',
    isVisible: true,
    displayOrder: 2,
    viewCount: 89,
    createdAt: new Date('2023-06-01'),
    updatedAt: new Date('2023-12-01'),
  },
  {
    id: 'project-3',
    title: 'Mobile Task Manager',
    description: 'A cross-platform mobile app for productivity and task management.',
    longDescription: 'A feature-rich mobile application built with React Native. Includes offline support, push notifications, team collaboration features, and advanced analytics. Supports both iOS and Android platforms with native performance.',
    category: 'mobile-app',
    technologies: JSON.stringify(['React Native', 'TypeScript', 'Firebase', 'Redux', 'Expo']),
    status: 'published' as const,
    featured: false,
    githubUrl: 'https://github.com/example/task-manager',
    liveUrl: undefined,
    imageUrl: '/images/placeholder-project.svg',
    gallery: JSON.stringify(['/images/placeholder-project.svg']),
    highlights: JSON.stringify(['Offline support', 'Push notifications', 'Cross-platform']),
    challenges: JSON.stringify(['Offline sync', 'Performance optimization', 'Platform differences']),
    learnings: JSON.stringify(['Mobile development', 'Offline strategies', 'Native performance']),
    startDate: new Date('2023-03-01'),
    endDate: new Date('2023-08-01'),
    teamSize: 2,
    role: 'Mobile Developer',
    isVisible: true,
    displayOrder: 3,
    viewCount: 45,
    createdAt: new Date('2023-03-01'),
    updatedAt: new Date('2023-08-01'),
  },
  {
    id: 'project-4',
    title: 'API Gateway Service',
    description: 'A high-performance API gateway for microservices architecture.',
    longDescription: 'A robust API gateway built with Go and Redis. Handles authentication, rate limiting, load balancing, and request routing. Designed for high-throughput microservices environments with comprehensive monitoring and analytics.',
    category: 'api',
    technologies: JSON.stringify(['Go', 'Redis', 'Docker', 'Kubernetes', 'Prometheus']),
    status: 'published' as const,
    featured: false,
    githubUrl: 'https://github.com/example/api-gateway',
    liveUrl: undefined,
    imageUrl: '/images/placeholder-project.svg',
    gallery: JSON.stringify([]),
    highlights: JSON.stringify(['High performance', 'Rate limiting', 'Load balancing']),
    challenges: JSON.stringify(['Concurrency handling', 'Memory optimization', 'Monitoring setup']),
    learnings: JSON.stringify(['Go programming', 'System design', 'Performance tuning']),
    startDate: new Date('2023-09-01'),
    endDate: new Date('2024-01-01'),
    teamSize: 4,
    role: 'Backend Developer',
    isVisible: true,
    displayOrder: 4,
    viewCount: 67,
    createdAt: new Date('2023-09-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

export default function ProjectsDemo() {
  const [filter, setFilter] = useState('all');

  const categories = ['all', 'web-app', 'mobile-app', 'api'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Project Cards Demo
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Interactive project cards using the exact Prisma Project model fields. 
            Hover over cards to see the expanded 2-column layout with enhanced details.
          </p>
        </div>

        {/* Category Filters */}
        <ProjectFilters filter={filter} setFilter={setFilter} categories={categories} />

        {/* Project Grid */}
        <ProjectGrid projects={mockProjects} filter={filter} />

        {/* Info Section */}
        <div className="mt-16 text-center">
          <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4">Features Demonstrated</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div>
                <h3 className="text-lg font-semibold text-violet-300 mb-2">Default Card State</h3>
                <ul className="text-slate-300 space-y-1 text-sm">
                  <li>• Project image (imageUrl or gallery[0])</li>
                  <li>• Short description</li>
                  <li>• Technology badges (parsed from JSON)</li>
                  <li>• 3D pin hover effect</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-violet-300 mb-2">Hover/Expanded State</h3>
                <ul className="text-slate-300 space-y-1 text-sm">
                  <li>• 2-column layout (image left, details right)</li>
                  <li>• Long description (fallback to description)</li>
                  <li>• Role display (e.g., "Full Stack Developer")</li>
                  <li>• Action buttons (View Project, GitHub)</li>
                  <li>• Non-hovered cards blur/fade effect</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-4 bg-violet-500/10 rounded-lg border border-violet-500/20">
              <p className="text-violet-200 text-sm">
                <strong>Prisma Integration:</strong> All data uses exact Prisma Project model fields including 
                JSON parsing for technologies, gallery, highlights, challenges, and learnings arrays.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
