
import { FloatingNav } from "@/components/ui/floating-navbar";
import Footer from '@/sections/Footer';
import Education from '@/sections/Education';
import Certifications from '@/sections/Certifications';
import About from '@/sections/About';
import SplineSkills from '@/sections/SplineSkills';
import Projects from '@/sections/Projects';
import Experience from '@/sections/Experience';
import GitHubAnalysis from '@/sections/GitHubAnalysis';
import Contact from '@/sections/Contact';
import { BackgroundPaths } from "@/components/ui/background-paths";
import { getMockData } from "@/lib/mockData";
import { getGithubStats } from "@/services/github/github.service";
import ClientHydrator from "@/components/ClientHydrator";
import { ParallaxStars } from "@/components/DynamicWrapper";
import CanvasCursor from "@/components/ui/canvas-cursor";
import getData from "./dbfetch";

export default async function Home() {


    // Nav Items
    const navItems = [
        { name: "Home", link: "/" },
        { name: "About", link: "#about" },
        { name: "Projects", link: "#projects" },
        { name: "Experience", link: "#experience" },
        { name: "Contact", link: "#contact" }
    ];

    const fetchedData = await getData();
    const mockData = getMockData();
    const data = fetchedData || mockData;

    const { MOCK_GITHUB_STATS } = mockData;

    // Fetch real Github stats (fallback to mock)
    const githubStats = await getGithubStats(data.personalInfo?.githubUsername || "GreenHacker420") || MOCK_GITHUB_STATS;


    return (
        <main className="min-h-screen bg-black text-white w-full relative">
            <ClientHydrator
                projects={data.projects}
                experience={data.experience}
                skills={data.skills}
                personalInfo={data.personalInfo}
                socialLinks={data.socialLinks}
                githubStats={githubStats}
            />
            <CanvasCursor />
            <ParallaxStars />
            <FloatingNav navItems={navItems} />

            <section id="home">
                <BackgroundPaths title={data.personalInfo?.fullName || "Harsh Hirawat aka Green Hacker"} />
            </section>

            {/* About Section */}
            <section id="about">
                <About data={data.personalInfo} />
            </section>

            {/* Skills Section */}
            <section id="skills">
                <SplineSkills data={data.skills} />
            </section>

            {/* Projects Section */}
            <section id="projects">
                <Projects data={data.projects} />
            </section>

            {/* Experience Section */}
            <section id="experience">
                <Experience data={data.experience} />
            </section>

            {/* Education Section */}
            <section id="education">
                <Education data={data.education} />
            </section>

            {/* Certifications Section */}
            <section id="certifications">
                <Certifications data={data.certifications} />
            </section>

            {/* GitHub Analysis Section */}
            <section id="github">
                <GitHubAnalysis initialData={githubStats} />
            </section>

            {/* Contact Section */}
            <section id="contact">
                <Contact />
            </section>

            <Footer />
        </main>
    );
}
