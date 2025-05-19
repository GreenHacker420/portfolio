
import React from 'react';
import IntroMessage from './IntroMessage';
import CTAButtons from './CTAButtons';
import ScrollPrompt from './ScrollPrompt';
import ThreeDBackground from './ThreeDBackground';
import ThreeFallback from './ThreeFallback';
import TypewriterEffect from './TypewriterEffect';

const HeroSection = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center py-16">
      <div className="absolute inset-0 z-0">
        <ThreeDBackground />
      </div>
      
      <div className="container mx-auto px-6 z-10 relative">
        <IntroMessage />
        <TypewriterEffect />
        <CTAButtons />
      </div>
      
      <ScrollPrompt />
    </section>
  );
};

export default HeroSection;
