
import { useEffect } from "react";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Hero from "../components/sections/Hero";
import About from "../components/sections/About";
import Skills from "../components/sections/Skills";
import Projects from "../components/sections/Projects";
import Experience from "../components/sections/Experience";
import Stats from "../components/sections/Stats";
import Contact from "../components/sections/Contact";
import Resume from "../components/sections/Resume";
import ErrorBoundary from "../components/common/ErrorBoundary";
import { 
  initSmoothScrolling, 
  initScrollAnimations, 
  neonFlickerEffect,
  createParallaxEffect
} from "../utils/animation";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

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
    
    // Initialize GSAP animations
    initSmoothScrolling();
    initScrollAnimations();
    createParallaxEffect();
    
    // Apply neon flicker effect to specific elements
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(title => {
      neonFlickerEffect(title as HTMLElement);
    });
    
    // Set up scroll trigger animations for sections
    const sections = document.querySelectorAll('section');
    sections.forEach((section, i) => {
      // Create section animations
      gsap.fromTo(
        section,
        { opacity: 0.6, y: 50 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: section,
            start: "top bottom-=100",
            end: "top center",
            scrub: true
          }
        }
      );
    });
    
    // Clean up ScrollTrigger on unmount
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="min-h-screen bg-github-dark text-github-text dark:bg-github-dark dark:text-github-text">
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
    </div>
  );
};

export default Index;
