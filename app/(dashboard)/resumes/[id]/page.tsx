"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { use, useCallback, useEffect, useRef, useState } from "react";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Star } from "lucide-react";
import type { Resume } from "@/lib/db/resumes";

export default function ResumeEditor({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const numId = Number(id);

    const [resume, setResume] = useState<Resume | null>(null);
    const [latex, setLatex] = useState("");
    const [loadError, setLoadError] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");

    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        fetch(`/api/resumes/${numId}`)
            .then((r) => (r.ok ? r.json() : Promise.reject()))
            .then((data: Resume) => {
                setResume(data);
                setLatex(data.latex);
            })
            .catch(() => setLoadError(true));
    }, [numId]);

    const save = useCallback(
        async (newLatex: string) => {
            setSaveStatus("saving");
            const res = await fetch(`/api/resumes/${numId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ latex: newLatex }),
            });
            if (res.ok) {
                const updated: Resume = await res.json();
                setResume(updated);
                setSaveStatus("saved");
            }
        },
        [numId],
    );

    function handleLatexChange(value: string) {
        setLatex(value);
        setSaveStatus("unsaved");
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => save(value), 800);
    }

    async function handleSetMaster() {
        await fetch(`/api/resumes/${numId}/master`, { method: "POST" });
        setResume((prev) => prev ? { ...prev, is_master: 1 } : prev);
    }

    async function handleGeneratePdf() {
        setIsGenerating(true);
        const res = await fetch("/api/generate-pdf", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ latex }),
        });
        setIsGenerating(false);
        if (res.ok) {
            const blob = await res.blob();
            if (pdfUrl) URL.revokeObjectURL(pdfUrl);
            setPdfUrl(URL.createObjectURL(blob));
        }
    }

    useEffect(() => {
        return () => {
            if (pdfUrl) URL.revokeObjectURL(pdfUrl);
        };
    }, [pdfUrl]);

    useEffect(() => {
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, []);

    if (loadError) {
        return (
            <div className="p-6 text-sm text-slate-500">
                Resume not found.
            </div>
        );
    }

    if (!resume) {
        return (
            <div className="p-6 text-sm text-slate-500">Loading…</div>
        );
    }

    const isMaster = resume.is_master === 1;

    return (
        <div className="h-screen bg-black font-sans">
            <ResizablePanelGroup
                orientation="horizontal"
                className="h-screen w-full"
            >
                <ResizablePanel defaultSize={50}>
                    <div className="flex flex-col h-full p-4 gap-3">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 min-w-0">
                                <span className="text-white font-medium text-sm truncate">
                                    {resume.name}
                                </span>
                                {isMaster && (
                                    <span className="flex items-center gap-1 text-xs text-violet-400 bg-violet-500/10 border border-violet-500/30 rounded-full px-2 py-0.5 shrink-0">
                                        <Star size={10} fill="currentColor" />
                                        Master
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <span className="text-xs text-slate-500">
                                    {saveStatus === "saving"
                                        ? "Saving…"
                                        : saveStatus === "unsaved"
                                          ? "Unsaved"
                                          : "Saved"}
                                </span>
                                {!isMaster && (
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-xs text-slate-400 hover:text-violet-400"
                                        onClick={handleSetMaster}
                                    >
                                        Set as Master
                                    </Button>
                                )}
                                <Button
                                    size="sm"
                                    onClick={handleGeneratePdf}
                                    disabled={isGenerating}
                                >
                                    {isGenerating ? "Generating…" : "Preview PDF"}
                                </Button>
                            </div>
                        </div>

                        <Textarea
                            className="text-white flex-1 resize-none font-mono text-sm"
                            value={latex}
                            onChange={(e) => handleLatexChange(e.target.value)}
                            placeholder="Enter LaTeX here…"
                        />
                    </div>
                </ResizablePanel>

                <ResizableHandle withHandle />

                <ResizablePanel defaultSize={50}>
                    {pdfUrl ? (
                        <iframe
                            src={pdfUrl}
                            className="w-full h-full"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-sm text-slate-500">
                            PDF preview will appear here
                        </div>
                    )}
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}
