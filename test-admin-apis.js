#!/usr/bin/env node

/**
 * Test script for admin API endpoints
 * Run with: node test-admin-apis.js
 */

const BASE_URL = 'http://localhost:3000'

// Test data for different endpoints
const testData = {
  skill: {
    name: 'Test Skill',
    description: 'A test skill for API validation',
    category: 'testing',
    level: 85,
    color: '#FF5733',
    logo: 'https://example.com/logo.png',
    experience: 2,
    projects: ['Project A', 'Project B'],
    strengths: ['Unit Testing', 'Integration Testing'],
    displayOrder: 1,
    isVisible: true
  },
  
  project: {
    title: 'Test Project',
    description: 'A test project for API validation',
    longDescription: 'This is a longer description of the test project with more details.',
    category: 'web-app',
    technologies: ['React', 'Node.js', 'PostgreSQL'],
    status: 'published',
    featured: true,
    githubUrl: 'https://github.com/test/project',
    liveUrl: 'https://test-project.com',
    imageUrl: 'https://example.com/project.png',
    gallery: ['https://example.com/img1.png', 'https://example.com/img2.png'],
    highlights: ['Feature 1', 'Feature 2'],
    challenges: ['Challenge 1', 'Challenge 2'],
    learnings: ['Learning 1', 'Learning 2'],
    startDate: '2024-01-01',
    endDate: '2024-06-01',
    teamSize: 3,
    role: 'Full Stack Developer',
    displayOrder: 1
  },
  
  experience: {
    company: 'Test Company',
    position: 'Software Developer',
    startDate: '2023-01-01',
    endDate: '2024-01-01',
    description: 'Test work experience description',
    achievements: ['Achievement 1', 'Achievement 2'],
    technologies: ['JavaScript', 'Python', 'Docker'],
    companyLogo: 'https://example.com/company-logo.png',
    companyUrl: 'https://testcompany.com',
    location: 'Remote',
    employmentType: 'Full-time',
    isVisible: true,
    displayOrder: 1
  },
  
  education: {
    institution: 'Test University',
    degree: 'Bachelor of Science',
    fieldOfStudy: 'Computer Science',
    startDate: '2020-09-01',
    endDate: '2024-05-01',
    gpa: '3.8',
    honors: 'Magna Cum Laude',
    description: 'Test education description',
    activities: ['Programming Club', 'Hackathon Winner'],
    isVisible: true,
    displayOrder: 1
  },
  
  certification: {
    name: 'Test Certification',
    issuer: 'Test Organization',
    issueDate: '2024-01-01',
    expiryDate: '2026-01-01',
    credentialId: 'TEST-123456',
    credentialUrl: 'https://example.com/credential',
    description: 'Test certification description',
    skills: ['Skill 1', 'Skill 2'],
    isVisible: true,
    displayOrder: 1
  }
}

async function testEndpoint(endpoint, data) {
  try {
    console.log(`\n🧪 Testing ${endpoint}...`)
    
    const response = await fetch(`${BASE_URL}/api/admin/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Note: In real testing, you'd need proper authentication
      },
      body: JSON.stringify(data)
    })
    
    const result = await response.json()
    
    if (response.ok) {
      console.log(`✅ ${endpoint} - SUCCESS`)
      console.log(`   Created ID: ${result[endpoint.slice(0, -1)]?.id || 'N/A'}`)
    } else {
      console.log(`❌ ${endpoint} - FAILED`)
      console.log(`   Status: ${response.status}`)
      console.log(`   Error: ${result.error}`)
      if (result.details) {
        console.log(`   Details:`, result.details)
      }
    }
  } catch (error) {
    console.log(`💥 ${endpoint} - ERROR: ${error.message}`)
  }
}

async function runTests() {
  console.log('🚀 Starting Admin API Tests...')
  console.log('Note: Make sure the development server is running on localhost:3000')
  console.log('Note: These tests will fail without proper authentication')
  
  // Test each endpoint
  await testEndpoint('skills', testData.skill)
  await testEndpoint('projects', testData.project)
  await testEndpoint('experience', testData.experience)
  await testEndpoint('education', testData.education)
  await testEndpoint('certifications', testData.certification)
  
  console.log('\n✨ Tests completed!')
  console.log('\n📝 Next steps:')
  console.log('1. Start dev server: npm run dev')
  console.log('2. Login to admin panel: http://localhost:3000/admin/login')
  console.log('3. Test form submissions manually')
  console.log('4. Check database for proper data storage')
}

runTests()
