'use client';

export default function Stats() {
    return (
        <section className="w-full py-12 border-y border-neutral-800 bg-neutral-900/30">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                    <h4 className="text-4xl font-bold text-white mb-2">2+</h4>
                    <p className="text-neutral-400">Years Exp</p>
                </div>
                <div>
                    <h4 className="text-4xl font-bold text-white mb-2">10+</h4>
                    <p className="text-neutral-400">Projects</p>
                </div>
                <div>
                    <h4 className="text-4xl font-bold text-white mb-2">5+</h4>
                    <p className="text-neutral-400">Happy Clients</p>
                </div>
                <div>
                    <h4 className="text-4xl font-bold text-white mb-2">24/7</h4>
                    <p className="text-neutral-400">Support</p>
                </div>
            </div>
        </section>
    );
}
