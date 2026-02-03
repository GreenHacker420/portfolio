import ResumeEditor from '@/components/admin/resume/ResumeEditor';

export default async function ResumeEditorPage({ params }) {
    const { id } = await params;
    return <ResumeEditor resumeId={id} />;
}
