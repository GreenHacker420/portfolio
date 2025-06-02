import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured') === 'true';

    let projects = getAllProjects();

    // Filter by category if specified
    if (category && category !== 'all') {
      projects = projects.filter(project =>
        project.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by featured if specified
    if (featured) {
      projects = projects.filter(project => project.featured);
    }

    return NextResponse.json({
      projects,
      total: projects.length,
      categories: getCategories(),
    });

  } catch (error) {
    console.error('Projects API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

function getAllProjects() {
  return [
    {
      id: 1,
      title: 'AI-Powered Portfolio',
      description: 'Modern portfolio website with AI integration, 3D components, and real-time GitHub data visualization.',
      longDescription: 'A cutting-edge portfolio website built with Next.js 15, featuring AI-powered content generation, interactive 3D components using Three.js and Spline, real-time GitHub API integration, and a responsive design optimized for performance.',
      category: 'Web Development',
      technologies: ['Next.js', 'TypeScript', 'Three.js', 'Spline', 'Tailwind CSS', 'Gemini AI'],
      featured: true,
      status: 'completed',
      github_url: 'https://github.com/GreenHacker420/portfolio-nextjs',
      live_url: 'https://greenhacker420.vercel.app',
      image_url: '/images/projects/portfolio.jpg',
      screenshots: [
        '/images/projects/portfolio-1.jpg',
        '/images/projects/portfolio-2.jpg',
        '/images/projects/portfolio-3.jpg'
      ],
      created_at: '2024-01-15T00:00:00Z',
      updated_at: new Date().toISOString(),
      highlights: [
        'Real-time GitHub API integration',
        'Interactive 3D keyboard component',
        'AI-powered content generation',
        'Responsive design with dark theme',
        'Performance optimized with Next.js 15'
      ]
    },
    {
      id: 2,
      title: 'Intelligent Chat Assistant',
      description: 'Advanced AI chatbot with natural language processing and context-aware responses.',
      longDescription: 'A sophisticated chat assistant powered by Google\'s Gemini AI, featuring advanced conversation capabilities, context awareness, and integration with various APIs for enhanced functionality.',
      category: 'AI/ML',
      technologies: ['Python', 'Gemini AI', 'FastAPI', 'React', 'WebSocket', 'Docker'],
      featured: true,
      status: 'completed',
      github_url: 'https://github.com/GreenHacker420/ai-chat-assistant',
      live_url: 'https://ai-chat-demo.vercel.app',
      image_url: '/images/projects/ai-chat.jpg',
      screenshots: [
        '/images/projects/ai-chat-1.jpg',
        '/images/projects/ai-chat-2.jpg'
      ],
      created_at: '2024-02-01T00:00:00Z',
      updated_at: '2024-03-15T00:00:00Z',
      highlights: [
        'Natural language understanding',
        'Context-aware conversations',
        'Real-time messaging with WebSocket',
        'Multi-language support',
        'Customizable personality settings'
      ]
    },
    {
      id: 3,
      title: 'React 3D Component Library',
      description: 'Reusable 3D React components for modern web applications.',
      longDescription: 'A comprehensive library of 3D React components built with Three.js and React Three Fiber, providing developers with easy-to-use, performant 3D elements for web applications.',
      category: 'Open Source',
      technologies: ['React', 'Three.js', 'TypeScript', 'Storybook', 'Jest', 'Rollup'],
      featured: false,
      status: 'in-progress',
      github_url: 'https://github.com/GreenHacker420/react-3d-components',
      live_url: 'https://react-3d-components.vercel.app',
      image_url: '/images/projects/3d-components.jpg',
      screenshots: [
        '/images/projects/3d-components-1.jpg',
        '/images/projects/3d-components-2.jpg'
      ],
      created_at: '2023-11-20T00:00:00Z',
      updated_at: '2024-01-10T00:00:00Z',
      highlights: [
        'Performance optimized components',
        'TypeScript support',
        'Comprehensive documentation',
        'Interactive Storybook demos',
        'Tree-shakable exports'
      ]
    },
    {
      id: 4,
      title: 'E-Commerce Platform',
      description: 'Full-stack e-commerce solution with modern payment integration.',
      longDescription: 'A complete e-commerce platform built with modern technologies, featuring user authentication, product management, shopping cart, payment processing, and admin dashboard.',
      category: 'Web Development',
      technologies: ['Next.js', 'Node.js', 'PostgreSQL', 'Stripe', 'Redis', 'Docker'],
      featured: false,
      status: 'completed',
      github_url: 'https://github.com/GreenHacker420/ecommerce-platform',
      live_url: 'https://ecommerce-demo.vercel.app',
      image_url: '/images/projects/ecommerce.jpg',
      screenshots: [
        '/images/projects/ecommerce-1.jpg',
        '/images/projects/ecommerce-2.jpg',
        '/images/projects/ecommerce-3.jpg'
      ],
      created_at: '2023-08-15T00:00:00Z',
      updated_at: '2023-12-01T00:00:00Z',
      highlights: [
        'Secure payment processing',
        'Real-time inventory management',
        'Admin dashboard with analytics',
        'Mobile-responsive design',
        'SEO optimized product pages'
      ]
    },
    {
      id: 5,
      title: 'Data Visualization Dashboard',
      description: 'Interactive dashboard for complex data analysis and visualization.',
      longDescription: 'A powerful data visualization dashboard built with D3.js and React, providing interactive charts, real-time data updates, and customizable visualization options for business intelligence.',
      category: 'Data Science',
      technologies: ['React', 'D3.js', 'Python', 'FastAPI', 'PostgreSQL', 'Chart.js'],
      featured: false,
      status: 'completed',
      github_url: 'https://github.com/GreenHacker420/data-dashboard',
      live_url: 'https://data-viz-dashboard.vercel.app',
      image_url: '/images/projects/dashboard.jpg',
      screenshots: [
        '/images/projects/dashboard-1.jpg',
        '/images/projects/dashboard-2.jpg'
      ],
      created_at: '2023-06-01T00:00:00Z',
      updated_at: '2023-09-15T00:00:00Z',
      highlights: [
        'Interactive data visualizations',
        'Real-time data updates',
        'Customizable chart types',
        'Export functionality',
        'Responsive design'
      ]
    }
  ];
}

function getCategories() {
  const projects = getAllProjects();
  const categorySet = new Set(projects.map(project => project.category));
  const categories = Array.from(categorySet);
  return ['all', ...categories];
}

export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
