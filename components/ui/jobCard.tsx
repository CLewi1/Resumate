import { Bookmark, Briefcase, Clock, DollarSign, MapPin } from "lucide-react";

export type Job = {
    id: number;
    title: string;
    company: string;
    logo: string;
    location: string;
    type: string;
    salary: string;
    posted: string;
    description: string;
    tags: string[];
};

type JobCardProps = {
    job: Job;
    isBookmarked?: boolean;
    compact?: boolean;
    onBookmarkToggle?: (job: Job) => void;
    onViewDetails?: (job: Job) => void;
    onApply?: (job: Job) => void;
};

export function JobCard({
    job,
    isBookmarked = false,
    compact = false,
    onBookmarkToggle,
    onViewDetails,
    onApply,
}: JobCardProps) {
    return (
        <div
            className={`bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 hover:shadow-lg transition-all ${compact ? "p-4" : "p-6"}`}
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div
                        className={`bg-linear-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50 border border-orange-200 dark:border-orange-900/50 rounded-xl flex items-center justify-center ${compact ? "w-10 h-10 text-lg" : "w-12 h-12 text-2xl"}`}
                    >
                        {job.logo}
                    </div>
                    <div>
                        <h3
                            className={`font-semibold text-gray-900 dark:text-gray-100 ${compact ? "text-sm" : "text-base"}`}
                        >
                            {job.title}
                        </h3>
                        <p
                            className={`text-gray-500 dark:text-gray-400 ${compact ? "text-xs" : "text-sm"}`}
                        >
                            {job.company}
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => onBookmarkToggle?.(job)}
                    aria-label={
                        isBookmarked ? "Remove bookmark" : "Add bookmark"
                    }
                    className="p-1.5 text-gray-400 hover:text-orange-500 dark:text-gray-500 dark:hover:text-orange-400 transition-colors rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20"
                >
                    <Bookmark
                        className={`w-4 h-4 ${isBookmarked ? "fill-current text-orange-500 dark:text-orange-400" : ""}`}
                    />
                </button>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400 mb-3">
                <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {job.location}
                </span>
                <span className="flex items-center gap-1">
                    <Briefcase className="w-3 h-3" />
                    {job.type}
                </span>
                <span className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    {job.salary}
                </span>
                <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {job.posted}
                </span>
            </div>
            {!compact && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    {job.description}
                </p>
            )}
            <div className="flex flex-wrap gap-1.5 mb-4">
                {job.tags.map((t: string, i: number) => (
                    <span
                        key={i}
                        className="px-2 py-0.5 bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full text-xs font-medium border border-orange-100 dark:border-orange-800/50"
                    >
                        {t}
                    </span>
                ))}
            </div>
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => onViewDetails?.(job)}
                    className="flex-1 px-3 py-2 bg-gray-900 dark:bg-slate-800 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-slate-700 text-xs font-medium transition-colors"
                >
                    View Details
                </button>
                <button
                    type="button"
                    onClick={() => onBookmarkToggle?.(job)}
                    className="px-3 py-2 border border-gray-300 dark:border-slate-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 text-xs transition-colors flex items-center gap-1"
                >
                    <Bookmark className="w-3 h-3" />
                    {isBookmarked ? "Saved" : "Save"}
                </button>
                <button
                    type="button"
                    onClick={() => onApply?.(job)}
                    className="px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-xs font-medium transition-colors"
                >
                    Apply
                </button>
            </div>
        </div>
    );
}
