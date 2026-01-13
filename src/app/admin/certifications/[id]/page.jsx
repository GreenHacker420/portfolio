import CertificationForm from "@/components/admin/forms/certification-form";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";

export default async function EditCertificationPage({ params }) {
    const { id } = await params;
    const certification = await prisma.certification.findUnique({
        where: { id },
    });

    if (!certification) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Edit Certification</h1>
                <p className="text-zinc-400">Update your certification.</p>
            </div>
            <CertificationForm initialData={certification} />
        </div>
    );
}
