'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";

// Type definitions for the data
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

interface EducationItem {
  id: string;
  school: string;
  degree: string;
  period: string;
  description?: string;
  skills?: string[];
}

interface CertificationItem {
  id: string;
  name: string;
  issuingOrg: string;
  issueDate: string;
  credentialId: string;
  credentialURL: string;
}

interface AchievementItem {
  id: string;
  title: string;
  date: string;
  description: string;
}

interface ExperienceClientProps {
  experiences: ExperienceItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
  achievements: AchievementItem[];
}

const ExperienceClient = ({ experiences, education, certifications, achievements }: ExperienceClientProps) => {
  const [activeTab, setActiveTab] = useState('work');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

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
                  <p className="text-neon-blue">{cert.issuingOrg}</p>
                  <div className="mt-2 text-github-text text-sm flex justify-between">
                    <span>Issued {new Date(cert.issueDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                    <span className="text-xs bg-github-dark px-2 py-1 rounded-full">ID: {cert.credentialId}</span>
                  </div>
                  <div className="mt-4 flex">
                    <a href={cert.credentialURL} target="_blank" rel="noopener noreferrer" className="text-sm text-white px-3 py-1 border border-neon-blue/50 rounded hover:bg-neon-blue/10 transition-colors">
                      Show credential
                    </a>
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
                      {new Date(achievement.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
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
  );
};

export default ExperienceClient;
