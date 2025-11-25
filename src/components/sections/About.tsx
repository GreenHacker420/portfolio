'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Rocket, Users, Brain, Code, Zap } from 'lucide-react';
import { InstagramIcon, LinkedinIcon } from '@/components/ui/social-icons';
import { animateIn } from '@/utils/animation-anime';

const aboutItems = [
  { icon: Rocket, text: "I'm currently working on a photo-sharing platform with face recognition.", color: 'text-neon-green' },
  { icon: Users, text: "Open to contributing to the open-source community.", color: 'text-neon-purple' },
  { icon: Brain, text: "Learning Machine Learning for face detection.", color: 'text-neon-blue' },
  { icon: Code, text: "Passionate developer and open-source contributor.", color: 'text-neon-pink' },
  { icon: Zap, text: "Fun fact: I can spend hours debugging code but still forget where I kept my phone! 😄", color: 'text-neon-green' },
];

const About = () => {
  useEffect(() => {
    animateIn('#about .about-item');
    animateIn('#about .section-title');
  }, []);

  return (
    <section id="about" className="bg-github-light py-16 sm:py-20">
      <div className="section-container">
        <h2 className="section-title">
          About Me
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="about-item lg:col-span-2 space-y-3 sm:space-y-4">
            {aboutItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start gap-3 p-3 sm:p-4 rounded-lg bg-github-dark/30 hover:bg-github-dark/50 transition-colors"
              >
                <item.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${item.color} flex-shrink-0 mt-0.5`} />
                <p className="text-sm sm:text-base lg:text-lg text-github-text leading-relaxed">
                  {item.text}
                </p>
              </motion.div>
            ))}

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="pt-4 sm:pt-6"
            >
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white">Let's Connect!</h3>
              <p className="text-sm sm:text-base lg:text-lg text-github-text">
                Feel free to reach out if you'd like to collaborate, discuss tech, or share some awesome ideas!
              </p>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="about-item lg:col-span-1"
          >
            <div className="bg-github-dark border border-github-border rounded-2xl overflow-hidden hover:border-neon-green/50 transition-colors">
              <div className="aspect-video sm:aspect-square w-full relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-neon-green/20 to-neon-purple/20 z-10" />
                <img
                  src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8dGVjaHx8fHx8fDE2MjM2MzYyODE&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080"
                  alt="Programming code on computer screen - representing Harsh Hirawat's full-stack development expertise in modern web technologies"
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-github-dark to-transparent h-1/3 z-20" />
              </div>
              <div className="p-4 sm:p-6 about-item">
                <h3 className="text-lg sm:text-xl font-bold mb-3 text-white">Connect with me</h3>
                <div className="space-y-2 sm:space-y-3">
                  <a
                    href="https://www.instagram.com/harsh_hirawat/"
                    className="flex items-center gap-3 p-2 sm:p-3 rounded-lg text-github-text hover:text-neon-pink hover:bg-neon-pink/10 transition-all"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <InstagramIcon className="w-5 h-5" />
                    <span className="text-sm sm:text-base">Instagram</span>
                  </a>
                  <a
                    href="https://in.linkedin.com/in/harsh-hirawat-b657061b7"
                    className="flex items-center gap-3 p-2 sm:p-3 rounded-lg text-github-text hover:text-neon-blue hover:bg-neon-blue/10 transition-all"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <LinkedinIcon className="w-5 h-5" />
                    <span className="text-sm sm:text-base">LinkedIn</span>
                  </a>
                  <a
                    href="mailto:harsh@greenhacker.tech"
                    className="flex items-center gap-3 p-2 sm:p-3 rounded-lg text-github-text hover:text-neon-green hover:bg-neon-green/10 transition-all"
                  >
                    <Mail className="w-5 h-5" />
                    <span className="text-sm sm:text-base">Email</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
