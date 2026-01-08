'use client';
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { projects } from "@/data";

export default function Projects() {
    return (
        <section className="w-full bg-black py-20">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-10 text-center">
                    Featured Projects
                </h2>
                <BentoGrid className="max-w-4xl mx-auto">
                    {projects.map((item, i) => (
                        <BentoGridItem
                            key={i}
                            title={item.title}
                            description={item.description}
                            header={item.header}
                            icon={item.icon}
                            className={i === 3 || i === 6 ? "md:col-span-2" : ""}
                        />
                    ))}
                </BentoGrid>
            </div>
        </section>
    );
}
