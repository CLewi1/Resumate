import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { latex } = await request.json();

    const response = await fetch("https://texapi.ovh/api/latex/compile", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-API-KEY": process.env.TEXAPI_KEY ?? "",
        },
        body: JSON.stringify({ content: latex }),
    });

    if (!response.ok) {
        const text = await response.text();
        console.error("texapi error:", response.status, text.slice(0, 500));
        return NextResponse.json(
            {
                error: `LaTeX rendering failed (${response.status})`,
                details: text.slice(0, 200),
            },
            { status: 502 },
        );
    }

    const pdf = await response.blob();
    return new NextResponse(pdf, {
        headers: { "Content-Type": "application/pdf" },
    });
}
