import ResumeEditorClient from "./ResumeEditorClient";

export default async function ResumePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const pdfEnabled = Boolean(process.env.TEXAPI_KEY);
    return <ResumeEditorClient id={id} pdfEnabled={pdfEnabled} />;
}
