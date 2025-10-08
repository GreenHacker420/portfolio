
import React, { useEffect, useRef } from 'react';
import { animateIn } from '@/utils/animation-anime';

const IntroMessage = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    animateIn('#intro-msg .intro-block');
  }, []);

  return (
    <div id="intro-msg" ref={rootRef} className="max-w-5xl">
      <div className="intro-block overflow-hidden">
        <h2 className="text-neon-green text-sm sm:text-lg md:text-xl font-mono mb-2 sm:mb-3 flex items-center">
          <span className="wave-emoji mr-2 inline-block text-base sm:text-xl">👋</span>
          <span className="text-sm sm:text-lg md:text-xl">Hello, I'm</span>
        </h2>
      </div>

      <div className="intro-block">
        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-3 sm:mb-4 relative leading-tight">
          Harsh Hirawat aka Green Hacker
          <span className="absolute -bottom-1 sm:-bottom-2 left-0 h-0.5 sm:h-1 bg-neon-green w-0 animate-expand"></span>
        </h1>
      </div>

      <div className="intro-block">
        <div className="text-base sm:text-xl md:text-2xl text-github-text font-medium mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4">
            <span className="flex items-center text-sm sm:text-base md:text-xl">
              <span className="bg-neon-green w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mr-2"></span>
              Full Stack Developer
            </span>
            <span className="flex items-center text-sm sm:text-base md:text-xl">
              <span className="bg-neon-purple w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mr-2"></span>
              Robotics Enthusiast
            </span>
            <span className="flex items-center text-sm sm:text-base md:text-xl">
              <span className="bg-neon-blue w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mr-2"></span>
              Open Source Contributor
            </span>
            <span className="flex items-center text-sm sm:text-base md:text-xl">
              <span className="bg-neon-pink w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mr-2"></span>
              AI/ML Practitioner
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroMessage;
