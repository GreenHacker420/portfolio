import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Experience from "@/components/sections/Experience";
import Stats from "@/components/sections/Stats";
import Contact from "@/components/sections/Contact";
import Resume from "@/components/sections/Resume";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import SectionErrorFallback from "@/components/sections/SectionErrorFallback";
import prisma from "../lib/db";

function SafeSection({ children, name }) {
    const sectionId = name.toLowerCase().replace(/\s+/g, '-');

    return (
        <ErrorBoundary fallback={<SectionErrorFallback section={name} />}>
            <section
                id={sectionId}
                aria-label={`${name} section`}
                className="scroll-mt-20 snap-start min-h-screen border-b border-neutral-900 last:border-0"
            >
                {children}
            </section>
        </ErrorBoundary>
    );
}

export default async function Home() {
    // Optional: Fetch data here if needed in future
    // const projects = await prisma.project.findMany({ where: { isVisible: true } });

    return (
        <main className="flex min-h-screen flex-col bg-black text-white">
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
    );
}
