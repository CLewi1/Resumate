"use client";
import { JobCard, type Job } from "@/components/ui/jobCard";
import { Filter, Grid, List, SortAsc } from "lucide-react";
import { useMemo, useState } from "react";

type SortBy = "recent" | "salary-high" | "company";
type ViewMode = "list" | "grid";
type FilterKey = "jobTitle" | "seniority" | "location" | "type" | "datePosted";

type Filters = Record<FilterKey, string>;

const jobListings: Job[] = [
    {
        id: 1,
        title: "Senior React Developer",
        company: "TechCorp",
        logo: "🚀",
        location: "Remote",
        type: "Full-time",
        salary: "$120k - $150k",
        posted: "2 hours ago",
        description:
            "Looking for a senior React developer to join our dynamic team and build cutting-edge web applications.",
        tags: ["React", "TypeScript", "Node.js", "AWS"],
    },
    {
        id: 2,
        title: "Full Stack Engineer",
        company: "StartupXYZ",
        logo: "⚡",
        location: "New York, NY",
        type: "Full-time",
        salary: "$90k - $120k",
        posted: "5 hours ago",
        description:
            "Join our fast-growing startup as a full stack engineer and help shape the future of our platform.",
        tags: ["JavaScript", "Python", "PostgreSQL", "Docker"],
    },
    {
        id: 3,
        title: "Frontend Developer Intern",
        company: "WebSolutions",
        logo: "🎯",
        location: "San Francisco, CA",
        type: "Internship",
        salary: "$25 - $35/hr",
        posted: "1 day ago",
        description:
            "Great opportunity for students to gain real-world experience in frontend development.",
        tags: ["HTML", "CSS", "JavaScript", "Vue.js"],
    },
];

const filterConfig: Array<{
    key: FilterKey;
    label: string;
    options: string[];
}> = [
    {
        key: "jobTitle",
        label: "Job Title",
        options: [
            "Any",
            "Frontend Developer",
            "Backend Developer",
            "Full Stack",
        ],
    },
    {
        key: "seniority",
        label: "Seniority",
        options: ["Any", "Intern", "Junior", "Mid-level", "Senior"],
    },
    {
        key: "location",
        label: "Location",
        options: ["Any", "Remote", "New York", "San Francisco", "Los Angeles"],
    },
    {
        key: "type",
        label: "Type",
        options: ["Any", "Full-time", "Part-time", "Contract", "Internship"],
    },
    {
        key: "datePosted",
        label: "Date Posted",
        options: ["Any", "Last 24 hours", "Last 7 days", "Last 30 days"],
    },
];

const viewModeOptions: Array<{
    mode: ViewMode;
    label: string;
    Icon: typeof List;
}> = [
    { mode: "list", label: "List view", Icon: List },
    { mode: "grid", label: "Grid view", Icon: Grid },
];

const defaultFilters: Filters = {
    jobTitle: "Any",
    seniority: "Any",
    location: "Any",
    type: "Any",
    datePosted: "Any",
};

function parseSalaryFloor(salary: string): number {
    const floor = salary.split("-")[0].replace(/[^\d]/g, "");
    return Number(floor) || 0;
}

function postedHoursAgo(posted: string): number {
    const match = posted.match(/(\d+)/);
    const amount = match ? Number(match[1]) : 0;
    if (posted.includes("day")) {
        return amount * 24;
    }
    return amount;
}

function getSeniority(title: string): string {
    const lowered = title.toLowerCase();
    if (lowered.includes("intern")) return "Intern";
    if (lowered.includes("junior")) return "Junior";
    if (lowered.includes("senior")) return "Senior";
    return "Mid-level";
}

export default function Jobs() {
    const [sortBy, setSortBy] = useState<SortBy>("recent");
    const [viewMode, setViewMode] = useState<ViewMode>("list");
    const [filters, setFilters] = useState<Filters>(defaultFilters);
    const [bookmarkedIds, setBookmarkedIds] = useState<Set<number>>(new Set());

    const displayedJobs = useMemo(() => {
        const filtered = jobListings.filter((job) => {
            if (
                filters.jobTitle !== "Any" &&
                !job.title
                    .toLowerCase()
                    .includes(filters.jobTitle.toLowerCase())
            ) {
                return false;
            }

            if (
                filters.seniority !== "Any" &&
                getSeniority(job.title) !== filters.seniority
            ) {
                return false;
            }

            if (
                filters.location !== "Any" &&
                !job.location.includes(filters.location)
            ) {
                return false;
            }

            if (filters.type !== "Any" && job.type !== filters.type) {
                return false;
            }

            if (filters.datePosted !== "Any") {
                const hoursAgo = postedHoursAgo(job.posted);
                if (filters.datePosted === "Last 24 hours" && hoursAgo > 24) {
                    return false;
                }
                if (filters.datePosted === "Last 7 days" && hoursAgo > 168) {
                    return false;
                }
                if (filters.datePosted === "Last 30 days" && hoursAgo > 720) {
                    return false;
                }
            }

            return true;
        });

        return [...filtered].sort((a, b) => {
            if (sortBy === "salary-high") {
                return parseSalaryFloor(b.salary) - parseSalaryFloor(a.salary);
            }
            if (sortBy === "company") {
                return a.company.localeCompare(b.company);
            }
            return postedHoursAgo(a.posted) - postedHoursAgo(b.posted);
        });
    }, [filters, sortBy]);

    function handleFilterChange(key: FilterKey, value: string): void {
        setFilters((prev) => ({ ...prev, [key]: value }));
    }

    function resetFilters(): void {
        setFilters(defaultFilters);
        setSortBy("recent");
    }

    function toggleBookmark(job: Job): void {
        setBookmarkedIds((prev) => {
            const next = new Set(prev);
            if (next.has(job.id)) {
                next.delete(job.id);
            } else {
                next.add(job.id);
            }
            return next;
        });
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex gap-6">
                {/* Sidebar */}
                <div className="w-72 shrink-0">
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-5 sticky top-24">
                        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                            <Filter className="w-4 h-4" /> Filters
                        </h2>
                        <div className="space-y-4">
                            {filterConfig.map(({ key, label, options }) => (
                                <div key={key}>
                                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1.5">
                                        {label}
                                    </label>
                                    <select
                                        value={filters[key]}
                                        onChange={(e) =>
                                            handleFilterChange(
                                                key,
                                                e.target.value,
                                            )
                                        }
                                        className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                    >
                                        {options.map((o: string) => (
                                            <option key={o}>{o}</option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2 mt-5">
                            <button
                                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 text-gray-600 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                                onClick={resetFilters}
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                Job Listings
                            </h1>
                            <span className="text-sm text-gray-500 dark:text-gray-300 bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                                {displayedJobs.length} found
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <SortAsc className="w-4 h-4 text-gray-500 dark:text-gray-300" />
                                <select
                                    value={sortBy}
                                    onChange={(e) =>
                                        setSortBy(e.target.value as SortBy)
                                    }
                                    className="px-3 py-1.5 bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500"
                                >
                                    <option value="recent">Most Recent</option>
                                    <option value="salary-high">
                                        Highest Salary
                                    </option>
                                    <option value="company">Company A-Z</option>
                                </select>
                            </div>
                            <div className="flex bg-gray-100 dark:bg-slate-800 rounded-lg p-1">
                                {viewModeOptions.map(
                                    ({ mode, label, Icon }) => (
                                        <button
                                            key={mode}
                                            aria-label={label}
                                            onClick={() => setViewMode(mode)}
                                            className={`p-1.5 rounded transition-colors ${viewMode === mode ? "bg-white dark:bg-slate-700 shadow-sm text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"}`}
                                        >
                                            <Icon className="w-4 h-4" />
                                        </button>
                                    ),
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-5">
                        {[
                            "Remote",
                            "Full-time",
                            "React",
                            "Senior Level",
                            "$100k+",
                        ].map((t, i: number) => (
                            <button
                                key={t}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${i === 0 ? "bg-violet-600 text-white" : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700"}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>

                    <div
                        className={
                            viewMode === "grid"
                                ? "grid md:grid-cols-2 gap-4"
                                : "space-y-4"
                        }
                    >
                        {displayedJobs.map((j) => (
                            <JobCard
                                key={j.id}
                                job={j}
                                compact={viewMode === "grid"}
                                isBookmarked={bookmarkedIds.has(j.id)}
                                onBookmarkToggle={toggleBookmark}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
