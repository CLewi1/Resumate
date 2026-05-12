// scripts/create-system-key.ts
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const systemEmail = process.env.SYSTEM_EMAIL!;

const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
    // create or fetch system user
    const { data: existing } = await supabase.auth.admin.listUsers();
    const user = existing.users.find((u) => u.email === systemEmail);

    const userId =
        user?.id ??
        (
            await supabase.auth.admin.createUser({
                email: systemEmail,
                email_confirm: true,
            })
        ).data.user?.id;

    if (!userId) throw new Error("Could not create or find system user.");

    // revoke old keys
    await supabase
        .from("extension_keys")
        .update({ revoked_at: new Date().toISOString() })
        .eq("user_id", userId)
        .is("revoked_at", null);

    // create new key
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const { error } = await supabase.from("extension_keys").insert({
        user_id: userId,
        token_hash: tokenHash,
    });

    if (error) throw error;

    console.log("SYSTEM_USER_ID:", userId);
    console.log("EXTENSION_KEY:", token);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
