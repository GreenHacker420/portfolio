import FAQForm from "@/components/admin/forms/faq-form";

export default function NewFAQPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Add FAQ</h1>
                <p className="text-zinc-400">Add a new frequently asked question.</p>
            </div>
            <FAQForm />
        </div>
    );
}
