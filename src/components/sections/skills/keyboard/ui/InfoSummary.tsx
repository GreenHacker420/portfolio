import React from 'react';

export interface InfoSummaryProps {
  open: boolean;
  onClose: () => void;
}

const InfoSummary: React.FC<InfoSummaryProps> = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-github-dark/95 border border-github-border rounded-lg p-4 max-w-md shadow-xl">
      <h3 className="text-white font-semibold mb-2">Interactive Skills Keyboard</h3>
      <p className="text-github-text text-sm">Explore my skills in 3D. Drag to orbit, scroll to zoom. Click highlighted keys to learn more.</p>
      <div className="mt-3 text-right">
        <button onClick={onClose} className="text-neon-green text-sm hover:underline">Got it</button>
      </div>
    </div>
  );
};

export default InfoSummary;

