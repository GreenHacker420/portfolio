
import { motion } from 'framer-motion';

const ProjectCTA = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      viewport={{ once: true }}
      className="mt-10 text-center"
    >
      <a
        href="#contact"
        className="inline-flex items-center px-6 py-3 bg-neon-green text-black font-medium rounded-md hover:bg-neon-green/90 transition-colors"
      >
        <span>Interested in working together?</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 ml-2"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </a>
    </motion.div>
  );
};

export default ProjectCTA;
