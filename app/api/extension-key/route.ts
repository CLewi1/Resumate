import crypto from "crypto";
import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
    const supabase = await createClient();
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const admin = createAdminClient();

    await admin
        .from("extension_keys")
        .update({ revoked_at: new Date().toISOString() })
        .eq("user_id", user.id)
        .is("revoked_at", null);

    const { error: insertError } = await admin.from("extension_keys").insert({
        user_id: user.id,
        token_hash: tokenHash,
    });

    if (insertError) {
        return NextResponse.json(
            { error: "Failed to create extension key" },
            { status: 500 },
        );
    }

    return NextResponse.json({ token });
}
