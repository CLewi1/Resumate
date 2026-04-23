import { createClient } from "@/lib/supabase/server";
import { type Provider } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const SUPPORTED_PROVIDERS: Provider[] = ["github", "google"];

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const provider = requestUrl.searchParams.get("provider");

    if (!provider || !SUPPORTED_PROVIDERS.includes(provider as Provider)) {
        const invalidProviderUrl = new URL("/", requestUrl.origin);
        invalidProviderUrl.searchParams.set("auth", "invalid-provider");
        return NextResponse.redirect(invalidProviderUrl);
    }

    const supabase = await createClient();
    const callbackUrl = new URL("/auth/callback", requestUrl.origin);

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider as Provider,
        options: {
            redirectTo: callbackUrl.toString(),
        },
    });

    if (error || !data.url) {
        const oauthStartErrorUrl = new URL("/", requestUrl.origin);
        oauthStartErrorUrl.searchParams.set("auth", "oauth-start-failed");
        return NextResponse.redirect(oauthStartErrorUrl);
    }

    return NextResponse.redirect(data.url);
}
