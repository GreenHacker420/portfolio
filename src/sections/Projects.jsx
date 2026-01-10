'use client';
import { FocusCards } from "@/components/ui/focus-cards";

export default function Projects({ data = [] }) {
    // Transform data to match FocusCards format if needed
    // Assuming data passed in has { title, imageUrl, ... }
    const projectCards = (data.length > 0 ? data : [
        { title: "Project Alpha", imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=3870&auto=format&fit=crop" },
        { title: "Project Beta", imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop" },
        { title: "Project Gamma", imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=3870&auto=format&fit=crop" },
        { title: "Project Delta", imageUrl: "https://images.unsplash.com/photo-1661956602116-aa6865609028?q=80&w=2664&auto=format&fit=crop" }
    ]).map(project => ({
        title: project.title,
        src: (project.imageUrl && !project.imageUrl.startsWith('/projects/')) ? project.imageUrl : "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
        // Add link if available
        id: project.id
    }));

    return (
        <section className="w-full bg-transparent py-20 relative z-10" id="projects">
            <div className="container mx-auto px-4 mb-12 text-center">
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Featured Projects</h2>
                <p className="text-neutral-400 max-w-2xl mx-auto text-lg">
                    Discover a collection of digital experiences crafted with precision.
                </p>
            </div>
            <FocusCards cards={projectCards} />
        </section>
    );
}
