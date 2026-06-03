import {
    Send,
    Calendar,
    Clock3,
    FileText,
    TrendingUp,
    CheckCircle2,
    Bookmark,
    CodeXml,
    MoreVertical,
} from "lucide-react";

export default function Dashboard() {
    return (
        <div className="flex flex-col gap-3 w-full font-mono text-slate-900 bg-[#fcfdfd] min-h-screen">
            <header className="flex justify-between items-center py-1.5 border-transparent">
                <div>
                    <h1 className="text-xl font-bold font-sans">
                        Good afternoon, Colin.
                    </h1>
                    <p className="text-slate-500 font-sans mt-0.5 text-xs">
                        Let&apos;s ship some applications today.
                    </p>
                </div>
                <button className="border border-slate-200 bg-white px-3 py-1.5 rounded-md text-xs text-slate-600 flex items-center gap-2 font-sans font-medium hover:bg-slate-50 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                    <span className="text-slate-400">{"</>"}</span> Quick
                    Actions <span className="text-slate-400">⌄</span>
                </button>
            </header>

            <main className="pb-2 flex flex-col gap-2.5">
                {/* Stats Row */}
                <div className="border border-slate-200 rounded-xl bg-white shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-4">
                        <div className="relative p-3.5 flex min-h-[92px] md:after:content-[''] md:after:absolute md:after:right-0 md:after:top-1/2 md:after:-translate-y-1/2 md:after:h-[70%] md:after:w-px md:after:bg-slate-200">
                            <div className="flex items-center justify-between gap-3 w-full">
                                <div>
                                    <div className="text-slate-600 font-sans font-medium mb-1 text-xs">
                                        Applications
                                    </div>
                                    <div className="text-2xl font-bold leading-none font-sans mt-2">
                                        18
                                    </div>
                                    <div className="text-orange-600 text-[10px] flex items-center gap-1.5 font-sans font-medium mt-2">
                                        <span className="w-1 h-1 rounded-full bg-orange-500"></span>{" "}
                                        4 this week
                                    </div>
                                </div>
                                <div className="w-11 h-11 rounded-lg bg-orange-50/80 flex items-center justify-center text-orange-600">
                                    <Send size={20} />
                                </div>
                            </div>
                        </div>

                        <div className="relative p-3.5 flex min-h-[92px] md:after:content-[''] md:after:absolute md:after:right-0 md:after:top-1/2 md:after:-translate-y-1/2 md:after:h-[70%] md:after:w-px md:after:bg-slate-200">
                            <div className="flex items-center justify-between gap-3 w-full">
                                <div>
                                    <div className="text-slate-600 font-sans font-medium mb-1 text-xs">
                                        Interviews
                                    </div>
                                    <div className="text-2xl font-bold leading-none font-sans mt-2">
                                        3
                                    </div>
                                    <div className="text-orange-600 text-[10px] flex items-center gap-1.5 font-sans font-medium mt-2">
                                        <span className="w-1 h-1 rounded-full bg-orange-500"></span>{" "}
                                        1 upcoming
                                    </div>
                                </div>
                                <div className="w-11 h-11 rounded-lg bg-orange-50/80 flex items-center justify-center text-orange-600">
                                    <Calendar size={20} />
                                </div>
                            </div>
                        </div>

                        <div className="relative p-3.5 flex min-h-[92px] md:after:content-[''] md:after:absolute md:after:right-0 md:after:top-1/2 md:after:-translate-y-1/2 md:after:h-[70%] md:after:w-px md:after:bg-slate-200">
                            <div className="flex items-center justify-between gap-3 w-full">
                                <div>
                                    <div className="text-slate-600 font-sans font-medium mb-1 text-xs">
                                        Resumes Generated
                                    </div>
                                    <div className="text-2xl font-bold leading-none font-sans mt-2">
                                        12
                                    </div>
                                    <div className="text-orange-600 text-[10px] flex items-center gap-1.5 font-sans font-medium mt-2">
                                        <span className="w-1 h-1 rounded-full bg-orange-500"></span>{" "}
                                        8 this week
                                    </div>
                                </div>
                                <div className="w-11 h-11 rounded-lg bg-orange-50/80 flex items-center justify-center text-orange-600">
                                    <FileText size={20} />
                                </div>
                            </div>
                        </div>

                        <div className="p-3.5 flex min-h-[92px]">
                            <div className="flex items-center justify-between gap-3 w-full">
                                <div>
                                    <div className="text-slate-600 font-sans font-medium mb-1 text-xs">
                                        ATS Success Rate
                                    </div>
                                    <div className="text-2xl font-bold leading-none font-sans mt-2">
                                        92%
                                    </div>
                                    <div className="text-orange-600 text-[10px] flex items-center gap-1.5 font-sans font-medium mt-2">
                                        <span className="w-1 h-1 rounded-full bg-orange-500"></span>{" "}
                                        +12% vs last week
                                    </div>
                                </div>
                                <div className="w-11 h-11 rounded-lg bg-orange-50/80 flex items-center justify-center text-orange-600">
                                    <TrendingUp size={20} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
                    {/* Recent Activity */}
                    <div className="lg:col-span-3 border border-slate-200 rounded-xl p-4 bg-white shadow-[0_2px_4px_rgba(0,0,0,0.02)] font-sans flex flex-col gap-3 relative">
                        <div className="flex justify-between items-center mb-1">
                            <h2 className="font-bold flex items-center text-xs font-mono text-slate-800">
                                Recent Activity
                            </h2>
                            <button className="text-orange-600 text-[10px] font-mono font-medium flex items-center gap-1 hover:text-orange-700 transition-colors">
                                View all <span>→</span>
                            </button>
                        </div>

                        <div className="space-y-0 divide-y divide-slate-100 flex-1">
                            <div className="flex items-center gap-4 py-2.5 group">
                                <div className="w-8 h-8 rounded-full border-2 border-orange-500/20 bg-orange-50 flex items-center justify-center text-orange-600 shrink-0 group-hover:border-orange-500/40 transition-colors">
                                    <CheckCircle2 size={14} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs text-slate-800 truncate">
                                        Applied to{" "}
                                        <span className="font-bold">
                                            Senior Frontend Engineer
                                        </span>{" "}
                                        at Vercel
                                    </div>
                                    <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                                        2 hours ago
                                    </div>
                                </div>
                                <div className="bg-orange-50/80 px-2 py-0.5 rounded text-[10px] font-bold text-orange-600 font-mono border border-orange-100/50">
                                    Applied
                                </div>
                            </div>

                            <div className="flex items-center gap-4 py-2.5 group">
                                <div className="w-8 h-8 rounded-full border-2 border-orange-500/20 bg-slate-50 flex items-center justify-center text-slate-500 shrink-0 group-hover:border-orange-500/40 transition-colors">
                                    <Bookmark size={14} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs text-slate-800 truncate">
                                        Saved{" "}
                                        <span className="font-bold">
                                            Full Stack Engineer
                                        </span>{" "}
                                        at Linear
                                    </div>
                                    <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                                        5 hours ago
                                    </div>
                                </div>
                                <div className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold text-slate-600 font-mono border border-slate-200/50">
                                    Saved
                                </div>
                            </div>

                            <div className="flex items-center gap-4 py-2.5 group">
                                <div className="w-8 h-8 rounded-full border-2 border-orange-500/20 bg-orange-50 flex items-center justify-center text-orange-600 shrink-0 group-hover:border-orange-500/40 transition-colors">
                                    <CodeXml size={14} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs text-slate-800 truncate">
                                        Generated resume for{" "}
                                        <span className="font-bold">
                                            Software Engineer
                                        </span>{" "}
                                        at Datadog
                                    </div>
                                    <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                                        1 day ago
                                    </div>
                                </div>
                                <div className="bg-orange-50/80 px-2 py-0.5 rounded text-[10px] font-bold text-orange-600 font-mono border border-orange-100/50">
                                    Generated
                                </div>
                            </div>

                            <div className="flex items-center gap-4 py-2.5 group">
                                <div className="w-8 h-8 rounded-full border-2 border-orange-500/20 bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 group-hover:border-blue-500/40 transition-colors">
                                    <Calendar size={14} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs text-slate-800 truncate">
                                        Interview scheduled with{" "}
                                        <span className="font-bold">
                                            Linear
                                        </span>
                                    </div>
                                    <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                                        2 days ago
                                    </div>
                                </div>
                                <div className="bg-blue-50 px-2 py-0.5 rounded text-[10px] font-bold text-blue-600 font-mono border border-blue-100/70">
                                    Upcoming
                                </div>
                            </div>

                            <div className="flex items-center gap-4 py-2.5 pb-0 group">
                                <div className="w-8 h-8 rounded-full border-2 border-orange-500/20 bg-orange-50 flex items-center justify-center text-orange-600 shrink-0 group-hover:border-orange-500/40 transition-colors">
                                    <CheckCircle2 size={14} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs text-slate-800 truncate">
                                        Applied to{" "}
                                        <span className="font-bold">
                                            Backend Engineer
                                        </span>{" "}
                                        at Railway
                                    </div>
                                    <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                                        3 days ago
                                    </div>
                                </div>
                                <div className="bg-orange-50/80 px-2 py-0.5 rounded text-[10px] font-bold text-orange-600 font-mono border border-orange-100/50">
                                    Applied
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Interview */}
                    <div className="lg:col-span-2 border border-slate-200 rounded-xl p-4 bg-white shadow-[0_2px_4px_rgba(0,0,0,0.02)] font-sans flex flex-col gap-3 relative">
                        <div className="flex justify-between items-center mb-1">
                            <h2 className="font-bold flex items-center text-xs font-mono text-slate-800">
                                Upcoming Interview
                            </h2>
                            <button className="text-orange-600 text-[10px] font-mono font-medium flex items-center gap-1 hover:text-orange-700 transition-colors">
                                View all <span>→</span>
                            </button>
                        </div>

                        <div className="mt-1 p-4 bg-slate-50 border border-slate-200/80 rounded-lg flex flex-col gap-3 min-h-[255px]">
                            <div className="flex gap-3 items-center">
                                <div className="w-12 h-12 bg-slate-950 rounded-[0.5rem] flex items-center justify-center text-white font-bold text-2xl shrink-0">
                                    L
                                </div>
                                <div className="leading-snug min-w-0">
                                    <div className="font-bold text-slate-900 text-[1.35rem] leading-none truncate">
                                        Linear
                                    </div>
                                    <div className="text-[11px] text-slate-600 mt-1 truncate">
                                        Full Stack Engineer
                                    </div>
                                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] font-mono text-slate-500 mt-2">
                                        <div className="flex gap-1 items-center">
                                            <Calendar size={10} /> May 30, 2024
                                        </div>
                                        <div className="flex gap-1 items-center">
                                            <Clock3 size={10} /> 2:00 PM PT
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2.5 border-t border-slate-200/80">
                                <div className="text-slate-700 text-[11px] font-mono font-bold">
                                    Prep status
                                </div>
                                <div className="text-slate-600 text-[10px] font-mono leading-relaxed mt-1">
                                    We analyzed the role and your resume.
                                </div>
                                <button className="bg-white border border-orange-400/60 text-orange-700 px-3 py-1.5 mt-3 rounded-md text-[10px] font-mono flex items-center justify-between gap-1.5 hover:bg-orange-50 transition-colors w-fit">
                                    View Prep Kit
                                    <span className="text-orange-700">→</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                    <div className="border border-slate-200 rounded-xl p-3.5 bg-white shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xs font-mono font-bold text-slate-800">
                                Application Pipeline
                            </h3>
                            <button className="text-[10px] font-mono text-orange-600 font-medium hover:text-orange-700">
                                View full pipeline <span>→</span>
                            </button>
                        </div>
                        <div className="mt-2 flex items-center gap-3 text-[10px] font-mono">
                            <div className="flex-1 min-w-0">
                                <div className="text-slate-500">Applied</div>
                                <div className="text-[1.65rem] leading-none text-slate-900 font-sans font-bold mt-1.5">
                                    18
                                </div>
                                <div className="h-0.5 mt-3 bg-slate-200 rounded-full overflow-hidden">
                                    <div className="h-full w-[84%] bg-orange-600"></div>
                                </div>
                            </div>
                            <span className="shrink-0 text-slate-400 text-sm">
                                →
                            </span>
                            <div className="flex-1 min-w-0">
                                <div className="text-slate-500">Screening</div>
                                <div className="text-[1.65rem] leading-none text-slate-900 font-sans font-bold mt-1.5">
                                    7
                                </div>
                                <div className="h-0.5 mt-3 bg-slate-200 rounded-full overflow-hidden">
                                    <div className="h-full w-[33%] bg-amber-400"></div>
                                </div>
                            </div>
                            <span className="shrink-0 text-slate-400 text-sm">
                                →
                            </span>
                            <div className="flex-1 min-w-0">
                                <div className="text-slate-500">Interview</div>
                                <div className="text-[1.65rem] leading-none text-slate-900 font-sans font-bold mt-1.5">
                                    3
                                </div>
                                <div className="h-0.5 mt-3 bg-slate-200 rounded-full overflow-hidden">
                                    <div className="h-full w-[17%] bg-blue-500"></div>
                                </div>
                            </div>
                            <span className="shrink-0 text-slate-400 text-sm">
                                →
                            </span>
                            <div className="flex-1 min-w-0">
                                <div className="text-slate-500">Offer</div>
                                <div className="text-[1.65rem] leading-none text-slate-900 font-sans font-bold mt-1.5">
                                    1
                                </div>
                                <div className="h-0.5 mt-3 bg-slate-200 rounded-full overflow-hidden">
                                    <div className="h-full w-[8%] bg-orange-500"></div>
                                </div>
                            </div>
                            <span className="shrink-0 text-slate-400 text-sm">
                                →
                            </span>
                            <div className="flex-1 min-w-0">
                                <div className="text-slate-500">Rejected</div>
                                <div className="text-[1.65rem] leading-none text-slate-900 font-sans font-bold mt-1.5">
                                    4
                                </div>
                                <div className="h-0.5 mt-3 bg-slate-200 rounded-full overflow-hidden">
                                    <div className="h-full w-[20%] bg-red-500"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border border-slate-200 rounded-xl bg-white shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
                    <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="text-xs font-mono font-bold text-slate-800">
                            Recent Generated Resumes
                        </h3>
                        <button className="text-[10px] font-mono text-orange-600 font-medium hover:text-orange-700">
                            View all <span>→</span>
                        </button>
                    </div>
                    <div className="px-4 py-1.5 text-[10px] font-mono text-slate-400 grid grid-cols-[2fr_1.2fr_1.9fr_1.3fr_1fr] gap-3 border-b border-slate-100">
                        <span>ROLE</span>
                        <span>COMPANY</span>
                        <span>MATCH SCORE</span>
                        <span>GENERATED</span>
                        <span>ACTION</span>
                    </div>
                    <div className="px-4 py-1.5 text-[11px] font-mono text-slate-700 grid grid-cols-[2fr_1.2fr_1.9fr_1.3fr_1fr] gap-3 border-b border-slate-100 items-center">
                        <span>Senior Frontend Engineer</span>
                        <span>Vercel</span>
                        <span className="flex items-center gap-2">
                            <span>99%</span>
                            <span className="h-0.5 flex-1 bg-slate-200 rounded-full overflow-hidden">
                                <span className="block h-full w-[99%] bg-orange-600"></span>
                            </span>
                        </span>
                        <span>2 hours ago</span>
                        <div className="flex items-center gap-2">
                            <button className="border border-slate-300 rounded-md px-3 py-1 text-[10px] text-slate-700 w-fit hover:bg-slate-50">
                                View
                            </button>
                            <button
                                className="text-slate-500 hover:text-slate-700"
                                aria-label="More actions"
                            >
                                <MoreVertical size={14} />
                            </button>
                        </div>
                    </div>
                    <div className="px-4 py-1.5 text-[11px] font-mono text-slate-700 grid grid-cols-[2fr_1.2fr_1.9fr_1.3fr_1fr] gap-3 items-center">
                        <span>Software Engineer</span>
                        <span>Datadog</span>
                        <span className="flex items-center gap-2">
                            <span>93%</span>
                            <span className="h-0.5 flex-1 bg-slate-200 rounded-full overflow-hidden">
                                <span className="block h-full w-[93%] bg-orange-600"></span>
                            </span>
                        </span>
                        <span>1 day ago</span>
                        <div className="flex items-center gap-2">
                            <button className="border border-slate-300 rounded-md px-3 py-1 text-[10px] text-slate-700 w-fit hover:bg-slate-50">
                                View
                            </button>
                            <button
                                className="text-slate-500 hover:text-slate-700"
                                aria-label="More actions"
                            >
                                <MoreVertical size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
