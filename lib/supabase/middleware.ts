import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const PROTECTED_PATH_PREFIXES = ["/dashboard", "/jobs", "/saved", "/resumes"];

const isProtectedPath = (pathname: string) =>
    PROTECTED_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet, headers) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value),
                    );

                    supabaseResponse = NextResponse.next({
                        request,
                    });

                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options),
                    );

                    Object.entries(headers ?? {}).forEach(([key, value]) =>
                        supabaseResponse.headers.set(key, value),
                    );
                },
            },
        },
    );

    const { data } = await supabase.auth.getClaims();
    const user = data?.claims;

    if (!user && isProtectedPath(request.nextUrl.pathname)) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = "/";
        redirectUrl.searchParams.set("auth", "required");
        return NextResponse.redirect(redirectUrl);
    }

    return supabaseResponse;
}
