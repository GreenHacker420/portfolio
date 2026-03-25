
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
import { getGithubStats } from "@/services/github/github.service";
import ClientHydrator from "@/components/ClientHydrator";
import { ParallaxStars } from "@/components/DynamicWrapper";
import CanvasCursor from "@/components/ui/canvas-cursor";
import { getPortfolioDataWithFallback } from "@/lib/getPortfolioDataWithFallback";
import { NAV_ITEMS, APP_CONFIG } from "@/config/constants";

export default async function Home() {
    const data = await getPortfolioDataWithFallback();

    // Fetch real Github stats (fallback handled in service/mapper)
    const githubStats = await getGithubStats(data.personalInfo?.githubUsername || APP_CONFIG.githubUsername);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": data.personalInfo?.fullName || APP_CONFIG.name,
        "url": APP_CONFIG.url,
        "sameAs": [
            data.socialLinks?.find(l => l.platform === 'github')?.url || `https://github.com/${APP_CONFIG.githubUsername}`,
            data.socialLinks?.find(l => l.platform === 'linkedin')?.url || "",
        ],
        "jobTitle": data.personalInfo?.title || "Creative Developer",
        "worksFor": {
            "@type": "Organization",
            "name": "Freelance"
        },
        "description": data.personalInfo?.bio || APP_CONFIG.description
    };


    return (
        <main className="min-h-screen bg-black text-white w-full relative">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ClientHydrator data={data} githubStats={githubStats} />
            <CanvasCursor />
            <ParallaxStars />
            <FloatingNav navItems={NAV_ITEMS} />

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
