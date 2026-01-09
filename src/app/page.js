import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import { DotBackground } from "@/components/ui/DotBackground";
import { FloatingNav } from "@/components/ui/floating-navbar";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Experience from "@/components/sections/Experience";
import GitHubAnalysis from "@/components/sections/GitHubAnalysis";
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
    const { MOCK_PROJECTS, MOCK_SKILLS, MOCK_EXPERIENCE, MOCK_GITHUB_STATS } = await import('@/lib/mockData');

    return (
        <main className="flex min-h-screen flex-col bg-black text-white">
            <DotBackground>
                <FloatingNav />

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
                    <Projects data={MOCK_PROJECTS} />
                </SafeSection>

                <SafeSection name="Experience">
                    <Experience data={MOCK_EXPERIENCE} />
                </SafeSection>

                <SafeSection name="Resume">
                    <Resume />
                </SafeSection>

                <SafeSection name="GitHub Activity">
                    <GitHubAnalysis data={MOCK_GITHUB_STATS} />
                </SafeSection>

                <SafeSection name="Contact">
                    <Contact />
                </SafeSection>
            </DotBackground>
        </main>
    );
}
