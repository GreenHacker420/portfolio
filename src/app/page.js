
import { SafeSection } from '@/components/layout/SafeSection';
import { BackgroundPaths } from "@/components/ui/background-paths";
import About from '@/sections/About';
import Projects from '@/sections/Projects';
import Experience from '@/sections/Experience';
import Contact from '@/sections/Contact';
import GitHubAnalysis from '@/sections/GitHubAnalysis';
import { FloatingNav } from "@/components/ui/floating-navbar";
import { ParallaxStars, SplineSkills } from '@/components/DynamicWrapper';
import prisma from '@/lib/db';
import AllData from './AllData';
import { getMockData } from '@/lib/mockData';
import { getGithubStats } from '@/lib/github';


// Ensure dynamic rendering for fresh data
// Updated: Force clearing stale cache
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

    // Fetch real Github stats (fallback to mock)
    const githubStats = await getGithubStats("GreenHacker420") || MOCK_GITHUB_STATS;


    return (
        <main className="min-h-screen bg-black text-white w-full relative">
            <ParallaxStars />
            <FloatingNav navItems={navItems} />

            <section id="home">
                <BackgroundPaths title="Harsh Hirawat aka Green Hacker" />
            </section>

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
                <GitHubAnalysis data={githubStats} />
            </SafeSection>

            <SafeSection section="contact">
                <Contact />
            </SafeSection>
        </main>
    );
}
