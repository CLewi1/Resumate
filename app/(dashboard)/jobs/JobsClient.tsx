"use client";

import {
    Bookmark,
    Briefcase,
    ChevronDown,
    ChevronRight,
    Clock3,
    ExternalLink,
    Filter,
    Grid2x2,
    List,
    MapPin,
    Search,
    DollarSign,
    X,
} from "lucide-react";
import { useEffect, useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export type SearchJob = {
    id: number;
    role: string;
    company: string;
    logoText: string;
    logoClass: string;
    location: string;
    type: string;
    salary: string;
    posted: string;
    tags: string[];
    description: string;
    bullets: string[];
    applyUrl?: string | null;
};

type SearchClientProps = {
    jobs: SearchJob[];
    query: string;
    errorMessage?: string;
};

const quickFilters = [
    "Remote",
    "Full-time",
    "React",
    "TypeScript",
    "Backend",
    "Frontend",
    "Senior Level",
    "$100k+",
];

export default function JobsClient({
    jobs,
    query,
    errorMessage,
}: SearchClientProps) {
    const [selectedId, setSelectedId] = useState(() => jobs[0]?.id ?? 0);
    const [isListView, setIsListView] = useState(true);
    const [searchTerm, setSearchTerm] = useState(query);
    const [, startTransition] = useTransition();
    const router = useRouter();

    const selectedJob =
        jobs.find((job) => job.id === selectedId) ?? jobs[0] ?? null;
    const hasResults = jobs.length > 0;

    useEffect(() => {
        if (!jobs.find((job) => job.id === selectedId)) {
            setSelectedId(jobs[0]?.id ?? 0);
        }
    }, [jobs, selectedId]);

    useEffect(() => {
        setSearchTerm(query);
    }, [query]);

    useEffect(() => {
        const trimmed = searchTerm.trim();
        if (trimmed === query) {
            return undefined;
        }

        const timeoutId = window.setTimeout(() => {
            const params = new URLSearchParams();
            if (trimmed) {
                params.set("q", trimmed);
            }

            startTransition(() => {
                const href = params.toString()
                    ? `/jobs?${params.toString()}`
                    : "/jobs";
                router.replace(href);
            });
        }, 350);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [query, router, searchTerm, startTransition]);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const trimmed = searchTerm.trim();
        const params = new URLSearchParams();
        if (trimmed) {
            params.set("q", trimmed);
        }

        startTransition(() => {
            const href = params.toString()
                ? `/jobs?${params.toString()}`
                : "/jobs";
            router.replace(href);
        });
    };

    const openApplyUrl = (url?: string | null) => {
        if (!url) {
            return;
        }

        window.open(url, "_blank", "noopener,noreferrer");
    };

    return (
        <div className="w-full h-[calc(100vh-2rem)] px-4 py-4 text-slate-900 overflow-hidden">
            <div className="flex items-center mb-4">
                <div className="flex items-center gap-8">
                    <h1 className="text-4xl leading-none font-bold font-sans">
                        Jobs
                    </h1>
                    <p className="text-orange-600 text-sm font-mono">
                        {"// find roles. tailor resume. get interviews."}
                    </p>
                </div>
            </div>

            <div className="border border-slate-200 rounded-lg bg-white overflow-hidden h-[calc(100%-4.5rem)] flex flex-col">
                <div className="px-3 py-2.5 border-b border-slate-100 grid grid-cols-[1fr_auto_auto_auto] gap-2 items-center">
                    <form
                        onSubmit={handleSubmit}
                        className="border border-slate-200 rounded-md px-3 py-2 flex items-center gap-2 text-slate-500"
                    >
                        <Search size={14} className="text-slate-400" />
                        <input
                            type="search"
                            name="q"
                            value={searchTerm}
                            onChange={(event) =>
                                setSearchTerm(event.target.value)
                            }
                            aria-label="Search jobs"
                            placeholder="Filter jobs... (e.g. title:react AND remote AND salary:100k)"
                            className="flex-1 bg-transparent text-xs font-mono text-slate-700 placeholder:text-slate-400 outline-none"
                        />
                        <span className="ml-auto border border-slate-200 rounded px-1.5 py-0.5 text-[11px] text-slate-400 font-mono">
                            /
                        </span>
                    </form>

                    <button
                        type="button"
                        className="border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-700 font-mono font-medium flex items-center gap-1.5 hover:bg-slate-50"
                    >
                        <Filter size={14} /> Filters
                    </button>
                    <button
                        type="button"
                        className="border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-700 font-mono font-medium flex items-center gap-2 hover:bg-slate-50 min-w-[170px] justify-between"
                    >
                        <span>Sort: Most Recent</span>
                        <ChevronDown size={14} className="text-slate-500" />
                    </button>
                    <div className="border border-slate-200 rounded-md p-1 flex items-center gap-1">
                        <button
                            type="button"
                            onClick={() => setIsListView(true)}
                            className={`px-2 py-1 rounded ${isListView ? "bg-orange-600 text-white" : "text-slate-600 hover:bg-slate-50"}`}
                        >
                            <List size={14} />
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsListView(false)}
                            className={`px-2 py-1 rounded ${!isListView ? "bg-orange-600 text-white" : "text-slate-600 hover:bg-slate-50"}`}
                        >
                            <Grid2x2 size={14} />
                        </button>
                    </div>
                </div>

                <div className="px-3 py-2.5 border-b border-slate-100 flex items-center gap-2.5 flex-wrap">
                    <span className="text-xs font-mono text-slate-600 mr-1">
                        Quick filters:
                    </span>
                    {quickFilters.map((filter, index) => (
                        <button
                            key={filter}
                            type="button"
                            className={`text-xs font-mono px-3 py-1 rounded-md border ${index === 0 ? "border-orange-300 bg-orange-50 text-orange-700" : "border-slate-200 text-slate-700 hover:bg-slate-50"}`}
                        >
                            {filter}
                        </button>
                    ))}
                    <button
                        type="button"
                        className="text-xs font-mono text-slate-500 hover:text-slate-700 px-2 py-1"
                    >
                        Clear
                    </button>
                </div>

                <div className="grid grid-cols-[1.55fr_1fr] flex-1 min-h-0 overflow-hidden">
                    <div className="border-r border-slate-200 flex flex-col min-h-0">
                        <div className="px-3 pt-2 pb-1 text-[11px] font-mono font-semibold text-slate-500 border-b border-slate-100">
                            {jobs.length} results
                        </div>
                        <div className="px-3 py-2 text-[11px] font-mono text-slate-400 grid grid-cols-[2.5fr_0.75fr_0.65fr_0.8fr_0.7fr_0.3fr] gap-3 border-b border-slate-100">
                            <span>ROLE / COMPANY</span>
                            <span>LOCATION</span>
                            <span>TYPE</span>
                            <span>SALARY</span>
                            <span className="flex items-center gap-1">
                                POSTED{" "}
                                <span className="text-orange-600">↓</span>
                            </span>
                            <span></span>
                        </div>

                        <div className="divide-y divide-slate-100 flex-1 min-h-0 overflow-y-auto">
                            {!hasResults && (
                                <div className="px-3 py-6 text-center text-xs font-mono text-slate-400">
                                    {errorMessage ??
                                        "No jobs match that search yet."}
                                </div>
                            )}
                            {jobs.map((job) => {
                                const selected = job.id === selectedId;
                                return (
                                    <button
                                        key={job.id}
                                        type="button"
                                        onClick={() => setSelectedId(job.id)}
                                        className={`w-full text-left px-3 py-4 grid grid-cols-[2.5fr_0.75fr_0.65fr_0.8fr_0.7fr_0.3fr] gap-3 transition-colors border-l-2 ${selected ? "bg-orange-50/40 border-l-orange-500" : "border-l-transparent hover:bg-slate-50"}`}
                                    >
                                        <div className="flex gap-3 min-w-0">
                                            <div
                                                className={`w-12 h-12 rounded-md flex items-center justify-center text-xl font-bold shrink-0 ${job.logoClass}`}
                                            >
                                                {job.logoText}
                                            </div>
                                            <div className="min-w-0">
                                                <div
                                                    className={`text-[1.05rem] leading-tight font-sans font-bold truncate ${selected ? "text-orange-700" : "text-slate-900"}`}
                                                >
                                                    {job.role}
                                                </div>
                                                <div className="text-xs font-mono text-slate-600 mt-1 truncate">
                                                    {job.company}
                                                </div>
                                                {job.tags.length > 0 && (
                                                    <div className="mt-2 flex flex-wrap gap-1.5">
                                                        {job.tags
                                                            .slice(0, 4)
                                                            .map((tag) => (
                                                                <span
                                                                    key={`${job.id}-${tag}`}
                                                                    className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
                                                                >
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="text-xs font-mono text-slate-700 self-center">
                                            {job.location}
                                        </div>
                                        <div className="text-xs font-mono text-slate-700 self-center">
                                            {job.type}
                                        </div>
                                        <div className="text-xs font-mono text-slate-700 self-center">
                                            {job.salary}
                                        </div>
                                        <div className="text-xs font-mono text-slate-500 self-center">
                                            {job.posted}
                                        </div>
                                        <div className="self-center text-slate-400 flex items-center gap-2">
                                            <Bookmark size={13} />
                                            <ChevronRight size={13} />
                                        </div>
                                    </button>
                                );
                            })}

                            {hasResults && (
                                <div className="px-3 py-5 text-center text-xs font-mono text-slate-400 border-t border-slate-100">
                                    End of results
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-4 flex flex-col min-h-0 overflow-hidden">
                        {!selectedJob && (
                            <div className="h-full flex items-center justify-center text-xs font-mono text-slate-400">
                                Select a job to see details.
                            </div>
                        )}
                        {selectedJob && (
                            <>
                                <div className="flex items-start justify-between">
                                    <div className="min-w-0">
                                        <h2 className="text-[2rem] leading-tight font-sans font-bold text-slate-900">
                                            {selectedJob.role}
                                        </h2>
                                        <div className="mt-1 flex items-center gap-1.5 text-sm font-mono text-slate-600">
                                            <span>{selectedJob.company}</span>
                                            <ExternalLink size={12} />
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        className="text-slate-500 hover:text-slate-700 p-1"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>

                                <div className="mt-4 flex items-center justify-between">
                                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-mono text-slate-600">
                                        <div className="flex items-center gap-1">
                                            <MapPin size={12} />
                                            {selectedJob.location}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Briefcase size={12} />
                                            {selectedJob.type}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <DollarSign size={12} />
                                            {selectedJob.salary}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock3 size={12} />
                                            {selectedJob.posted}
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        className="text-xs font-mono text-slate-600 flex items-center gap-1 hover:text-slate-800"
                                    >
                                        <Bookmark size={12} /> Save
                                    </button>
                                </div>

                                {selectedJob.tags.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-1.5">
                                        {selectedJob.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-orange-50 text-orange-700 border border-orange-200"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <p className="mt-4 text-sm font-mono text-slate-700 leading-relaxed border-b border-slate-200 pb-4">
                                    {selectedJob.description}
                                </p>

                                <div className="mt-4 border-b border-slate-200">
                                    <div className="flex items-center gap-8 text-sm font-mono text-slate-500">
                                        <button
                                            type="button"
                                            className="pb-2 border-b-2 border-orange-600 text-slate-900 font-bold"
                                        >
                                            Overview
                                        </button>
                                        <button type="button" className="pb-2">
                                            Requirements
                                        </button>
                                        <button type="button" className="pb-2">
                                            About {selectedJob.company}
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-4 flex-1">
                                    <h3 className="text-sm font-mono font-bold text-slate-900 mb-2">
                                        About the role
                                    </h3>
                                    {selectedJob.bullets.length > 0 ? (
                                        <ul className="space-y-2 text-sm font-mono text-slate-700">
                                            {selectedJob.bullets.map(
                                                (bullet) => (
                                                    <li
                                                        key={bullet}
                                                        className="flex items-start gap-2"
                                                    >
                                                        <span className="text-orange-600 mt-0.5">
                                                            ›
                                                        </span>
                                                        <span>{bullet}</span>
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    ) : (
                                        <p className="text-sm font-mono text-slate-500">
                                            No highlights available yet.
                                        </p>
                                    )}
                                </div>

                                <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            openApplyUrl(selectedJob.applyUrl)
                                        }
                                        className="border border-slate-300 rounded-md px-4 py-2 text-sm font-mono text-slate-700 hover:bg-slate-50 flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
                                        disabled={!selectedJob.applyUrl}
                                    >
                                        View on company site{" "}
                                        <ExternalLink size={12} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            openApplyUrl(selectedJob.applyUrl)
                                        }
                                        className="bg-orange-600 hover:bg-orange-700 text-white rounded-md px-6 py-2 text-sm font-mono font-medium flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
                                        disabled={!selectedJob.applyUrl}
                                    >
                                        Apply now <span>→</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
