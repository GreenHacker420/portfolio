
import React from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import { Download, Eye, FileText } from 'lucide-react';
import { trackEvent, portfolioEvents } from '@/components/analytics/GoogleAnalytics';
import SimplePDFViewer from './SimplePDFViewer';

// Resume URL - replace with your actual resume URL
const RESUME_URL = '/resume.pdf';

const ResumePreview = () => {
  // Function to handle download tracking
  const handleDownload = () => {
    trackEvent(portfolioEvents.resumeDownload);
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

      <p className="text-github-text mb-4">
        Check out my professional experience, skills, and educational background.
        Download the PDF or view it directly on this page.
      </p>

      {/* Chrome-specific notice */}
      {typeof window !== 'undefined' && /Chrome/.test(navigator.userAgent) && (
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3 mb-4">
          <p className="text-blue-300 text-sm">
            <strong>Chrome Users:</strong> If the preview is blocked, click "Open in New Tab" for the best viewing experience.
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Dialog>
          <DialogTrigger asChild>
            <button className="flex items-center gap-2 px-4 py-2 bg-neon-green text-black font-medium rounded-md hover:bg-neon-green/90 transition-all">
              <Eye size={16} />
              View Resume
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-5xl w-[95vw] h-[95vh] p-0">
            <VisuallyHidden>
              <DialogTitle>Resume Preview</DialogTitle>
              <DialogDescription>
                View and download my professional resume in PDF format
              </DialogDescription>
            </VisuallyHidden>

            {/* Compact header with download button positioned absolutely */}
            <div className="absolute top-2 right-2 z-10">
              <a
                href={RESUME_URL}
                download="GREENHACKER_Resume.pdf"
                onClick={handleDownload}
                className="flex items-center gap-2 px-3 py-2 bg-black/80 backdrop-blur-sm text-neon-green text-sm rounded-md hover:bg-black/90 transition-all shadow-lg border border-neon-green/30"
                title="Download Resume PDF"
              >
                <Download size={16} />
                Download
              </a>
            </div>

            {/* Full-height PDF viewer */}
            <div className="h-full bg-gray-800 overflow-auto relative">
              <SimplePDFViewer
                pdfUrl={RESUME_URL}
                onDownload={handleDownload}
              />
            </div>
          </DialogContent>
        </Dialog>

        <a
          href={RESUME_URL}
          download="GREENHACKER_Resume.pdf"
          onClick={handleDownload}
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
