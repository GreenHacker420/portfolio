/**
 * Comprehensive GitHub API types and interfaces
 * Used across GitHub-related components and services
 */

// Core GitHub User Profile
export interface GitHubProfile {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  hireable: boolean | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

// GitHub Repository
export interface GitHubRepo {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;
  owner: GitHubProfile;
  html_url: string;
  description: string | null;
  fork: boolean;
  url: string;
  archive_url: string;
  assignees_url: string;
  blobs_url: string;
  branches_url: string;
  collaborators_url: string;
  comments_url: string;
  commits_url: string;
  compare_url: string;
  contents_url: string;
  contributors_url: string;
  deployments_url: string;
  downloads_url: string;
  events_url: string;
  forks_url: string;
  git_commits_url: string;
  git_refs_url: string;
  git_tags_url: string;
  git_url: string;
  issue_comment_url: string;
  issue_events_url: string;
  issues_url: string;
  keys_url: string;
  labels_url: string;
  languages_url: string;
  merges_url: string;
  milestones_url: string;
  notifications_url: string;
  pulls_url: string;
  releases_url: string;
  ssh_url: string;
  stargazers_url: string;
  statuses_url: string;
  subscribers_url: string;
  subscription_url: string;
  tags_url: string;
  teams_url: string;
  trees_url: string;
  clone_url: string;
  mirror_url: string | null;
  hooks_url: string;
  svn_url: string;
  homepage: string | null;
  language: string | null;
  forks_count: number;
  stargazers_count: number;
  watchers_count: number;
  size: number;
  default_branch: string;
  open_issues_count: number;
  is_template: boolean;
  topics: string[];
  has_issues: boolean;
  has_projects: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  has_downloads: boolean;
  archived: boolean;
  disabled: boolean;
  visibility: string;
  pushed_at: string | null;
  created_at: string;
  updated_at: string;
  permissions?: {
    admin: boolean;
    maintain: boolean;
    push: boolean;
    triage: boolean;
    pull: boolean;
  };
  allow_rebase_merge: boolean;
  template_repository: GitHubRepo | null;
  temp_clone_token: string;
  allow_squash_merge: boolean;
  allow_auto_merge: boolean;
  delete_branch_on_merge: boolean;
  allow_merge_commit: boolean;
  subscribers_count: number;
  network_count: number;
  license: {
    key: string;
    name: string;
    spdx_id: string;
    url: string;
    node_id: string;
  } | null;
  forks: number;
  open_issues: number;
  watchers: number;
}

// GitHub Language Statistics
export interface GitHubLanguage {
  name: string;
  value: number;
  color: string;
  percentage: number;
  bytes: number;
}

// GitHub Statistics Summary
export interface GitHubStats {
  totalStars: number;
  totalForks: number;
  totalRepos: number;
  totalCommits: number;
  totalPRs: number;
  totalIssues: number;
  contributedRepos: number;
  yearOfCoding: number;
  currentStreak: number;
  longestStreak: number;
  totalContributions: number;
}

// GitHub Contribution Data
export interface GitHubContribution {
  date: string;
  count: number;
  level: number; // 0-4 for color intensity
}

export interface GitHubContributionWeek {
  contributionDays: GitHubContribution[];
  firstDay: string;
}

export interface GitHubContributionCalendar {
  totalContributions: number;
  weeks: GitHubContributionWeek[];
  months: Array<{
    name: string;
    year: number;
    firstDay: string;
    totalWeeks: number;
  }>;
}

// GitHub Activity
export interface GitHubActivity {
  type: 'commit' | 'pr' | 'issue' | 'release' | 'fork' | 'star';
  repo: string;
  date: string;
  description: string;
  url: string;
}

// Combined GitHub Data
export interface GitHubData {
  profile: GitHubProfile;
  repositories: GitHubRepo[];
  stats: GitHubStats;
  languages: GitHubLanguage[];
  contributions: GitHubContributionCalendar;
  recentActivity: GitHubActivity[];
  topRepositories: GitHubRepo[];
}

// API Response Types
export interface GitHubAPIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  cached?: boolean;
  timestamp?: string;
  rateLimit?: {
    limit: number;
    remaining: number;
    reset: number;
  };
}

// Hook Return Types
export interface UseGitHubStatsReturn {
  data: GitHubData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  lastUpdated: Date | null;
}

export interface UseGitHubContributionsReturn {
  contributions: GitHubContributionCalendar | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  lastUpdated: Date | null;
}

// AI Analysis Types
export interface GitHubAIAnalysis {
  overview: string;
  insights: string[];
  recommendations: string[];
  strengths: string[];
  techStack: string[];
  activitySummary: string;
  careerHighlights: string[];
}

export interface GitHubAIResponse {
  success: boolean;
  analysis?: GitHubAIAnalysis;
  error?: string;
  cached?: boolean;
  cacheAge?: number;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

// Component Props Types
export interface GitHubStatsCardsProps {
  data: GitHubData | null;
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export interface GitHubContributionHeatmapProps {
  contributions: GitHubContributionCalendar | null;
  isLoading: boolean;
  error: string | null;
  year?: number;
  className?: string;
}

export interface GitHubAIAnalysisProps {
  githubData: GitHubData | null;
  isLoading: boolean;
  className?: string;
}

// Constants
export const GITHUB_COLORS = {
  level0: '#161b22', // No contributions
  level1: '#0e4429', // Low contributions
  level2: '#006d32', // Medium-low contributions
  level3: '#26a641', // Medium-high contributions
  level4: '#39d353', // High contributions
} as const;

export const GITHUB_API_ENDPOINTS = {
  USER: '/api/github/profile',
  REPOS: '/api/github/repos',
  STATS: '/api/github/stats',
  CONTRIBUTIONS: '/api/github/contributions',
  AI_ANALYSIS: '/api/ai/github-analysis',
} as const;
