
import React from 'react';

const ThreeFallback = () => (
  <div className="absolute inset-0 bg-github-darker z-0 opacity-80">
    <div className="absolute inset-0 opacity-30">
      <div className="absolute top-0 -left-4 w-72 h-72 bg-neon-purple rounded-full mix-blend-screen filter blur-xl opacity-70 animate-float"></div>
      <div className="absolute top-8 -right-4 w-72 h-72 bg-neon-green rounded-full mix-blend-screen filter blur-xl opacity-70 animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-neon-blue rounded-full mix-blend-screen filter blur-xl opacity-70 animate-float" style={{ animationDelay: '4s' }}></div>
    </div>
  </div>
);

export default ThreeFallback;
