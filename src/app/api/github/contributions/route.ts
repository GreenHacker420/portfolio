import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());
    
    const githubToken = process.env.GITHUB_TOKEN;
    const githubUsername = process.env.GITHUB_USERNAME || 'GreenHacker420';

    if (!githubToken) {
      console.warn('GitHub token not configured, using mock data');
      return getMockContributions(year);
    }

    // Note: GitHub's GraphQL API is needed for contribution data
    // For now, we'll generate realistic mock data based on the year
    // In a real implementation, you would use GitHub's GraphQL API:
    // https://docs.github.com/en/graphql/reference/objects#contributionscollection
    
    return getMockContributions(year);

  } catch (error) {
    console.error('GitHub contributions API error:', error);
    return getMockContributions(new Date().getFullYear());
  }
}

function getMockContributions(year: number) {
  const contributions = generateContributionData(year);
  
  return NextResponse.json({
    year,
    total_contributions: contributions.reduce((sum, week) => 
      sum + week.reduce((weekSum, day) => weekSum + day.count, 0), 0
    ),
    contributions,
    longest_streak: calculateLongestStreak(contributions),
    current_streak: calculateCurrentStreak(contributions),
  });
}

function generateContributionData(year: number) {
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);
  const contributions: Array<Array<{date: string, count: number, level: number}>> = [];
  
  // Find the first Sunday of the year or before
  const firstSunday = new Date(startDate);
  firstSunday.setDate(startDate.getDate() - startDate.getDay());
  
  let currentDate = new Date(firstSunday);
  
  while (currentDate <= endDate || contributions.length < 53) {
    const week: Array<{date: string, count: number, level: number}> = [];
    
    for (let day = 0; day < 7; day++) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const count = generateRealisticContributionCount(currentDate, year);
      const level = getContributionLevel(count);
      
      week.push({
        date: dateStr,
        count,
        level
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    contributions.push(week);
    
    // Stop if we've gone past the end of the year and have at least 52 weeks
    if (currentDate.getFullYear() > year && contributions.length >= 52) {
      break;
    }
  }
  
  return contributions;
}

function generateRealisticContributionCount(date: Date, year: number): number {
  const dayOfWeek = date.getDay();
  const month = date.getMonth();
  const currentYear = new Date().getFullYear();
  
  // Base probability - higher on weekdays
  let baseProbability = dayOfWeek === 0 || dayOfWeek === 6 ? 0.3 : 0.7;
  
  // Seasonal variations - more activity in certain months
  const seasonalMultiplier = [0.8, 0.9, 1.0, 1.1, 1.2, 1.0, 0.8, 0.9, 1.1, 1.2, 1.0, 0.9][month];
  baseProbability *= seasonalMultiplier;
  
  // If it's a future date, no contributions
  if (date > new Date()) {
    return 0;
  }
  
  // Random factor
  const random = Math.random();
  
  if (random > baseProbability) {
    return 0;
  }
  
  // Generate contribution count (1-15, with bias toward lower numbers)
  const contributionRandom = Math.random();
  if (contributionRandom < 0.6) return Math.floor(Math.random() * 3) + 1; // 1-3
  if (contributionRandom < 0.85) return Math.floor(Math.random() * 5) + 4; // 4-8
  if (contributionRandom < 0.95) return Math.floor(Math.random() * 5) + 9; // 9-13
  return Math.floor(Math.random() * 7) + 14; // 14-20
}

function getContributionLevel(count: number): number {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 6) return 2;
  if (count <= 9) return 3;
  return 4;
}

function calculateLongestStreak(contributions: Array<Array<{date: string, count: number, level: number}>>) {
  let longestStreak = 0;
  let currentStreak = 0;
  
  for (const week of contributions) {
    for (const day of week) {
      if (day.count > 0) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }
  }
  
  return longestStreak;
}

function calculateCurrentStreak(contributions: Array<Array<{date: string, count: number, level: number}>>) {
  let currentStreak = 0;
  const today = new Date().toISOString().split('T')[0];
  
  // Work backwards from today
  for (let weekIndex = contributions.length - 1; weekIndex >= 0; weekIndex--) {
    const week = contributions[weekIndex];
    for (let dayIndex = week.length - 1; dayIndex >= 0; dayIndex--) {
      const day = week[dayIndex];
      
      if (day.date > today) continue;
      
      if (day.count > 0) {
        currentStreak++;
      } else {
        return currentStreak;
      }
    }
  }
  
  return currentStreak;
}

export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
