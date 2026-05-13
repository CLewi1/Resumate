import { NextRequest, NextResponse } from "next/server";
import { getJobRepository } from "@/lib/db/jobs";

const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

export function OPTIONS() {
    return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(req: NextRequest) {
    const body = await req.json().catch(() => null);
    const { title, company, description, linkedinUrl } = body ?? {};

    if (
        !body ||
        typeof title !== "string" || !title.trim() ||
        typeof company !== "string" || !company.trim() ||
        typeof description !== "string" || !description.trim() ||
        typeof linkedinUrl !== "string" || !linkedinUrl.trim()
    ) {
        return NextResponse.json(
            { error: "title, company, description, and linkedinUrl are required" },
            { status: 400, headers: CORS_HEADERS },
        );
    }

    const repo = getJobRepository();
    const job = repo.insert({ title, company, description, linkedin_url: linkedinUrl });

    if (!job) {
        const existing = repo.getByLinkedinUrl(linkedinUrl);
        return NextResponse.json(
            { id: existing!.id, url: `/jobs/${existing!.id}`, duplicate: true },
            { status: 200, headers: CORS_HEADERS },
        );
    }

    return NextResponse.json(
        { id: job.id, url: `/jobs/${job.id}`, duplicate: false },
        { status: 201, headers: CORS_HEADERS },
    );
}
