import { notFound } from "next/navigation";
import Link from "next/link";
import { getJobRepository } from "@/lib/db/jobs";
import { getResumeRepository } from "@/lib/db/resumes";
import { TailorButton } from "./TailorButton";

type Props = { params: Promise<{ id: string }> };

export default async function JobDetailPage({ params }: Props) {
    const { id } = await params;
    const numericId = Number(id);
    if (!Number.isInteger(numericId) || numericId < 1) notFound();

    const repo = getJobRepository();
    const job = repo.getById(numericId);
    if (!job) notFound();

    const existingResume = getResumeRepository().getByJobId(numericId);

    return (
        <div className="max-w-3xl mx-auto py-8 space-y-6">
            <div className="space-y-1">
                <h1 className="text-2xl font-bold text-foreground">{job.title}</h1>
                <p className="text-lg text-muted-foreground">{job.company}</p>
            </div>

            <div className="flex gap-3">
                <Link
                    href={job.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 transition-colors"
                >
                    View on LinkedIn ↗
                </Link>
                <TailorButton jobId={numericId} existingResumeId={existingResume?.id} />
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Job Description
                </h2>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                    {job.description}
                </p>
            </div>
        </div>
    );
}
