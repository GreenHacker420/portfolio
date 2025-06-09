
'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { RefreshCw, Github, Star, GitFork, Users, Calendar } from 'lucide-react';

import { animateGithubGraph } from '../../utils/animation';
import GitHubStatsAI from './GitHubStatsAI';

interface GitHubProfile {
  login: string;
  name: string;
  bio: string;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  location: string;
  blog: string;
  twitter_username: string;
  company: string;
}

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  homepage: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  size: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  topics: string[];
  license: string;
  default_branch: string;
  open_issues_count: number;
}

const Stats = () => {
  const [activeTab, setActiveTab] = useState('contributions');
  const graphRef = useRef<HTMLDivElement>(null);
  const [githubProfile, setGithubProfile] = useState<GitHubProfile | null>(null);
  const [githubRepos, setGithubRepos] = useState<GitHubRepo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Animate GitHub contributions graph when it comes into view
  useEffect(() => {
    if (graphRef.current) {
      animateGithubGraph();
    }
  }, [graphRef.current]);

  // Fetch GitHub data on component mount
  useEffect(() => {
    fetchGitHubData();
  }, []);

  const fetchGitHubData = async () => {
    try {
      setError(null);

      // Fetch profile and repos in parallel
      const [profileResponse, reposResponse] = await Promise.all([
        fetch('/api/github/profile'),
        fetch('/api/github/repos')
      ]);

      if (!profileResponse.ok || !reposResponse.ok) {
        throw new Error('Failed to fetch GitHub data');
      }

      const profileData = await profileResponse.json();
      const reposData = await reposResponse.json();

      if (profileData.success) {
        setGithubProfile(profileData.data);
      }

      if (reposData.repos) {
        setGithubRepos(reposData.repos);
      }

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching GitHub data:', error);
      setError('Failed to load GitHub stats. Using cached data.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchGitHubData();
  };

  const calculateYearsOfCoding = () => {
    if (!githubProfile?.created_at) return 0;
    const createdDate = new Date(githubProfile.created_at);
    const now = new Date();
    const years = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    return Math.floor(years);
  };

  const calculateTotalStars = () => {
    return githubRepos.reduce((total, repo) => total + repo.stargazers_count, 0);
  };

  const calculateTotalForks = () => {
    return githubRepos.reduce((total, repo) => total + repo.forks_count, 0);
  };

  const calculateLanguageStats = () => {
    const languageMap: Record<string, number> = {};
    githubRepos.forEach(repo => {
      if (repo.language) {
        languageMap[repo.language] = (languageMap[repo.language] || 0) + repo.size;
      }
    });
    return languageMap;
  };

  const calculateTotalCommits = () => {
    // Estimate based on repositories (this would need GitHub API commits endpoint for accuracy)
    return githubRepos.length * 15; // Rough estimate
  };

  const getContributionYears = () => {
    const currentYear = new Date().getFullYear();
    const accountCreated = githubProfile?.created_at ? new Date(githubProfile.created_at).getFullYear() : currentYear - 3;
    const years = [];
    for (let year = accountCreated; year <= currentYear; year++) {
      years.push(year);
    }
    return years;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const githubStats = {
    stars: 47,
    commits: 430,
    prs: 28,
    issues: 15,
    contributions: 12,
  };

  const contributionData = [
    { month: 'May', contributions: 42 },
    { month: 'Jun', contributions: 38 },
    { month: 'Jul', contributions: 56 },
    { month: 'Aug', contributions: 72 },
    { month: 'Sep', contributions: 48 },
    { month: 'Oct', contributions: 62 },
    { month: 'Nov', contributions: 54 },
    { month: 'Dec', contributions: 38 },
    { month: 'Jan', contributions: 45 },
    { month: 'Feb', contributions: 67 },
    { month: 'Mar', contributions: 52 },
    { month: 'Apr', contributions: 49 },
  ];

  const languageData = [
    { name: 'JavaScript', value: 38, color: '#f1e05a' },
    { name: 'TypeScript', value: 24, color: '#3178c6' },
    { name: 'Python', value: 18, color: '#3572A5' },
    { name: 'HTML', value: 10, color: '#e34c26' },
    { name: 'CSS', value: 10, color: '#563d7c' },
  ];

  const repoData = [
    { name: 'ML-Face-Recognition', stars: 15, forks: 7 },
    { name: 'React-Portfolio', stars: 12, forks: 5 },
    { name: 'UI-Component-Library', stars: 8, forks: 3 },
    { name: 'Python-Data-Analysis', stars: 7, forks: 2 },
    { name: 'Mobile-App-Template', stars: 5, forks: 1 },
  ];

  return (
    <section id="stats" className="py-20 bg-github-light">
      <div className="section-container">
        <div className="flex items-center justify-between mb-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="section-title"
          >
            GitHub Stats
          </motion.h2>

          <div className="flex items-center gap-4">
            {error && (
              <span className="text-red-400 text-sm">{error}</span>
            )}
            {lastUpdated && (
              <span className="text-github-text text-sm">
                Updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-3 py-1 bg-github-dark border border-github-border rounded-md text-github-text hover:text-white hover:border-neon-green transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>

        <div className="mb-10 flex justify-center">
          <div className="flex rounded-lg overflow-hidden border border-github-border">
            <button
              onClick={() => setActiveTab('contributions')}
              className={`px-4 py-2 ${activeTab === 'contributions' ? 'bg-neon-green text-black' : 'bg-github-dark text-github-text'}`}
            >
              Contributions
            </button>
            <button
              onClick={() => setActiveTab('languages')}
              className={`px-4 py-2 ${activeTab === 'languages' ? 'bg-neon-green text-black' : 'bg-github-dark text-github-text'}`}
            >
              Languages
            </button>
            <button
              onClick={() => setActiveTab('repos')}
              className={`px-4 py-2 ${activeTab === 'repos' ? 'bg-neon-green text-black' : 'bg-github-dark text-github-text'}`}
            >
              Top Repos
            </button>
          </div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          <motion.div variants={itemVariants} className="bg-github-dark p-6 rounded-xl border border-github-border">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Real-time GitHub Stats</h3>
              {isLoading && (
                <div className="flex items-center gap-2 text-github-text">
                  <RefreshCw size={16} className="animate-spin" />
                  <span className="text-sm">Loading...</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <motion.div
                className="p-4 bg-github-light/50 rounded-lg hover:bg-github-light transition-colors"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Star className="text-yellow-400" size={16} />
                  <p className="text-sm text-github-text">Total Stars:</p>
                </div>
                <motion.p
                  className="text-2xl font-bold text-white"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                  viewport={{ once: true }}
                >
                  {isLoading ? '...' : calculateTotalStars()}
                </motion.p>
              </motion.div>

              <motion.div
                className="p-4 bg-github-light/50 rounded-lg hover:bg-github-light transition-colors"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <GitFork className="text-blue-400" size={16} />
                  <p className="text-sm text-github-text">Total Forks:</p>
                </div>
                <motion.p
                  className="text-2xl font-bold text-white"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                  viewport={{ once: true }}
                >
                  {isLoading ? '...' : calculateTotalForks()}
                </motion.p>
              </motion.div>

              <motion.div
                className="p-4 bg-github-light/50 rounded-lg hover:bg-github-light transition-colors"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Users className="text-green-400" size={16} />
                  <p className="text-sm text-github-text">Followers:</p>
                </div>
                <motion.p
                  className="text-2xl font-bold text-white"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                  viewport={{ once: true }}
                >
                  {isLoading ? '...' : githubProfile?.followers || 0}
                </motion.p>
              </motion.div>

              <motion.div
                className="p-4 bg-github-light/50 rounded-lg hover:bg-github-light transition-colors"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="text-purple-400" size={16} />
                  <p className="text-sm text-github-text">Years Coding:</p>
                </div>
                <motion.p
                  className="text-2xl font-bold text-white"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                  viewport={{ once: true }}
                >
                  {isLoading ? '...' : calculateYearsOfCoding()}
                </motion.p>
              </motion.div>

              <motion.div
                className="p-4 bg-github-light/50 rounded-lg col-span-2 hover:bg-github-light transition-colors"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Github className="text-neon-green" size={16} />
                  <p className="text-sm text-github-text">Public Repositories:</p>
                </div>
                <motion.p
                  className="text-2xl font-bold text-white"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                  viewport={{ once: true }}
                >
                  {isLoading ? '...' : githubProfile?.public_repos || 0}
                </motion.p>
              </motion.div>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="p-5 flex flex-col items-center justify-center">
                <motion.p
                  className="text-3xl font-bold text-white"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  623
                </motion.p>
                <p className="text-sm text-github-text text-center mt-2">This Year</p>
                <p className="text-xs text-github-text text-center mt-1">Contributions</p>
              </div>

              <div className="p-5 flex flex-col items-center justify-center">
                <motion.div
                  className="w-20 h-20 rounded-full bg-github-light flex items-center justify-center border-4 border-neon-green/70"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, type: 'spring' }}
                  viewport={{ once: true }}
                >
                  <p className="text-3xl font-bold text-white">3</p>
                </motion.div>
                <p className="text-sm text-github-text text-center mt-2">Current Streak</p>
              </div>

              <div className="p-5 flex flex-col items-center justify-center">
                <motion.p
                  className="text-3xl font-bold text-white"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  17
                </motion.p>
                <p className="text-sm text-github-text text-center mt-2">Longest Streak</p>
                <p className="text-xs text-github-text text-center mt-1">Apr 8 - Apr 24</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-github-dark p-6 rounded-xl border border-github-border">
            {activeTab === 'contributions' && (
              <>
                <h3 className="text-xl font-bold text-white mb-6">Contribution Activity</h3>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={contributionData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                      <XAxis dataKey="month" stroke="#8b949e" />
                      <YAxis stroke="#8b949e" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#161b22', border: '1px solid #30363d' }}
                        itemStyle={{ color: '#c9d1d9' }}
                        labelStyle={{ color: 'white', fontWeight: 'bold' }}
                      />
                      <Bar dataKey="contributions" fill="#3fb950" radius={[4, 4, 0, 0]}>
                        {contributionData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.contributions > 50 ? '#3fb950' : '#388e3c'}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}

            {activeTab === 'languages' && (
              <>
                <h3 className="text-xl font-bold text-white mb-6">Most Used Languages</h3>

                <div className="flex">
                  <div className="h-64 w-1/2">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={languageData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {languageData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ backgroundColor: '#161b22', border: '1px solid #30363d' }}
                          formatter={(value) => [`${value}%`, 'Usage']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="w-1/2 flex flex-col justify-center space-y-4 pl-4">
                    {languageData.map((lang, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: lang.color }}></div>
                        <span className="text-white mr-2">{lang.name}</span>
                        <span className="text-sm text-github-text">{lang.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'repos' && (
              <>
                <h3 className="text-xl font-bold text-white mb-6">Top Repositories</h3>

                <div className="space-y-4">
                  {isLoading ? (
                    <div className="text-center py-8">
                      <RefreshCw className="animate-spin mx-auto mb-2" size={24} />
                      <p className="text-github-text">Loading repositories...</p>
                    </div>
                  ) : (
                    githubRepos.slice(0, 5).map((repo, index) => (
                      <motion.div
                        key={repo.id}
                        className="p-4 bg-github-light/50 rounded-lg hover:bg-github-light cursor-pointer transition-colors"
                        whileHover={{ x: 5 }}
                        onClick={() => window.open(repo.html_url, '_blank')}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="text-neon-green font-medium">{repo.name}</h4>
                            <p className="text-sm text-github-text mt-1 line-clamp-2">
                              {repo.description || 'No description available'}
                            </p>
                            {repo.language && (
                              <span className="inline-block mt-2 px-2 py-1 bg-github-dark rounded text-xs text-github-text">
                                {repo.language}
                              </span>
                            )}
                          </div>
                          <div className="flex space-x-3 text-github-text">
                            <span className="flex items-center text-sm">
                              <Star className="w-4 h-4 mr-1 text-yellow-400" />
                              {repo.stargazers_count}
                            </span>
                            <span className="flex items-center text-sm">
                              <GitFork className="w-4 h-4 mr-1 text-blue-400" />
                              {repo.forks_count}
                            </span>
                          </div>
                        </div>
                        {repo.topics && repo.topics.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {repo.topics.slice(0, 3).map((topic, topicIndex) => (
                              <span
                                key={topicIndex}
                                className="px-2 py-1 bg-neon-green/10 text-neon-green rounded text-xs"
                              >
                                {topic}
                              </span>
                            ))}
                            {repo.topics.length > 3 && (
                              <span className="px-2 py-1 bg-github-dark text-github-text rounded text-xs">
                                +{repo.topics.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </motion.div>
                    ))
                  )}
                </div>
              </>
            )}

            <div className="mt-8">
              <h4 className="text-lg font-semibold text-white mb-4">Recent Activity</h4>
              <div className="space-y-4">
                <motion.div
                  className="flex items-start space-x-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="w-6 h-6 bg-github-light rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-neon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-white">Created 14 commits in 5 repositories</p>
                    <p className="text-sm text-github-text">Last week</p>
                  </div>
                </motion.div>
                <motion.div
                  className="flex items-start space-x-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="w-6 h-6 bg-github-light rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-neon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-white">Created 2 new repositories</p>
                    <p className="text-sm text-github-text">This month</p>
                  </div>
                </motion.div>
              </div>
              <motion.button
                className="mt-6 w-full py-2 border border-github-border rounded-md text-github-text hover:bg-github-light transition-colors"
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                whileTap={{ scale: 0.98 }}
              >
                Show more activity
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* AI-Powered GitHub Analysis */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-8"
        >
          <GitHubStatsAI
            githubData={
              githubProfile && githubRepos.length > 0 ? {
                profile: githubProfile,
                repositories: githubRepos,
                languages: calculateLanguageStats(),
                totalCommits: calculateTotalCommits(),
                contributionYears: getContributionYears()
              } : null
            }
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Stats;
