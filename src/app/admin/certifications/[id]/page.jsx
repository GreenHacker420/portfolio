
import { getCertificationById } from "@/repositories/portfolio.repository";
import ProjectForm from "@/components/admin/ProjectForm";
import { notFound } from "next/navigation";

export default async function EditCertificationPage({ params }) {
    const { id } = await params;
    const cert = await getCertificationById(id);

    if (!cert) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Edit Certification</h1>
                <p className="text-zinc-400">Update certification details.</p>
            </div>

            <ProjectForm initialData={cert} type="certification" />
        </div>
    );
}
