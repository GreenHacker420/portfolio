'use client';
import { motion } from "framer-motion";

export default function Experience({ data = [] }) {
    return (
        <section className="w-full bg-transparent py-20" id="experience">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-10 text-center">
                    Work Experience
                </h2>

                <div className="max-w-4xl mx-auto space-y-8">
                    {data.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-neutral-900/50 border border-white/10 p-8 rounded-2xl hover:bg-neutral-900/80 transition-colors"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-neon-green">{item.position}</h3>
                                    <p className="text-xl text-white">{item.company}</p>
                                </div>
                                <div className="text-neutral-400 mt-2 md:mt-0 font-mono">
                                    {new Date(item.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })} - {item.endDate ? new Date(item.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : 'Present'}
                                </div>
                            </div>

                            <p className="text-neutral-300 mb-6 leading-relaxed">
                                {item.description}
                            </p>

                            {item.achievements && (
                                <ul className="list-disc list-inside text-neutral-400 space-y-2 mb-6">
                                    {item.achievements.map((ach, j) => (
                                        <li key={j}>{ach}</li>
                                    ))}
                                </ul>
                            )}

                            <div className="flex flex-wrap gap-2">
                                {item.technologies && item.technologies.map(tech => (
                                    <span key={tech} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-neutral-300">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
