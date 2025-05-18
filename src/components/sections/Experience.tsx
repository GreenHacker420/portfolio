
import { motion } from 'framer-motion';

interface ExperienceItem {
  title: string;
  company: string;
  period: string;
  location: string;
  description?: string;
  skills?: string[];
  type: string;
}

const Experience = () => {
  const experiences: ExperienceItem[] = [
    {
      title: "Field Associate",
      company: "Sachetparyant",
      period: "Sep 2021 - Jul 2023",
      location: "India",
      type: "Part-time",
      description: "Database Head & Field Associate At Sachetparyant's Project Shikshan"
    },
    {
      title: "Field Associate",
      company: "Sachetparyant",
      period: "Sep 2021 - Apr 2022",
      location: "India",
      type: "Part-time",
      description: "Database Head & Field Associate At Sachetparyant's Project Shikshan",
      skills: ["Team Management", "Data Analysis"]
    },
    {
      title: "Field Associate",
      company: "Sachetparyant",
      period: "Sep 2021 - Sep 2021",
      location: "India",
      type: "Internship"
    },
    {
      title: "Executive",
      company: "Sachetparyant",
      period: "Jul 2021 - Sep 2021",
      location: "India",
      type: "Internship"
    }
  ];

  const education = [
    {
      school: "Newton School of Technology",
      degree: "Bachelor of Technology - BTech, Computer Science",
      period: "Aug 2024 - Jul 2028",
      skills: ["Programming", "Python"]
    },
    {
      school: "Royal Senior Secondary School",
      degree: "Senior Secondary School, PCM",
      period: "Apr 2022 - May 2024"
    }
  ];

  const certifications = [
    {
      name: "AI For Everyone",
      issuer: "DeepLearning.AI",
      date: "Mar 2025",
      id: "GQIFS41IFAYR"
    },
    {
      name: "Generative AI for Everyone",
      issuer: "DeepLearning.AI",
      date: "Mar 2025",
      id: "R2CGBN98KY1W"
    }
  ];

  const achievements = [
    {
      title: "Postman API Fundamentals Student Expert",
      description: "Mastered API development and testing with Postman."
    },
    {
      title: "Certified Machine Learning Specialist",
      description: "Completed a comprehensive course on machine learning."
    },
    {
      title: "1st Place - Robo Soccer Competition (2025)",
      description: "Led a team to victory at the national Robo Soccer competition."
    },
    {
      title: "Tekron 2025 Organizing Committee Member",
      description: "Contributed to organizing one of the largest technical events at my university."
    }
  ];

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-bold text-white flex items-center">
              <span className="inline-block w-3 h-3 bg-neon-green rounded-full mr-2"></span>
              Work Experience
            </h3>

            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-github-light rounded-lg p-6 border border-github-border"
              >
                <h4 className="font-semibold text-white text-lg">{exp.title}</h4>
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <p className="text-neon-green">{exp.company}</p>
                  <p className="text-github-text text-sm">{exp.type}</p>
                </div>
                <div className="mt-2 text-github-text text-sm flex flex-col sm:flex-row sm:justify-between">
                  <span>{exp.period}</span>
                  <span>{exp.location}</span>
                </div>
                {exp.description && (
                  <p className="mt-4 text-github-text">{exp.description}</p>
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
              </motion.div>
            ))}

            <h3 className="text-xl font-bold text-white flex items-center mt-10">
              <span className="inline-block w-3 h-3 bg-neon-purple rounded-full mr-2"></span>
              Education
            </h3>

            {education.map((edu, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-github-light rounded-lg p-6 border border-github-border"
              >
                <h4 className="font-semibold text-white text-lg">{edu.school}</h4>
                <p className="text-neon-purple">{edu.degree}</p>
                <p className="mt-2 text-github-text text-sm">{edu.period}</p>
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
              </motion.div>
            ))}
          </motion.div>

          <div className="space-y-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              <h3 className="text-xl font-bold text-white flex items-center">
                <span className="inline-block w-3 h-3 bg-neon-blue rounded-full mr-2"></span>
                Certifications
              </h3>

              {certifications.map((cert, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-github-light rounded-lg p-6 border border-github-border mt-6"
                >
                  <h4 className="font-semibold text-white text-lg">{cert.name}</h4>
                  <p className="text-neon-blue">{cert.issuer}</p>
                  <div className="mt-2 text-github-text text-sm flex justify-between">
                    <span>Issued {cert.date}</span>
                    <span>Credential ID {cert.id}</span>
                  </div>
                  <div className="mt-4">
                    <button className="text-sm text-white px-3 py-1 border border-neon-blue/50 rounded hover:bg-neon-blue/10 transition-colors">
                      Show credential
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="mt-10"
            >
              <h3 className="text-xl font-bold text-white flex items-center">
                <span className="inline-block w-3 h-3 bg-neon-green rounded-full mr-2"></span>
                Achievements
              </h3>

              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-github-light rounded-lg p-6 border border-github-border mt-6"
                >
                  <h4 className="font-semibold text-white text-lg">{achievement.title}</h4>
                  <p className="mt-2 text-github-text">{achievement.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
