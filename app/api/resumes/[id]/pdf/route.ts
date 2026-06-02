import { NextRequest, NextResponse } from "next/server";
import { getResumeRepository } from "@/lib/db/resumes";
import { compilePdf } from "@/lib/compile-pdf";
import { cachePdf, getCachedPdf } from "@/lib/pdf-cache";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
    const { id } = await params;
    const numId = Number(id);
    if (!Number.isInteger(numId) || numId <= 0) {
        return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const cached = getCachedPdf(numId);
    if (cached) {
        return new NextResponse(cached, { headers: { "Content-Type": "application/pdf" } });
    }

    const resume = getResumeRepository().getById(numId);
    if (!resume) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    let blob: Blob;
    try {
        blob = await compilePdf(resume.latex);
    } catch (err) {
        const e = err as { status?: number; details?: string; message?: string };
        return NextResponse.json(
            { error: e.message ?? "PDF generation failed", details: e.details },
            { status: 502 },
        );
    }

    cachePdf(numId, Buffer.from(await blob.arrayBuffer()));
    return new NextResponse(blob, { headers: { "Content-Type": "application/pdf" } });
}
