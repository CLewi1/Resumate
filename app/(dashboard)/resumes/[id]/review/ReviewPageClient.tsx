"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

function computeInnerDiff(
    oldText: string,
    newText: string,
): { prefixLen: number; oldEnd: number; newEnd: number } {
    let prefixLen = 0;
    while (prefixLen < oldText.length && prefixLen < newText.length && oldText[prefixLen] === newText[prefixLen]) {
        prefixLen++;
    }
    let oldEnd = oldText.length;
    let newEnd = newText.length;
    while (oldEnd > prefixLen && newEnd > prefixLen && oldText[oldEnd - 1] === newText[newEnd - 1]) {
        oldEnd--;
        newEnd--;
    }
    return { prefixLen, oldEnd, newEnd };
}

function injectColorHighlights(
    latex: string,
    changes: Change[],
    accepted: Set<number>,
    kind: "remove" | "add",
): string {
    let result = latex;
    if (!/\\usepackage(\[.*?\])?\{xcolor\}/.test(result)) {
        result = result.replace(/\\begin\{document\}/, "\\usepackage[dvipsnames]{xcolor}\n\\begin{document}");
    }
    const color = kind === "remove" ? "red!20" : "green!20";
    for (let i = 0; i < changes.length; i++) {
        if (!accepted.has(i)) continue;
        const { old: oldText, new: newText } = changes[i];
        if (!oldText) continue;
        const { prefixLen, oldEnd, newEnd } = computeInnerDiff(oldText, newText);
        const sourceText = kind === "remove" ? oldText : newText;
        const sourceEnd = kind === "remove" ? oldEnd : newEnd;
        const mid = sourceText.slice(prefixLen, sourceEnd);
        if (!mid) continue;
        const prefix = sourceText.slice(0, prefixLen);
        const suffix = sourceText.slice(sourceEnd);
        result = result.replaceAll(sourceText, `${prefix}\\colorbox{${color}}{${mid}}${suffix}`);
    }
    return result;
}

type Highlight = { text: string; kind: "add"; section?: string; innerStart: number; innerEnd: number };
type Segment = { text: string; kind: "add" | null; highlight?: Highlight };

function buildSegments(latex: string, highlights: Highlight[]): Segment[] {
    const out: Segment[] = [];
    let rest = latex;
    while (rest.length > 0) {
        let best = -1;
        let bestHighlight: Highlight | undefined;
        for (const h of highlights) {
            if (!h.text) continue;
            const idx = rest.indexOf(h.text);
            if (idx !== -1 && (best === -1 || idx < best)) {
                best = idx;
                bestHighlight = h;
            }
        }
        if (best === -1) { out.push({ text: rest, kind: null }); break; }
        if (best > 0) out.push({ text: rest.slice(0, best), kind: null });
        out.push({ text: bestHighlight!.text, kind: "add", highlight: bestHighlight });
        rest = rest.slice(best + bestHighlight!.text.length);
    }
    return out;
}

// ---------------------------------------------------------------------------
// CodeDiff
// ---------------------------------------------------------------------------

function CodeDiff({ latex, highlights }: { latex: string; highlights: Highlight[] }) {
    const segments = useMemo(() => buildSegments(latex, highlights), [latex, highlights]);
    return (
        <pre className="h-full overflow-auto p-4 text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-wrap break-all">
            {segments.map((seg, i) => {
                if (seg.kind === "add") {
                    const { innerStart, innerEnd } = seg.highlight!;
                    const pre = seg.text.slice(0, innerStart);
                    const inner = seg.text.slice(innerStart, innerEnd);
                    const suf = seg.text.slice(innerEnd);
                    return (
                        <span key={i}>
                            {pre && <span>{pre}</span>}
                            {inner && <mark className="rounded-sm bg-green-950 text-green-300 not-italic">{inner}</mark>}
                            {suf && <span>{suf}</span>}
                        </span>
                    );
                }
                return <span key={i}>{seg.text}</span>;
            })}
        </pre>
    );
}

// ---------------------------------------------------------------------------
// AutoPdfPanel
// ---------------------------------------------------------------------------

function AutoPdfPanel({ latex, pdfEnabled }: { latex: string; pdfEnabled: boolean }) {
    const [url, setUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const [generatedFor, setGeneratedFor] = useState<string | null>(null);
    const prevUrl = useRef<string | null>(null);

    useEffect(() => () => { if (prevUrl.current) URL.revokeObjectURL(prevUrl.current); }, []);

    const generate = useCallback(async (forLatex: string) => {
        setLoading(true);
        setErr(null);
        try {
            const res = await fetch("/api/generate-pdf", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ latex: forLatex }),
            });
            if (!res.ok) { setErr("PDF generation failed — check TEXAPI_KEY."); return; }
            const blob = await res.blob();
            if (prevUrl.current) URL.revokeObjectURL(prevUrl.current);
            const next = URL.createObjectURL(blob);
            prevUrl.current = next;
            setUrl(next);
            setGeneratedFor(forLatex);
        } catch {
            setErr("Network error.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (pdfEnabled) generate(latex);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (!pdfEnabled) {
        return (
            <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
                <FileText size={32} className="text-slate-600" />
                <p className="text-sm text-slate-400">
                    Add{" "}
                    <code className="rounded bg-slate-800 px-1 py-0.5 font-mono text-xs text-slate-300">
                        TEXAPI_KEY
                    </code>{" "}
                    to{" "}
                    <code className="rounded bg-slate-800 px-1 py-0.5 font-mono text-xs text-slate-300">
                        .env.local
                    </code>{" "}
                    to enable PDF preview — see{" "}
                    <code className="rounded bg-slate-800 px-1 py-0.5 font-mono text-xs text-slate-300">
                        .env.example
                    </code>{" "}
                    for details.
                </p>
            </div>
        );
    }

    const stale = generatedFor !== null && generatedFor !== latex;

    return (
        <div className="relative h-full">
            {loading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950/80">
                    <RefreshCw size={20} className="animate-spin text-slate-400" />
                </div>
            )}
            {url && !err && <iframe src={url} className="h-full w-full" title="PDF preview" />}
            {!loading && err && (
                <div className="flex h-full items-center justify-center text-xs text-red-400">{err}</div>
            )}
            {stale && (
                <div className="absolute bottom-3 right-3 z-10">
                    <button
                        onClick={() => generate(latex)}
                        className="flex items-center gap-1.5 rounded-md border border-amber-500/40 bg-amber-950/80 px-2.5 py-1.5 text-xs font-medium text-amber-300 backdrop-blur-sm transition-colors hover:bg-amber-950"
                    >
                        <RefreshCw size={11} /> Changes made — regenerate
                    </button>
                </div>
            )}
        </div>
    );
}

// ---------------------------------------------------------------------------
// CommentCard
// ---------------------------------------------------------------------------

function CommentCard({
    change,
    accepted,
    onAccept,
    onReject,
}: {
    change: Change;
    accepted: boolean;
    onAccept: () => void;
    onReject: () => void;
}) {
    const { prefixLen, oldEnd, newEnd } = computeInnerDiff(change.old, change.new);
    const oldMid = change.old.slice(prefixLen, oldEnd) || change.old;
    const newMid = change.new.slice(prefixLen, newEnd) || change.new;

    return (
        <div
            className={`rounded-xl border p-3.5 transition-all duration-150 ${
                accepted ? "border-green-500/25 bg-card" : "border-border bg-card/40 opacity-55"
            }`}
        >
            <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {change.section}
            </p>

            <div className="mb-3 space-y-1 rounded-md bg-slate-950/60 px-2.5 py-2">
                {oldMid && (
                    <p className="flex gap-1.5 text-[11px] font-mono leading-relaxed">
                        <span className="mt-px select-none text-red-500">−</span>
                        <span className="break-all text-red-400 line-through">{oldMid}</span>
                    </p>
                )}
                {newMid && (
                    <p className="flex gap-1.5 text-[11px] font-mono leading-relaxed">
                        <span className="mt-px select-none text-green-500">+</span>
                        <span className="break-all text-green-400">{newMid}</span>
                    </p>
                )}
            </div>

            <div className="flex gap-2">
                <button
                    onClick={onAccept}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-colors ${
                        accepted
                            ? "bg-green-500/20 text-green-300"
                            : "border border-border text-slate-500 hover:border-green-500/40 hover:text-green-400"
                    }`}
                >
                    <CheckCircle size={11} />
                    Accept
                </button>
                <button
                    onClick={onReject}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-colors ${
                        !accepted
                            ? "bg-red-500/20 text-red-400"
                            : "border border-border text-slate-500 hover:border-red-500/40 hover:text-red-400"
                    }`}
                >
                    <XCircle size={11} />
                    Reject
                </button>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// ReviewPageClient
// ---------------------------------------------------------------------------

export default function ReviewPageClient({ id, pdfEnabled }: { id: string; pdfEnabled: boolean }) {
    const numId = Number(id);
    const router = useRouter();

    const [view, setView] = useState<"code" | "pdf">("code");
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
                // eslint-disable-next-line react-hooks/set-state-in-effect
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

    function acceptChange(i: number) {
        setAccepted((prev) => new Set([...prev, i]));
    }

    function rejectChange(i: number) {
        setAccepted((prev) => { const next = new Set(prev); next.delete(i); return next; });
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

    const codeHighlights = useMemo<Highlight[]>(
        () => (changes ?? []).filter((_, i) => accepted.has(i)).map((c) => {
            const { prefixLen, newEnd } = computeInnerDiff(c.old, c.new);
            return { text: c.new, kind: "add", section: c.section, innerStart: prefixLen, innerEnd: newEnd };
        }),
        [changes, accepted],
    );

    const pdfLatex = useMemo(() => {
        if (!changes) return modifiedLatex;
        return injectColorHighlights(modifiedLatex, changes, accepted, "add");
    }, [modifiedLatex, changes, accepted]);

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
                <div className="flex items-center gap-3">
                    <div className="flex overflow-hidden rounded-md border border-border text-xs font-medium">
                        <button
                            onClick={() => setView("code")}
                            className={`flex items-center gap-1.5 px-3 py-1.5 transition-colors ${
                                view === "code" ? "bg-orange-600 text-white" : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            <Code2 size={12} /> Code
                        </button>
                        <button
                            onClick={() => setView("pdf")}
                            className={`flex items-center gap-1.5 px-3 py-1.5 transition-colors ${
                                view === "pdf" ? "bg-orange-600 text-white" : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            <FileText size={12} /> PDF
                        </button>
                    </div>
                    <button
                        onClick={acceptAll}
                        disabled={accepted.size === changes.length}
                        className="text-xs font-medium text-orange-400 transition-colors hover:text-orange-300 disabled:cursor-not-allowed disabled:opacity-40"
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

            {/* Body: main panel + sidebar */}
            <div className="flex min-h-0 flex-1 gap-4">
                {/* Updated document view */}
                <div className="relative min-w-0 flex-1 overflow-hidden rounded-lg border border-border bg-slate-950">
                    <div className={view === "code" ? "absolute inset-0" : "hidden"}>
                        <CodeDiff latex={modifiedLatex} highlights={codeHighlights} />
                    </div>
                    <div className={view === "pdf" ? "absolute inset-0" : "hidden"}>
                        <AutoPdfPanel latex={pdfLatex} pdfEnabled={pdfEnabled} />
                    </div>
                </div>

                {/* Comment sidebar */}
                <div className="w-72 shrink-0 space-y-2 overflow-y-auto">
                    {changes.map((change, i) => (
                        <CommentCard
                            key={i}
                            change={change}
                            accepted={accepted.has(i)}
                            onAccept={() => acceptChange(i)}
                            onReject={() => rejectChange(i)}
                        />
                    ))}
                </div>
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
