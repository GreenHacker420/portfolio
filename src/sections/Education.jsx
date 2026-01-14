"use client";
import { Timeline } from "@/components/ui/timeline";

export default function Education({ data = [] }) {
    // Helper for safe date parsing
    const getYear = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? '' : date.getFullYear();
    };

    const educationData = (data.length > 0 ? data : [
        {
            institution: "Newton School of Technology",
            degree: "B.Tech in CS & AI",
            startDate: "2024-01-01",
            endDate: "2028-05-01",
            description: "Targeting AI & ML specialization."
        }
    ]).map(item => {
        const startYear = getYear(item.startDate);
        const endYear = item.endDate ? getYear(item.endDate) : 'Present';

        return {
            title: item.institution,
            content: (
                <div>
                    <h4 className="text-2xl font-bold text-white mb-2">{item.degree} {item.fieldOfStudy ? `- ${item.fieldOfStudy}` : ''}</h4>
                    <p className="text-neutral-400 text-sm mb-4">{startYear} - {endYear}</p>
                    {item.gpa && <p className="text-neutral-500 text-xs mb-2 font-mono">GPA: {item.gpa}</p>}
                    <p className="text-neutral-300">
                        {item.description}
                    </p>
                </div>
            )
        };
    });

    return (
        <section className="w-full bg-black py-20 relative z-10" id="education">
            <div className="max-w-7xl mx-auto px-4 md:px-8 mb-10">
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Education</h2>
            </div>
            <Timeline data={educationData} />
        </section>
    );
}
