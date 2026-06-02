import ReviewPageClient from "./ReviewPageClient";

export default async function ReviewPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const pdfEnabled = Boolean(process.env.TEXAPI_KEY);
    return <ReviewPageClient id={id} pdfEnabled={pdfEnabled} />;
}
