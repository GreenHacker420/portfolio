import CertificationForm from "@/components/admin/forms/certification-form";

export default function NewCertificationPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Add Certification</h1>
                <p className="text-zinc-400">Add a new certification.</p>
            </div>
            <CertificationForm />
        </div>
    );
}
