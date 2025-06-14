#!/usr/bin/env node

/**
 * GitHub API Integration Test Script
 * Tests all GitHub API endpoints and validates data structure
 */

const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'GreenHacker420';

if (!GITHUB_TOKEN) {
  console.error('❌ GITHUB_TOKEN not found in environment variables');
  process.exit(1);
}

console.log('🚀 Starting GitHub API Integration Tests...\n');

/**
 * Test GitHub REST API endpoints
 */
async function testRestAPI() {
  console.log('📡 Testing GitHub REST API...');
  
  const headers = {
    'Authorization': `Bearer ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Portfolio-Test-Script'
  };

  try {
    // Test user profile endpoint
    console.log('  🔍 Testing user profile endpoint...');
    const profileResponse = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, { headers });
    
    if (!profileResponse.ok) {
      throw new Error(`Profile API error: ${profileResponse.status} ${profileResponse.statusText}`);
    }
    
    const profileData = await profileResponse.json();
    console.log(`  ✅ Profile data retrieved for ${profileData.name || profileData.login}`);
    console.log(`     - Public repos: ${profileData.public_repos}`);
    console.log(`     - Followers: ${profileData.followers}`);
    console.log(`     - Account created: ${new Date(profileData.created_at).toLocaleDateString()}`);

    // Test repositories endpoint
    console.log('  🔍 Testing repositories endpoint...');
    const reposResponse = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=10`, { headers });
    
    if (!reposResponse.ok) {
      throw new Error(`Repos API error: ${reposResponse.status} ${reposResponse.statusText}`);
    }
    
    const reposData = await reposResponse.json();
    console.log(`  ✅ Repository data retrieved (${reposData.length} repos)`);
    
    if (reposData.length > 0) {
      const totalStars = reposData.reduce((sum, repo) => sum + repo.stargazers_count, 0);
      const languages = [...new Set(reposData.map(repo => repo.language).filter(Boolean))];
      console.log(`     - Total stars: ${totalStars}`);
      console.log(`     - Languages: ${languages.join(', ')}`);
    }

    // Check rate limit
    const rateLimitRemaining = profileResponse.headers.get('x-ratelimit-remaining');
    const rateLimitReset = profileResponse.headers.get('x-ratelimit-reset');
    console.log(`  📊 Rate limit remaining: ${rateLimitRemaining}`);
    
    return {
      profile: profileData,
      repositories: reposData,
      rateLimit: {
        remaining: rateLimitRemaining,
        reset: rateLimitReset
      }
    };

  } catch (error) {
    console.error('  ❌ REST API test failed:', error.message);
    throw error;
  }
}

/**
 * Test GitHub GraphQL API for contributions
 */
async function testGraphQLAPI() {
  console.log('\n📡 Testing GitHub GraphQL API...');
  
  const headers = {
    'Authorization': `Bearer ${GITHUB_TOKEN}`,
    'Content-Type': 'application/json',
    'User-Agent': 'Portfolio-Test-Script'
  };

  const currentYear = new Date().getFullYear();
  const query = `
    query($username: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $username) {
        contributionsCollection(from: $from, to: $to) {
          totalCommitContributions
          totalIssueContributions
          totalPullRequestContributions
          totalPullRequestReviewContributions
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
                contributionLevel
              }
              firstDay
            }
            months {
              name
              year
              firstDay
              totalWeeks
            }
          }
        }
      }
    }
  `;

  try {
    console.log(`  🔍 Testing contributions for ${currentYear}...`);
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query,
        variables: {
          username: GITHUB_USERNAME,
          from: `${currentYear}-01-01T00:00:00Z`,
          to: `${currentYear}-12-31T23:59:59Z`
        }
      })
    });

    if (!response.ok) {
      throw new Error(`GraphQL API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    if (result.errors) {
      throw new Error(`GraphQL errors: ${result.errors.map(e => e.message).join(', ')}`);
    }

    const contributionsData = result.data?.user?.contributionsCollection;
    if (!contributionsData) {
      throw new Error('No contributions data found');
    }

    const calendar = contributionsData.contributionCalendar;
    console.log(`  ✅ Contributions data retrieved for ${currentYear}`);
    console.log(`     - Total contributions: ${calendar.totalContributions}`);
    console.log(`     - Weeks of data: ${calendar.weeks.length}`);
    console.log(`     - Months: ${calendar.months.length}`);
    
    // Analyze contribution patterns
    const allDays = calendar.weeks.flatMap(week => week.contributionDays);
    const activeDays = allDays.filter(day => day.contributionCount > 0);
    const maxContributions = Math.max(...allDays.map(day => day.contributionCount));
    
    console.log(`     - Active days: ${activeDays.length}/${allDays.length}`);
    console.log(`     - Max contributions in a day: ${maxContributions}`);

    return contributionsData;

  } catch (error) {
    console.error('  ❌ GraphQL API test failed:', error.message);
    throw error;
  }
}

/**
 * Save test results to file
 */
function saveTestResults(results) {
  console.log('\n💾 Saving test results...');
  
  const testData = {
    test_info: {
      description: "GitHub API Test Results",
      timestamp: new Date().toISOString(),
      github_username: GITHUB_USERNAME,
      test_status: "completed"
    },
    actual_responses: results,
    validation: {
      profile_data_complete: !!results.restAPI?.profile,
      repositories_data_complete: !!results.restAPI?.repositories,
      contributions_data_complete: !!results.graphQLAPI,
      rate_limit_info_available: !!results.restAPI?.rateLimit
    }
  };

  const outputPath = path.join(__dirname, '..', 'testgitdata.json');
  fs.writeFileSync(outputPath, JSON.stringify(testData, null, 2));
  console.log(`  ✅ Test results saved to ${outputPath}`);
}

/**
 * Main test function
 */
async function runTests() {
  try {
    const results = {};
    
    // Test REST API
    results.restAPI = await testRestAPI();
    
    // Test GraphQL API
    results.graphQLAPI = await testGraphQLAPI();
    
    // Save results
    saveTestResults(results);
    
    console.log('\n🎉 All GitHub API tests completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   - Profile data: ✅ Retrieved`);
    console.log(`   - Repository data: ✅ Retrieved (${results.restAPI.repositories.length} repos)`);
    console.log(`   - Contribution data: ✅ Retrieved`);
    console.log(`   - Rate limit remaining: ${results.restAPI.rateLimit.remaining}`);
    
  } catch (error) {
    console.error('\n💥 Test failed:', error.message);
    process.exit(1);
  }
}

// Run the tests
runTests();
