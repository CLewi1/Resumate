"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { Change } from "@/lib/tailor";
import { CheckCircle, XCircle } from "lucide-react";

export default function ReviewPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const numId = Number(id);
    const router = useRouter();

    const [changes, setChanges] = useState<Change[] | null>(null);
    const [accepted, setAccepted] = useState<Set<number>>(new Set());
    const [isApplying, setIsApplying] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        Promise.resolve(sessionStorage.getItem(`tailor-changes-${numId}`)).then(
            (raw) => {
                if (!raw) { setChanges([]); return; }
                try {
                    const parsed = JSON.parse(raw) as Change[];
                    setChanges(parsed);
                    setAccepted(new Set(parsed.map((_, i) => i)));
                } catch {
                    setChanges([]);
                }
            },
        );
    }, [numId]);

    function toggle(index: number) {
        setAccepted((prev) => {
            const next = new Set(prev);
            if (next.has(index)) next.delete(index);
            else next.add(index);
            return next;
        });
    }

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

    if (changes === null) {
        return <div className="p-6 text-sm text-slate-500">Loading…</div>;
    }

    if (changes.length === 0) {
        return (
            <div className="p-6 space-y-4">
                <p className="text-sm text-slate-400">
                    No proposed changes found. The AI may not have suggested any modifications, or this page was accessed directly.
                </p>
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => router.push(`/resumes/${numId}`)}
                >
                    Go to resume editor →
                </Button>
            </div>
        );
    }

    const acceptedCount = accepted.size;

    return (
        <div className="max-w-3xl mx-auto py-8 space-y-6">
            <div className="space-y-1">
                <h1 className="text-2xl font-bold text-foreground">
                    Review AI-proposed changes
                </h1>
                <p className="text-sm text-muted-foreground">
                    {changes.length} proposed change{changes.length !== 1 ? "s" : ""}. Accept or reject each one, then confirm.
                </p>
            </div>

            <div className="space-y-4">
                {changes.map((change, i) => {
                    const isAccepted = accepted.has(i);
                    return (
                        <div
                            key={i}
                            className={`rounded-lg border p-5 space-y-4 transition-colors ${
                                isAccepted
                                    ? "border-violet-500/40 bg-violet-500/5"
                                    : "border-border bg-card opacity-60"
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold uppercase tracking-wide text-violet-400 bg-violet-500/10 border border-violet-500/30 rounded-full px-2 py-0.5">
                                    {change.section}
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => !isAccepted && toggle(i)}
                                        className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                                            isAccepted
                                                ? "bg-violet-600 text-white"
                                                : "border border-border text-muted-foreground hover:border-violet-500/50 hover:text-violet-400"
                                        }`}
                                    >
                                        <CheckCircle size={13} />
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => isAccepted && toggle(i)}
                                        className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                                            !isAccepted
                                                ? "bg-red-900/60 text-red-300 border border-red-700/50"
                                                : "border border-border text-muted-foreground hover:border-red-500/50 hover:text-red-400"
                                        }`}
                                    >
                                        <XCircle size={13} />
                                        Reject
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                        Before
                                    </p>
                                    <pre className="text-xs font-mono text-slate-300 bg-slate-900 rounded-md p-3 whitespace-pre-wrap break-words leading-relaxed">
                                        {change.old}
                                    </pre>
                                </div>
                                <div className="space-y-1.5">
                                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                        After
                                    </p>
                                    <pre className="text-xs font-mono text-slate-300 bg-slate-900 rounded-md p-3 whitespace-pre-wrap break-words leading-relaxed">
                                        {change.new}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex items-center justify-between pt-2">
                <div className="flex-1">
                    {error && <p className="text-sm text-red-400">{error}</p>}
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                        {acceptedCount} of {changes.length} accepted
                    </span>
                    <Button onClick={handleConfirm} disabled={isApplying}>
                        {isApplying ? "Applying…" : "Apply accepted changes →"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
