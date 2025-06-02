
'use client';

import { motion } from 'framer-motion';
import { Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-github-darker border-t border-github-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Logo and info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-green to-neon-blue flex items-center justify-center">
                <span className="font-mono font-bold text-white">GH</span>
              </div>
              <span className="font-bold text-xl text-white">GreenHacker</span>
            </div>
            <p className="text-sm text-github-text mt-4 max-w-sm">
              Passionate developer and open-source contributor currently working on a photo-sharing platform with face recognition.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['About', 'Projects', 'Skills', 'Experience', 'Contact'].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="text-github-text hover:text-white transition-colors hover:underline"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Social and Contact */}
          <div>
            <h3 className="text-white font-medium mb-4">Connect With Me</h3>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="bg-github-light p-2 rounded-full hover:bg-neon-green/20 transition-colors"
              >
                <Instagram className="w-5 h-5 text-github-text hover:text-white" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="bg-github-light p-2 rounded-full hover:bg-neon-blue/20 transition-colors"
              >
                <Linkedin className="w-5 h-5 text-github-text hover:text-white" />
              </a>
            </div>

            <div className="mt-4">
              <p className="text-sm text-github-text">harsh_hirawat</p>
              <p className="text-sm text-github-text mt-1">Pune, Maharashtra</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-github-border text-center">
          <p className="text-sm text-github-text">
            © {new Date().getFullYear()} GreenHacker. All rights reserved.
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
