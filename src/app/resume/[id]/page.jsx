import prisma from "@/lib/db";
import ReactMarkdown from "react-markdown";

export const revalidate = 0;

async function getResume(id) {
    return prisma.resume.findUnique({ where: { id } });
}

export default async function ResumePublicPage({ params }) {
    const { id } = params;
    const resume = await getResume(id);
    if (!resume) return <div className="min-h-screen flex items-center justify-center text-white">Resume not found</div>;

    return (
        <main className="min-h-screen bg-black text-white py-16 px-6">
            <div className="max-w-4xl mx-auto space-y-6">
                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">{resume.title}</h1>
                        <p className="text-zinc-500 text-sm">Public resume view</p>
                    </div>
                    <a
                        className="px-4 py-2 rounded-lg bg-emerald-500 text-black font-semibold"
                        href={`/api/resumes/${id}/pdf`}
                    >
                        Download PDF
                    </a>
                </header>
                <div className="prose prose-invert bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 whitespace-pre-wrap">
                    <ReactMarkdown>{`\`\`\`\n${resume.latex}\n\`\`\``}</ReactMarkdown>
                </div>
            </div>
        </main>
    );
}
