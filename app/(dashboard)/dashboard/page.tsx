import { Search, Sparkles } from "lucide-react";

export default function Dashboard() {
    const stats = [
        {
            label: "Jobs Applied",
            value: "12",
            delta: "+3 this week",
            color: "#8b5cf6",
            fill: "#ede9fe",
            data: [3, 5, 4, 7, 6, 9, 12],
        },
        {
            label: "Saved Jobs",
            value: "27",
            delta: "+5 this week",
            color: "#3b82f6",
            fill: "#dbeafe",
            data: [10, 12, 14, 16, 18, 22, 27],
        },

        {
            label: "Interviews",
            value: "3",
            delta: "2 upcoming",
            color: "#a855f7",
            fill: "#f3e8ff",
            data: [0, 0, 1, 1, 1, 2, 3],
        },
    ];

    const Sparkline = ({
        data,
        color,
        fill,
    }: {
        data: number[];
        color: string;
        fill: string;
    }) => {
        const w = 120,
            h = 40,
            pad = 2;
        const min = Math.min(...data),
            max = Math.max(...data);
        const range = max - min || 1;
        const pts = data.map((v, i) => [
            pad + (i / (data.length - 1)) * (w - pad * 2),
            pad + (1 - (v - min) / range) * (h - pad * 2),
        ]);
        const line = pts
            .map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`)
            .join(" ");
        const area = `${line} L${pts[pts.length - 1][0]},${h} L${pts[0][0]},${h} Z`;
        return (
            <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-10">
                <path d={area} fill={fill} opacity="0.6" />
                <path
                    d={line}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <circle
                    cx={pts[pts.length - 1][0]}
                    cy={pts[pts.length - 1][1]}
                    r="3"
                    fill={color}
                />
            </svg>
        );
    };

    const activity = [
        {
            action: "Applied to",
            target: "Senior React Developer",
            company: "TechCorp",
            time: "2h ago",
            status: "applied",
            logo: "🚀",
        },
        {
            action: "Saved",
            target: "Full Stack Engineer",
            company: "StartupXYZ",
            time: "5h ago",
            status: "saved",
            logo: "⚡",
        },
        {
            action: "Generated resume for",
            target: "Frontend Developer",
            company: "WebSolutions",
            time: "1d ago",
            status: "generated",
            logo: "🎯",
        },
        {
            action: "Applied to",
            target: "Software Engineer Intern",
            company: "Google",
            time: "2d ago",
            status: "applied",
            logo: "🔵",
        },
        {
            action: "Saved",
            target: "React Developer",
            company: "ShopifyPlus",
            time: "3d ago",
            status: "saved",
            logo: "🛍️",
        },
    ];

    const pipeline = [
        {
            stage: "Applied",
            count: 12,
            color: "bg-blue-500",
            light: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        },
        {
            stage: "Screening",
            count: 5,
            color: "bg-yellow-400",
            light: "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
        },
        {
            stage: "Interview",
            count: 3,
            color: "bg-purple-500",
            light: "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
        },
        {
            stage: "Offer",
            count: 1,
            color: "bg-fuchsia-500",
            light: "bg-fuchsia-50 text-fuchsia-700 dark:bg-fuchsia-900/30 dark:text-fuchsia-400",
        },
        {
            stage: "Rejected",
            count: 3,
            color: "bg-red-400",
            light: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        },
    ];

    const jobListings = [
        {
            id: 1,
            title: "Senior React Developer",
            company: "TechCorp",
            location: "Remote",
            tags: ["React", "JavaScript", "Full-Time"],
            logo: "🚀",
        },
        {
            id: 2,
            title: "Full Stack Engineer",
            company: "StartupXYZ",
            location: "New York, NY",
            tags: ["Node.js", "React", "AWS"],
            logo: "⚡",
        },
        {
            id: 3,
            title: "Frontend Developer",
            company: "WebSolutions",
            location: "San Francisco, CA",
            tags: ["HTML", "CSS", "JavaScript"],
            logo: "🎯",
        },
        {
            id: 4,
            title: "Software Engineer Intern",
            company: "Google",
            location: "Mountain View, CA",
            tags: ["Python", "C++", "Internship"],
            logo: "🔵",
        },
        {
            id: 5,
            title: "React Developer",
            company: "ShopifyPlus",
            location: "Remote",
            tags: ["React", "E-commerce", "Full-Time"],
            logo: "🛍️",
        },
    ];

    const recommended = jobListings.slice(0, 2);

    const statusColors: Record<string, string> = {
        applied:
            "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        saved: "bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-gray-400",
        generated:
            "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
    };

    return (
        <>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Welcome back, User 👋
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        Here&apos;s what&apos;s happening with your job search
                    </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-xl text-sm font-medium hover:bg-violet-700 transition-colors shadow">
                    <Search className="w-4 h-4" /> Find Jobs
                </button>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                {stats.map((s, i) => (
                    <div
                        key={i}
                        className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-5"
                    >
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            {s.label}
                        </p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                            {s.value}
                        </p>
                        <p
                            className="text-xs font-medium mb-3"
                            style={{ color: s.color }}
                        >
                            {s.delta}
                        </p>
                        <Sparkline
                            data={s.data}
                            color={s.color}
                            fill={s.fill}
                        />
                    </div>
                ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Application Pipeline */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-6">
                    <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-5">
                        Application Pipeline
                    </h2>
                    <div className="space-y-3">
                        {pipeline.map((p, i) => {
                            const total = pipeline.reduce(
                                (a, x) => a + x.count,
                                0,
                            );
                            const pct = Math.round((p.count / total) * 100);
                            return (
                                <div key={i}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm text-gray-600 dark:text-gray-300">
                                            {p.stage}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-400 dark:text-gray-500">
                                                {pct}%
                                            </span>
                                            <span
                                                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${p.light}`}
                                            >
                                                {p.count}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${p.color} transition-all`}
                                            style={{ width: `${pct}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-5 pt-4 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-sm">
                        <span className="text-gray-400 dark:text-gray-500">
                            Total applications
                        </span>
                        <span className="font-bold text-gray-900 dark:text-gray-100">
                            {pipeline.reduce((a, x) => a + x.count, 0)}
                        </span>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-6">
                    <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
                        Recent Activity
                    </h2>
                    <div className="space-y-3">
                        {activity.map((a, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-linear-to-br from-violet-950/50 to-purple-900/50 border border-violet-900/50 rounded-lg flex items-center justify-center text-base shrink-0">
                                    {a.logo}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-700 dark:text-gray-200 truncate">
                                        <span className="text-gray-400 dark:text-gray-500">
                                            {a.action}
                                        </span>{" "}
                                        <span className="font-medium">
                                            {a.target}
                                        </span>
                                    </p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500">
                                        {a.company} · {a.time}
                                    </p>
                                </div>
                                <span
                                    className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${statusColors[a.status]}`}
                                >
                                    {a.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Recommended Jobs */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                            Recommended for You
                        </h2>
                        <button className="text-xs text-violet-600 dark:text-violet-400 hover:underline font-medium">
                            View all →
                        </button>
                    </div>
                    <div className="grid gap-4">
                        {recommended.map((job) => (
                            <div
                                key={job.id}
                                className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 dark:border-slate-800 hover:border-violet-200 dark:hover:border-violet-800/50 hover:bg-violet-50/30 dark:hover:bg-violet-900/20 transition-all cursor-pointer"
                            >
                                <div className="w-10 h-10 bg-linear-to-br from-violet-50 to-purple-100 dark:from-violet-950/50 dark:to-purple-900/50 border border-violet-100 dark:border-violet-900/50 rounded-xl flex items-center justify-center text-lg shrink-0">
                                    {job.logo}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                                        {job.title}
                                    </p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500">
                                        {job.company} · {job.location}
                                    </p>
                                    <div className="flex gap-1 mt-1 flex-wrap">
                                        {job.tags.slice(0, 3).map((t, i) => (
                                            <span
                                                key={i}
                                                className="px-1.5 py-0.5 bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded text-xs border border-violet-100 dark:border-violet-800/50"
                                            >
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="p-3 bg-linear-to-r from-violet-500 to-purple-600 rounded-xl text-white flex flex-col justify-between">
                            <div className="flex items-center gap-2 mb-1">
                                <Sparkles className="w-4 h-4" />
                                <span className="text-sm font-semibold">
                                    Boost your chances
                                </span>
                            </div>
                            <p className="text-xs text-violet-100 mb-3">
                                Paste a job description to generate a tailored
                                resume instantly.
                            </p>
                            <button className="px-3 py-1.5 bg-white text-violet-700 dark:bg-slate-950 dark:text-violet-400 rounded-lg text-xs font-semibold hover:bg-violet-50 dark:hover:bg-slate-900 transition-colors self-start">
                                Try Custom Job Gen →
                            </button>
                        </div>
                    </div>
                </div>
                {/* Upcoming Interviews */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-6 mb-6">
                    <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                        Upcoming Interviews
                    </h2>
                </div>
            </div>
        </>
    );
}
