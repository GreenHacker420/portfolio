#!/usr/bin/env tsx

/**
 * GitHub Cache Setup Script
 * Sets up the database schema and initializes the GitHub caching system
 */

import { PrismaClient } from '@prisma/client';
import { createGitHubCacheService } from '../src/services/githubCacheService';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Setting up GitHub Cache System...\n');

  try {
    // Check database connection
    console.log('📡 Checking database connection...');
    await prisma.$connect();
    console.log('✅ Database connected successfully\n');

    // Check if cache tables exist
    console.log('🔍 Checking cache tables...');
    try {
      await prisma.gitHubProfileCache.findFirst();
      await prisma.gitHubRepoCache.findFirst();
      await prisma.gitHubContributionCache.findFirst();
      await prisma.gitHubStatsCache.findFirst();
      await prisma.gitHubCacheAnalytics.findFirst();
      console.log('✅ All cache tables exist\n');
    } catch (error) {
      console.log('❌ Cache tables not found. Please run database migration first:');
      console.log('   npx prisma db push');
      console.log('   or');
      console.log('   npx prisma migrate dev\n');
      process.exit(1);
    }

    // Check environment variables
    console.log('🔧 Checking environment variables...');
    const githubToken = process.env.GITHUB_TOKEN;
    const githubUsername = process.env.GITHUB_USERNAME;
    const databaseUrl = process.env.DATABASE_URL;

    if (!githubToken) {
      console.log('⚠️  GITHUB_TOKEN not found in environment variables');
    } else {
      console.log('✅ GITHUB_TOKEN configured');
    }

    if (!githubUsername) {
      console.log('⚠️  GITHUB_USERNAME not found, using default: GreenHacker420');
    } else {
      console.log(`✅ GITHUB_USERNAME configured: ${githubUsername}`);
    }

    if (!databaseUrl) {
      console.log('❌ DATABASE_URL not found in environment variables');
      process.exit(1);
    } else {
      console.log('✅ DATABASE_URL configured\n');
    }

    // Initialize cache service
    console.log('🔄 Initializing GitHub cache service...');
    const cacheService = createGitHubCacheService(
      prisma,
      githubUsername || 'GreenHacker420',
      githubToken
    );

    // Test cache service
    if (githubToken) {
      console.log('🧪 Testing cache service with GitHub API...');
      try {
        const profileResult = await cacheService.getProfile({
          forceRefresh: true,
          fallbackToAPI: true,
        });

        if (profileResult.data) {
          console.log(`✅ Successfully cached GitHub profile for: ${profileResult.data.login}`);
          console.log(`   - Name: ${profileResult.data.name}`);
          console.log(`   - Public repos: ${profileResult.data.public_repos}`);
          console.log(`   - Followers: ${profileResult.data.followers}`);
        } else {
          console.log('⚠️  Profile test failed:', profileResult.error);
        }

        // Test contributions cache
        const currentYear = new Date().getFullYear();
        const contributionsResult = await cacheService.getContributions(currentYear, {
          forceRefresh: false, // Use existing service for this
          fallbackToAPI: false,
        });

        if (contributionsResult.data) {
          console.log(`✅ Contributions cache test successful for year ${currentYear}`);
        } else {
          console.log('ℹ️  Contributions cache test skipped (requires existing service integration)');
        }

      } catch (error) {
        console.log('⚠️  Cache service test failed:', error instanceof Error ? error.message : error);
      }
    } else {
      console.log('⚠️  Skipping GitHub API test (no token provided)');
    }

    // Display cache statistics
    console.log('\n📊 Current cache statistics:');
    try {
      const stats = await cacheService.getCacheStats();
      console.log(`   - Profile cache entries: ${stats.profile.length}`);
      console.log(`   - Repository cache entries: ${stats.repositories.length}`);
      console.log(`   - Contribution cache entries: ${stats.contributions.length}`);
      console.log(`   - Stats cache entries: ${stats.stats.length}`);
      console.log(`   - Total cache entries: ${stats.summary.totalCacheEntries}`);
      console.log(`   - Total fetches: ${stats.summary.totalFetches}`);
      console.log(`   - Total errors: ${stats.summary.totalErrors}`);
    } catch (error) {
      console.log('⚠️  Could not retrieve cache statistics:', error instanceof Error ? error.message : error);
    }

    // Display setup completion
    console.log('\n🎉 GitHub Cache System setup completed!\n');
    
    console.log('📋 Next steps:');
    console.log('1. Deploy to Netlify to enable edge functions');
    console.log('2. Test the cache endpoints:');
    console.log('   - GET /api/github/contributions?year=2024&edge=true');
    console.log('   - GET /api/admin/github-cache?action=stats');
    console.log('   - GET /api/admin/github-cache?action=health');
    console.log('3. Monitor cache performance in the admin panel');
    console.log('4. Set up cache warming if needed\n');

    console.log('🔗 Available endpoints:');
    console.log('   - Edge Functions: /api/edge/github/*');
    console.log('   - Cache Management: /api/admin/github-cache');
    console.log('   - Enhanced API Routes: /api/github/* (with edge cache support)\n');

    console.log('📚 Cache Configuration:');
    console.log('   - Profile cache: 1 hour (stale-while-revalidate: 2 hours)');
    console.log('   - Repository cache: 1 hour (stale-while-revalidate: 2 hours)');
    console.log('   - Contribution cache: 24 hours (stale-while-revalidate: 48 hours)');
    console.log('   - Stats cache: 30 minutes (stale-while-revalidate: 1 hour)\n');

  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Handle script execution
if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Script execution failed:', error);
    process.exit(1);
  });
}

export { main as setupGitHubCache };
