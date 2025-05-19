// GitHub API service to fetch real-time data
// Note: For public repositories and basic user info, we can use the public GitHub API without authentication
// For higher rate limits or private repos, you would need to use a personal access token

const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_USERNAME = 'GreenHacker420'; // Replace with your actual GitHub username

// Types for GitHub API responses
export interface GithubUserStats {
  name: string;
  login: string;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
  bio: string;
}

export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  updated_at: string;
  fork: boolean;
}

export interface GithubContribution {
  date: string;
  count: number;
}

export interface GithubLanguage {
  name: string;
  value: number;
  color: string;
}

export interface GithubStats {
  stars: number;
  commits: number;
  prs: number;
  issues: number;
  contributions: number;
}

// Fetch user profile information
export const fetchGithubUser = async (): Promise<GithubUserStats> => {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`);
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching GitHub user:', error);
    throw error;
  }
};

// Fetch user's repositories
export const fetchGithubRepos = async (): Promise<GithubRepo[]> => {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`);
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
    throw error;
  }
};

// Calculate total stars from all repositories
export const calculateTotalStars = (repos: GithubRepo[]): number => {
  return repos.reduce((total, repo) => total + repo.stargazers_count, 0);
};

// Get top repositories by stars
export const getTopRepos = (repos: GithubRepo[], count: number = 5): GithubRepo[] => {
  return [...repos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, count);
};

// Calculate language distribution from repositories
export const calculateLanguageDistribution = async (repos: GithubRepo[]): Promise<GithubLanguage[]> => {
  // Language colors from GitHub
  const languageColors: Record<string, string> = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    Python: '#3572A5',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Java: '#b07219',
    C: '#555555',
    'C++': '#f34b7d',
    'C#': '#178600',
    Ruby: '#701516',
    Go: '#00ADD8',
    Swift: '#ffac45',
    Kotlin: '#A97BFF',
    Rust: '#dea584',
    PHP: '#4F5D95',
    // Add more languages as needed
  };

  // Count languages
  const languageCounts: Record<string, number> = {};
  let totalCount = 0;

  // Only count non-fork repositories
  const nonForkRepos = repos.filter(repo => !repo.fork);
  
  for (const repo of nonForkRepos) {
    if (repo.language) {
      languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
      totalCount++;
    }
  }

  // Convert to percentage and format for chart
  const languageData: GithubLanguage[] = Object.entries(languageCounts)
    .map(([name, count]) => ({
      name,
      value: Math.round((count / totalCount) * 100),
      color: languageColors[name] || '#8b949e' // Default color if not found
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // Top 5 languages

  return languageData;
};

// Generate mock contribution data (since the actual contribution calendar requires authentication)
// In a real app, you might use a GitHub token to fetch actual contribution data
export const generateContributionData = (): { month: string; contributions: number }[] => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  
  // Reorder months to start from current month - 11 (to show last 12 months)
  const orderedMonths = [];
  for (let i = 0; i < 12; i++) {
    const monthIndex = (currentMonth - 11 + i + 12) % 12;
    orderedMonths.push(months[monthIndex]);
  }
  
  return orderedMonths.map(month => ({
    month,
    contributions: Math.floor(Math.random() * 50) + 20 // Random number between 20-70
  }));
};

// Fetch all GitHub stats in one call
export const fetchAllGithubStats = async (): Promise<{
  user: GithubUserStats;
  repos: GithubRepo[];
  topRepos: GithubRepo[];
  languageData: GithubLanguage[];
  contributionData: { month: string; contributions: number }[];
  stats: GithubStats;
}> => {
  try {
    // Fetch user and repos in parallel
    const [user, repos] = await Promise.all([
      fetchGithubUser(),
      fetchGithubRepos()
    ]);
    
    // Process the data
    const topRepos = getTopRepos(repos);
    const languageData = await calculateLanguageDistribution(repos);
    const contributionData = generateContributionData();
    
    // Calculate stats
    const totalStars = calculateTotalStars(repos);
    
    // For commits, PRs, and issues, we're using placeholder values
    // In a real app with authentication, you could fetch these from the GitHub API
    const stats: GithubStats = {
      stars: totalStars,
      commits: 430, // Placeholder - would need GitHub auth for real data
      prs: 28,      // Placeholder
      issues: 15,    // Placeholder
      contributions: repos.length // Use repo count as a proxy for contributions
    };
    
    return {
      user,
      repos,
      topRepos,
      languageData,
      contributionData,
      stats
    };
  } catch (error) {
    console.error('Error fetching GitHub data:', error);
    throw error;
  }
};
