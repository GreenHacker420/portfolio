import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@greenhacker.tech'
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
  
  const hashedPassword = await bcrypt.hash(adminPassword, 12)
  
  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin',
    },
  })
  
  console.log('✅ Admin user created:', admin.email)

  // Create personal info (will be updated through admin panel)
  const personalInfo = await prisma.personalInfo.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      fullName: 'Portfolio Owner',
      title: 'Full Stack Developer',
      bio: 'Update your bio through the admin panel.',
      email: adminEmail,
      location: 'Update location through admin panel',
    },
  })
  
  console.log('✅ Personal info created')

  // Create comprehensive skills data
  const comprehensiveSkills = [
    {
      name: 'JavaScript',
      description: 'A versatile scripting language that conforms to the ECMAScript specification.',
      category: 'language',
      level: 95,
      color: '#F7DF1E',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
      experience: 5,
      projects: JSON.stringify(['Portfolio Website', 'E-commerce Platform', 'Social Media Dashboard']),
      strengths: JSON.stringify(['ES6+', 'Async/Await', 'DOM Manipulation', 'Functional Programming']),
      displayOrder: 1,
      isVisible: true,
    },
    {
      name: 'TypeScript',
      description: 'A strongly typed programming language that builds on JavaScript.',
      category: 'language',
      level: 90,
      color: '#3178C6',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
      experience: 3,
      projects: JSON.stringify(['Enterprise CRM', 'Financial Dashboard', 'API Gateway']),
      strengths: JSON.stringify(['Type Safety', 'Interface Design', 'Generics', 'Advanced Types']),
      displayOrder: 2,
      isVisible: true,
    },
    {
      name: 'React',
      description: 'A JavaScript library for building user interfaces.',
      category: 'frontend',
      level: 92,
      color: '#61DAFB',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
      experience: 4,
      projects: JSON.stringify(['E-commerce Platform', 'Social Media Dashboard', 'Portfolio Website']),
      strengths: JSON.stringify(['Hooks', 'Context API', 'Custom Hooks', 'Performance Optimization']),
      displayOrder: 3,
      isVisible: true,
    },
    {
      name: 'Node.js',
      description: 'A JavaScript runtime built on Chrome\'s V8 JavaScript engine.',
      category: 'backend',
      level: 88,
      color: '#339933',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
      experience: 4,
      projects: JSON.stringify(['REST API Services', 'Real-time Chat Application', 'Data Processing Pipeline']),
      strengths: JSON.stringify(['Express.js', 'API Development', 'Async Programming', 'Performance Tuning']),
      displayOrder: 4,
      isVisible: true,
    },
    {
      name: 'Python',
      description: 'A high-level, interpreted programming language with dynamic semantics.',
      category: 'language',
      level: 85,
      color: '#3776AB',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      experience: 3,
      projects: JSON.stringify(['Data Analysis Tool', 'Machine Learning Model', 'Automation Scripts']),
      strengths: JSON.stringify(['Data Processing', 'Machine Learning', 'Scripting', 'Web Scraping']),
      displayOrder: 5,
      isVisible: true,
    },
    {
      name: 'AWS',
      description: 'A comprehensive cloud computing platform provided by Amazon.',
      category: 'devops',
      level: 80,
      color: '#FF9900',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg',
      experience: 3,
      projects: JSON.stringify(['Serverless Application', 'Cloud Migration', 'Scalable Web Services']),
      strengths: JSON.stringify(['Lambda', 'S3', 'EC2', 'CloudFormation', 'DynamoDB']),
      displayOrder: 6,
      isVisible: true,
    },
    {
      name: 'Docker',
      description: 'A platform for developing, shipping, and running applications in containers.',
      category: 'devops',
      level: 85,
      color: '#2496ED',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
      experience: 3,
      projects: JSON.stringify(['Microservices Architecture', 'CI/CD Pipeline', 'Development Environment']),
      strengths: JSON.stringify(['Containerization', 'Docker Compose', 'Multi-stage Builds', 'Optimization']),
      displayOrder: 7,
      isVisible: true,
    },
    {
      name: 'MongoDB',
      description: 'A cross-platform document-oriented database program.',
      category: 'database',
      level: 82,
      color: '#47A248',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
      experience: 3,
      projects: JSON.stringify(['E-commerce Platform', 'Content Management System', 'Analytics Dashboard']),
      strengths: JSON.stringify(['Schema Design', 'Aggregation Pipeline', 'Indexing', 'Performance Tuning']),
      displayOrder: 8,
      isVisible: true,
    },
    {
      name: 'PostgreSQL',
      description: 'A powerful, open source object-relational database system.',
      category: 'database',
      level: 88,
      color: '#336791',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
      experience: 4,
      projects: JSON.stringify(['Financial System', 'Inventory Management', 'Data Warehouse']),
      strengths: JSON.stringify(['Complex Queries', 'Performance Tuning', 'Data Integrity', 'JSON Support']),
      displayOrder: 9,
      isVisible: true,
    },
    {
      name: 'GraphQL',
      description: 'A query language for APIs and a runtime for executing those queries.',
      category: 'backend',
      level: 78,
      color: '#E10098',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg',
      experience: 2,
      projects: JSON.stringify(['API Gateway', 'Content Platform', 'Mobile App Backend']),
      strengths: JSON.stringify(['Schema Design', 'Resolvers', 'Type System', 'Query Optimization']),
      displayOrder: 10,
      isVisible: true,
    },
    {
      name: 'Vue.js',
      description: 'A progressive JavaScript framework for building user interfaces.',
      category: 'frontend',
      level: 75,
      color: '#4FC08D',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',
      experience: 2,
      projects: JSON.stringify(['Admin Dashboard', 'E-commerce Frontend', 'Interactive Documentation']),
      strengths: JSON.stringify(['Component System', 'Reactivity', 'Vue Router', 'Vuex']),
      displayOrder: 11,
      isVisible: true,
    },
    {
      name: 'Tailwind CSS',
      description: 'A utility-first CSS framework for rapidly building custom designs.',
      category: 'frontend',
      level: 90,
      color: '#06B6D4',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg',
      experience: 3,
      projects: JSON.stringify(['Portfolio Website', 'Marketing Site', 'Web Application UI']),
      strengths: JSON.stringify(['Rapid Prototyping', 'Responsive Design', 'Custom Theming', 'Dark Mode']),
      displayOrder: 12,
      isVisible: true,
    },
    {
      name: 'Three.js',
      description: 'A cross-browser JavaScript library used to create and display animated 3D computer graphics.',
      category: 'frontend',
      level: 75,
      color: '#000000',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/threejs/threejs-original.svg',
      experience: 2,
      projects: JSON.stringify(['3D Portfolio', 'Interactive Product Viewer', 'Data Visualization']),
      strengths: JSON.stringify(['WebGL', '3D Modeling', 'Animation', 'Performance Optimization']),
      displayOrder: 13,
      isVisible: true,
    },
    {
      name: 'Git',
      description: 'A distributed version control system for tracking changes in source code.',
      category: 'devops',
      level: 92,
      color: '#F05032',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
      experience: 5,
      projects: JSON.stringify(['All Projects', 'Open Source Contributions', 'Team Collaboration']),
      strengths: JSON.stringify(['Branching Strategy', 'Conflict Resolution', 'Git Flow', 'Advanced Commands']),
      displayOrder: 14,
      isVisible: true,
    },
    {
      name: 'Next.js',
      description: 'A React framework with hybrid static & server rendering, TypeScript support, and route pre-fetching.',
      category: 'frontend',
      level: 85,
      color: '#000000',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
      experience: 3,
      projects: JSON.stringify(['E-commerce Platform', 'Corporate Website', 'Blog Platform']),
      strengths: JSON.stringify(['SSR/SSG', 'API Routes', 'Image Optimization', 'Incremental Static Regeneration']),
      displayOrder: 15,
      isVisible: true,
    },
  ]

  for (const skill of comprehensiveSkills) {
    const existingSkill = await prisma.skill.findFirst({
      where: { name: skill.name }
    })

    if (!existingSkill) {
      await prisma.skill.create({
        data: skill,
      })
    }
  }
  
  console.log('✅ Sample skills created')

  // Create initial project (update through admin panel)
  const sampleProject = {
    title: 'Portfolio Admin Dashboard',
    description: 'Admin dashboard for managing portfolio content',
    longDescription: 'Update project details through the admin panel.',
    category: 'web-app',
    technologies: JSON.stringify(['Next.js', 'TypeScript', 'Prisma']),
    status: 'draft' as const,
    featured: false,
    githubUrl: '',
    imageUrl: '',
    highlights: JSON.stringify([
      'Add project highlights through admin panel',
      'Audit logging system',
      'Responsive design',
      'Real-time validation'
    ]),
    displayOrder: 1,
  }

  const existingProject = await prisma.project.findFirst({
    where: { title: sampleProject.title }
  })

  if (!existingProject) {
    await prisma.project.create({
      data: sampleProject,
    })
  }
  
  console.log('✅ Sample project created')

  // Create initial work experience (update through admin panel)
  const sampleExperience = {
    company: 'Update Company Name',
    position: 'Update Position Title',
    startDate: new Date('2022-01-01'),
    endDate: null,
    description: 'Update job description through the admin panel.',
    companyLogo: '',
    isVisible: false,
    displayOrder: 1,
  }

  const existingExperience = await prisma.workExperience.findFirst({
    where: {
      company: sampleExperience.company,
      position: sampleExperience.position
    }
  })

  if (!existingExperience) {
    await prisma.workExperience.create({
      data: sampleExperience,
    })
  }
  
  console.log('✅ Sample work experience created')

  console.log('🎉 Database seeding completed!')
  console.log(`\n📧 Admin Login:`)
  console.log(`   Email: ${adminEmail}`)
  console.log(`   Password: ${adminPassword}`)
  console.log(`\n🚀 You can now start the development server and access the admin dashboard!`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
