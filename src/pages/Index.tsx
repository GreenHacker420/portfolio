
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

const Index = () => {
  useEffect(() => {
    document.title = "GreenHacker | Developer Portfolio";
  }, []);

  return (
    <div className="min-h-screen bg-github-dark text-github-text">
      <Header />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Stats />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
