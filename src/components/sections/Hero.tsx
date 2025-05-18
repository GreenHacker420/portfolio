
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import ThreeScene from '../3d/ThreeScene';

const Hero = () => {
  const [mounted, setMounted] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    setMounted(true);
    
    // Fix hero height to properly fill viewport
    const updateHeight = () => {
      if (heroRef.current) {
        const windowHeight = window.innerHeight;
        heroRef.current.style.height = `${windowHeight}px`;
      }
    };
    
    // Initial height set
    updateHeight();
    
    // Update on resize
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  return (
    <section id="home" ref={heroRef} className="relative flex items-center overflow-hidden">
      {/* Three.js Background */}
      <div className="absolute inset-0 z-0">
        <ThreeScene showParticles={true} showHexagon={true} />
      </div>
      
      {/* Animated gradient background as fallback for 3D scene */}
      <div className="absolute inset-0 bg-github-darker z-0 opacity-80">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-neon-purple rounded-full mix-blend-screen filter blur-xl opacity-70 animate-float"></div>
          <div className="absolute top-8 -right-4 w-72 h-72 bg-neon-green rounded-full mix-blend-screen filter blur-xl opacity-70 animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-neon-blue rounded-full mix-blend-screen filter blur-xl opacity-70 animate-float" style={{ animationDelay: '4s' }}></div>
        </div>
      </div>
      
      <div className="section-container relative z-10">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden"
          >
            <h2 className="text-neon-green text-lg md:text-xl font-mono mb-2 flex items-center">
              <span className="wave-emoji mr-2 inline-block">👋</span> Hello, I'm
            </h2>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-3 relative">
              Green Hacker
              <span className="absolute -bottom-2 left-0 h-1 bg-neon-green w-0 animate-expand"></span>
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-xl md:text-2xl text-github-text font-medium mb-6 flex flex-wrap gap-2 md:gap-4">
              <span className="flex items-center"><span className="bg-neon-green w-2 h-2 rounded-full mr-2"></span>Full Stack Developer</span>
              <span className="flex items-center"><span className="bg-neon-purple w-2 h-2 rounded-full mr-2"></span>ML Expert</span>
              <span className="flex items-center"><span className="bg-neon-blue w-2 h-2 rounded-full mr-2"></span>OSS Contributor</span>
            </h2>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8"
          >
            <p className="text-lg text-github-text max-w-2xl mb-8 leading-relaxed">
              I'm currently working on a photo-sharing platform with face recognition.
              Passionate about open-source and applying Machine Learning to solve real-world problems.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <motion.a
                href="#projects"
                className="px-6 py-3 bg-neon-green text-black font-medium rounded-md hover:bg-neon-green/90 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Projects
              </motion.a>
              <motion.a
                href="#contact"
                className="px-6 py-3 bg-transparent border border-neon-green text-neon-green font-medium rounded-md hover:bg-neon-green/10 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Me
              </motion.a>
            </div>
          </motion.div>

          {/* Type Writer Effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-12"
          >
            <p className="text-github-text text-lg flex items-center">
              <span className="mr-2">Currently:</span>
              <span className="text-neon-green font-mono typewriter">Building cool stuff with React & ML</span>
            </p>
          </motion.div>
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8, repeat: Infinity, repeatType: 'reverse', repeatDelay: 1 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10"
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
            className="animate-bounce"
          >
            <path d="M12 5v14" />
            <path d="m19 12-7 7-7-7" />
          </svg>
        </a>
      </motion.div>

      {/* Add CSS for animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes expand {
          to { width: 100%; }
        }
        
        .animate-expand {
          animation: expand 1.5s ease-out forwards;
          animation-delay: 0.8s;
        }
        
        .wave-emoji {
          animation: wave 2.5s infinite;
          transform-origin: 70% 70%;
          display: inline-block;
        }
        
        @keyframes wave {
          0% { transform: rotate(0deg); }
          10% { transform: rotate(14deg); }
          20% { transform: rotate(-8deg); }
          30% { transform: rotate(14deg); }
          40% { transform: rotate(-4deg); }
          50% { transform: rotate(10deg); }
          60% { transform: rotate(0deg); }
          100% { transform: rotate(0deg); }
        }
        
        .typewriter {
          overflow: hidden;
          border-right: .15em solid #3fb950;
          white-space: nowrap;
          margin: 0 auto;
          letter-spacing: .15em;
          animation: typing 3.5s steps(40, end), blink-caret .75s step-end infinite;
        }
        
        @keyframes typing {
          from { width: 0 }
          to { width: 100% }
        }
        
        @keyframes blink-caret {
          from, to { border-color: transparent }
          50% { border-color: #3fb950 }
        }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}} />
    </section>
  );
};

export default Hero;
