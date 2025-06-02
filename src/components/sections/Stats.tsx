
'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from 'recharts';

import { animateGithubGraph } from '../../utils/animation';

const Stats = () => {
  const [activeTab, setActiveTab] = useState('contributions');
  const graphRef = useRef<HTMLDivElement>(null);

  // Animate GitHub contributions graph when it comes into view
  useEffect(() => {
    if (graphRef.current) {
      animateGithubGraph();
    }
  }, [graphRef.current]);

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
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="section-title"
        >
          GitHub Stats
        </motion.h2>

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
            <h3 className="text-xl font-bold text-white mb-6">Green Hacker's GitHub Stats</h3>

            <div className="grid grid-cols-2 gap-4">
              <motion.div
                className="p-4 bg-github-light/50 rounded-lg hover:bg-github-light transition-colors"
                whileHover={{ y: -5 }}
              >
                <p className="text-sm text-github-text">Total Stars Earned:</p>
                <motion.p
                  className="text-2xl font-bold text-white"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                  viewport={{ once: true }}
                >
                  {githubStats.stars}
                </motion.p>
              </motion.div>
              <motion.div
                className="p-4 bg-github-light/50 rounded-lg hover:bg-github-light transition-colors"
                whileHover={{ y: -5 }}
              >
                <p className="text-sm text-github-text">Total Commits (2025):</p>
                <motion.p
                  className="text-2xl font-bold text-white"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                  viewport={{ once: true }}
                >
                  {githubStats.commits}
                </motion.p>
              </motion.div>
              <motion.div
                className="p-4 bg-github-light/50 rounded-lg hover:bg-github-light transition-colors"
                whileHover={{ y: -5 }}
              >
                <p className="text-sm text-github-text">Total PRs:</p>
                <motion.p
                  className="text-2xl font-bold text-white"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                  viewport={{ once: true }}
                >
                  {githubStats.prs}
                </motion.p>
              </motion.div>
              <motion.div
                className="p-4 bg-github-light/50 rounded-lg hover:bg-github-light transition-colors"
                whileHover={{ y: -5 }}
              >
                <p className="text-sm text-github-text">Total Issues:</p>
                <motion.p
                  className="text-2xl font-bold text-white"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                  viewport={{ once: true }}
                >
                  {githubStats.issues}
                </motion.p>
              </motion.div>
              <motion.div
                className="p-4 bg-github-light/50 rounded-lg col-span-2 hover:bg-github-light transition-colors"
                whileHover={{ y: -5 }}
              >
                <p className="text-sm text-github-text">Contributed to (last year):</p>
                <motion.p
                  className="text-2xl font-bold text-white"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                  viewport={{ once: true }}
                >
                  {githubStats.contributions} Open Source Projects
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
                  {repoData.map((repo, index) => (
                    <motion.div
                      key={index}
                      className="p-4 bg-github-light/50 rounded-lg hover:bg-github-light cursor-pointer transition-colors"
                      whileHover={{ x: 5 }}
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="text-neon-green font-medium">{repo.name}</h4>
                        <div className="flex space-x-3 text-github-text">
                          <span className="flex items-center text-sm">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                            </svg>
                            {repo.stars}
                          </span>
                          <span className="flex items-center text-sm">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                            </svg>
                            {repo.forks}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
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
      </div>
    </section>
  );
};

export default Stats;
