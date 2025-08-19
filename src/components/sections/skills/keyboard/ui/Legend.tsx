import React from 'react';

export interface LegendProps {
  open: boolean;
  onToggle: () => void;
}

const Legend: React.FC<LegendProps> = ({ open, onToggle }) => {
  return (
    <>
      <div className="absolute top-3 left-3 z-10">
        <button onClick={onToggle} className="px-2 py-1 text-xs rounded-md bg-white/5 ring-1 ring-inset ring-white/10 text-white hover:bg-white/10">
          {open ? 'Hide Legend' : 'Show Legend'}
        </button>
      </div>
      {open && (
        <div className="absolute bottom-4 right-4 z-10 bg-github-dark/90 border border-github-border rounded-lg p-3 text-xs text-white space-y-1 w-48">
          <div className="font-semibold text-neon-green mb-1">Key → Tech</div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-github-text">
            <span>React</span>
            <span className="text-white/90">react_key</span>
            <span>TypeScript</span>
            <span className="text-white/90">typescript_key</span>
            <span>Next.js</span>
            <span className="text-white/90">nextjs_key</span>
            <span>Node.js</span>
            <span className="text-white/90">nodejs_key</span>
            <span>Python</span>
            <span className="text-white/90">python_key</span>
            <span>JavaScript</span>
            <span className="text-white/90">javascript_key</span>
            <span>HTML</span>
            <span className="text-white/90">html_key</span>
            <span>CSS</span>
            <span className="text-white/90">css_key</span>
            <span>Git</span>
            <span className="text-white/90">git_key</span>
            <span>Docker</span>
            <span className="text-white/90">docker_key</span>
          </div>
        </div>
      )}
    </>
  );
};

export default Legend;

