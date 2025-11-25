
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from "sonner";
import { Mail, MapPin, Link as LinkIcon, Send, Loader2 } from 'lucide-react';
import { GithubIcon, LinkedinIcon, InstagramIcon } from '@/components/ui/social-icons';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Thanks for reaching out! I'll get back to you soon.", {
          description: "Your message has been sent successfully."
        });
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        toast.error("Failed to send message", {
          description: data.error || "Please try again later."
        });
      }
    } catch (error) {
      toast.error("Connection error", {
        description: "Failed to send message. Please check your connection and try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 sm:py-20 bg-github-dark">
      <div className="section-container">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="section-title"
        >
          Contact
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center max-w-xl mx-auto mb-8 sm:mb-12 px-4"
        >
          <p className="text-base sm:text-lg text-github-text">
            Feel free to reach out if you'd like to collaborate, discuss tech, or share some awesome ideas!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-4 sm:space-y-6"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-white">Get in Touch</h3>
            <p className="text-sm sm:text-base text-github-text">
              Whether you have a project in mind, a question about my work, or just want to say hi, I'd love to hear from you.
            </p>

            <div className="space-y-3 sm:space-y-4">
              <a 
                href="mailto:harsh@greenhacker.tech"
                className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-github-light/50 hover:bg-github-light transition-colors group"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-neon-green/10 flex items-center justify-center flex-shrink-0 group-hover:bg-neon-green/20 transition-colors">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-neon-green" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-medium text-white text-sm sm:text-base">Email</h4>
                  <p className="text-github-text text-xs sm:text-sm truncate">harsh@greenhacker.tech</p>
                </div>
              </a>

              <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-github-light/50">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-neon-blue/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-neon-blue" />
                </div>
                <div>
                  <h4 className="font-medium text-white text-sm sm:text-base">Location</h4>
                  <p className="text-github-text text-xs sm:text-sm">Pune, Maharashtra</p>
                </div>
              </div>

              <a 
                href="https://portfolio.greenhacker.tech/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-github-light/50 hover:bg-github-light transition-colors group"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-neon-purple/10 flex items-center justify-center flex-shrink-0 group-hover:bg-neon-purple/20 transition-colors">
                  <LinkIcon className="w-5 h-5 sm:w-6 sm:h-6 text-neon-purple" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-medium text-white text-sm sm:text-base">Portfolio</h4>
                  <p className="text-github-text text-xs sm:text-sm truncate">portfolio.greenhacker.tech</p>
                </div>
              </a>
            </div>

            <div className="pt-4 sm:pt-6">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Connect With Me</h3>
              <div className="flex gap-3 sm:gap-4">
                <a
                  href="https://www.linkedin.com/in/harsh-hirawat-b657061b7/"
                  target="_blank"
                  rel="noreferrer"
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-github-light flex items-center justify-center hover:bg-neon-blue/20 hover:scale-110 transition-all"
                  aria-label="LinkedIn"
                >
                  <LinkedinIcon className="w-5 h-5 sm:w-6 sm:h-6 text-neon-blue" />
                </a>
                <a
                  href="https://instagram.com/harsh_hirawat"
                  target="_blank"
                  rel="noreferrer"
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-github-light flex items-center justify-center hover:bg-neon-pink/20 hover:scale-110 transition-all"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="w-5 h-5 sm:w-6 sm:h-6 text-neon-pink" />
                </a>
                <a
                  href="https://github.com/GreenHacker420"
                  target="_blank"
                  rel="noreferrer"
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-github-light flex items-center justify-center hover:bg-white/10 hover:scale-110 transition-all"
                  aria-label="GitHub"
                >
                  <GithubIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="bg-github-light p-4 sm:p-6 rounded-xl border border-github-border">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Send a Message</h3>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label htmlFor="name" className="block text-github-text text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-github-dark border border-github-border rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-green/50 focus:border-neon-green/50 text-white text-sm sm:text-base transition-all"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-github-text text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-github-dark border border-github-border rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-green/50 focus:border-neon-green/50 text-white text-sm sm:text-base transition-all"
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-github-text text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-github-dark border border-github-border rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-green/50 focus:border-neon-green/50 text-white text-sm sm:text-base transition-all"
                    placeholder="Project Collaboration"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-github-text text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-github-dark border border-github-border rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-green/50 focus:border-neon-green/50 text-white text-sm sm:text-base resize-none transition-all"
                    placeholder="Hi there, I'd like to talk about..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-2.5 sm:py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                    isSubmitting
                      ? 'bg-github-dark text-github-text cursor-not-allowed'
                      : 'bg-neon-green text-black hover:bg-neon-green/90 hover:shadow-neon-green active:scale-[0.98]'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      <span className="text-sm sm:text-base">Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-sm sm:text-base">Send Message</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
