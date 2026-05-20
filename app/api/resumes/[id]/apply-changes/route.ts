import { NextRequest, NextResponse } from "next/server";
import { getResumeRepository } from "@/lib/db/resumes";
import { isChangeArray } from "@/lib/change";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
    const { id } = await params;
    const numId = Number(id);
    if (!Number.isInteger(numId) || numId <= 0) {
        return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const body = await req.json().catch(() => null);
    if (!body || !isChangeArray(body.accepted)) {
        return NextResponse.json(
            { error: "accepted must be an array of Change objects" },
            { status: 400 },
        );
    }

    const repo = getResumeRepository();
    const resume = repo.getById(numId);
    if (!resume) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (resume.is_master) {
        return NextResponse.json({ error: "Cannot apply changes to master resume" }, { status: 403 });
    }

    let latex = resume.latex;
    for (const change of body.accepted) {
        latex = latex.replaceAll(change.old, change.new);
    }

    const updated = repo.update(numId, { latex });
    if (!updated) {
        return NextResponse.json({ error: "Failed to save changes" }, { status: 500 });
    }
    return NextResponse.json(updated);
}
