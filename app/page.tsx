"use client";

import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"


export default function Home() {

    const [latex, setLatex] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);


    async function handleLatexSubmit() {
        setIsLoading(true);

        // Call internal API with LaTeX content
        const response = await fetch('/api/generate-pdf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ latex })
        })

        // Finished loading
        setIsLoading(false);

        if (response.ok) {
            // If successful, get pdf blob
            const data = await response.blob();
            console.log("Recieved PDF Blob:", data);

            //Create URL
            setPdfUrl(URL.createObjectURL(data));
            
        } else {
            const errorData = await response.json();
            console.error("Error", errorData);
        }
    }



    return (
        <div className="screen bg-zinc-50 font-sans dark:bg-black">
                <ResizablePanelGroup orientation="horizontal" className="h-screen w-full bg-gray-700">
                    <ResizablePanel>
                        <h1 className="text-white">Random text</h1>
                        <Textarea 
                            className="text-white w-full h-100" 
                            placeholder="Type your message here." 
                            value={latex}
                            onChange={(e) => setLatex(e.target.value)}
                        />
                        <Button 
                            className="mt-4" 
                            onClick={handleLatexSubmit}
                            disabled={isLoading}>
                                {isLoading ? 'Generating PDF...' : 'Submit'}
                        </Button>
                    </ResizablePanel>

                    <ResizableHandle withHandle={true} />
                    
                    <ResizablePanel>
                        <iframe src={pdfUrl ?? undefined} className="ml-4 w-full h-full" />
                    </ResizablePanel>
                </ResizablePanelGroup>
                

        </div>
    );
}
