"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type State =
    | { status: "idle" }
    | { status: "loading" }
    | { status: "error"; message: string };

export function TailorButton({
    jobId,
    existingResumeId,
}: {
    jobId: number;
    existingResumeId?: number;
}) {
    const router = useRouter();
    const [state, setState] = useState<State>({ status: "idle" });

    if (existingResumeId) {
        return (
            <Link
                href={`/resumes/${existingResumeId}`}
                className="inline-flex items-center rounded-md border border-orange-600/40 px-4 py-2 text-sm font-semibold text-orange-400 hover:bg-orange-600/10 transition-colors"
            >
                Already generated resume. View →
            </Link>
        );
    }

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
            sessionStorage.setItem(
                `tailor-changes-${data.resumeId}`,
                JSON.stringify(data.changes),
            );
            router.push(`/resumes/${data.resumeId}/review`);
        } catch {
            setState({ status: "error", message: "Network error — is the app running?" });
        }
    }

    return (
        <div className="space-y-2">
            <button
                onClick={handleClick}
                disabled={state.status === "loading"}
                className="inline-flex items-center rounded-md border border-orange-600 px-4 py-2 text-sm font-semibold text-orange-400 hover:bg-orange-600/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {state.status === "loading" ? "Tailoring…" : "Tailor my resume"}
            </button>

            {state.status === "error" && (
                <p className="text-sm text-red-400">{state.message}</p>
            )}
        </div>
    );
}
