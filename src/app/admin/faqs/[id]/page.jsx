import FAQForm from "@/components/admin/forms/faq-form";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";

export default async function EditFAQPage({ params }) {
    const { id } = await params;
    const faq = await prisma.fAQ.findUnique({
        where: { id },
    });

    if (!faq) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Edit FAQ</h1>
                <p className="text-zinc-400">Update your FAQ.</p>
            </div>
            <FAQForm initialData={faq} />
        </div>
    );
}
