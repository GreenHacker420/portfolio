'use client';
import Spline from '@splinetool/react-spline';

export default function Skills() {
    return (
        <section className="w-full bg-black relative py-20">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-10 text-center">
                    My Tech Stack
                </h2>
                <div className="h-[600px] w-full bg-neutral-900/50 rounded-2xl overflow-hidden border border-white/10">
                    {/* Spline Keyboard Model */}
                    <Spline scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode" />
                </div>
            </div>
        </section>
    );
}
