
import { useEffect } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Hero from "../components/sections/Hero";
import About from "../components/sections/About";
import Skills from "../components/sections/Skills";
import Projects from "../components/sections/Projects";
import Experience from "../components/sections/Experience";
import Stats from "../components/sections/Stats";
import Contact from "../components/sections/Contact";
import { ErrorBoundary } from "react";

// Simple error fallback component
const SectionErrorFallback = ({ section }: { section: string }) => {
  return (
    <div className="py-20 bg-github-dark">
      <div className="section-container">
        <h2 className="section-title">{section}</h2>
        <div className="p-6 bg-github-light rounded-lg border border-github-border">
          <p className="text-white">This section could not be loaded.</p>
        </div>
      </div>
    </div>
  );
};

// Wrap each section in an error boundary to prevent full app crash
const SafeSection = ({ children, name }: { children: React.ReactNode; name: string }) => {
  return (
    <ErrorBoundary fallback={<SectionErrorFallback section={name} />}>
      {children}
    </ErrorBoundary>
  );
};

const Index = () => {
  useEffect(() => {
    document.title = "GreenHacker | Developer Portfolio";
  }, []);

  return (
    <div className="min-h-screen bg-github-dark text-github-text">
      <Header />
      <main>
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
        <SafeSection name="Stats">
          <Stats />
        </SafeSection>
        <SafeSection name="Contact">
          <Contact />
        </SafeSection>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
