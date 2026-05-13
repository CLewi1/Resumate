import { NextRequest, NextResponse } from "next/server";
import { getJobRepository } from "@/lib/db/jobs";
import { getResumeRepository } from "@/lib/db/resumes";
import { tailorResume } from "@/lib/tailor";

export async function POST(req: NextRequest) {
    const body = await req.json().catch(() => null);
    const { jobId } = body ?? {};

    if (typeof jobId !== "number" || !Number.isInteger(jobId) || jobId < 1) {
        return NextResponse.json({ error: "jobId is required and must be a positive integer" }, { status: 400 });
    }

    const jobRepo = getJobRepository();
    const job = jobRepo.getById(jobId);
    if (!job) {
        return NextResponse.json({ error: `Job ${jobId} not found` }, { status: 404 });
    }

    const resumeRepo = getResumeRepository();
    const master = resumeRepo.getMaster();
    if (!master) {
        return NextResponse.json(
            { error: "No master resume set. Designate a master resume before tailoring." },
            { status: 422 },
        );
    }

    let changes;
    try {
        changes = await tailorResume(master.latex, job.description);
    } catch {
        return NextResponse.json(
            { error: "AI tailoring failed. Check your ANTHROPIC_API_KEY and try again." },
            { status: 502 },
        );
    }

    const tailored = resumeRepo.save({
        name: `${job.title} at ${job.company}`,
        latex: master.latex,
        job_id: job.id,
    });

    return NextResponse.json({ resumeId: tailored.id, changes });
}
