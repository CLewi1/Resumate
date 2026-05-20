"use client";

import { use, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { Change } from "@/lib/change";
import { CheckCircle, Code2, FileText, RefreshCw, XCircle } from "lucide-react";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function applyAccepted(latex: string, changes: Change[], accepted: Set<number>): string {
    let result = latex;
    for (let i = 0; i < changes.length; i++) {
        if (accepted.has(i) && changes[i].old) result = result.replaceAll(changes[i].old, changes[i].new);
    }
    return result;
}

type Segment = { text: string; kind: "remove" | "add" | null };

function buildSegments(
    latex: string,
    highlights: { text: string; kind: "remove" | "add" }[],
): Segment[] {
    const out: Segment[] = [];
    let rest = latex;

    while (rest.length > 0) {
        let best = -1;
        let bestKind: "remove" | "add" = "remove";
        let bestText = "";

        for (const h of highlights) {
            if (!h.text) continue;
            const idx = rest.indexOf(h.text);
            if (idx !== -1 && (best === -1 || idx < best)) {
                best = idx;
                bestKind = h.kind;
                bestText = h.text;
            }
        }

        if (best === -1) { out.push({ text: rest, kind: null }); break; }
        if (best > 0) out.push({ text: rest.slice(0, best), kind: null });
        out.push({ text: bestText, kind: bestKind });
        rest = rest.slice(best + bestText.length);
    }

    return out;
}

// ---------------------------------------------------------------------------
// CodeDiff
// ---------------------------------------------------------------------------

function CodeDiff({
    latex,
    highlights,
}: {
    latex: string;
    highlights: { text: string; kind: "remove" | "add" }[];
}) {
    const segments = useMemo(() => buildSegments(latex, highlights), [latex, highlights]);

    return (
        <pre className="h-full overflow-auto p-4 text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-wrap break-all">
            {segments.map((seg, i) => {
                if (seg.kind === "remove") {
                    return (
                        <mark
                            key={i}
                            className="rounded-sm bg-red-950 text-red-300 line-through decoration-red-500/60 not-italic"
                        >
                            {seg.text}
                        </mark>
                    );
                }
                if (seg.kind === "add") {
                    return (
                        <mark key={i} className="rounded-sm bg-green-950 text-green-300 not-italic">
                            {seg.text}
                        </mark>
                    );
                }
                return <span key={i}>{seg.text}</span>;
            })}
        </pre>
    );
}

// ---------------------------------------------------------------------------
// PdfPanel
// ---------------------------------------------------------------------------

function PdfPanel({ latex }: { latex: string }) {
    const [url, setUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const prevUrl = useRef<string | null>(null);

    useEffect(
        () => () => { if (prevUrl.current) URL.revokeObjectURL(prevUrl.current); },
        [],
    );

    const generate = useCallback(async () => {
        setLoading(true);
        setErr(null);
        try {
            const res = await fetch("/api/generate-pdf", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ latex }),
            });
            if (!res.ok) { setErr("PDF generation failed — check TEXAPI_KEY."); return; }
            const blob = await res.blob();
            if (prevUrl.current) URL.revokeObjectURL(prevUrl.current);
            const next = URL.createObjectURL(blob);
            prevUrl.current = next;
            setUrl(next);
        } catch {
            setErr("Network error.");
        } finally {
            setLoading(false);
        }
    }, [latex]);

    if (!url) {
        return (
            <div className="flex h-full flex-col items-center justify-center gap-3">
                {err && <p className="text-xs text-red-400">{err}</p>}
                <Button variant="outline" size="sm" onClick={generate} disabled={loading}>
                    {loading ? (
                        <><RefreshCw size={13} className="mr-1.5 animate-spin" />Generating…</>
                    ) : (
                        "Generate PDF preview"
                    )}
                </Button>
            </div>
        );
    }

    return (
        <div className="relative h-full">
            <iframe src={url} className="h-full w-full" title="PDF preview" />
            <button
                onClick={generate}
                disabled={loading}
                title="Regenerate"
                className="absolute right-2 top-2 rounded bg-black/60 p-1.5 text-slate-400 transition-colors hover:text-white disabled:opacity-40"
            >
                <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
            </button>
        </div>
    );
}

// ---------------------------------------------------------------------------
// DiffPanel
// ---------------------------------------------------------------------------

function DiffPanel({
    title,
    latex,
    highlights,
}: {
    title: string;
    latex: string;
    highlights: { text: string; kind: "remove" | "add" }[];
}) {
    const [view, setView] = useState<"code" | "pdf">("code");

    return (
        <div className="flex flex-1 min-w-0 flex-col overflow-hidden rounded-lg border border-border">
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border bg-card px-4 py-2.5">
                <span className="text-sm font-semibold text-foreground">{title}</span>
                <div className="flex overflow-hidden rounded-md border border-border text-xs font-medium">
                    <button
                        onClick={() => setView("code")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 transition-colors ${
                            view === "code"
                                ? "bg-violet-600 text-white"
                                : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        <Code2 size={12} /> Code
                    </button>
                    <button
                        onClick={() => setView("pdf")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 transition-colors ${
                            view === "pdf"
                                ? "bg-violet-600 text-white"
                                : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        <FileText size={12} /> PDF
                    </button>
                </div>
            </div>
            <div className="min-h-0 flex-1 bg-slate-950">
                {view === "code" ? (
                    <CodeDiff latex={latex} highlights={highlights} />
                ) : (
                    <PdfPanel latex={latex} />
                )}
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const numId = Number(id);
    const router = useRouter();

    const [originalLatex, setOriginalLatex] = useState<string | null>(null);
    const [changes, setChanges] = useState<Change[] | null>(null);
    const [accepted, setAccepted] = useState<Set<number>>(new Set());
    const [isApplying, setIsApplying] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const raw = sessionStorage.getItem(`tailor-changes-${numId}`);
        if (raw) {
            try {
                const parsed = JSON.parse(raw) as Change[];
                setChanges(parsed);
                setAccepted(new Set(parsed.map((_, i) => i)));
            } catch {
                setChanges([]);
            }
        } else {
            setChanges([]);
        }

        fetch(`/api/resumes/${numId}`)
            .then((r) => (r.ok ? r.json() : Promise.reject()))
            .then((data) => setOriginalLatex(data.latex as string))
            .catch(() => setOriginalLatex(""));
    }, [numId]);

    function toggle(i: number) {
        setAccepted((prev) => {
            const next = new Set(prev);
            if (next.has(i)) next.delete(i); else next.add(i);
            return next;
        });
    }

    function acceptAll() {
        if (!changes) return;
        setAccepted(new Set(changes.map((_, i) => i)));
    }

    function rejectAll() { setAccepted(new Set()); }

    const modifiedLatex = useMemo(() => {
        if (originalLatex === null || !changes) return "";
        return applyAccepted(originalLatex, changes, accepted);
    }, [originalLatex, changes, accepted]);

    const leftHighlights = useMemo(
        () => (changes ?? []).filter((_, i) => accepted.has(i)).map((c) => ({ text: c.old, kind: "remove" as const })),
        [changes, accepted],
    );
    const rightHighlights = useMemo(
        () => (changes ?? []).filter((_, i) => accepted.has(i)).map((c) => ({ text: c.new, kind: "add" as const })),
        [changes, accepted],
    );

    async function handleConfirm() {
        if (!changes) return;
        setIsApplying(true);
        setError(null);
        const acceptedChanges = changes.filter((_, i) => accepted.has(i));
        try {
            const res = await fetch(`/api/resumes/${numId}/apply-changes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ accepted: acceptedChanges }),
            });
            if (!res.ok) {
                const data = await res.json();
                setError(data.error ?? "Failed to apply changes.");
                setIsApplying(false);
                return;
            }
            sessionStorage.removeItem(`tailor-changes-${numId}`);
            router.push(`/resumes/${numId}`);
        } catch {
            setError("Network error — is the app running?");
            setIsApplying(false);
        }
    }

    if (originalLatex === null || changes === null) {
        return <div className="p-6 text-sm text-slate-500">Loading…</div>;
    }

    if (changes.length === 0) {
        return (
            <div className="space-y-4 p-6">
                <p className="text-sm text-slate-400">
                    No proposed changes found. The AI may not have suggested any modifications, or this page was accessed directly.
                </p>
                <Button size="sm" variant="ghost" onClick={() => router.push(`/resumes/${numId}`)}>
                    Go to resume editor →
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4" style={{ height: "calc(100vh - 40px)" }}>
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-foreground">Review AI-proposed changes</h1>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                        {accepted.size} of {changes.length} change{changes.length !== 1 ? "s" : ""} accepted
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={acceptAll}
                        disabled={accepted.size === changes.length}
                        className="text-xs font-medium text-violet-400 transition-colors hover:text-violet-300 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Accept all
                    </button>
                    <span className="text-border">·</span>
                    <button
                        onClick={rejectAll}
                        disabled={accepted.size === 0}
                        className="text-xs font-medium text-muted-foreground transition-colors hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Reject all
                    </button>
                </div>
            </div>

            {/* Change chips */}
            <div className="flex shrink-0 flex-wrap gap-2">
                {changes.map((change, i) => {
                    const isAccepted = accepted.has(i);
                    return (
                        <button
                            key={i}
                            onClick={() => toggle(i)}
                            className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                                isAccepted
                                    ? "border-violet-500/50 bg-violet-500/10 text-violet-300 hover:bg-violet-500/15"
                                    : "border-border bg-card text-muted-foreground hover:border-slate-500 hover:text-slate-300"
                            }`}
                        >
                            {isAccepted ? <CheckCircle size={11} /> : <XCircle size={11} />}
                            {change.section}
                        </button>
                    );
                })}
            </div>

            {/* Diff panels */}
            <div className="flex min-h-0 flex-1 gap-4">
                <DiffPanel title="Original" latex={originalLatex} highlights={leftHighlights} />
                <DiffPanel title="Modified" latex={modifiedLatex} highlights={rightHighlights} />
            </div>

            {/* Footer */}
            <div className="flex shrink-0 items-center justify-between pt-1 pb-2">
                <div>{error && <p className="text-sm text-red-400">{error}</p>}</div>
                <div className="flex items-center gap-3">
                    <Button variant="ghost" onClick={() => router.push(`/resumes/${numId}`)} disabled={isApplying}>
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm} disabled={isApplying}>
                        {isApplying ? "Applying…" : "Apply accepted changes →"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
