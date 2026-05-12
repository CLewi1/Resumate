import SearchClient, { type SearchJob } from "./SearchClient";
import { createClient } from "@/lib/supabase/server";

type SearchPageProps = {
    searchParams?: Promise<{
        q?: string | string[];
    }>;
};

type JobRow = {
    id: number;
    title: string | null;
    company: string | null;
    location: string | null;
    salary: string | null;
    posted_at: string | null;
    description: string | null;
    apply_url: string | null;
    linkedin_url: string | null;
    raw: Record<string, unknown> | null;
};

const LOGO_CLASSES = [
    "bg-black text-white",
    "bg-violet-600 text-white",
    "bg-green-600 text-white",
    "bg-blue-600 text-white",
    "bg-emerald-600 text-white",
    "bg-slate-900 text-white",
];

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const resolvedParams = searchParams ? await searchParams : undefined;
    const q = resolvedParams?.q;
    const query =
        typeof q === "string" ? q : Array.isArray(q) ? (q[0] ?? "") : "";
    const trimmedQuery = query.trim();
    const supabase = await createClient();

    let request = supabase
        .from("jobs")
        .select(
            "id, title, company, location, salary, posted_at, description, apply_url, linkedin_url, raw",
        );

    if (trimmedQuery) {
        const cleanedQuery = trimmedQuery.replace(/,+/g, " ").trim();
        const pattern = `%${cleanedQuery}%`;
        request = request.or(
            `title.ilike.${pattern},company.ilike.${pattern},location.ilike.${pattern},description.ilike.${pattern},salary.ilike.${pattern}`,
        );
    }

    const { data, error } = await request
        .order("posted_at", { ascending: false })
        .limit(200);

    const jobs = (data ?? []).map((row, index) => mapJobRow(row, index));

    return (
        <SearchClient
            jobs={jobs}
            query={trimmedQuery}
            errorMessage={error ? "Unable to load jobs right now." : undefined}
        />
    );
}

function mapJobRow(row: JobRow, index: number): SearchJob {
    const raw = row.raw ?? {};
    const role =
        row.title ?? getString(raw.title) ?? getString(raw.role) ?? "Untitled";
    const company =
        row.company ??
        getString(raw.company) ??
        getString(raw.employer) ??
        "Unknown";
    const postedAt =
        row.posted_at ?? getString(raw.posted_at) ?? getString(raw.postedAt);

    return {
        id: row.id,
        role,
        company,
        logoText: getLogoText(company, role),
        logoClass: LOGO_CLASSES[index % LOGO_CLASSES.length],
        location:
            row.location ??
            getString(raw.location) ??
            getString(raw.city) ??
            "Unknown",
        type: getJobType(raw),
        salary:
            row.salary ??
            getString(raw.salary) ??
            getString(raw.pay) ??
            "Not listed",
        posted: formatRelativeTime(postedAt),
        tags: getTags(raw),
        description:
            row.description ??
            getString(raw.description) ??
            "No description provided.",
        bullets: getBullets(raw),
        applyUrl:
            row.apply_url ??
            row.linkedin_url ??
            getString(raw.apply_url) ??
            getString(raw.applyUrl) ??
            getString(raw.linkedin_url) ??
            getString(raw.linkedinUrl),
    };
}

function getLogoText(company: string, role: string) {
    const base = company?.trim() || role?.trim() || "?";
    const [first] = Array.from(base);
    return first ? first.toUpperCase() : "?";
}

function getString(value: unknown): string | null {
    if (typeof value !== "string") {
        return null;
    }

    const trimmed = value.trim();
    return trimmed ? trimmed : null;
}

function getStringArray(value: unknown): string[] {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .map((item) => (typeof item === "string" ? item.trim() : ""))
        .filter((item) => item.length > 0);
}

function getJobType(raw: Record<string, unknown>): string {
    return (
        getString(raw.type) ??
        getString(raw.job_type) ??
        getString(raw.jobType) ??
        getString(raw.employment_type) ??
        getString(raw.employmentType) ??
        "Unknown"
    );
}

function getTags(raw: Record<string, unknown>): string[] {
    const candidates = [
        getStringArray(raw.tags),
        getStringArray(raw.skills),
        getStringArray(raw.tech_stack),
        getStringArray(raw.techStack),
        getStringArray(raw.keywords),
    ];

    return candidates.find((items) => items.length > 0) ?? [];
}

function getBullets(raw: Record<string, unknown>): string[] {
    const candidates = [
        getStringArray(raw.bullets),
        getStringArray(raw.responsibilities),
        getStringArray(raw.requirements),
        getStringArray(raw.qualifications),
        getStringArray(raw.highlights),
        getStringArray(raw.key_points),
        getStringArray(raw.keyPoints),
    ];

    return candidates.find((items) => items.length > 0) ?? [];
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
