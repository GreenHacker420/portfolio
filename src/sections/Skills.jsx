'use client';
import SplineSkills from "./SplineSkills";

export default function Skills({ data = [] }) {
    if (!data || data.length === 0) {
        return (
            <section id="skills" className="py-20 w-full bg-black">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="h-12 w-64 bg-white/5 animate-pulse rounded-lg mx-auto mb-12" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-40 bg-white/5 animate-pulse rounded-2xl" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="w-full bg-transparent relative py-20" id="skills">
            <div className="max-w-7xl mx-auto px-4 z-10 relative pointer-events-none">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 text-center">
                    Skills & Expertise
                </h2>
                <p className="text-neutral-400 max-w-lg mx-auto text-center mb-8">
                    Interact with the keyboard below to explore my technical skills.
                </p>
            </div>

            <div className="w-full h-screen absolute top-0 left-0">
                <SplineSkills data={data} />
            </div>

            {/* Spacer to make sure content below is pushed down if needed, or just let h-screen take over */}
            <div className="h-[60vh]"></div>
        </section>
    );
}
