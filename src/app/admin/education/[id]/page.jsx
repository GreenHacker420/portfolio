import EducationForm from "@/components/admin/forms/education-form";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";

export default async function EditEducationPage({ params }) {
    const { id } = await params;
    const education = await prisma.education.findUnique({
        where: { id },
    });

    if (!education) {
        notFound();
    }

    // Convert keys to be generic if needed or passed directly
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Edit Education</h1>
                <p className="text-zinc-400">Update your educational background.</p>
            </div>
            <EducationForm initialData={education} />
        </div>
    );
}
