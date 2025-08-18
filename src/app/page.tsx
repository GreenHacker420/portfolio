
'use client';

import { useEffect } from "react";
import dynamic from 'next/dynamic';
import { animateIn, textFlicker } from '@/utils/animation-anime';

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Experience from "@/components/sections/Experience";
import Stats from "@/components/sections/Stats";
import Contact from "@/components/sections/Contact";
import Resume from "@/components/sections/Resume";
import ErrorBoundary from "@/components/common/ErrorBoundary";
// GSAP utilities removed in favor of anime.js

// Dynamically import chatbot components to improve initial page load
const CLIChatbot = dynamic(() => import("@/components/sections/CLIChatbot"), {
  ssr: false,
  loading: () => null
});

const EnhancedChatbot = dynamic(() => import("@/components/sections/EnhancedChatbot"), {
  ssr: false,
  loading: () => null
});




// Simple error fallback component
const SectionErrorFallback = ({ section }: { section: string }) => {
  return (
    <div className="py-20 bg-github-dark">
      <div className="section-container">
        <h2 className="section-title text-white">{section}</h2>
        <div className="p-6 bg-github-light rounded-lg border border-github-border">
          <div className="text-center">
            <p className="text-white mb-4">This section could not be loaded.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-neon-green text-black rounded-md hover:bg-neon-green/90 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Safe section wrapper with error boundary
const SafeSection = ({ children, name }: { children: React.ReactNode; name: string }) => {
  const sectionId = name.toLowerCase().replace(/\s+/g, '-');

  return (
    <ErrorBoundary fallback={<SectionErrorFallback section={name} />}>
      <section
        id={sectionId}
        aria-label={`${name} section`}
        className="scroll-mt-20" // Offset for fixed header
      >
        {children}
      </section>
    </ErrorBoundary>
  );
};

export default function HomePage() {
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Performance monitoring
    const startTime = performance.now();

    // Add a small delay to ensure DOM is fully loaded
    const initAnimations = () => {
      try {
        // Animate headings
        animateIn('.section-title');
        // Subtle section entrances
        const sections = document.querySelectorAll('section');
        sections.forEach((section) => {
          animateIn(`#${section.id} *:is(h2,h3,p,div,li,a,img)`, { delay: 50 });
        });
        // Optional: neon flicker-like effect using anime
        document.querySelectorAll('.section-title').forEach((t) => {
          try { textFlicker(t as HTMLElement); } catch {}
        });
        const endTime = performance.now();
        console.log(`Animation initialization took ${endTime - startTime} milliseconds`);
      } catch (error) {
        console.error('Failed to initialize animations:', error);
      }
    };

    // Initialize animations with a small delay
    const timeoutId = setTimeout(initAnimations, 100);

    // Clean up ScrollTrigger on unmount
    return () => {
      clearTimeout(timeoutId);
      try {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      } catch (error) {
        console.warn('Failed to clean up ScrollTrigger:', error);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-github-dark text-github-text dark:bg-github-dark dark:text-github-text">
      {/* Skip to main content for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-neon-green text-black px-4 py-2 rounded-md z-50"
      >
        Skip to main content
      </a>

      <Header />

      <main id="main-content" role="main">
        <SafeSection name="Hero">
          <Hero />
        </SafeSection>

        <SafeSection name="About">
          <About />
        </SafeSection>

        <SafeSection name="Skills">
          <Skills />
        </SafeSection>

        <SafeSection name="Projects">
          <Projects />
        </SafeSection>

        <SafeSection name="Experience">
          <Experience />
        </SafeSection>

        <SafeSection name="Resume">
          <Resume />
        </SafeSection>

        <SafeSection name="Stats">
          <Stats />
        </SafeSection>

        <SafeSection name="Contact">
          <Contact />
        </SafeSection>
      </main>

      <Footer />

      {/* Chatbot components - only one will be active based on user preference */}
      <CLIChatbot />
      <EnhancedChatbot />
    </div>
  );
}
