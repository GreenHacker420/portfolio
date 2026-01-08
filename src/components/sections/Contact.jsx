'use client';

export default function Contact() {
    return (
        <section className="w-full py-20 bg-black">
            <div className="max-w-3xl mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">Get In Touch</h2>
                <p className="text-neutral-400 mb-8">
                    Have a project in mind or want to collaborate? I'd love to hear from you.
                </p>
                <a
                    href="mailto:contact@example.com"
                    className="inline-block px-8 py-3 rounded-full bg-white text-black font-bold hover:bg-neutral-200 transition-colors"
                >
                    Say Hello
                </a>
            </div>
        </section>
    );
}
