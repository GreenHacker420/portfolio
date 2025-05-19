
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Download, Eye, FileText, X } from 'lucide-react';

// Mock resume URL - replace with your actual resume URL
const RESUME_URL = '/resume.pdf';

const Resume = () => {
  const [pdfLoaded, setPdfLoaded] = useState(false);

  return (
    <section id="resume" className="py-20 bg-github-dark relative">
      <div className="section-container">
        <h2 className="section-title mb-12">Resume</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-github-light rounded-lg p-6 border border-github-border card-hover"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <FileText className="text-neon-green mr-3" size={24} />
                <h3 className="text-xl font-semibold text-white">My Resume</h3>
              </div>
              <span className="px-3 py-1 bg-neon-green/20 text-neon-green text-xs rounded-full">PDF</span>
            </div>
            
            <p className="text-github-text mb-6">
              Check out my professional experience, skills, and educational background.
              Download the PDF or view it directly on this page.
            </p>
            
            <div className="flex flex-wrap gap-3">
              <Dialog>
                <DialogTrigger asChild>
                  <button className="flex items-center gap-2 px-4 py-2 bg-neon-green text-black font-medium rounded-md hover:bg-neon-green/90 transition-all">
                    <Eye size={16} />
                    View Resume
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl w-[90vw] h-[90vh] p-0">
                  <div className="flex justify-between items-center p-4 border-b border-github-border">
                    <h4 className="font-semibold text-lg">Resume Preview</h4>
                    <a 
                      href={RESUME_URL} 
                      download="GreenHacker_Resume.pdf"
                      className="flex items-center gap-2 px-3 py-1 bg-neon-green text-black text-sm rounded-md hover:bg-neon-green/90 transition-all"
                    >
                      <Download size={14} />
                      Download
                    </a>
                  </div>
                  <div className="h-full bg-gray-800 overflow-auto">
                    <iframe 
                      src={RESUME_URL}
                      className="w-full h-full" 
                      title="Resume Preview"
                      onLoad={() => setPdfLoaded(true)}
                    />
                    {!pdfLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center bg-github-dark/80">
                        <div className="text-center">
                          <div className="w-16 h-16 border-4 border-neon-green/30 border-t-neon-green rounded-full animate-spin mx-auto mb-4"></div>
                          <p className="text-github-text">Loading resume...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
              
              <a 
                href={RESUME_URL} 
                download="GreenHacker_Resume.pdf"
                className="flex items-center gap-2 px-4 py-2 bg-transparent border border-neon-green text-neon-green font-medium rounded-md hover:bg-neon-green/10 transition-all"
              >
                <Download size={16} />
                Download PDF
              </a>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-github-light rounded-lg p-6 border border-github-border"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Highlights</h3>
            <ul className="space-y-3">
              {[
                'Full Stack Development with React, Node.js, and TypeScript',
                'Machine Learning specialization with PyTorch and TensorFlow',
                '5+ years experience working with distributed teams',
                'Open Source contributor to various GitHub projects',
                'Conference speaker on AI and web technologies',
              ].map((item, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  viewport={{ once: true }}
                  className="flex items-start"
                >
                  <span className="bg-neon-green w-2 h-2 rounded-full mt-2 mr-3"></span>
                  <span className="text-github-text">{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Resume;
