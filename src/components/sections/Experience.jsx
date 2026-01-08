'use client';
import { motion } from 'framer-motion';

const experiences = [
    {
        title: "Full Stack Intern",
        company: "Tech Startups Inc.",
        period: "2023 - Present",
        desc: "Building scalable web applications using Next.js and Node.js."
    },
    {
        title: "Frontend Developer",
        company: "Freelance",
        period: "2022 - 2023",
        desc: "Created responsive websites and landing pages for local businesses."
    }
];

export default function Experience() {
    return (
        <section className="w-full py-20 bg-neutral-950">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-16 text-center">Work Experience</h2>

                <div className="relative border-l border-neutral-700 ml-4 md:ml-auto md:max-w-2xl space-y-12">
                    {experiences.map((exp, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="ml-6 relative"
                        >
                            <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-blue-500 border-4 border-neutral-950" />
                            <h3 className="text-xl font-bold text-white">{exp.title}</h3>
                            <p className="text-blue-400 font-medium mb-2">{exp.company} | {exp.period}</p>
                            <p className="text-neutral-400">{exp.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
