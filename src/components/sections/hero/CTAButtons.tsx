
import React from 'react';
import { motion } from 'framer-motion';
import { Download, MessageSquare } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/ui/social-icons';

const CTAButtons = () => {
  const handleContactClick = () => {
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleResumeDownload = () => {
    const link = document.createElement('a');
    link.href = '/resume.pdf';
    link.download = 'GreenHacker_Resume.pdf';
    link.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-8 sm:mb-12"
    >
      {/* Primary CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <button
          onClick={handleContactClick}
          className="group relative bg-neon-green text-black px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 hover:bg-neon-green/90 hover:scale-105 flex items-center justify-center gap-2 min-h-[48px] sm:min-h-[52px]"
        >
          <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Let's Connect</span>
          <div className="absolute inset-0 rounded-lg bg-neon-green opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        </button>

        <button
          onClick={handleResumeDownload}
          className="group relative border-2 border-neon-green text-neon-green px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 hover:bg-neon-green hover:text-black hover:scale-105 flex items-center justify-center gap-2 min-h-[48px] sm:min-h-[52px]"
        >
          <Download className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Download CV</span>
          <div className="absolute inset-0 rounded-lg border-2 border-neon-green opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        </button>
      </div>

      {/* Social Links */}
      <div className="flex gap-3 sm:gap-4 justify-center sm:justify-start">
        <a
          href="https://github.com/GreenHacker420"
          target="_blank"
          rel="noopener noreferrer"
          className="group p-3 sm:p-4 rounded-full border border-github-border hover:border-neon-green transition-all duration-300 hover:scale-110 min-h-[48px] min-w-[48px] sm:min-h-[52px] sm:min-w-[52px] flex items-center justify-center"
        >
          <GithubIcon className="w-5 h-5 sm:w-6 sm:h-6 text-github-text group-hover:text-neon-green transition-colors" />
        </a>

        <a
          href="https://linkedin.com/in/harsh-hirawat-b657061b7"
          target="_blank"
          rel="noopener noreferrer"
          className="group p-3 sm:p-4 rounded-full border border-github-border hover:border-neon-blue transition-all duration-300 hover:scale-110 min-h-[48px] min-w-[48px] sm:min-h-[52px] sm:min-w-[52px] flex items-center justify-center"
        >
          <LinkedinIcon className="w-5 h-5 sm:w-6 sm:h-6 text-github-text group-hover:text-neon-blue transition-colors" />
        </a>
      </div>
    </motion.div>
  );
};

export default CTAButtons;
