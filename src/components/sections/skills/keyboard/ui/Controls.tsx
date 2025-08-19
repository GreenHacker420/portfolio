import React from 'react';
import { RefreshCw, Maximize2 } from 'lucide-react';

export interface ControlsProps {
  onRefresh: () => void;
  onFullscreen: () => void;
}

const Controls: React.FC<ControlsProps> = ({ onRefresh, onFullscreen }) => {
  return (
    <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
      <button onClick={onRefresh} className="p-2 rounded-md bg-white/5 ring-1 ring-inset ring-white/10 text-white hover:bg-white/10" title="Reload" aria-label="Reload viewer">
        <RefreshCw size={16} />
      </button>
      <button onClick={onFullscreen} className="p-2 rounded-md bg-white/5 ring-1 ring-inset ring-white/10 text-white hover:bg-white/10" title="Fullscreen" aria-label="Toggle fullscreen">
        <Maximize2 size={16} />
      </button>
    </div>
  );
};

export default Controls;

