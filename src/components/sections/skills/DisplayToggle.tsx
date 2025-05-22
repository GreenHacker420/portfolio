
import React from 'react';

type DisplayToggleProps = {
  displayStyle: 'tabs' | 'keyboard';
  toggleDisplayStyle: () => void;
};

const DisplayToggle = ({ displayStyle, toggleDisplayStyle }: DisplayToggleProps) => {
  return (
    <div className="flex justify-end mb-6">
      <button 
        onClick={toggleDisplayStyle}
        className="text-sm bg-github-light/30 px-4 py-2 rounded-md text-neon-green hover:bg-github-light/50 transition-colors"
      >
        {displayStyle === 'tabs' ? 'Switch to Keyboard View' : 'Switch to Tabs View'}
      </button>
    </div>
  );
};

export default DisplayToggle;
