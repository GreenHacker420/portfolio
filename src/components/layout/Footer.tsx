
'use client';

import { motion } from 'framer-motion';
import { Instagram, Linkedin, Github, Mail, MapPin } from 'lucide-react';
import Image from 'next/image';

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-github-darker border-t border-github-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Column 1: Logo and info */}
          <div className="space-y-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-gradient-to-br from-neon-green to-neon-blue flex items-center justify-center">
                <Image
                  src="/logo.jpg"
                  alt="GreenHacker Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className="font-bold text-lg sm:text-xl text-white">GreenHacker</span>
            </div>
            <p className="text-sm text-github-text max-w-sm mx-auto md:mx-0">
              Passionate developer and open-source contributor currently working on a photo-sharing platform with face recognition.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-white font-medium mb-4 text-base sm:text-lg">Quick Links</h3>
            <ul className="space-y-2">
              {['About', 'Projects', 'Skills', 'Experience', 'Contact'].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => {
                      const element = document.querySelector(`#${item.toLowerCase()}`);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="text-github-text hover:text-white transition-colors hover:underline text-sm sm:text-base py-1 px-2 -mx-2 rounded min-h-[44px] flex items-center justify-center md:justify-start"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Social and Contact */}
          <div className="text-center md:text-left">
            <h3 className="text-white font-medium mb-4 text-base sm:text-lg">Connect With Me</h3>
            <div className="flex justify-center md:justify-start space-x-3 sm:space-x-4 mb-4">
              <a
                href="https://github.com/GreenHacker420"
                target="_blank"
                rel="noreferrer"
                className="bg-github-light p-3 rounded-full hover:bg-neon-green/20 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="GitHub Profile"
              >
                <Github className="w-5 h-5 text-github-text hover:text-white" />
              </a>
              <a
                href="https://linkedin.com/in/harsh-hirawat-b657061b7"
                target="_blank"
                rel="noreferrer"
                className="bg-github-light p-3 rounded-full hover:bg-neon-blue/20 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-5 h-5 text-github-text hover:text-white" />
              </a>
              <a
                href="mailto:harsh@greenhacker.tech"
                className="bg-github-light p-3 rounded-full hover:bg-neon-purple/20 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Email Contact"
              >
                <Mail className="w-5 h-5 text-github-text hover:text-white" />
              </a>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-github-text flex items-center justify-center md:justify-start gap-2">
                <Mail className="w-4 h-4" />
                harsh@greenhacker.tech
              </p>
              <p className="text-sm text-github-text flex items-center justify-center md:justify-start gap-2">
                <MapPin className="w-4 h-4" />
                Pune, Maharashtra
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-github-border text-center">
          <p className="text-xs sm:text-sm text-github-text">
            © {new Date().getFullYear()} GreenHacker. All rights reserved.
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
