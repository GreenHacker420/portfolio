#!/usr/bin/env node

/**
 * Simple script to generate Prisma client
 */

const { execSync } = require('child_process');
const path = require('path');

// Change to the project root directory
process.chdir(path.join(__dirname, '..'));

console.log('🔄 Generating Prisma client...');

try {
  // Generate Prisma client
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma client generated successfully!');
  
  // Optionally push to database if needed
  console.log('\n📝 To push schema changes to database, run:');
  console.log('   npx prisma db push');
  console.log('   or');
  console.log('   npx prisma migrate dev --name add-github-cache');
  
} catch (error) {
  console.error('❌ Failed to generate Prisma client:', error.message);
  process.exit(1);
}
