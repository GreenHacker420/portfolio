
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const Stats = () => {
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
    stars: 1,
    commits: 430,
    prs: 11,
    issues: 1,
    contributions: 5,
  };

  const contributionData = [
    { month: 'May', contributions: 120 },
    { month: 'Jun', contributions: 180 },
    { month: 'Jul', contributions: 240 },
    { month: 'Aug', contributions: 290 },
    { month: 'Sep', contributions: 310 },
    { month: 'Oct', contributions: 340 },
    { month: 'Nov', contributions: 350 },
    { month: 'Dec', contributions: 410 },
    { month: 'Jan', contributions: 425 },
    { month: 'Feb', contributions: 450 },
    { month: 'Mar', contributions: 480 },
    { month: 'Apr', contributions: 510 },
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
              <div className="p-4 bg-github-light/50 rounded-lg">
                <p className="text-sm text-github-text">Total Stars Earned:</p>
                <p className="text-2xl font-bold text-white">{githubStats.stars}</p>
              </div>
              <div className="p-4 bg-github-light/50 rounded-lg">
                <p className="text-sm text-github-text">Total Commits (2025):</p>
                <p className="text-2xl font-bold text-white">{githubStats.commits}</p>
              </div>
              <div className="p-4 bg-github-light/50 rounded-lg">
                <p className="text-sm text-github-text">Total PRs:</p>
                <p className="text-2xl font-bold text-white">{githubStats.prs}</p>
              </div>
              <div className="p-4 bg-github-light/50 rounded-lg">
                <p className="text-sm text-github-text">Total Issues:</p>
                <p className="text-2xl font-bold text-white">{githubStats.issues}</p>
              </div>
              <div className="p-4 bg-github-light/50 rounded-lg col-span-2">
                <p className="text-sm text-github-text">Contributed to (last year):</p>
                <p className="text-2xl font-bold text-white">{githubStats.contributions}</p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="p-5 flex flex-col items-center justify-center">
                <p className="text-3xl font-bold text-white">3,806</p>
                <p className="text-sm text-github-text text-center mt-2">Total Contributions</p>
                <p className="text-xs text-github-text text-center mt-1">May 30, 2022 - Present</p>
              </div>

              <div className="p-5 flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-github-light flex items-center justify-center border-4 border-neon-green/70">
                  <p className="text-3xl font-bold text-white">3</p>
                </div>
                <p className="text-sm text-github-text text-center mt-2">Current Streak</p>
              </div>

              <div className="p-5 flex flex-col items-center justify-center">
                <p className="text-3xl font-bold text-white">378</p>
                <p className="text-sm text-github-text text-center mt-2">Longest Streak</p>
                <p className="text-xs text-github-text text-center mt-1">Apr 8, 2024 - Apr 20</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="bg-github-dark p-6 rounded-xl border border-github-border">
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
                  <Bar dataKey="contributions" fill="#3fb950" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-8">
              <h4 className="text-lg font-semibold text-white mb-4">Recent Activity</h4>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-github-light rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-neon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-white">Created 144 commits in 11 repositories</p>
                    <p className="text-sm text-github-text">May 2025</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-github-light rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-neon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-white">Created 12 repositories</p>
                    <p className="text-sm text-github-text">May 2025</p>
                  </div>
                </div>
              </div>
              <button className="mt-6 w-full py-2 border border-github-border rounded-md text-github-text hover:bg-github-light transition-colors">
                Show more activity
              </button>
            </div>
          </motion.div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-12 bg-github-dark/60 p-6 rounded-lg border border-github-border text-center"
        >
          <h3 className="text-lg font-semibold text-white mb-4">3,026 contributions in the last year</h3>
          <div className="bg-github-dark p-4 rounded-lg overflow-hidden">
            <div className="flex justify-center">
              <div className="grid grid-cols-52 gap-1 auto-rows-fr">
                {Array.from({ length: 365 }, (_, i) => {
                  const intensity = Math.floor(Math.random() * 5); // 0-4
                  let color = 'bg-github-light/30';
                  if (intensity === 1) color = 'bg-neon-green/20';
                  if (intensity === 2) color = 'bg-neon-green/40';
                  if (intensity === 3) color = 'bg-neon-green/60';
                  if (intensity === 4) color = 'bg-neon-green/80';
                  
                  return (
                    <div 
                      key={i} 
                      className={`w-2 h-2 rounded-sm ${color}`}
                      title={`${Math.floor(Math.random() * 10)} contributions on ${new Date().toDateString()}`}
                    />
                  );
                })}
              </div>
            </div>
            <div className="flex justify-end mt-2">
              <div className="flex items-center space-x-1 text-xs text-github-text">
                <span>Less</span>
                <div className="w-2 h-2 bg-github-light/30 rounded-sm"></div>
                <div className="w-2 h-2 bg-neon-green/20 rounded-sm"></div>
                <div className="w-2 h-2 bg-neon-green/40 rounded-sm"></div>
                <div className="w-2 h-2 bg-neon-green/60 rounded-sm"></div>
                <div className="w-2 h-2 bg-neon-green/80 rounded-sm"></div>
                <span>More</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Stats;
