import { NextRequest, NextResponse } from "next/server";
import { getResumeRepository } from "@/lib/db/resumes";
import type { Change } from "@/lib/tailor";

type Params = { params: Promise<{ id: string }> };

function isChangeArray(value: unknown): value is Change[] {
    if (!Array.isArray(value)) return false;
    return value.every(
        (c) =>
            typeof c === "object" &&
            c !== null &&
            typeof (c as Record<string, unknown>).section === "string" &&
            typeof (c as Record<string, unknown>).old === "string" &&
            typeof (c as Record<string, unknown>).new === "string",
    );
}

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

    let latex = resume.latex;
    for (const change of body.accepted) {
        latex = latex.replace(change.old, change.new);
    }

    const updated = repo.update(numId, { latex });
    return NextResponse.json(updated);
}
