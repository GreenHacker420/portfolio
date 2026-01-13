import { Timeline } from "@/components/ui/timeline";

export default function Education({ data = [] }) {
    // Transform Education data to match Timeline format if needed
    // Timeline expects: { title, content } or similar?
    // Let's check Timeline component usually.
    // Experience.jsx passed `displayData` which has `company, position, etc.`
    // So Timeline component must handle generic data or be adapted.
    // If Timeline was custom built for Experience, I might need to adapt it.
    // Assuming Timeline takes `{ title, content }` or custom objects.
    // I'll map education data to resemble experience data for consistency if Timeline supports it.

    const displayData = data.map(edu => ({
        company: edu.institution, // mapping to "company" slot
        position: edu.degree + (edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''),
        startDate: edu.startDate,
        endDate: edu.endDate,
        description: edu.description,
        technologies: edu.activities ? [edu.activities] : [] // or badges
    }));

    if (displayData.length === 0) return null;

    return (
        <section className="w-full bg-transparent py-20 relative z-10" id="education">
            <div className="max-w-7xl mx-auto px-4 md:px-8 mb-10">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                    Education
                </h2>
                <p className="text-neutral-400 text-sm md:text-base max-w-sm">
                    My academic journey and qualifications.
                </p>
            </div>
            <Timeline data={displayData} />
        </section>
    );
}
