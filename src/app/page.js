
import { SafeSection } from '@/components/layout/SafeSection';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import SplineSkills from '@/components/sections/SplineSkills';
import Projects from '@/components/sections/Projects';
import Experience from '@/components/sections/Experience';
import Contact from '@/components/sections/Contact';
import GitHubAnalysis from '@/components/sections/GitHubAnalysis';
import { DotBackground } from '@/components/ui/DotBackground';
import { FloatingNav } from "@/components/ui/floating-navbar";
import prisma from '@/lib/db';
import AllData from './AllData';
import { getMockData } from '@/lib/mockData';


// Ensure dynamic rendering for fresh data
export const dynamic = 'force-dynamic';

export default async function Home() {


    // Nav Items
    const navItems = [
        { name: "Home", link: "/" },
        { name: "About", link: "#about" },
        { name: "Projects", link: "#projects" },
        { name: "Experience", link: "#experience" },
        { name: "Contact", link: "#contact" }
    ];

    const data = await AllData();
    const { MOCK_GITHUB_STATS } = getMockData();

    return (
        <main className="min-h-screen bg-black text-white relative w-full overflow-hidden">
            <DotBackground />
            <FloatingNav navItems={navItems} />

            <SafeSection section="hero">
                <Hero />
            </SafeSection>

            <SafeSection section="about">
                <About />
            </SafeSection>

            <SafeSection section="skills">
                <SplineSkills />
            </SafeSection>

            <SafeSection section="projects">
                {/* Pass DB data to Projects component */}
                <Projects data={data.projects || data.MOCK_PROJECTS} />
            </SafeSection>

            <SafeSection section="experience">
                <Experience data={data.experience || data.MOCK_EXPERIENCE} />
            </SafeSection>

            <SafeSection section="github">
                <GitHubAnalysis data={MOCK_GITHUB_STATS} />
            </SafeSection>

            <SafeSection section="contact">
                <Contact />
            </SafeSection>
        </main>
    );
}
