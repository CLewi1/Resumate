import { redirect } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

export default async function JobDetailPage({ params }: Props) {
    const { id } = await params;
    redirect(`/jobs?selected=${encodeURIComponent(id)}`);
}
