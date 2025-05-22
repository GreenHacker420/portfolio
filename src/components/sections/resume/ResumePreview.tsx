
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Download, Eye, FileText, X } from 'lucide-react';

// Resume URL - replace with your actual resume URL
const RESUME_URL = '/resume.pdf';

const ResumePreview = () => {
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [iframeKey, setIframeKey] = useState(Date.now()); // Key to force iframe refresh

  // Function to reload the PDF iframe
  const reloadPdf = () => {
    setPdfLoaded(false);
    setIframeKey(Date.now());
  };

  return (
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
              <div className="flex items-center gap-2">
                <a 
                  href={RESUME_URL} 
                  download="GREENHACKER_Resume.pdf"
                  className="flex items-center gap-2 px-3 py-1 bg-neon-green text-black text-sm rounded-md hover:bg-neon-green/90 transition-all"
                >
                  <Download size={14} />
                  Download
                </a>
                <button 
                  onClick={reloadPdf} 
                  className="p-1 rounded-full hover:bg-github-border/30 transition-colors"
                  title="Reload PDF"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 2v6h-6"></path>
                    <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
                    <path d="M3 12a9 9 0 0 0 6.7 15L13 21"></path>
                    <path d="M14.3 19.1L21 12"></path>
                  </svg>
                </button>
                <DialogTrigger asChild>
                  <button className="p-1 rounded-full hover:bg-github-border/30 transition-colors">
                    <X size={18} />
                  </button>
                </DialogTrigger>
              </div>
            </div>
            <div className="h-full bg-gray-800 overflow-auto">
              <iframe 
                key={iframeKey}
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
          download="GREENHACKER_Resume.pdf"
          className="flex items-center gap-2 px-4 py-2 bg-transparent border border-neon-green text-neon-green font-medium rounded-md hover:bg-neon-green/10 transition-all"
        >
          <Download size={16} />
          Download PDF
        </a>
      </div>
    </motion.div>
  );
};

export default ResumePreview;
