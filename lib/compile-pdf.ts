export async function compilePdf(latex: string): Promise<Blob> {
    const res = await fetch("https://texapi.ovh/api/latex/compile", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-API-KEY": process.env.TEXAPI_KEY ?? "",
        },
        body: JSON.stringify({ content: latex }),
    });

    if (!res.ok) {
        const text = await res.text();
        throw Object.assign(new Error(`LaTeX compilation failed (${res.status})`), {
            status: res.status,
            details: text.slice(0, 200),
        });
    }

    return res.blob();
}
