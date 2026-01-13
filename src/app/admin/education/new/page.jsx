import EducationForm from "@/components/admin/forms/education-form";

export default function NewEducationPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Add Education</h1>
                <p className="text-zinc-400">Add a new educational background.</p>
            </div>
            <EducationForm />
        </div>
    );
}
