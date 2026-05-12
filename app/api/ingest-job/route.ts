import crypto from "crypto";
import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";

type IncomingJob = {
    source_id?: string;
    sourceId?: string;
    title?: string;
    description?: string;
    company?: string;
    location?: string;
    salary?: string;
    posted_at?: string;
    postedAt?: string;
    apply_url?: string;
    applyUrl?: string;
    linkedin_url?: string;
    linkedinUrl?: string;
    image_url?: string;
    imageUrl?: string;
    raw?: Record<string, unknown>;
};

export async function POST(request: Request) {
    const token = request.headers.get("x-extension-key")?.trim();
    if (!token) {
        return NextResponse.json(
            { error: "Missing extension key" },
            { status: 401 },
        );
    }

    const admin = createAdminClient();
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const { data: keyRow, error: keyError } = await admin
        .from("extension_keys")
        .select("id, user_id")
        .eq("token_hash", tokenHash)
        .is("revoked_at", null)
        .single();

    if (keyError || !keyRow) {
        return NextResponse.json(
            { error: "Invalid extension key" },
            { status: 401 },
        );
    }

    const body = (await request.json().catch(() => null)) as IncomingJob | null;
    if (!body) {
        return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const sourceId = body.source_id ?? body.sourceId;
    if (!sourceId) {
        return NextResponse.json(
            { error: "Missing source_id" },
            { status: 400 },
        );
    }

    const postedAt = body.posted_at ?? body.postedAt ?? null;
    const applyUrl = body.apply_url ?? body.applyUrl ?? null;
    const linkedinUrl = body.linkedin_url ?? body.linkedinUrl ?? null;
    const imageUrl = body.image_url ?? body.imageUrl ?? null;

    const jobInsert = {
        source_id: sourceId,
        title: body.title ?? null,
        description: body.description ?? null,
        company: body.company ?? null,
        location: body.location ?? null,
        salary: body.salary ?? null,
        posted_at: postedAt,
        apply_url: applyUrl,
        linkedin_url: linkedinUrl,
        image_url: imageUrl,
        raw: body.raw ?? body,
    };

    const { data: existingJob, error: lookupError } = await admin
        .from("jobs")
        .select("id")
        .eq("source_id", sourceId)
        .maybeSingle();

    if (lookupError) {
        return NextResponse.json(
            { error: "Failed to lookup job" },
            { status: 500 },
        );
    }

    let jobId = existingJob?.id ?? null;

    if (!jobId) {
        const { data: insertedJob, error: insertError } = await admin
            .from("jobs")
            .insert(jobInsert)
            .select("id")
            .single();

        if (insertError || !insertedJob) {
            return NextResponse.json(
                { error: "Failed to insert job" },
                { status: 500 },
            );
        }

        jobId = insertedJob.id;
    }

    const { error: submissionError } = await admin
        .from("job_submissions")
        .upsert(
            {
                user_id: keyRow.user_id,
                job_id: jobId,
            },
            { onConflict: "user_id,job_id" },
        );

    if (submissionError) {
        return NextResponse.json(
            { error: "Failed to track submission" },
            { status: 500 },
        );
    }

    await admin
        .from("extension_keys")
        .update({ last_used_at: new Date().toISOString() })
        .eq("id", keyRow.id);

    return NextResponse.json({ job_id: jobId });
}
