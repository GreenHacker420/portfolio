import { Timeline } from "@/components/ui/timeline";

export default function Experience({ data = [] }) {
    // Fallback data for dev
    const displayData = data.length > 0 ? data : [
        {
            company: "CommKraft",
            position: "Full Stack Dev",
            startDate: "2024-01-01",
            description: "Building scalable and maintainable web applications.",
            technologies: ["React", "Node.js", "PostgreSQL", "Prisma", "Tailwind CSS", "Next.js", "TypeScript", "Gemini",]
        },
        {
            company: "Webs Jyoti",
            position: "Frontend Developer Intern",
            startDate: "2025-06-01",
            endDate: "2025-07-31",
            description: "Built scalable APIs.",
            technologies: ["React", "Node.js", "PostgreSQL", "Prisma", "Tailwind CSS", "Next.js", "TypeScript", "Gemini",]
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

    // Helper for safe date parsing
    const getYear = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? '' : date.getFullYear();
    };

    const timelineData = displayData.map(item => {
        // Safe parsers for JSON fields
        let technologies = [];
        try {
            technologies = typeof item.technologies === 'string'
                ? JSON.parse(item.technologies)
                : item.technologies || [];
        } catch (e) {
            // Fallback if not valid JSON
            technologies = [item.technologies];
        }

        const startYear = getYear(item.startDate);
        const endYear = item.endDate ? getYear(item.endDate) : 'Present';

        return {
            title: item.company,
            content: (
                <div>
                    <h4 className="text-2xl font-bold text-white mb-2">{item.position}</h4>
                    <p className="text-neutral-400 text-sm mb-4">
                        {startYear} - {endYear}
                    </p>
                    <p className="text-neutral-300 mb-6 leading-relaxed">{item.description}</p>
                    <div className="flex flex-wrap gap-2">
                        {Array.isArray(technologies) && technologies.map((tech, i) => (
                            <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-xs text-neutral-300 border border-white/10">
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            )
        };
    });

    return (
        <section className="w-full bg-transparent py-20 relative z-10" id="experience">
            <Timeline data={timelineData} />
        </section>
    );
}
