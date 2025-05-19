
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeProvider';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className={`p-2 rounded-full focus:outline-none transition-colors ${
        theme === 'dark' 
          ? 'bg-github-light hover:bg-github-light/80' 
          : 'bg-gray-200 hover:bg-gray-300'
      }`}
      whileTap={{ scale: 0.9 }}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 0 : 180 }}
        transition={{ duration: 0.5 }}
      >
        {theme === 'dark' ? (
          <Sun size={20} className="text-yellow-300" />
        ) : (
          <Moon size={20} className="text-neon-blue" />
        )}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
