"use client";

import { useState } from "react";
import Link from "next/link";
import type { Change } from "@/lib/tailor";

type State =
    | { status: "idle" }
    | { status: "loading" }
    | { status: "done"; resumeId: number; changes: Change[] }
    | { status: "error"; message: string };

export function TailorButton({ jobId }: { jobId: number }) {
    const [state, setState] = useState<State>({ status: "idle" });

    async function handleClick() {
        setState({ status: "loading" });
        try {
            const res = await fetch("/api/tailor", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ jobId }),
            });
            const data = await res.json();
            if (!res.ok) {
                setState({ status: "error", message: data.error ?? "Something went wrong." });
                return;
            }
            setState({ status: "done", resumeId: data.resumeId, changes: data.changes });
        } catch {
            setState({ status: "error", message: "Network error — is the app running?" });
        }
    }

    return (
        <div className="space-y-4">
            <button
                onClick={handleClick}
                disabled={state.status === "loading" || state.status === "done"}
                className="inline-flex items-center rounded-md border border-violet-600 px-4 py-2 text-sm font-semibold text-violet-400 hover:bg-violet-600/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {state.status === "loading" ? "Tailoring…" : "Tailor my resume"}
            </button>

            {state.status === "error" && (
                <p className="text-sm text-red-400">{state.message}</p>
            )}

            {state.status === "done" && (
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <p className="text-sm text-green-400">
                            {state.changes.length} proposed change{state.changes.length !== 1 ? "s" : ""} generated.
                        </p>
                        <Link
                            href={`/resumes/${state.resumeId}`}
                            className="text-sm font-semibold text-violet-400 hover:text-violet-300 underline underline-offset-2"
                        >
                            Open in editor →
                        </Link>
                    </div>

                    <ul className="space-y-3">
                        {state.changes.map((change, i) => (
                            <li key={i} className="rounded-lg border border-border bg-card p-4 text-sm space-y-2">
                                <span className="inline-block rounded bg-violet-600/20 px-2 py-0.5 text-xs font-semibold text-violet-300">
                                    {change.section}
                                </span>
                                <div className="space-y-1">
                                    <p className="text-muted-foreground line-through">{change.old}</p>
                                    <p className="text-foreground">{change.new}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
