'use client';
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";

export default function Projects({ data = [] }) {
    return (
        <section className="w-full bg-transparent py-20" id="projects">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-10 text-center">
                    Featured Projects
                </h2>
                <BentoGrid className="max-w-4xl mx-auto">
                    {data.map((item, i) => (
                        <BentoGridItem
                            key={i}
                            title={item.title}
                            description={item.description}
                            // header={item.imageUrl && <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100"><img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover rounded-xl" /></div>}
                            // icon={item.technologies && <div className="flex gap-2">{item.technologies.slice(0,3).map(t => <span key={t} className="text-xs bg-gray-800 px-2 py-1 rounded">{t}</span>)}</div>}
                            header={
                                <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-800"></div>
                            }
                            className={i === 3 || i === 6 ? "md:col-span-2" : ""}
                        />
                    ))}
                </BentoGrid>
            </div>
        </section>
    );
}
