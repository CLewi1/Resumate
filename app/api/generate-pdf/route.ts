import { NextResponse } from "next/server";
import { compilePdf } from "@/lib/compile-pdf";

export async function POST(request: Request) {
    const { latex } = await request.json();

    let blob: Blob;
    try {
        blob = await compilePdf(latex as string);
    } catch (err) {
        const e = err as { status?: number; details?: string; message?: string };
        console.error("texapi error:", e.message, e.details);
        return NextResponse.json(
            { error: e.message ?? "LaTeX rendering failed", details: e.details },
            { status: 502 },
        );
    }

    return new NextResponse(blob, { headers: { "Content-Type": "application/pdf" } });
}
