import { NextRequest, NextResponse } from "next/server";
import { getResumeRepository } from "@/lib/db/resumes";

type Params = { params: Promise<{ id: string }> };

export async function POST(_req: NextRequest, { params }: Params) {
    const { id } = await params;
    const numId = Number(id);
    if (!Number.isInteger(numId) || numId <= 0) {
        return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const repo = getResumeRepository();
    if (!repo.getById(numId)) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    repo.setMaster(numId);
    return NextResponse.json({ success: true });
}
