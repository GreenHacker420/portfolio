
import { motion } from 'framer-motion';

const Projects = () => {
  const projects = [
    {
      title: 'Portfolio',
      description: 'Personal portfolio website built with HTML and showcasing my projects and skills.',
      tags: ['HTML'],
      imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=800&ixid=MnwxfDB8MXxyYW5kb218MHx8dGVjaHx8fHx8fDE2MjM2MzYyODE&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1200',
    },
    {
      title: 'SNW',
      description: 'A CSS-based interactive web application with modern design principles.',
      tags: ['CSS'],
      imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=800&ixid=MnwxfDB8MXxyYW5kb218MHx8dGVjaHx8fHx8fDE2MjM2MzYyODE&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1200',
    },
    {
      title: 'Nirmaan',
      description: 'A CSS framework for creating responsive and accessible web interfaces.',
      tags: ['CSS'],
      imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=800&ixid=MnwxfDB8MXxyYW5kb218MHx8cHJvZ3JhbW1pbmd8fHx8fHwxNjIzNjM2MzU4&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1200',
    },
    {
      title: 'Storage-NextJs',
      description: 'A NextJS-based storage solution with TypeScript integration.',
      tags: ['TypeScript'],
      imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=800&ixid=MnwxfDB8MXxyYW5kb218MHx8Y29kZXx8fHx8fDE2MjM2MzYzNzg&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1200',
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
    <section id="projects" className="py-20 bg-github-light">
      <div className="section-container">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="section-title"
        >
          Projects
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {projects.map((project, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-github-dark border border-github-border rounded-lg overflow-hidden card-hover"
            >
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-white">{project.title}</h3>
                  <div className="flex gap-2">
                    {project.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className={`tech-badge ${
                          tag === "HTML"
                            ? "bg-tech-html/20 text-tech-html border-tech-html/30"
                            : tag === "CSS"
                            ? "bg-tech-css/20 text-tech-css border-tech-css/30"
                            : "bg-tech-ts/20 text-tech-ts border-tech-ts/30"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="mt-4 text-github-text">{project.description}</p>
                <div className="mt-6 flex gap-3">
                  <a
                    href="#"
                    className="px-4 py-2 bg-github-light text-github-text rounded-md hover:bg-github-light/80 transition-colors"
                  >
                    Demo
                  </a>
                  <a
                    href="#"
                    className="px-4 py-2 bg-github-light text-github-text rounded-md hover:bg-github-light/80 transition-colors"
                  >
                    Source
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
