
import { getFAQById } from "@/repositories/portfolio.repository";
import ProjectForm from "@/components/admin/ProjectForm";
import { notFound } from "next/navigation";

export default async function EditFAQPage({ params }) {
    const { id } = await params;
    const faq = await getFAQById(id);

    if (!faq) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Edit FAQ</h1>
                <p className="text-zinc-400">Update FAQ details.</p>
            </div>

            <ProjectForm initialData={faq} type="faq" />
        </div>
    );
}
