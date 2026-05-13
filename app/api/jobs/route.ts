import { NextRequest, NextResponse } from "next/server";
import { getJobRepository } from "@/lib/db/jobs";

export async function POST(req: NextRequest) {
    const body = await req.json().catch(() => null);
    if (
        !body ||
        typeof body.title !== "string" ||
        typeof body.company !== "string" ||
        typeof body.description !== "string" ||
        typeof body.linkedinUrl !== "string"
    ) {
        return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const repo = await getJobRepository();
    const job = repo.insert({
        title: body.title,
        company: body.company,
        description: body.description,
        linkedin_url: body.linkedinUrl,
    });

    if (!job) {
        // INSERT OR IGNORE hit a dupe — return the existing job
        const existing = repo.search(body.linkedinUrl).find(
            (j) => j.linkedin_url === body.linkedinUrl,
        );
        return NextResponse.json(
            { job: existing ?? null, duplicate: true },
            { status: 200 },
        );
    }

    return NextResponse.json({ job, duplicate: false }, { status: 201 });
}
