import { getMedia } from "@/actions/media";
import MediaGrid from "@/components/admin/media-grid";

export const dynamic = 'force-dynamic';

export default async function MediaPage() {
    const data = await getMedia();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Media Library</h1>
                <p className="text-zinc-400">Manage your images and assets.</p>
            </div>
            <MediaGrid initialData={data} />
        </div>
    );
}
