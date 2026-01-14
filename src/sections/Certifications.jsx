"use client";
import React from "react";
import { Award, ExternalLink } from "lucide-react";

const certifications = [
    {
        name: "AWS Certified Solutions Architect",
        issuer: "Amazon Web Services",
        date: "2024",
        link: "#",
        color: "bg-orange-500/10 text-orange-400 border-orange-500/20"
    },
    {
        name: "Meta Frontend Developer",
        issuer: "Coursera",
        date: "2023",
        link: "#",
        color: "bg-blue-500/10 text-blue-400 border-blue-500/20"
    }
    // Add more
];

export default function Certifications() {
    return (
        <section className="py-20 bg-black relative z-10" id="certifications">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="mb-16">
                    <span className="text-neon-green font-mono text-sm tracking-widest mb-2 block">05. CREDENTIALS</span>
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Certifications</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certifications.map((cert, idx) => (
                        <div key={idx} className="group relative bg-neutral-900/40 border border-white/5 rounded-2xl p-6 hover:bg-neutral-900/60 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl ${cert.color} border`}>
                                    <Award className="w-6 h-6" />
                                </div>
                                <a href={cert.link} className="opacity-0 group-hover:opacity-100 transition-opacity text-neutral-400 hover:text-white">
                                    <ExternalLink className="w-5 h-5" />
                                </a>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-neon-green transition-colors">
                                {cert.name}
                            </h3>
                            <p className="text-neutral-400 text-sm mb-4">{cert.issuer}</p>
                            <span className="text-xs font-mono text-neutral-600 bg-white/5 px-2 py-1 rounded">
                                Issued: {cert.date}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
