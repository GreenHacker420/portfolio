
import { motion } from 'framer-motion';
import ThreeScene from '../3d/ThreeScene';

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center">
      <ThreeScene />
      
      <div className="section-container relative z-10">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-neon-green text-lg md:text-xl font-mono mb-2">
              👋 Hello, I'm
            </h2>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-3">
              Green Hacker
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-2xl md:text-3xl text-github-text font-medium mb-6">
              <span className="mr-2">Full Stack Developer</span>
              <span className="text-neon-green">•</span>
              <span className="mx-2">Machine Learning Expert</span>
              <span className="text-neon-green">•</span>
              <span className="ml-2">Open Source Contributor</span>
            </h2>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8"
          >
            <p className="text-lg text-github-text max-w-2xl mb-8">
              I'm currently working on a photo-sharing platform with face recognition.
              Passionate about open-source and applying Machine Learning to solve real-world problems.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <a
                href="#projects"
                className="px-6 py-3 bg-neon-green text-black font-medium rounded-md hover:bg-neon-green/90 transition-colors"
              >
                View Projects
              </a>
              <a
                href="#contact"
                className="px-6 py-3 bg-transparent border border-neon-green text-neon-green font-medium rounded-md hover:bg-neon-green/10 transition-colors"
              >
                Contact Me
              </a>
            </div>
          </motion.div>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8, repeat: Infinity, repeatType: 'loop', repeatDelay: 1 }}
        >
          <a href="#about" className="flex flex-col items-center text-github-text hover:text-white transition-colors">
            <span className="mb-2 text-sm">Scroll Down</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14" />
              <path d="m19 12-7 7-7-7" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
