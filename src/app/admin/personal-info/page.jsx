import { PersonalInfoForm } from "@/components/admin/forms/personal-info-form";
import { getPersonalInfo } from "@/actions/personal-info";

export default async function PersonalInfoPage() {
    const result = await getPersonalInfo();
    const info = result.success ? result.data : null;

    if (!info) {
        return <div className="text-red-500">Failed to load personal info</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">Personal Information</h1>
                <p className="text-zinc-500">Manage your primary identity details</p>
            </div>

            <PersonalInfoForm initialData={info} />
        </div>
    );
}
