
'use client';

import React, { useState, useEffect, useRef } from 'react';
import ThreeDBackground from './hero/ThreeDBackground';
import ThreeFallback from './hero/ThreeFallback';
import IntroMessage from './hero/IntroMessage';
import CTAButtons from './hero/CTAButtons';
import TypewriterEffect from './hero/TypewriterEffect';
import ScrollPrompt from './hero/ScrollPrompt';

const Hero = () => {
  const [mounted, setMounted] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Delay mounting to ensure DOM is ready
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);

    // Fix hero height to properly fill viewport
    const updateHeight = () => {
      if (typeof window !== 'undefined' && heroRef.current) {
        const windowHeight = window.innerHeight;
        heroRef.current.style.height = `${windowHeight}px`;
      }
    };

    // Initial height set
    updateHeight();

    // Update on resize
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', updateHeight);
    }

    return () => {
      clearTimeout(timer);
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', updateHeight);
      }
    };
  }, []);

  return (
    <section id="home" ref={heroRef} className="relative flex items-center overflow-hidden">
      {/* Always show fallback background */}
      <ThreeFallback />

      {/* Three.js Background with Error Boundary - overlaid on top */}
      {mounted && <ThreeDBackground mounted={mounted} />}

      <div className="section-container relative z-10">
        <IntroMessage />
        <CTAButtons />
        <TypewriterEffect />
      </div>

      <ScrollPrompt />

      {/* Add CSS for animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes expand {
          to { width: 100%; }
        }

        .animate-expand {
          animation: expand 1.5s ease-out forwards;
          animation-delay: 0.8s;
        }

        .wave-emoji {
          animation: wave 2.5s infinite;
          transform-origin: 70% 70%;
          display: inline-block;
        }

        @keyframes wave {
          0% { transform: rotate(0deg); }
          10% { transform: rotate(14deg); }
          20% { transform: rotate(-8deg); }
          30% { transform: rotate(14deg); }
          40% { transform: rotate(-4deg); }
          50% { transform: rotate(10deg); }
          60% { transform: rotate(0deg); }
          100% { transform: rotate(0deg); }
        }

        .typewriter {
          overflow: hidden;
          border-right: .15em solid #3fb950;
          white-space: nowrap;
          margin: 0 auto;
          letter-spacing: .15em;
          animation: typing 3.5s steps(40, end), blink-caret .75s step-end infinite;
        }

        @keyframes typing {
          from { width: 0 }
          to { width: 100% }
        }

        @keyframes blink-caret {
          from, to { border-color: transparent }
          50% { border-color: #3fb950 }
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}} />
    </section>
  );
};

export default Hero;
