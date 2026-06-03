"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Star, X, FileText, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TEMPLATES } from "@/lib/resume-templates";
import type { Resume } from "@/lib/db/resumes";

export default function ResumesPage() {
    const router = useRouter();
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newName, setNewName] = useState("");
    const [newTemplate, setNewTemplate] = useState(TEMPLATES[0].id);
    const [creating, setCreating] = useState(false);

    const fetchResumes = useCallback(async () => {
        setLoading(true);
        const res = await fetch("/api/resumes");
        if (res.ok) setResumes(await res.json());
        setLoading(false);
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        void fetchResumes();
    }, [fetchResumes]);

    async function handleCreate() {
        if (!newName.trim()) return;
        setCreating(true);
        const template =
            TEMPLATES.find((t) => t.id === newTemplate) ?? TEMPLATES[0];
        const res = await fetch("/api/resumes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: newName.trim(),
                latex: template.latex,
            }),
        });
        setCreating(false);
        if (res.ok) {
            const resume: Resume = await res.json();
            router.push(`/resumes/${resume.id}`);
        }
    }

    async function handleSetMaster(id: number) {
        await fetch(`/api/resumes/${id}/master`, { method: "POST" });
        fetchResumes();
    }

    async function handleDelete(id: number) {
        if (!confirm("Delete this resume? This cannot be undone.")) return;
        await fetch(`/api/resumes/${id}`, { method: "DELETE" });
        fetchResumes();
    }

    function openDialog() {
        setNewName("");
        setNewTemplate(TEMPLATES[0].id);
        setDialogOpen(true);
    }

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-semibold text-white">Resumes</h1>
                <Button
                    onClick={openDialog}
                    className="flex items-center gap-2"
                >
                    <Plus size={16} />
                    New Resume
                </Button>
            </div>

            {loading ? (
                <p className="text-sm text-slate-500">Loading…</p>
            ) : resumes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <FileText size={40} className="text-slate-600 mb-4" />
                    <p className="text-slate-400 text-sm mb-4">
                        No resumes yet.
                    </p>
                    <Button variant="outline" onClick={openDialog}>
                        Create your first resume
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {resumes.map((resume) => (
                        <ResumeCard
                            key={resume.id}
                            resume={resume}
                            onEdit={() => router.push(`/resumes/${resume.id}`)}
                            onSetMaster={() => handleSetMaster(resume.id)}
                            onDelete={() => handleDelete(resume.id)}
                        />
                    ))}
                </div>
            )}

            {dialogOpen && (
                <NewResumeDialog
                    name={newName}
                    template={newTemplate}
                    creating={creating}
                    onNameChange={setNewName}
                    onTemplateChange={setNewTemplate}
                    onCreate={handleCreate}
                    onClose={() => setDialogOpen(false)}
                />
            )}
        </div>
    );
}

function ResumeCard({
    resume,
    onEdit,
    onSetMaster,
    onDelete,
}: {
    resume: Resume;
    onEdit: () => void;
    onSetMaster: () => void;
    onDelete: () => void;
}) {
    const isMaster = resume.is_master === 1;
    const date = new Date(resume.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    return (
        <div
            className={`rounded-xl border p-4 flex flex-col gap-3 transition-colors ${
                isMaster
                    ? "border-violet-500/50 bg-violet-950/20"
                    : "border-zinc-700 bg-zinc-900"
            }`}
        >
            <div className="flex items-start justify-between gap-2">
                <span className="font-medium text-white text-sm truncate">
                    {resume.name}
                </span>
                {isMaster && (
                    <span className="flex items-center gap-1 text-xs text-violet-400 bg-violet-500/10 border border-violet-500/30 rounded-full px-2 py-0.5 shrink-0">
                        <Star size={10} fill="currentColor" />
                        Master
                    </span>
                )}
            </div>
            <p className="text-xs text-slate-500">{date}</p>
            <div className="flex gap-2 mt-auto">
                <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs"
                    onClick={onEdit}
                >
                    Edit
                </Button>
                {!isMaster && (
                    <Button
                        size="sm"
                        variant="ghost"
                        className="flex-1 text-xs text-slate-400 hover:text-violet-400"
                        onClick={onSetMaster}
                    >
                        Set as Master
                    </Button>
                )}
                {!isMaster && (
                    <Button
                        size="sm"
                        variant="ghost"
                        className="text-slate-500 hover:text-red-400 px-2"
                        onClick={onDelete}
                        title="Delete resume"
                    >
                        <Trash2 size={14} />
                    </Button>
                )}
            </div>
        </div>
    );
}

function NewResumeDialog({
    name,
    template,
    creating,
    onNameChange,
    onTemplateChange,
    onCreate,
    onClose,
}: {
    name: string;
    template: string;
    creating: boolean;
    onNameChange: (v: string) => void;
    onTemplateChange: (v: string) => void;
    onCreate: () => void;
    onClose: () => void;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
                >
                    <X size={18} />
                </button>

                <h2 className="text-lg font-semibold text-white mb-4">
                    New Resume
                </h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs text-slate-400 mb-1.5">
                            Name
                        </label>
                        <input
                            autoFocus
                            type="text"
                            value={name}
                            onChange={(e) => onNameChange(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && onCreate()}
                            placeholder="e.g. Software Engineer Resume"
                            className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-slate-400 mb-1.5">
                            Starter Template
                        </label>
                        <select
                            value={template}
                            onChange={(e) => onTemplateChange(e.target.value)}
                            className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                        >
                            {TEMPLATES.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex gap-2 mt-6">
                    <Button
                        variant="outline"
                        className="flex-1"
                        onClick={onClose}
                        disabled={creating}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="flex-1"
                        onClick={onCreate}
                        disabled={!name.trim() || creating}
                    >
                        {creating ? "Creating…" : "Create"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
