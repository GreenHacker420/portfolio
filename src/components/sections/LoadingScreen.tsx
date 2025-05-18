
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing system...');
  const [showCursor, setShowCursor] = useState(true);
  const [commandComplete, setCommandComplete] = useState(false);

  const loadingSteps = [
    { text: 'Initializing system...', duration: 1200 },
    { text: 'Establishing secure connection...', duration: 1000 },
    { text: 'Authenticating credentials...', duration: 800 },
    { text: 'Bypassing security protocols...', duration: 1500 },
    { text: 'Loading developer assets...', duration: 1000 },
    { text: 'Compiling portfolio data...', duration: 1200 },
    { text: 'Optimizing display modules...', duration: 900 },
    { text: 'Rendering interface...', duration: 1300 },
    { text: 'System ready. Welcome to GreenHacker portfolio v2.0', duration: 1000 }
  ];

  useEffect(() => {
    // Cursor blinking effect
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    // Loading progress simulation
    let step = 0;
    const progressInterval = setTimeout(function runStep() {
      if (step < loadingSteps.length) {
        const { text, duration } = loadingSteps[step];
        setLoadingText(text);
        setLoadingProgress(Math.min(100, Math.round((step + 1) / loadingSteps.length * 100)));
        
        step++;
        setTimeout(runStep, duration);
      } else {
        setCommandComplete(true);
        setTimeout(() => {
          const event = new Event('loadingComplete');
          window.dispatchEvent(event);
        }, 1000);
      }
    }, 500);

    return () => {
      clearInterval(cursorInterval);
      clearTimeout(progressInterval);
    };
  }, []);

  const terminalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black flex items-center justify-center z-50"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <motion.div 
        className="w-full max-w-3xl bg-black border border-neon-green p-6 rounded-md shadow-neon-green terminal-window"
        variants={terminalVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="terminal-header flex items-center justify-between mb-4">
          <div className="text-neon-green font-mono text-sm">~/green-hacker/portfolio</div>
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
        </div>

        <div className="terminal-content space-y-2 font-mono text-sm overflow-hidden">
          <div className="line">
            <span className="text-neon-blue">$ </span>
            <span className="text-white">load portfolio --env=production --secure</span>
          </div>

          <motion.div 
            className="line text-neon-green"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {loadingText}{showCursor ? '▋' : ' '}
          </motion.div>

          <motion.div 
            className="line"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-github-text">Progress: {loadingProgress}%</div>
            <div className="w-full bg-github-dark rounded-full h-2 mt-1">
              <motion.div 
                className="h-2 rounded-full bg-neon-green"
                initial={{ width: 0 }}
                animate={{ width: `${loadingProgress}%` }}
                transition={{ duration: 0.5 }}
              ></motion.div>
            </div>
          </motion.div>

          {commandComplete && (
            <>
              <motion.div 
                className="line"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <span className="text-neon-blue">$ </span>
                <span className="text-white">launch --mode=interactive</span>
              </motion.div>
              <motion.div 
                className="line text-neon-purple"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Launching portfolio interface...
              </motion.div>
            </>
          )}
        </div>

        <div className="ascii-art mt-8 text-neon-green font-mono text-xs whitespace-pre">
{`  _____ _____  _____ _____ _   _   _    _          _____ _  ________ _____  
 / ____|  __ \\|  ___| ____| \\ | | | |  | |   /\\   / ____| |/ /  ____|  __ \\ 
| |  __| |__) | |__ | |__ |  \\| | | |__| |  /  \\ | |    | ' /| |__  | |__) |
| | |_ |  _  /|  __||___ \\| . \` | |  __  | / /\\ \\| |    |  < |  __| |  _  / 
| |__| | | \\ \\| |___ ___) | |\\  | | |  | |/ ____ \\ |____| . \\| |____| | \\ \\ 
 \\_____|_|  \\_\\_____|____/|_| \\_| |_|  |_/_/    \\_\\_____|_|\\_\\______|_|  \\_\\`}
        </div>

        {commandComplete && (
          <motion.div 
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <span className="text-github-text text-sm">Press </span>
            <span className="px-2 py-1 bg-github-light rounded text-white text-sm mx-1">ENTER</span>
            <span className="text-github-text text-sm"> to continue</span>
          </motion.div>
        )}
      </motion.div>
      <style jsx>{`
        .terminal-window {
          box-shadow: 0 0 10px rgba(63, 185, 80, 0.3), 0 0 20px rgba(63, 185, 80, 0.2);
        }
        
        @keyframes scan {
          from { top: 0; }
          to { top: 100%; }
        }
        
        .terminal-window::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background-color: rgba(63, 185, 80, 0.5);
          animation: scan 3s linear infinite;
        }
      `}</style>
    </motion.div>
  );
};

export default LoadingScreen;
