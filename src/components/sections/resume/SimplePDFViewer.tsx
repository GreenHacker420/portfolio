'use client';

import React, { useState, useEffect } from 'react';
import { ExternalLink, Download, AlertCircle } from 'lucide-react';

interface SimplePDFViewerProps {
  pdfUrl: string;
  onDownload?: () => void;
}

const SimplePDFViewer: React.FC<SimplePDFViewerProps> = ({ pdfUrl, onDownload }) => {
  const [viewerType, setViewerType] = useState<'iframe' | 'object' | 'embed' | 'blocked'>('iframe');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Detect browser and set optimal viewer
  useEffect(() => {
    const userAgent = navigator.userAgent;
    const isChrome = /Chrome/.test(userAgent) && !/Edge/.test(userAgent);
    const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
    
    if (isChrome) {
      setViewerType('object'); // Chrome works better with object
    } else if (isSafari) {
      setViewerType('embed'); // Safari prefers embed
    } else {
      setViewerType('iframe'); // Firefox and others work well with iframe
    }
  }, []);

  const handleLoad = () => {
    setLoading(false);
    setError(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
    
    // Try next viewer type
    if (viewerType === 'iframe') {
      setViewerType('object');
      setLoading(true);
      setError(false);
    } else if (viewerType === 'object') {
      setViewerType('embed');
      setLoading(true);
      setError(false);
    } else if (viewerType === 'embed') {
      setViewerType('blocked');
    }
  };

  const openInNewTab = () => {
    window.open(pdfUrl, '_blank', 'noopener,noreferrer');
  };

  if (viewerType === 'blocked' || error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-800">
        <div className="text-center max-w-sm p-4">
          <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white mb-2">
            PDF Preview Blocked
          </h3>
          <p className="text-gray-300 text-sm mb-4">
            Your browser blocked the PDF preview.
          </p>
          <div className="flex flex-col gap-2 justify-center">
            <button
              onClick={openInNewTab}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-all"
            >
              <ExternalLink size={14} />
              Open in New Tab
            </button>
            {onDownload && (
              <button
                onClick={onDownload}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-all"
              >
                <Download size={14} />
                Download PDF
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative bg-white">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800/95 z-10">
          <div className="text-center">
            <div className="w-8 h-8 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-white text-sm">Loading PDF...</p>
          </div>
        </div>
      )}

      {viewerType === 'iframe' && (
        <iframe
          src={`${pdfUrl}#view=FitH&toolbar=1&navpanes=0&scrollbar=1`}
          className="w-full h-full border-0"
          title="PDF Viewer"
          onLoad={handleLoad}
          onError={handleError}
          sandbox="allow-same-origin allow-scripts allow-downloads"
        />
      )}

      {viewerType === 'object' && (
        <object
          data={`${pdfUrl}#view=FitH&toolbar=1&navpanes=0`}
          type="application/pdf"
          className="w-full h-full"
          onLoad={handleLoad}
          onError={handleError}
        >
          <p className="text-center p-4">
            Your browser doesn't support PDF viewing.{' '}
            <button onClick={openInNewTab} className="text-blue-500 underline">
              Click here to open in a new tab.
            </button>
          </p>
        </object>
      )}

      {viewerType === 'embed' && (
        <embed
          src={`${pdfUrl}#view=FitH&toolbar=1&navpanes=0`}
          type="application/pdf"
          className="w-full h-full"
          onLoad={handleLoad}
          onError={handleError}
        />
      )}

      {/* Compact fallback button in top-left corner */}
      <div className="absolute top-2 left-2 z-10">
        <button
          onClick={openInNewTab}
          className="px-3 py-1 bg-black/80 backdrop-blur-sm text-blue-300 text-xs rounded-md hover:bg-black/90 transition-all shadow-lg border border-blue-300/30"
          title="Open in new tab if having trouble viewing"
        >
          Open in New Tab
        </button>
      </div>
    </div>
  );
};

export default SimplePDFViewer;
