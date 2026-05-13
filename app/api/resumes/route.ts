import { NextRequest, NextResponse } from "next/server";
import { getResumeRepository } from "@/lib/db/resumes";

export async function GET() {
    const repo = getResumeRepository();
    return NextResponse.json(repo.list());
}

export async function POST(req: NextRequest) {
    const body = await req.json().catch(() => null);
    const { name, latex, jobId } = body ?? {};

    if (
        !body ||
        typeof name !== "string" || !name.trim() ||
        typeof latex !== "string"
    ) {
        return NextResponse.json(
            { error: "name and latex are required" },
            { status: 400 },
        );
    }

    const repo = getResumeRepository();
    const resume = repo.save({
        name: name.trim(),
        latex,
        job_id: typeof jobId === "number" ? jobId : null,
    });
    return NextResponse.json(resume, { status: 201 });
}
