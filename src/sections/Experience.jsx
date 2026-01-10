import { Timeline } from "@/components/ui/timeline";

export default function Experience({ data = [] }) {
    // Fallback data for dev
    const displayData = data.length > 0 ? data : [
        {
            company: "Tech Corp",
            position: "Senior Dev",
            startDate: "2024-01-01",
            description: "Leading frontend teams.",
            technologies: ["React", "Three.js"]
        },
        {
            company: "Startup Inc",
            position: "Full Stack Eng",
            startDate: "2022-01-01",
            endDate: "2023-12-31",
            description: "Built scalable APIs.",
            technologies: ["Node.js", "PostgreSQL"]
        },
        {
            company: "Freelance",
            position: "Web Designer",
            startDate: "2020-01-01",
            endDate: "2021-12-31",
            description: "Created award winning sites.",
            technologies: ["Figma", "Webflow"]
        }
    ];

    return (
        <section className="w-full bg-transparent py-20 relative z-10" id="experience">
            <Timeline data={displayData} />
        </section>
    );
}
