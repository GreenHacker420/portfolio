import GsocEditor from "@/components/admin/gsoc/GsocEditor";

export default async function GsocEditorPage({ params }) {
    const { id } = await params;
    return <GsocEditor proposalId={id} />;
}
