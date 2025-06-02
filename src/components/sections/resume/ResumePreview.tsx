
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import { Download, Eye, FileText, X, RefreshCw, ExternalLink, AlertCircle } from 'lucide-react';
import { trackEvent, portfolioEvents } from '@/components/analytics/GoogleAnalytics';

// Resume URL - replace with your actual resume URL
const RESUME_URL = '/resume.pdf';

interface PDFViewerState {
  loading: boolean;
  error: boolean;
  loaded: boolean;
  retryCount: number;
}

const ResumePreview = () => {
  const [pdfState, setPdfState] = useState<PDFViewerState>({
    loading: true,
    error: false,
    loaded: false,
    retryCount: 0
  });
  const [iframeKey, setIframeKey] = useState(Date.now());
  const [usePdfJs, setUsePdfJs] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout>();

  // Function to reload the PDF iframe
  const reloadPdf = () => {
    setPdfState(prev => ({
      ...prev,
      loading: true,
      error: false,
      retryCount: prev.retryCount + 1
    }));
    setIframeKey(Date.now());
  };

  // Function to handle iframe load success
  const handleIframeLoad = () => {
    setPdfState(prev => ({
      ...prev,
      loading: false,
      error: false,
      loaded: true
    }));

    // Track successful resume view
    trackEvent({
      ...portfolioEvents.resumeView,
      label: usePdfJs ? 'pdf_js_viewer' : 'native_iframe'
    });
  };

  // Function to handle iframe load error
  const handleIframeError = () => {
    setPdfState(prev => ({
      ...prev,
      loading: false,
      error: true,
      loaded: false
    }));

    // Track resume loading error
    trackEvent({
      ...portfolioEvents.resumeError,
      label: usePdfJs ? 'pdf_js_failed' : 'iframe_failed'
    });

    // Auto-retry with PDF.js after first failure
    if (pdfState.retryCount === 0) {
      retryTimeoutRef.current = setTimeout(() => {
        setUsePdfJs(true);
        reloadPdf();
      }, 2000);
    }
  };

  // Function to handle download tracking
  const handleDownload = () => {
    trackEvent(portfolioEvents.resumeDownload);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

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
            <VisuallyHidden>
              <DialogTitle>Resume Preview</DialogTitle>
              <DialogDescription>
                View and download my professional resume in PDF format
              </DialogDescription>
            </VisuallyHidden>
            <div className="flex justify-between items-center p-4 border-b border-github-border">
              <h4 className="font-semibold text-lg">Resume Preview</h4>
              <div className="flex items-center gap-2">
                <a
                  href={RESUME_URL}
                  download="GREENHACKER_Resume.pdf"
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-3 py-1 bg-neon-green text-black text-sm rounded-md hover:bg-neon-green/90 transition-all"
                >
                  <Download size={14} />
                  Download
                </a>
                <button
                  onClick={reloadPdf}
                  disabled={pdfState.loading}
                  className="p-1 rounded-full hover:bg-github-border/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title={pdfState.loading ? "Loading..." : "Reload PDF"}
                >
                  <RefreshCw
                    size={18}
                    className={pdfState.loading ? "animate-spin" : ""}
                  />
                </button>
                <DialogTrigger asChild>
                  <button className="p-1 rounded-full hover:bg-github-border/30 transition-colors">
                    <X size={18} />
                  </button>
                </DialogTrigger>
              </div>
            </div>
            <div className="h-full bg-gray-800 overflow-auto relative">
              {/* Enhanced PDF Viewer with multiple fallback strategies */}
              {!usePdfJs ? (
                // Primary: Native iframe approach
                <iframe
                  ref={iframeRef}
                  key={iframeKey}
                  src={`${RESUME_URL}#toolbar=1&navpanes=0&scrollbar=1`}
                  className="w-full h-full border-0"
                  title="Resume Preview"
                  onLoad={handleIframeLoad}
                  onError={handleIframeError}
                  sandbox="allow-same-origin allow-scripts"
                />
              ) : (
                // Fallback: PDF.js viewer
                <iframe
                  ref={iframeRef}
                  key={`pdfjs-${iframeKey}`}
                  src={`https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(window.location.origin + RESUME_URL)}`}
                  className="w-full h-full border-0"
                  title="Resume Preview (PDF.js)"
                  onLoad={handleIframeLoad}
                  onError={handleIframeError}
                  sandbox="allow-same-origin allow-scripts"
                />
              )}

              {/* Loading State */}
              {pdfState.loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-github-dark/90 backdrop-blur-sm">
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-neon-green/30 border-t-neon-green rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-github-text mb-2">
                      {usePdfJs ? 'Loading with PDF.js...' : 'Loading resume...'}
                    </p>
                    <p className="text-sm text-github-text/70">
                      {pdfState.retryCount > 0 && 'Trying alternative viewer...'}
                    </p>
                  </div>
                </div>
              )}

              {/* Error State with Recovery Options */}
              {pdfState.error && !pdfState.loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-github-dark/90 backdrop-blur-sm">
                  <div className="text-center max-w-md p-6">
                    <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">
                      PDF Preview Unavailable
                    </h3>
                    <p className="text-github-text mb-6">
                      The PDF preview couldn't load in your browser. You can still download or view it directly.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        onClick={reloadPdf}
                        className="flex items-center gap-2 px-4 py-2 bg-neon-green/20 text-neon-green border border-neon-green rounded-md hover:bg-neon-green/30 transition-all"
                      >
                        <RefreshCw size={16} />
                        Try Again
                      </button>

                      <a
                        href={RESUME_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-neon-green text-black rounded-md hover:bg-neon-green/90 transition-all"
                      >
                        <ExternalLink size={16} />
                        Open in New Tab
                      </a>
                    </div>
                  </div>
                </div>
              )}
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
