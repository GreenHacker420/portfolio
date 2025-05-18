
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";

interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  period: string;
  location: string;
  description?: string;
  skills?: string[];
  type: string;
}

const Experience = () => {
  const [activeTab, setActiveTab] = useState('work');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  
  const toggleItem = (id: string) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  const experiences: ExperienceItem[] = [
    {
      id: "exp1",
      title: "Field Associate",
      company: "Sachetparyant",
      period: "Sep 2021 - Jul 2023",
      location: "India",
      type: "Part-time",
      description: "Database Head & Field Associate at Sachetparyant's Project Shikshan. Responsible for managing multiple database systems and ensuring data integrity across projects.",
      skills: ["Database Management", "Team Leadership", "Data Analysis"]
    },
    {
      id: "exp2",
      title: "Field Associate",
      company: "Sachetparyant",
      period: "Sep 2021 - Apr 2022",
      location: "India",
      type: "Part-time",
      description: "Database Head & Field Associate at Sachetparyant's Project Shikshan. Worked with stakeholders to identify data needs and implement appropriate solutions.",
      skills: ["Team Management", "Data Analysis", "Stakeholder Communication"]
    },
    {
      id: "exp3",
      title: "Field Associate",
      company: "Sachetparyant",
      period: "Sep 2021 - Sep 2021",
      location: "India",
      type: "Internship",
      description: "Assisted in field operations and data collection activities. Participated in team meetings and contributed to project documentation.",
      skills: ["Field Operations", "Data Collection", "Documentation"]
    },
    {
      id: "exp4",
      title: "Executive",
      company: "Sachetparyant",
      period: "Jul 2021 - Sep 2021",
      location: "India",
      type: "Internship",
      description: "Supported executive team in daily operations and special projects. Developed reporting templates and assisted with presentation materials.",
      skills: ["Executive Support", "Reporting", "Office Administration"]
    }
  ];

  const education = [
    {
      id: "edu1",
      school: "Newton School of Technology",
      degree: "Bachelor of Technology - BTech, Computer Science",
      period: "Aug 2024 - Jul 2028",
      description: "Focusing on advanced programming concepts, data structures, algorithms, and software engineering principles. Participating in coding competitions and tech community events.",
      skills: ["Programming", "Python", "Data Structures", "Algorithms"]
    },
    {
      id: "edu2",
      school: "Royal Senior Secondary School",
      degree: "Senior Secondary School, PCM",
      period: "Apr 2022 - May 2024",
      description: "Completed secondary education with focus on Physics, Chemistry, and Mathematics (PCM). Participated in science exhibitions and mathematical olympiads.",
      skills: ["Mathematics", "Physics", "Chemistry", "Problem Solving"]
    }
  ];

  const certifications = [
    {
      id: "cert1",
      name: "AI For Everyone",
      issuer: "DeepLearning.AI",
      date: "Mar 2025",
      certId: "GQIFS41IFAYR"
    },
    {
      id: "cert2",
      name: "Generative AI for Everyone",
      issuer: "DeepLearning.AI",
      date: "Mar 2025",
      certId: "R2CGBN98KY1W"
    }
  ];

  const achievements = [
    {
      id: "ach1",
      title: "Postman API Fundamentals Student Expert",
      date: "Feb 2025",
      description: "Mastered API development and testing with Postman."
    },
    {
      id: "ach2",
      title: "Certified Machine Learning Specialist",
      date: "Jan 2025",
      description: "Completed a comprehensive course on machine learning."
    },
    {
      id: "ach3",
      title: "1st Place - Robo Soccer Competition",
      date: "Dec 2024",
      description: "Led a team to victory at the national Robo Soccer competition."
    },
    {
      id: "ach4",
      title: "Tekron 2025 Organizing Committee Member",
      date: "Nov 2024",
      description: "Contributed to organizing one of the largest technical events at my university."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section id="experience" className="py-20 bg-github-dark">
      <div className="section-container">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="section-title"
        >
          Experience
        </motion.h2>

        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-md shadow-sm p-1 bg-github-light">
            <button
              onClick={() => setActiveTab('work')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'work'
                  ? 'bg-neon-green text-black'
                  : 'text-github-text hover:text-white'
              }`}
            >
              Work Experience
            </button>
            <button
              onClick={() => setActiveTab('education')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'education'
                  ? 'bg-neon-purple text-black'
                  : 'text-github-text hover:text-white'
              }`}
            >
              Education
            </button>
            <button
              onClick={() => setActiveTab('certifications')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'certifications'
                  ? 'bg-neon-blue text-black'
                  : 'text-github-text hover:text-white'
              }`}
            >
              Certifications
            </button>
            <button
              onClick={() => setActiveTab('achievements')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'achievements'
                  ? 'bg-neon-green text-black'
                  : 'text-github-text hover:text-white'
              }`}
            >
              Achievements
            </button>
          </div>
        </div>

        <div>
          {/* Work Experience Tab */}
          {activeTab === 'work' && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              <motion.h3 
                variants={itemVariants}
                className="text-xl font-bold text-white flex items-center"
              >
                <span className="inline-block w-3 h-3 bg-neon-green rounded-full mr-2"></span>
                Work Experience
              </motion.h3>

              {experiences.map((exp) => (
                <motion.div
                  key={exp.id}
                  variants={itemVariants}
                  className="bg-github-light rounded-lg border border-github-border overflow-hidden transition-all duration-300"
                >
                  <Collapsible 
                    open={expandedItem === exp.id} 
                    onOpenChange={() => toggleItem(exp.id)}
                  >
                    <div className="p-6">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                        <div>
                          <h4 className="font-semibold text-white text-lg">{exp.title}</h4>
                          <p className="text-neon-green">{exp.company}</p>
                        </div>
                        <div className="mt-2 sm:mt-0 text-right">
                          <p className="text-github-text text-sm">{exp.type}</p>
                          <p className="mt-1 text-github-text text-sm">{exp.period}</p>
                        </div>
                      </div>
                      
                      <CollapsibleTrigger className="mt-4 text-sm text-github-text hover:text-white transition-colors flex items-center">
                        {expandedItem === exp.id ? 'Show less' : 'Show more'}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={`ml-2 transition-transform ${expandedItem === exp.id ? 'rotate-180' : ''}`}
                        >
                          <path d="m6 9 6 6 6-6"/>
                        </svg>
                      </CollapsibleTrigger>
                    </div>
                    
                    <CollapsibleContent>
                      <div className="px-6 pb-6 border-t border-github-border pt-4 mt-4">
                        {exp.description && (
                          <p className="text-github-text">{exp.description}</p>
                        )}
                        {exp.skills && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {exp.skills.map((skill, skillIndex) => (
                              <span
                                key={skillIndex}
                                className="tech-badge bg-github-dark"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Education Tab */}
          {activeTab === 'education' && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              <motion.h3 
                variants={itemVariants}
                className="text-xl font-bold text-white flex items-center"
              >
                <span className="inline-block w-3 h-3 bg-neon-purple rounded-full mr-2"></span>
                Education
              </motion.h3>

              {education.map((edu) => (
                <motion.div
                  key={edu.id}
                  variants={itemVariants}
                  className="bg-github-light rounded-lg border border-github-border overflow-hidden"
                >
                  <Collapsible 
                    open={expandedItem === edu.id} 
                    onOpenChange={() => toggleItem(edu.id)}
                  >
                    <div className="p-6">
                      <h4 className="font-semibold text-white text-lg">{edu.school}</h4>
                      <p className="text-neon-purple">{edu.degree}</p>
                      <p className="mt-2 text-github-text text-sm">{edu.period}</p>
                      
                      <CollapsibleTrigger className="mt-4 text-sm text-github-text hover:text-white transition-colors flex items-center">
                        {expandedItem === edu.id ? 'Show less' : 'Show more'}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={`ml-2 transition-transform ${expandedItem === edu.id ? 'rotate-180' : ''}`}
                        >
                          <path d="m6 9 6 6 6-6"/>
                        </svg>
                      </CollapsibleTrigger>
                    </div>
                    
                    <CollapsibleContent>
                      <div className="px-6 pb-6 border-t border-github-border pt-4 mt-4">
                        {edu.description && (
                          <p className="text-github-text">{edu.description}</p>
                        )}
                        {edu.skills && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {edu.skills.map((skill, skillIndex) => (
                              <span
                                key={skillIndex}
                                className="tech-badge bg-github-dark"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Certifications Tab */}
          {activeTab === 'certifications' && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              <motion.h3 
                variants={itemVariants}
                className="text-xl font-bold text-white flex items-center"
              >
                <span className="inline-block w-3 h-3 bg-neon-blue rounded-full mr-2"></span>
                Certifications
              </motion.h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {certifications.map((cert) => (
                  <motion.div
                    key={cert.id}
                    variants={itemVariants}
                    whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                    className="bg-github-light rounded-lg p-6 border border-github-border"
                  >
                    <h4 className="font-semibold text-white text-lg">{cert.name}</h4>
                    <p className="text-neon-blue">{cert.issuer}</p>
                    <div className="mt-2 text-github-text text-sm flex justify-between">
                      <span>Issued {cert.date}</span>
                      <span className="text-xs bg-github-dark px-2 py-1 rounded-full">ID: {cert.certId}</span>
                    </div>
                    <div className="mt-4 flex">
                      <button className="text-sm text-white px-3 py-1 border border-neon-blue/50 rounded hover:bg-neon-blue/10 transition-colors">
                        Show credential
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              <motion.h3 
                variants={itemVariants}
                className="text-xl font-bold text-white flex items-center"
              >
                <span className="inline-block w-3 h-3 bg-neon-green rounded-full mr-2"></span>
                Achievements
              </motion.h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {achievements.map((achievement) => (
                  <motion.div
                    key={achievement.id}
                    variants={itemVariants}
                    whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                    className="bg-github-light rounded-lg p-6 border border-github-border"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-white text-lg">{achievement.title}</h4>
                      <span className="bg-github-dark text-neon-green px-2 py-1 text-xs rounded-full">
                        {achievement.date}
                      </span>
                    </div>
                    <p className="mt-2 text-github-text">{achievement.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Experience;
