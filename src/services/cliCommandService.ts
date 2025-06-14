import { CLICommand, CLIContext, CLIResponse, CLI_CATEGORIES } from '@/types/cli';
import { getWebsiteContext, searchFAQs, getFAQsByCategory, getContextualSuggestions } from './chatbotService';

// Built-in commands registry
const commands = new Map<string, CLICommand>();
const aliases = new Map<string, string>();

// Helper function to format output
const formatOutput = (content: string | string[], type: CLIResponse['type'] = 'text'): CLIResponse => ({
  success: true,
  output: Array.isArray(content) ? content : [content],
  type,
  metadata: {
    timestamp: new Date().toISOString()
  }
});

// Helper function to format error
const formatError = (message: string): CLIResponse => ({
  success: false,
  output: [message],
  type: 'error',
  metadata: {
    timestamp: new Date().toISOString()
  }
});

// Command implementations
const helpCommand: CLICommand = {
  name: 'help',
  description: 'Display help information for commands',
  usage: 'help [command]',
  category: CLI_CATEGORIES.HELP,
  handler: (args: string[]) => {
    if (args.length === 0) {
      const categories = {
        [CLI_CATEGORIES.NAVIGATION]: [],
        [CLI_CATEGORIES.INFO]: [],
        [CLI_CATEGORIES.SYSTEM]: [],
        [CLI_CATEGORIES.AI]: [],
        [CLI_CATEGORIES.HELP]: []
      };

      // Group commands by category
      commands.forEach(cmd => {
        categories[cmd.category].push(cmd);
      });

      const output = [
        '🚀 GREENHACKER CLI - Available Commands',
        '═══════════════════════════════════════',
        '',
        '📋 NAVIGATION:',
        ...categories.navigation.map(cmd => `  ${cmd.name.padEnd(12)} - ${cmd.description}`),
        '',
        '📊 INFORMATION:',
        ...categories.info.map(cmd => `  ${cmd.name.padEnd(12)} - ${cmd.description}`),
        '',
        '🤖 AI ASSISTANT:',
        ...categories.ai.map(cmd => `  ${cmd.name.padEnd(12)} - ${cmd.description}`),
        '',
        '⚙️  SYSTEM:',
        ...categories.system.map(cmd => `  ${cmd.name.padEnd(12)} - ${cmd.description}`),
        '',
        '💡 Tips:',
        '  • Use Tab for auto-completion',
        '  • Use ↑/↓ arrows for command history',
        '  • Type "help <command>" for detailed help',
        '  • Switch to chat mode with "chat" command',
        '  • Type "?" for quick help'
      ];

      return formatOutput(output, 'info');
    } else {
      const cmdName = args[0].toLowerCase();
      const command = commands.get(cmdName) || commands.get(aliases.get(cmdName) || '');
      
      if (!command) {
        return formatError(`Command "${cmdName}" not found. Type "help" for available commands.`);
      }

      const output = [
        `📖 Help: ${command.name}`,
        '═══════════════════',
        '',
        `Description: ${command.description}`,
        `Usage: ${command.usage}`,
        `Category: ${command.category}`,
        ...(command.aliases ? [`Aliases: ${command.aliases.join(', ')}`] : []),
        ...(command.requiresArgs ? ['⚠️  This command requires arguments'] : [])
      ];

      return formatOutput(output, 'info');
    }
  }
};

const aboutCommand: CLICommand = {
  name: 'about',
  description: 'Learn about Harsh Hirawat (GreenHacker)',
  usage: 'about',
  aliases: ['whoami', 'info'],
  category: CLI_CATEGORIES.INFO,
  handler: async () => {
    const output = [
      '👨‍💻 About Harsh Hirawat (GreenHacker)',
      '═══════════════════════════════════════',
      '',
      '🚀 Full-Stack Developer & AI Enthusiast',
      '📍 Passionate about creating innovative web experiences',
      '🎯 Specializing in modern web technologies and AI integration',
      '',
      '🔧 Core Expertise:',
      '  • Frontend: React, TypeScript, Next.js, Tailwind CSS',
      '  • Backend: Node.js, Python, FastAPI, GraphQL',
      '  • AI/ML: PyTorch, TensorFlow, Computer Vision',
      '  • DevOps: Docker, AWS, CI/CD, Kubernetes',
      '  • 3D: Three.js, React Three Fiber, WebGL',
      '',
      '🌟 Always learning, always building, always innovating!',
      '',
      '💡 Type "skills" for detailed technical skills',
      '💡 Type "projects" to see recent work',
      '💡 Type "contact" to get in touch'
    ];

    return formatOutput(output, 'success');
  }
};

const skillsCommand: CLICommand = {
  name: 'skills',
  description: 'Display technical skills and expertise',
  usage: 'skills [category]',
  category: CLI_CATEGORIES.INFO,
  handler: async (args: string[]) => {
    try {
      // Get real skills data from database
      const context = await getWebsiteContext();
      
      if (args.length === 0) {
        const output = [
          '🛠️  Technical Skills & Expertise',
          '═══════════════════════════════════',
          '',
          '🎨 FRONTEND DEVELOPMENT:',
          '  • React.js & Next.js (Expert)',
          '  • TypeScript & JavaScript (Expert)', 
          '  • Tailwind CSS & Styled Components (Advanced)',
          '  • Framer Motion & GSAP (Advanced)',
          '  • Three.js & React Three Fiber (Intermediate)',
          '',
          '⚙️  BACKEND DEVELOPMENT:',
          '  • Node.js & Express (Expert)',
          '  • Python & FastAPI (Advanced)',
          '  • GraphQL & REST APIs (Advanced)',
          '  • PostgreSQL & Prisma (Advanced)',
          '  • Redis & Caching (Intermediate)',
          '',
          '🤖 AI & MACHINE LEARNING:',
          '  • PyTorch & TensorFlow (Advanced)',
          '  • Computer Vision (Intermediate)',
          '  • Natural Language Processing (Intermediate)',
          '  • Google Gemini API Integration (Advanced)',
          '',
          '☁️  DEVOPS & TOOLS:',
          '  • Docker & Kubernetes (Intermediate)',
          '  • AWS & Cloud Services (Intermediate)',
          '  • Git & GitHub Actions (Expert)',
          '  • CI/CD Pipelines (Advanced)',
          '',
          '💡 Type "skills frontend", "skills backend", "skills ai", or "skills devops" for details'
        ];

        return formatOutput(output, 'info');
      } else {
        const category = args[0].toLowerCase();
        // Handle specific skill categories
        switch (category) {
          case 'frontend':
          case 'front':
            return formatOutput([
              '🎨 Frontend Development Skills',
              '═══════════════════════════════',
              '',
              '⭐ EXPERT LEVEL:',
              '  • React.js - Component architecture, hooks, context',
              '  • Next.js - SSR, SSG, API routes, app router',
              '  • TypeScript - Advanced types, generics, utility types',
              '  • JavaScript - ES6+, async/await, modules',
              '',
              '🔥 ADVANCED LEVEL:',
              '  • Tailwind CSS - Custom components, responsive design',
              '  • Framer Motion - Complex animations, gestures',
              '  • GSAP - Timeline animations, scroll triggers',
              '  • State Management - Zustand, React Query',
              '',
              '📈 INTERMEDIATE LEVEL:',
              '  • Three.js - 3D graphics, WebGL',
              '  • React Three Fiber - 3D React components',
              '  • PWA Development - Service workers, offline support'
            ], 'info');
          
          case 'backend':
          case 'back':
            return formatOutput([
              '⚙️  Backend Development Skills',
              '═══════════════════════════════',
              '',
              '⭐ EXPERT LEVEL:',
              '  • Node.js - Server-side JavaScript, event loop',
              '  • Express.js - RESTful APIs, middleware, routing',
              '',
              '🔥 ADVANCED LEVEL:',
              '  • Python - FastAPI, async programming',
              '  • GraphQL - Schema design, resolvers, subscriptions',
              '  • PostgreSQL - Complex queries, optimization',
              '  • Prisma - ORM, migrations, type safety',
              '  • Authentication - JWT, OAuth, session management',
              '',
              '📈 INTERMEDIATE LEVEL:',
              '  • Redis - Caching, session storage',
              '  • WebSockets - Real-time communication',
              '  • Microservices - Service architecture'
            ], 'info');
          
          default:
            return formatError(`Unknown skill category "${category}". Available: frontend, backend, ai, devops`);
        }
      }
    } catch (error) {
      return formatError('Failed to fetch skills data. Please try again.');
    }
  },
  autoComplete: (partial: string) => {
    const categories = ['frontend', 'backend', 'ai', 'devops'];
    return categories.filter(cat => cat.startsWith(partial.toLowerCase()));
  }
};

const projectsCommand: CLICommand = {
  name: 'projects',
  description: 'Show recent projects and portfolio work',
  usage: 'projects [filter]',
  category: CLI_CATEGORIES.INFO,
  handler: async (args: string[]) => {
    const output = [
      '🚀 Recent Projects & Portfolio',
      '═══════════════════════════════',
      '',
      '1. 📸 AI Photo Platform',
      '   • Face recognition for intelligent photo organization',
      '   • Tech: Python, TensorFlow, React, PostgreSQL',
      '   • Status: Production',
      '',
      '2. 🌐 Portfolio Website (This Site!)',
      '   • Interactive 3D portfolio with AI chatbot',
      '   • Tech: Next.js, TypeScript, Three.js, Gemini AI',
      '   • Status: Live at greenhacker.tech',
      '',
      '3. 🔬 ML Research Tool',
      '   • Natural language processing for scientific papers',
      '   • Tech: Python, PyTorch, FastAPI, React',
      '   • Status: Research phase',
      '',
      '4. 🤝 Real-time Collaboration App',
      '   • WebRTC and WebSockets for seamless teamwork',
      '   • Tech: Node.js, Socket.io, React, Redis',
      '   • Status: Beta testing',
      '',
      '💡 Type "project <number>" for detailed information',
      '💡 Visit /projects section for live demos and code'
    ];

    return formatOutput(output, 'success');
  }
};

const contactCommand: CLICommand = {
  name: 'contact',
  description: 'Get contact information and ways to reach out',
  usage: 'contact',
  aliases: ['reach', 'email'],
  category: CLI_CATEGORIES.INFO,
  handler: async () => {
    const output = [
      '📧 Contact Information',
      '═══════════════════════',
      '',
      '✉️  Email: harsh@greenhacker.tech',
      '🔗 LinkedIn: linkedin.com/in/harsh-hirawat-b657061b7',
      '🐙 GitHub: github.com/GreenHacker420',
      '🌐 Website: greenhacker.tech',
      '',
      '💼 Available for:',
      '  • Full-stack development projects',
      '  • AI/ML consulting and implementation',
      '  • Technical mentoring and code reviews',
      '  • Open source collaborations',
      '',
      '⚡ Response time: Usually within 24 hours',
      '🎯 Best for: Project inquiries and technical discussions',
      '',
      '💡 Type "chat" to switch to AI assistant mode for questions'
    ];

    return formatOutput(output, 'success');
  }
};

const faqCommand: CLICommand = {
  name: 'faq',
  description: 'Browse frequently asked questions',
  usage: 'faq [category|search]',
  category: CLI_CATEGORIES.INFO,
  handler: async (args: string[]) => {
    if (args.length === 0) {
      const output = [
        '❓ Frequently Asked Questions',
        '═══════════════════════════════',
        '',
        '📋 Available Categories:',
        '  • general - General questions about me',
        '  • technical - Technical skills and experience',
        '  • projects - Questions about my projects',
        '  • hiring - Employment and freelance inquiries',
        '',
        '🔍 Usage Examples:',
        '  faq general     - Show general FAQs',
        '  faq technical   - Show technical FAQs',
        '  faq "react"     - Search for React-related FAQs',
        '',
        '💡 You can also ask the AI assistant directly with "chat"'
      ];

      return formatOutput(output, 'info');
    } else {
      const query = args.join(' ');
      try {
        const faqs = await searchFAQs(query);

        if (faqs.length === 0) {
          return formatOutput([
            `No FAQs found for "${query}"`,
            '',
            'Try these categories: general, technical, projects, hiring',
            'Or switch to chat mode for AI assistance: "chat"'
          ], 'warning');
        }

        const output = [
          `❓ FAQs for "${query}"`,
          '═'.repeat(20 + query.length),
          ''
        ];

        faqs.forEach((faq, index) => {
          output.push(`${index + 1}. ${faq.question}`);
          output.push(`   ${faq.answer}`);
          output.push('');
        });

        return formatOutput(output, 'info');
      } catch (error) {
        return formatError('Failed to search FAQs. Please try again.');
      }
    }
  },
  autoComplete: (partial: string) => {
    const categories = ['general', 'technical', 'projects', 'hiring'];
    return categories.filter(cat => cat.startsWith(partial.toLowerCase()));
  }
};

const clearCommand: CLICommand = {
  name: 'clear',
  description: 'Clear the terminal screen',
  usage: 'clear',
  aliases: ['cls'],
  category: CLI_CATEGORIES.SYSTEM,
  handler: () => {
    return {
      success: true,
      output: [],
      type: 'success',
      metadata: {
        timestamp: new Date().toISOString(),
        special: 'clear'
      }
    };
  }
};

const chatCommand: CLICommand = {
  name: 'chat',
  description: 'Switch to AI chat mode for natural language conversation',
  usage: 'chat [message]',
  category: CLI_CATEGORIES.AI,
  handler: (args: string[]) => {
    const message = args.join(' ');

    return {
      success: true,
      output: message ? [
        '🤖 Switching to AI chat mode...',
        `Processing: "${message}"`
      ] : [
        '🤖 Switched to AI chat mode',
        'You can now have natural conversations!',
        'Type "cmd" to return to command mode'
      ],
      type: 'ai',
      metadata: {
        timestamp: new Date().toISOString(),
        special: 'mode_switch',
        mode: 'chat',
        initialMessage: message
      }
    };
  }
};

const exitCommand: CLICommand = {
  name: 'exit',
  description: 'Close the CLI interface',
  usage: 'exit',
  aliases: ['quit', 'q'],
  category: CLI_CATEGORIES.SYSTEM,
  handler: () => {
    return {
      success: true,
      output: ['👋 Thanks for using GREENHACKER CLI!', 'Closing interface...'],
      type: 'success',
      metadata: {
        timestamp: new Date().toISOString(),
        special: 'exit'
      }
    };
  }
};

const experienceCommand: CLICommand = {
  name: 'experience',
  description: 'Show professional experience and work history',
  usage: 'experience [years|companies|recent]',
  aliases: ['exp', 'work'],
  category: CLI_CATEGORIES.INFO,
  handler: async (args: string[]) => {
    if (args.length === 0) {
      const output = [
        '💼 Professional Experience',
        '═══════════════════════════',
        '',
        '🎯 CURRENT FOCUS:',
        '  • Full-Stack Development (3+ years)',
        '  • AI/ML Integration (2+ years)',
        '  • Open Source Contributions (Ongoing)',
        '',
        '🏢 EXPERIENCE HIGHLIGHTS:',
        '  • Led development of AI-powered photo platform',
        '  • Built scalable web applications with 10k+ users',
        '  • Implemented CI/CD pipelines reducing deployment time by 60%',
        '  • Mentored junior developers in modern web technologies',
        '',
        '🛠️  TECHNICAL LEADERSHIP:',
        '  • Architecture design for microservices',
        '  • Code review and quality assurance',
        '  • Performance optimization and monitoring',
        '  • Team collaboration and agile methodologies',
        '',
        '📈 ACHIEVEMENTS:',
        '  • 95% client satisfaction rate',
        '  • 40+ successful project deliveries',
        '  • 500+ GitHub contributions this year',
        '',
        '💡 Type "experience recent" for latest projects',
        '💡 Type "contact" to discuss opportunities'
      ];

      return formatOutput(output, 'success');
    } else {
      const filter = args[0].toLowerCase();
      switch (filter) {
        case 'recent':
          return formatOutput([
            '🚀 Recent Experience (2024)',
            '═══════════════════════════',
            '',
            '📸 AI Photo Platform Lead Developer',
            '  • Built intelligent photo organization system',
            '  • Implemented face recognition with 98% accuracy',
            '  • Tech: Python, TensorFlow, React, PostgreSQL',
            '  • Impact: 5k+ photos organized, 200+ active users',
            '',
            '🌐 Portfolio Website (This Site!)',
            '  • Designed and developed interactive 3D portfolio',
            '  • Integrated AI chatbot with Gemini 2.0-flash',
            '  • Tech: Next.js, TypeScript, Three.js, Tailwind',
            '  • Features: CLI interface, real-time analytics',
            '',
            '🔬 ML Research Tool',
            '  • Developed NLP tool for scientific paper analysis',
            '  • Processed 1000+ research papers',
            '  • Tech: Python, PyTorch, FastAPI, React',
            '  • Status: Research collaboration ongoing'
          ], 'info');

        case 'years':
          return formatOutput([
            '📅 Experience Timeline',
            '═══════════════════════',
            '',
            '2024 - Present: Senior Full-Stack Developer',
            '  • AI/ML integration specialist',
            '  • Leading complex web application projects',
            '',
            '2023 - 2024: Full-Stack Developer',
            '  • React/Next.js application development',
            '  • Backend API design and implementation',
            '',
            '2022 - 2023: Frontend Developer',
            '  • Modern web application development',
            '  • UI/UX implementation and optimization',
            '',
            '2021 - 2022: Learning & Building',
            '  • Self-taught programming and development',
            '  • Open source contributions and personal projects'
          ], 'info');

        default:
          return formatError(`Unknown experience filter "${filter}". Available: recent, years, companies`);
      }
    }
  },
  autoComplete: (partial: string) => {
    const filters = ['recent', 'years', 'companies'];
    return filters.filter(filter => filter.startsWith(partial.toLowerCase()));
  }
};

const githubCommand: CLICommand = {
  name: 'github',
  description: 'Show GitHub profile and repository information',
  usage: 'github [repos|stats|profile]',
  aliases: ['git', 'gh'],
  category: CLI_CATEGORIES.INFO,
  handler: async (args: string[]) => {
    if (args.length === 0) {
      const output = [
        '🐙 GitHub Profile',
        '═══════════════════',
        '',
        '👤 Profile: github.com/GreenHacker420',
        '📊 Public Repositories: 25+',
        '⭐ Total Stars: 150+',
        '🍴 Forks: 50+',
        '👥 Followers: 100+',
        '',
        '🔥 RECENT ACTIVITY:',
        '  • Portfolio website with CLI interface',
        '  • AI-powered photo organization platform',
        '  • Machine learning research tools',
        '  • Open source contributions to React ecosystem',
        '',
        '🏆 ACHIEVEMENTS:',
        '  • 500+ contributions this year',
        '  • Multiple featured repositories',
        '  • Active in open source community',
        '',
        '💡 Type "github repos" for repository list',
        '💡 Type "github stats" for detailed statistics'
      ];

      return formatOutput(output, 'success');
    } else {
      const section = args[0].toLowerCase();
      switch (section) {
        case 'repos':
        case 'repositories':
          return formatOutput([
            '📁 Featured Repositories',
            '═══════════════════════════',
            '',
            '1. 🌐 portfolio-website',
            '   • Interactive 3D portfolio with AI chatbot',
            '   • Next.js, TypeScript, Three.js, Gemini AI',
            '   • ⭐ 25 stars | 🍴 8 forks',
            '',
            '2. 📸 ai-photo-platform',
            '   • Intelligent photo organization with face recognition',
            '   • Python, TensorFlow, React, PostgreSQL',
            '   • ⭐ 42 stars | 🍴 12 forks',
            '',
            '3. 🔬 ml-research-tools',
            '   • NLP tools for scientific paper analysis',
            '   • Python, PyTorch, FastAPI, Jupyter',
            '   • ⭐ 18 stars | 🍴 5 forks',
            '',
            '4. 🤝 collaboration-app',
            '   • Real-time collaboration with WebRTC',
            '   • Node.js, Socket.io, React, Redis',
            '   • ⭐ 31 stars | 🍴 9 forks',
            '',
            '🔗 Visit github.com/GreenHacker420 for complete list'
          ], 'info');

        case 'stats':
        case 'statistics':
          return formatOutput([
            '📊 GitHub Statistics',
            '═══════════════════════',
            '',
            '📈 CONTRIBUTION STATS:',
            '  • Total Commits: 2,500+',
            '  • This Year: 500+ contributions',
            '  • Longest Streak: 45 days',
            '  • Current Streak: 12 days',
            '',
            '🗂️  REPOSITORY STATS:',
            '  • Public Repos: 25',
            '  • Private Repos: 15',
            '  • Forks: 50+',
            '  • Stars Received: 150+',
            '',
            '💻 LANGUAGE BREAKDOWN:',
            '  • TypeScript: 35%',
            '  • JavaScript: 25%',
            '  • Python: 20%',
            '  • CSS/SCSS: 10%',
            '  • Other: 10%',
            '',
            '🏆 ACHIEVEMENTS:',
            '  • Arctic Code Vault Contributor',
            '  • Pull Shark (Multiple merged PRs)',
            '  • Quickdraw (Fast PR responses)'
          ], 'info');

        default:
          return formatError(`Unknown GitHub section "${section}". Available: repos, stats, profile`);
      }
    }
  },
  autoComplete: (partial: string) => {
    const sections = ['repos', 'repositories', 'stats', 'statistics', 'profile'];
    return sections.filter(section => section.startsWith(partial.toLowerCase()));
  }
};

const statusCommand: CLICommand = {
  name: 'status',
  description: 'Show current availability and project status',
  usage: 'status [availability|projects|health]',
  category: CLI_CATEGORIES.INFO,
  handler: async (args: string[]) => {
    if (args.length === 0) {
      const output = [
        '📊 Current Status',
        '═══════════════════',
        '',
        '🟢 AVAILABILITY: Open for opportunities',
        '⚡ RESPONSE TIME: Usually within 24 hours',
        '🎯 FOCUS: Full-stack development & AI integration',
        '',
        '🚀 ACTIVE PROJECTS:',
        '  • Portfolio website (Maintenance)',
        '  • AI photo platform (Production)',
        '  • ML research tool (Development)',
        '',
        '💼 SEEKING:',
        '  • Full-stack development roles',
        '  • AI/ML integration projects',
        '  • Technical consulting opportunities',
        '  • Open source collaborations',
        '',
        '📍 LOCATION: Remote-friendly',
        '🌍 TIMEZONE: Flexible (UTC+5:30 primary)',
        '',
        '💡 Type "contact" to get in touch',
        '💡 Type "status projects" for detailed project status'
      ];

      return formatOutput(output, 'success');
    } else {
      const section = args[0].toLowerCase();
      switch (section) {
        case 'availability':
          return formatOutput([
            '🟢 Availability Status',
            '═══════════════════════',
            '',
            '📅 CURRENT STATUS: Available',
            '⏰ PREFERRED HOURS: 9 AM - 6 PM UTC+5:30',
            '🌍 WORK STYLE: Remote-first, flexible',
            '',
            '💼 OPEN TO:',
            '  • Full-time positions',
            '  • Contract/Freelance work',
            '  • Part-time consulting',
            '  • Open source collaborations',
            '',
            '⚡ RESPONSE TIMES:',
            '  • Email: Within 24 hours',
            '  • LinkedIn: Within 12 hours',
            '  • GitHub: Within 48 hours',
            '',
            '🎯 IDEAL PROJECTS:',
            '  • Modern web applications',
            '  • AI/ML integration',
            '  • Performance optimization',
            '  • Technical architecture'
          ], 'success');

        case 'projects':
          return formatOutput([
            '🚀 Project Status Dashboard',
            '═══════════════════════════',
            '',
            '🟢 PRODUCTION:',
            '  • Portfolio Website (greenhacker.tech)',
            '    Status: Live, ongoing maintenance',
            '    Traffic: 1k+ monthly visitors',
            '',
            '  • AI Photo Platform',
            '    Status: Production, active users',
            '    Performance: 98% uptime',
            '',
            '🟡 DEVELOPMENT:',
            '  • ML Research Tool',
            '    Status: Beta testing phase',
            '    Progress: 80% complete',
            '',
            '  • Collaboration App',
            '    Status: Feature development',
            '    Progress: 60% complete',
            '',
            '🔵 PLANNING:',
            '  • E-commerce Platform',
            '  • Mobile App Development',
            '  • DevOps Automation Tools'
          ], 'info');

        default:
          return formatError(`Unknown status section "${section}". Available: availability, projects, health`);
      }
    }
  },
  autoComplete: (partial: string) => {
    const sections = ['availability', 'projects', 'health'];
    return sections.filter(section => section.startsWith(partial.toLowerCase()));
  }
};

const whoamiCommand: CLICommand = {
  name: 'whoami',
  description: 'Display current user information',
  usage: 'whoami',
  category: CLI_CATEGORIES.SYSTEM,
  handler: () => {
    const output = [
      '👤 Current User: Guest',
      '🌐 Location: GREENHACKER Portfolio',
      '💻 Interface: CLI Terminal v1.0',
      '🎯 Access Level: Public',
      '',
      '💡 You are browsing Harsh Hirawat\'s portfolio',
      '💡 Type "about" to learn more about the developer'
    ];

    return formatOutput(output, 'info');
  }
};

const dateCommand: CLICommand = {
  name: 'date',
  description: 'Display current date and time',
  usage: 'date [format]',
  category: CLI_CATEGORIES.SYSTEM,
  handler: (args: string[]) => {
    const now = new Date();
    const format = args[0]?.toLowerCase();

    let output: string[];

    switch (format) {
      case 'iso':
        output = [now.toISOString()];
        break;
      case 'utc':
        output = [now.toUTCString()];
        break;
      case 'local':
        output = [now.toLocaleString()];
        break;
      default:
        output = [
          `📅 ${now.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}`,
          `🕐 ${now.toLocaleTimeString('en-US', {
            hour12: true,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })}`,
          `🌍 Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`,
          '',
          '💡 Use "date iso", "date utc", or "date local" for different formats'
        ];
    }

    return formatOutput(output, 'info');
  },
  autoComplete: (partial: string) => {
    const formats = ['iso', 'utc', 'local'];
    return formats.filter(format => format.startsWith(partial.toLowerCase()));
  }
};

const echoCommand: CLICommand = {
  name: 'echo',
  description: 'Display a line of text',
  usage: 'echo <text>',
  category: CLI_CATEGORIES.SYSTEM,
  requiresArgs: true,
  minArgs: 1,
  handler: (args: string[]) => {
    const text = args.join(' ');
    return formatOutput([text], 'text');
  }
};

const historyCommand: CLICommand = {
  name: 'history',
  description: 'Show command history',
  usage: 'history [clear|search <term>]',
  category: CLI_CATEGORIES.SYSTEM,
  handler: (args: string[], context: CLIContext) => {
    if (args.length === 0) {
      const history = context.history.slice(-10); // Show last 10 commands

      if (history.length === 0) {
        return formatOutput(['No command history available'], 'info');
      }

      const output = [
        '📜 Command History (Last 10)',
        '═══════════════════════════',
        ''
      ];

      history.forEach((entry, index) => {
        const timestamp = new Date(entry.timestamp).toLocaleTimeString();
        const command = entry.args.length > 0
          ? `${entry.command} ${entry.args.join(' ')}`
          : entry.command;
        output.push(`${(index + 1).toString().padStart(2)}: [${timestamp}] ${command}`);
      });

      output.push('');
      output.push('💡 Use "history clear" to clear history');
      output.push('💡 Use "history search <term>" to search history');

      return formatOutput(output, 'info');
    } else {
      const action = args[0].toLowerCase();

      if (action === 'clear') {
        return {
          success: true,
          output: ['✅ Command history cleared'],
          type: 'success',
          metadata: {
            timestamp: new Date().toISOString(),
            special: 'clear_history'
          }
        };
      } else if (action === 'search' && args.length > 1) {
        const searchTerm = args.slice(1).join(' ').toLowerCase();
        const matches = context.history.filter(entry =>
          entry.command.toLowerCase().includes(searchTerm) ||
          entry.args.some(arg => arg.toLowerCase().includes(searchTerm))
        );

        if (matches.length === 0) {
          return formatOutput([`No commands found matching "${searchTerm}"`], 'warning');
        }

        const output = [
          `🔍 Search Results for "${searchTerm}"`,
          '═'.repeat(25 + searchTerm.length),
          ''
        ];

        matches.slice(-5).forEach((entry, index) => {
          const timestamp = new Date(entry.timestamp).toLocaleTimeString();
          const command = entry.args.length > 0
            ? `${entry.command} ${entry.args.join(' ')}`
            : entry.command;
          output.push(`${index + 1}: [${timestamp}] ${command}`);
        });

        return formatOutput(output, 'info');
      } else {
        return formatError('Invalid history command. Use "history", "history clear", or "history search <term>"');
      }
    }
  },
  autoComplete: (partial: string) => {
    const actions = ['clear', 'search'];
    return actions.filter(action => action.startsWith(partial.toLowerCase()));
  }
};

const versionCommand: CLICommand = {
  name: 'version',
  description: 'Show CLI version and system information',
  usage: 'version',
  aliases: ['ver', '--version'],
  category: CLI_CATEGORIES.SYSTEM,
  handler: () => {
    const output = [
      '🚀 GREENHACKER CLI v1.0.0',
      '═══════════════════════════',
      '',
      '📦 System Information:',
      `  • Platform: ${typeof window !== 'undefined' ? navigator.platform : 'Server'}`,
      `  • User Agent: ${typeof window !== 'undefined' ? navigator.userAgent.split(' ')[0] : 'Node.js'}`,
      `  • Language: ${typeof window !== 'undefined' ? navigator.language : 'en-US'}`,
      '',
      '🛠️  Built with:',
      '  • Next.js 15.3.3',
      '  • TypeScript 5.5.3',
      '  • React 18.3.1',
      '  • Tailwind CSS 3.4.17',
      '  • Framer Motion 12.12.1',
      '',
      '🎯 Features:',
      '  • Command auto-completion',
      '  • Command history',
      '  • AI integration',
      '  • Real-time responses',
      '  • Mobile responsive',
      '',
      '👨‍💻 Developer: Harsh Hirawat (GreenHacker)',
      '🌐 Website: greenhacker.tech',
      '📧 Contact: harsh@greenhacker.tech'
    ];

    return formatOutput(output, 'info');
  }
};

const askCommand: CLICommand = {
  name: 'ask',
  description: 'Ask the AI assistant a question',
  usage: 'ask <question>',
  aliases: ['ai', 'query'],
  category: CLI_CATEGORIES.AI,
  requiresArgs: true,
  minArgs: 1,
  handler: async (args: string[], context: CLIContext) => {
    const question = args.join(' ');

    try {
      // Call the AI API
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: question,
          context: context.currentPage,
          sessionId: context.sessionId
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        const output = [
          '🤖 AI Assistant Response:',
          '═══════════════════════════',
          '',
          ...data.response.split('\n'),
          ''
        ];

        // Add suggestions if available
        if (data.suggestions && data.suggestions.length > 0) {
          output.push('💡 Suggested follow-up questions:');
          data.suggestions.forEach((suggestion: string, index: number) => {
            output.push(`  ${index + 1}. ${suggestion}`);
          });
          output.push('');
        }

        // Add related FAQs if available
        if (data.relatedFAQs && data.relatedFAQs.length > 0) {
          output.push('❓ Related FAQs:');
          data.relatedFAQs.forEach((faq: any, index: number) => {
            output.push(`  ${index + 1}. ${faq.question}`);
          });
          output.push('');
        }

        output.push('💡 Type "chat" to switch to interactive chat mode');

        return formatOutput(output, 'ai');
      } else {
        throw new Error(data.error || 'Failed to get AI response');
      }
    } catch (error) {
      console.error('AI command error:', error);

      // Fallback response
      const fallbackOutput = [
        '❌ AI service temporarily unavailable',
        '',
        'Here are some alternatives:',
        '• Type "help" for available commands',
        '• Type "faq" to browse frequently asked questions',
        '• Type "about" to learn about the developer',
        '• Type "contact" to get in touch directly',
        '',
        'Please try again later or use the contact form for urgent inquiries.'
      ];

      return formatOutput(fallbackOutput, 'error');
    }
  }
};

const cmdCommand: CLICommand = {
  name: 'cmd',
  description: 'Switch back to command mode from chat mode',
  usage: 'cmd',
  aliases: ['command'],
  category: CLI_CATEGORIES.SYSTEM,
  handler: () => {
    return {
      success: true,
      output: [
        '💻 Switched to command mode',
        'You can now use structured commands.',
        'Type "help" to see available commands.'
      ],
      type: 'success',
      metadata: {
        timestamp: new Date().toISOString(),
        special: 'mode_switch',
        mode: 'command'
      }
    };
  }
};

const lsCommand: CLICommand = {
  name: 'ls',
  description: 'List available sections and pages',
  usage: 'ls [section]',
  aliases: ['list', 'dir'],
  category: CLI_CATEGORIES.NAVIGATION,
  handler: (args: string[]) => {
    if (args.length === 0) {
      const output = [
        '📁 Available Sections',
        '═══════════════════════',
        '',
        '🏠 home        - Main landing page',
        '👤 about       - About the developer',
        '🛠️  skills      - Technical skills and expertise',
        '🚀 projects    - Portfolio projects and work',
        '💼 experience  - Professional experience',
        '📄 resume      - Resume and CV information',
        '📊 stats       - GitHub and development statistics',
        '📧 contact     - Contact information and form',
        '',
        '💡 Type "ls <section>" for section details',
        '💡 Type "cd <section>" to navigate (coming soon)'
      ];

      return formatOutput(output, 'info');
    } else {
      const section = args[0].toLowerCase();

      const sectionDetails: Record<string, string[]> = {
        home: [
          '🏠 Home Section',
          '═══════════════',
          '',
          '• Hero introduction with 3D background',
          '• Interactive typewriter effect',
          '• Call-to-action buttons',
          '• Scroll prompts and navigation'
        ],
        about: [
          '👤 About Section',
          '═══════════════',
          '',
          '• Personal introduction and background',
          '• Professional journey and story',
          '• Interests and hobbies',
          '• Values and work philosophy'
        ],
        skills: [
          '🛠️  Skills Section',
          '═══════════════',
          '',
          '• Interactive keyboard skills display',
          '• Technical skill categories',
          '• Proficiency levels and experience',
          '• Technology stack overview'
        ],
        projects: [
          '🚀 Projects Section',
          '═══════════════════',
          '',
          '• Featured portfolio projects',
          '• Live demos and GitHub links',
          '• Technology stack for each project',
          '• Project filtering and search'
        ],
        experience: [
          '💼 Experience Section',
          '═══════════════════',
          '',
          '• Professional work history',
          '• Key achievements and responsibilities',
          '• Timeline of career progression',
          '• Skills developed over time'
        ],
        contact: [
          '📧 Contact Section',
          '═══════════════════',
          '',
          '• Contact form for inquiries',
          '• Social media links',
          '• Professional email address',
          '• Response time expectations'
        ]
      };

      if (sectionDetails[section]) {
        return formatOutput(sectionDetails[section], 'info');
      } else {
        return formatError(`Section "${section}" not found. Type "ls" to see available sections.`);
      }
    }
  },
  autoComplete: (partial: string) => {
    const sections = ['home', 'about', 'skills', 'projects', 'experience', 'resume', 'stats', 'contact'];
    return sections.filter(section => section.startsWith(partial.toLowerCase()));
  }
};

// Register all commands
const registerCommands = () => {
  const commandList = [
    helpCommand,
    aboutCommand,
    skillsCommand,
    projectsCommand,
    contactCommand,
    faqCommand,
    clearCommand,
    chatCommand,
    exitCommand,
    experienceCommand,
    githubCommand,
    statusCommand,
    whoamiCommand,
    dateCommand,
    echoCommand,
    historyCommand,
    versionCommand,
    askCommand,
    cmdCommand,
    lsCommand
  ];

  commandList.forEach(cmd => {
    commands.set(cmd.name, cmd);
    if (cmd.aliases) {
      cmd.aliases.forEach(alias => aliases.set(alias, cmd.name));
    }
  });
};

// Initialize commands
registerCommands();

// Export functions
export const getCommand = (name: string): CLICommand | undefined => {
  return commands.get(name.toLowerCase()) || commands.get(aliases.get(name.toLowerCase()) || '');
};

export const getAllCommands = (): CLICommand[] => {
  return Array.from(commands.values());
};

export const getCommandCompletions = (partial: string): string[] => {
  const commandNames = Array.from(commands.keys());
  const aliasNames = Array.from(aliases.keys());
  const allNames = [...commandNames, ...aliasNames];
  
  return allNames.filter(name => name.startsWith(partial.toLowerCase()));
};

export const executeCommand = async (
  commandLine: string, 
  context: CLIContext
): Promise<CLIResponse> => {
  const parts = commandLine.trim().split(/\s+/);
  const commandName = parts[0].toLowerCase();
  const args = parts.slice(1);

  const command = getCommand(commandName);
  
  if (!command) {
    return formatError(`Command "${commandName}" not found. Type "help" for available commands.`);
  }

  try {
    const startTime = Date.now();
    const result = await command.handler(args, context);
    const executionTime = Date.now() - startTime;

    return {
      ...result,
      metadata: {
        ...result.metadata,
        executionTime,
        command: commandName,
        args
      }
    };
  } catch (error) {
    console.error('Command execution error:', error);
    return formatError(`Error executing command "${commandName}": ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
