import JobsClient, { type SearchJob } from "./JobsClient";
import { getJobRepository, type Job } from "@/lib/db/jobs";

type JobsPageProps = {
    searchParams?: Promise<{
        q?: string | string[];
        selected?: string | string[];
    }>;
};

const LOGO_CLASSES = [
    "bg-black text-white",
    "bg-orange-600 text-white",
    "bg-green-600 text-white",
    "bg-blue-600 text-white",
    "bg-purple-600 text-white",
    "bg-slate-900 text-white",
];

export default async function JobsPage({ searchParams }: JobsPageProps) {
    const resolvedParams = searchParams ? await searchParams : undefined;
    const q = resolvedParams?.q;
    const query =
        typeof q === "string" ? q : Array.isArray(q) ? (q[0] ?? "") : "";
    const trimmedQuery = query.trim();

    const rawSelected = resolvedParams?.selected;
    const selectedParam =
        typeof rawSelected === "string"
            ? rawSelected
            : Array.isArray(rawSelected)
              ? (rawSelected[0] ?? "")
              : "";
    const selectedId: number | null | undefined = (() => {
        if (!selectedParam) return undefined;
        const n = Number(selectedParam);
        return Number.isNaN(n) ? null : n;
    })();

    let jobs: SearchJob[] = [];
    let errorMessage: string | undefined;

    try {
        const rows = getJobRepository().search(trimmedQuery || undefined);
        jobs = rows.map((row, index) => mapJobRow(row, index));
    } catch {
        errorMessage = "Unable to load jobs right now.";
    }

    return (
        <JobsClient
            jobs={jobs}
            query={trimmedQuery}
            selectedId={selectedId}
            errorMessage={errorMessage}
        />
    );
}

function mapJobRow(row: Job, index: number): SearchJob {
    return {
        id: row.id,
        role: row.title,
        company: row.company,
        logoText: getLogoText(row.company, row.title),
        logoClass: LOGO_CLASSES[index % LOGO_CLASSES.length],
        location: "Unknown",
        type: "Unknown",
        salary: "Not listed",
        posted: formatRelativeTime(row.captured_at),
        tags: [],
        description: row.description,
        bullets: [],
        applyUrl: row.linkedin_url,
    };
}

function getLogoText(company: string, role: string) {
    const base = company?.trim() || role?.trim() || "?";
    const [first] = Array.from(base);
    return first ? first.toUpperCase() : "?";
}

function formatRelativeTime(value: string | null): string {
    if (!value) {
        return "Unknown";
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return "Unknown";
    }

    const diffSeconds = Math.round((date.getTime() - Date.now()) / 1000);
    const absSeconds = Math.abs(diffSeconds);
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

    if (absSeconds < 60) {
        return rtf.format(diffSeconds, "second");
    }

    const diffMinutes = Math.round(diffSeconds / 60);
    if (Math.abs(diffMinutes) < 60) {
        return rtf.format(diffMinutes, "minute");
    }

    const diffHours = Math.round(diffMinutes / 60);
    if (Math.abs(diffHours) < 24) {
        return rtf.format(diffHours, "hour");
    }

    const diffDays = Math.round(diffHours / 24);
    if (Math.abs(diffDays) < 7) {
        return rtf.format(diffDays, "day");
    }

    const diffWeeks = Math.round(diffDays / 7);
    if (Math.abs(diffWeeks) < 5) {
        return rtf.format(diffWeeks, "week");
    }

    const diffMonths = Math.round(diffDays / 30);
    if (Math.abs(diffMonths) < 12) {
        return rtf.format(diffMonths, "month");
    }

    const diffYears = Math.round(diffDays / 365);
    return rtf.format(diffYears, "year");
}
