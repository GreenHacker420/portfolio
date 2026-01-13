import { HoverEffect } from "@/components/ui/card-hover-effect";

export default function Certifications({ data = [] }) {

    if (!data || data.length === 0) return null;

    const items = data.map(cert => ({
        title: cert.name,
        description: `${cert.issuer} • Issued: ${new Date(cert.issueDate).toLocaleDateString()}`,
        link: cert.credentialUrl || "#"
    }));

    return (
        <section className="w-full bg-transparent py-20 relative z-10" id="certifications">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-10">
                    Certifications
                </h2>
                <HoverEffect items={items} />
            </div>
        </section>
    );
}
