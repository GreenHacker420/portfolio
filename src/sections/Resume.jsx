'use client';
import { Download } from 'lucide-react';

export default function Resume() {
    return (
        <section className="w-full py-16 bg-neutral-950 border-t border-neutral-900">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                    <h3 className="text-2xl font-bold text-white">Resume</h3>
                    <p className="text-neutral-400 mt-1">Check out my full professional background.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 rounded-lg bg-neutral-800 text-white hover:bg-neutral-700 transition-colors border border-neutral-700">
                    <Download className="w-4 h-4" />
                    <span>Download CV</span>
                </button>
            </div>
        </section>
    );
}
