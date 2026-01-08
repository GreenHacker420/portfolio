'use client';
import { motion } from 'framer-motion';

export default function About() {
    return (
        <section className="w-full py-20 bg-black">
            <div className="max-w-7xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-3xl mx-auto text-center"
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">About Me</h2>
                    <p className="text-neutral-300 text-lg md:text-xl leading-relaxed">
                        I am a passionate developer currently in my second year of studies.
                        I love building things for the web and exploring new technologies.
                        My journey involves deep dives into Next.js, React, and 3D web experiences.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
