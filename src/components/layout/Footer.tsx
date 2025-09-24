
'use client';

import { motion } from 'framer-motion';
import { Instagram, Linkedin, Github, Mail, MapPin } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface PersonalInfo {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  bio?: string;
  tagline?: string;
  profileImage?: string;
}

interface SocialLink {
  id: string;
  platform: string;
  username: string;
  url: string;
  icon?: string;
  displayOrder: number;
}

const Footer = () => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [personalResponse, socialResponse] = await Promise.all([
        fetch('/api/personal-info'),
        fetch('/api/social-links')
      ]);

      if (personalResponse.ok) {
        const personalData = await personalResponse.json();
        setPersonalInfo(personalData.personalInfo);
      }

      if (socialResponse.ok) {
        const socialData = await socialResponse.json();
        setSocialLinks(socialData.socialLinks || []);
      }
    } catch (error) {
      console.error('Error fetching footer data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getIconForPlatform = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'github':
        return <Github className="w-5 h-5 text-github-text hover:text-white" />;
      case 'linkedin':
        return <Linkedin className="w-5 h-5 text-github-text hover:text-white" />;
      case 'instagram':
        return <Instagram className="w-5 h-5 text-github-text hover:text-white" />;
      default:
        return <Github className="w-5 h-5 text-github-text hover:text-white" />;
    }
  };
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
                  src={personalInfo?.profileImage || "/logo.jpg"}
                  alt={`${personalInfo?.name || 'GreenHacker'} Logo`}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className="font-bold text-lg sm:text-xl text-white">
                {personalInfo?.name || 'GreenHacker'}
              </span>
            </div>
            <p className="text-sm text-github-text max-w-sm mx-auto md:mx-0">
              {personalInfo?.bio || personalInfo?.tagline || 'Passionate developer and open-source contributor.'}
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
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-github-light p-3 rounded-full hover:bg-neon-green/20 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label={`${link.platform} Profile`}
                >
                  {getIconForPlatform(link.platform)}
                </a>
              ))}
              {personalInfo?.email && (
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="bg-github-light p-3 rounded-full hover:bg-neon-purple/20 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Email Contact"
                >
                  <Mail className="w-5 h-5 text-github-text hover:text-white" />
                </a>
              )}
            </div>

            <div className="space-y-2">
              {personalInfo?.email && (
                <p className="text-sm text-github-text flex items-center justify-center md:justify-start gap-2">
                  <Mail className="w-4 h-4" />
                  {personalInfo.email}
                </p>
              )}
              {personalInfo?.location && (
                <p className="text-sm text-github-text flex items-center justify-center md:justify-start gap-2">
                  <MapPin className="w-4 h-4" />
                  {personalInfo.location}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-github-border text-center">
          <p className="text-xs sm:text-sm text-github-text">
            © {new Date().getFullYear()} {personalInfo?.name || 'GreenHacker'}. All rights reserved.
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
