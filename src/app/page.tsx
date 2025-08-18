
export const dynamic = 'force-dynamic';

import InitAnimations from '@/components/InitAnimations';
import Chatbots from '@/components/Chatbots';

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Experience from "@/components/sections/Experience";
// import Stats from "@/components/sections/Stats";
import Stats from "@/components/sections/StatsServer";
import Contact from "@/components/sections/Contact";
import Resume from "@/components/sections/Resume";
import ErrorBoundary from "@/components/common/ErrorBoundary";
// GSAP utilities removed in favor of anime.js





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
function SafeSection({ children, name }: { children: React.ReactNode; name: string }) {
  const sectionId = name.toLowerCase().replace(/\s+/g, '-');

  return (
    <ErrorBoundary fallback={<SectionErrorFallback section={name} />}>
      <section
        id={sectionId}
        aria-label={`${name} section`}
        className="scroll-mt-20"
      >
        {children}
      </section>
    </ErrorBoundary>
  );
}

export default function HomePage() {
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
      <Chatbots />
      {/* Init client-only animations */}
      <InitAnimations />

    </div>
  );
}
