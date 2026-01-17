import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body = await request.json();
    const { latex } = body;

    const response = await fetch('https://latexlite.com/v1/renders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.LATEX_API_KEY}`
        },
        body: JSON.stringify({
            template: latex,
            data: {
                name: "User"
            }
        })
    })

    let data = await response.json();
    console.log("LaTeX API response:", data);

    // If processing failed to start
    if (data.success === false) {
        return NextResponse.json({ error: 'Failed to initiate LaTeX rendering', details: data.error }, { status: 500 });
    }

    // If started, wait for success or failure
    while (data.data.status !== 'succeeded' && data.data.status !== 'failed') {
        await new Promise(r => setTimeout(r, 3000));

        const statusResponse = await fetch(`https://latexlite.com/v1/renders/${data.data.id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.LATEX_API_KEY}`
            }
        });
        data = await statusResponse.json();
        console.log("Status check response:", data.data.status, data.data.id, data);
    }

    // If succeeded, fetch and return the PDF
    if (data.data.status === 'succeeded') {
        const pdfResponse = await fetch(`https://latexlite.com/v1/renders/${data.data.id}/pdf`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.LATEX_API_KEY}`
            }
        })
        const pdfData = await pdfResponse.blob();
        console.log("PDF Blob:", pdfData);

        return new NextResponse(pdfData, {
            headers: {
                'Content-Type': 'application/pdf'
            }
        })
    }
    
    // If failed, return error
    else if (data.data.status === 'failed') {
        return NextResponse.json({ error: 'LaTeX rendering failed' }, { status: 500 });
    }


}