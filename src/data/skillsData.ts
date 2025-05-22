// Skills data for the keyboard component
export interface Skill {
  id: string;
  name: string;
  description: string;
  logo: string;
  color: string;
  experience: number;
  proficiency: number;
  projects: string[];
  strengths: string[];
  category: SkillCategory;
}

export type SkillCategory = 
  | 'frontend' 
  | 'backend' 
  | 'language' 
  | 'database' 
  | 'devops' 
  | 'mobile' 
  | 'design' 
  | 'other';

// Skill data with detailed information
export const skills: Skill[] = [
  {
    id: 'js',
    name: 'JavaScript',
    description: 'A versatile scripting language that conforms to the ECMAScript specification.',
    logo: 'javascript',
    color: '#F7DF1E',
    experience: 5,
    proficiency: 95,
    projects: ['Portfolio Website', 'E-commerce Platform', 'Social Media Dashboard'],
    strengths: ['ES6+', 'Async/Await', 'DOM Manipulation', 'Functional Programming'],
    category: 'language'
  },
  {
    id: 'ts',
    name: 'TypeScript',
    description: 'A strongly typed programming language that builds on JavaScript.',
    logo: 'typescript',
    color: '#3178C6',
    experience: 3,
    proficiency: 90,
    projects: ['Enterprise CRM', 'Financial Dashboard', 'API Gateway'],
    strengths: ['Type Safety', 'Interface Design', 'Generics', 'Advanced Types'],
    category: 'language'
  },
  {
    id: 'react',
    name: 'React',
    description: 'A JavaScript library for building user interfaces.',
    logo: 'react',
    color: '#61DAFB',
    experience: 4,
    proficiency: 92,
    projects: ['E-commerce Platform', 'Social Media Dashboard', 'Portfolio Website'],
    strengths: ['Hooks', 'Context API', 'Custom Hooks', 'Performance Optimization'],
    category: 'frontend'
  },
  {
    id: 'node',
    name: 'Node.js',
    description: 'A JavaScript runtime built on Chrome\'s V8 JavaScript engine.',
    logo: 'nodejs',
    color: '#339933',
    experience: 4,
    proficiency: 88,
    projects: ['REST API Services', 'Real-time Chat Application', 'Data Processing Pipeline'],
    strengths: ['Express.js', 'API Development', 'Async Programming', 'Performance Tuning'],
    category: 'backend'
  },
  {
    id: 'python',
    name: 'Python',
    description: 'A high-level, interpreted programming language with dynamic semantics.',
    logo: 'python',
    color: '#3776AB',
    experience: 3,
    proficiency: 85,
    projects: ['Data Analysis Tool', 'Machine Learning Model', 'Automation Scripts'],
    strengths: ['Data Processing', 'Machine Learning', 'Scripting', 'Web Scraping'],
    category: 'language'
  },
  {
    id: 'aws',
    name: 'AWS',
    description: 'A comprehensive cloud computing platform provided by Amazon.',
    logo: 'aws',
    color: '#FF9900',
    experience: 3,
    proficiency: 80,
    projects: ['Serverless Application', 'Cloud Migration', 'Scalable Web Services'],
    strengths: ['Lambda', 'S3', 'EC2', 'CloudFormation', 'DynamoDB'],
    category: 'devops'
  },
  {
    id: 'docker',
    name: 'Docker',
    description: 'A platform for developing, shipping, and running applications in containers.',
    logo: 'docker',
    color: '#2496ED',
    experience: 3,
    proficiency: 85,
    projects: ['Microservices Architecture', 'CI/CD Pipeline', 'Development Environment'],
    strengths: ['Containerization', 'Docker Compose', 'Multi-stage Builds', 'Optimization'],
    category: 'devops'
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    description: 'A cross-platform document-oriented database program.',
    logo: 'mongodb',
    color: '#47A248',
    experience: 3,
    proficiency: 82,
    projects: ['E-commerce Platform', 'Content Management System', 'Analytics Dashboard'],
    strengths: ['Schema Design', 'Aggregation Pipeline', 'Indexing', 'Performance Tuning'],
    category: 'database'
  },
  {
    id: 'postgres',
    name: 'PostgreSQL',
    description: 'A powerful, open source object-relational database system.',
    logo: 'postgresql',
    color: '#336791',
    experience: 4,
    proficiency: 88,
    projects: ['Financial System', 'Inventory Management', 'Data Warehouse'],
    strengths: ['Complex Queries', 'Performance Tuning', 'Data Integrity', 'JSON Support'],
    category: 'database'
  },
  {
    id: 'graphql',
    name: 'GraphQL',
    description: 'A query language for APIs and a runtime for executing those queries.',
    logo: 'graphql',
    color: '#E10098',
    experience: 2,
    proficiency: 78,
    projects: ['API Gateway', 'Content Platform', 'Mobile App Backend'],
    strengths: ['Schema Design', 'Resolvers', 'Type System', 'Query Optimization'],
    category: 'backend'
  },
  {
    id: 'vue',
    name: 'Vue.js',
    description: 'A progressive JavaScript framework for building user interfaces.',
    logo: 'vuejs',
    color: '#4FC08D',
    experience: 2,
    proficiency: 75,
    projects: ['Admin Dashboard', 'E-commerce Frontend', 'Interactive Documentation'],
    strengths: ['Component System', 'Reactivity', 'Vue Router', 'Vuex'],
    category: 'frontend'
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    description: 'A utility-first CSS framework for rapidly building custom designs.',
    logo: 'tailwindcss',
    color: '#06B6D4',
    experience: 3,
    proficiency: 90,
    projects: ['Portfolio Website', 'Marketing Site', 'Web Application UI'],
    strengths: ['Rapid Prototyping', 'Responsive Design', 'Custom Theming', 'Dark Mode'],
    category: 'frontend'
  },
  {
    id: 'threejs',
    name: 'Three.js',
    description: 'A cross-browser JavaScript library used to create and display animated 3D computer graphics.',
    logo: 'threejs',
    color: '#000000',
    experience: 2,
    proficiency: 75,
    projects: ['3D Portfolio', 'Interactive Product Viewer', 'Data Visualization'],
    strengths: ['WebGL', '3D Modeling', 'Animation', 'Performance Optimization'],
    category: 'frontend'
  },
  {
    id: 'git',
    name: 'Git',
    description: 'A distributed version control system for tracking changes in source code.',
    logo: 'git',
    color: '#F05032',
    experience: 5,
    proficiency: 92,
    projects: ['All Projects', 'Open Source Contributions', 'Team Collaboration'],
    strengths: ['Branching Strategy', 'Conflict Resolution', 'Git Flow', 'Advanced Commands'],
    category: 'devops'
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    description: 'A React framework with hybrid static & server rendering, TypeScript support, and route pre-fetching.',
    logo: 'nextjs',
    color: '#000000',
    experience: 3,
    proficiency: 85,
    projects: ['E-commerce Platform', 'Corporate Website', 'Blog Platform'],
    strengths: ['SSR/SSG', 'API Routes', 'Image Optimization', 'Incremental Static Regeneration'],
    category: 'frontend'
  }
];

// Map of skill IDs to their index in the skills array for quick lookup
export const skillsMap = skills.reduce((acc, skill, index) => {
  acc[skill.id] = index;
  return acc;
}, {} as Record<string, number>);

// Get skill by ID
export const getSkillById = (id: string): Skill | undefined => {
  const index = skillsMap[id];
  return typeof index === 'number' ? skills[index] : undefined;
};

// Get skills by category
export const getSkillsByCategory = (category: SkillCategory): Skill[] => {
  return skills.filter(skill => skill.category === category);
};
