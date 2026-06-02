import { NextRequest, NextResponse } from "next/server";
import { getResumeRepository } from "@/lib/db/resumes";
import { invalidatePdf } from "@/lib/pdf-cache";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
    const { id } = await params;
    const numId = Number(id);
    if (!Number.isInteger(numId) || numId <= 0) {
        return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const repo = getResumeRepository();
    const resume = repo.getById(numId);
    if (!resume) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(resume);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
    const { id } = await params;
    const numId = Number(id);
    if (!Number.isInteger(numId) || numId <= 0) {
        return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const repo = getResumeRepository();
    const resume = repo.getById(numId);
    if (!resume) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (resume.is_master === 1) {
        return NextResponse.json({ error: "Cannot delete the master resume" }, { status: 409 });
    }
    repo.delete(numId);
    invalidatePdf(numId);
    return new NextResponse(null, { status: 204 });
}

export async function PUT(req: NextRequest, { params }: Params) {
    const { id } = await params;
    const numId = Number(id);
    if (!Number.isInteger(numId) || numId <= 0) {
        return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const body = await req.json().catch(() => null);
    if (!body) {
        return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }

    const changes: { name?: string; latex?: string } = {};
    if (typeof body.name === "string") changes.name = body.name.trim();
    if (typeof body.latex === "string") changes.latex = body.latex;

    const repo = getResumeRepository();
    const existing = repo.getById(numId);
    if (!existing) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const updated = repo.update(numId, changes);
    if (!updated) {
        return NextResponse.json({ error: "Not found" }, { status: 500 });
    }
    if (changes.latex !== undefined && changes.latex !== existing.latex) {
        invalidatePdf(numId);
    }
    return NextResponse.json(updated);
}
