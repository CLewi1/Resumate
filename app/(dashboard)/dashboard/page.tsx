import {
    Send,
    Calendar,
    FileText,
    TrendingUp,
    CheckCircle2,
    Bookmark,
    CodeXml,
} from "lucide-react";

export default function Dashboard() {
    return (
        <div className="flex flex-col gap-8 w-full font-mono text-slate-900 bg-[#fcfdfd] min-h-screen">
            <header className="flex justify-between items-center py-2 border-transparent">
                <div>
                    <h1 className="text-2xl font-bold font-sans">
                        Good afternoon, Colin.
                    </h1>
                    <p className="text-slate-500 font-sans mt-1 text-sm">
                        Let&apos;s ship some applications today.
                    </p>
                </div>
                <button className="border border-slate-200 bg-white px-4 py-2 rounded-md text-sm text-slate-600 flex items-center gap-2 font-sans font-medium hover:bg-slate-50 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                    <span className="text-slate-400">{"</>"}</span> Quick
                    Actions <span className="text-slate-400">⌄</span>
                </button>
            </header>

            <main className="pb-12 flex flex-col gap-6">
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="border border-slate-200 rounded-[1rem] p-6 bg-white shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[140px]">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="text-slate-600 font-sans font-medium mb-1 text-sm">
                                    Applications
                                </div>
                                <div className="text-[2rem] font-bold leading-none font-sans mt-2">
                                    18
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-emerald-50/80 flex items-center justify-center text-emerald-600">
                                <Send size={18} className="-translate-y-0.5" />
                            </div>
                        </div>
                        <div className="text-emerald-600 text-xs flex items-center gap-1.5 font-sans font-medium mt-auto pt-4">
                            <span className="w-1 h-1 rounded-full bg-emerald-500"></span>{" "}
                            4 this week
                        </div>
                    </div>

                    <div className="border border-slate-200 rounded-[1rem] p-6 bg-white shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[140px]">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="text-slate-600 font-sans font-medium mb-1 text-sm">
                                    Interviews
                                </div>
                                <div className="text-[2rem] font-bold leading-none font-sans mt-2">
                                    3
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-emerald-50/80 flex items-center justify-center text-emerald-600">
                                <Calendar size={18} />
                            </div>
                        </div>
                        <div className="text-emerald-600 text-xs flex items-center gap-1.5 font-sans font-medium mt-auto pt-4">
                            <span className="w-1 h-1 rounded-full bg-emerald-500"></span>{" "}
                            1 upcoming
                        </div>
                    </div>

                    <div className="border border-slate-200 rounded-[1rem] p-6 bg-white shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[140px]">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="text-slate-600 font-sans font-medium mb-1 text-sm">
                                    Resumes Generated
                                </div>
                                <div className="text-[2rem] font-bold leading-none font-sans mt-2">
                                    12
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-emerald-50/80 flex items-center justify-center text-emerald-600">
                                <FileText size={18} />
                            </div>
                        </div>
                        <div className="text-emerald-600 text-xs flex items-center gap-1.5 font-sans font-medium mt-auto pt-4">
                            <span className="w-1 h-1 rounded-full bg-emerald-500"></span>{" "}
                            8 this week
                        </div>
                    </div>

                    <div className="border border-slate-200 rounded-[1rem] p-6 bg-white shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[140px]">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="text-slate-600 font-sans font-medium mb-1 text-sm">
                                    ATS Success Rate
                                </div>
                                <div className="text-[2rem] font-bold leading-none font-sans mt-2">
                                    92%
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-emerald-50/80 flex items-center justify-center text-emerald-600">
                                <TrendingUp size={18} />
                            </div>
                        </div>
                        <div className="text-emerald-600 text-xs flex items-center gap-1.5 font-sans font-medium mt-auto pt-4">
                            <span className="w-1 h-1 rounded-full bg-emerald-500"></span>{" "}
                            +12% vs last week
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
                    {/* Recent Activity */}
                    <div className="lg:col-span-2 border border-slate-200 rounded-[1rem] p-8 bg-white shadow-[0_2px_4px_rgba(0,0,0,0.02)] font-sans flex flex-col gap-6 relative">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="font-bold flex items-center text-sm font-mono text-slate-800">
                                Recent Activity
                            </h2>
                            <button className="text-emerald-600 text-xs font-mono font-medium flex items-center gap-1 hover:text-emerald-700 transition-colors">
                                View all <span>→</span>
                            </button>
                        </div>

                        <div className="space-y-0 divide-y divide-slate-100 flex-1">
                            <div className="flex items-center gap-6 py-5 group">
                                <div className="w-10 h-10 rounded-full border-2 border-emerald-500/20 bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 group-hover:border-emerald-500/40 transition-colors">
                                    <CheckCircle2 size={18} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-[13px] text-slate-800 truncate">
                                        Applied to{" "}
                                        <span className="font-bold">
                                            Senior Frontend Engineer
                                        </span>{" "}
                                        at Vercel
                                    </div>
                                    <div className="text-xs text-slate-400 mt-1 font-mono">
                                        2 hours ago
                                    </div>
                                </div>
                                <div className="bg-emerald-50/80 px-3 py-1 rounded text-[11px] font-bold text-emerald-600 font-mono border border-emerald-100/50">
                                    Applied
                                </div>
                            </div>

                            <div className="flex items-center gap-6 py-5 group">
                                <div className="w-10 h-10 rounded-full border-2 border-emerald-500/20 bg-slate-50 flex items-center justify-center text-slate-500 shrink-0 group-hover:border-emerald-500/40 transition-colors">
                                    <Bookmark size={18} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-[13px] text-slate-800 truncate">
                                        Saved{" "}
                                        <span className="font-bold">
                                            Full Stack Engineer
                                        </span>{" "}
                                        at Linear
                                    </div>
                                    <div className="text-xs text-slate-400 mt-1 font-mono">
                                        5 hours ago
                                    </div>
                                </div>
                                <div className="bg-slate-100 px-3 py-1 rounded text-[11px] font-bold text-slate-600 font-mono border border-slate-200/50">
                                    Saved
                                </div>
                            </div>

                            <div className="flex items-center gap-6 py-5 pt-5 pb-0 group">
                                <div className="w-10 h-10 rounded-full border-2 border-emerald-500/20 bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 group-hover:border-emerald-500/40 transition-colors">
                                    <CodeXml size={18} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-[13px] text-slate-800 truncate">
                                        Generated resume for{" "}
                                        <span className="font-bold">
                                            Software Engineer
                                        </span>{" "}
                                        at Datadog
                                    </div>
                                    <div className="text-xs text-slate-400 mt-1 font-mono">
                                        1 day ago
                                    </div>
                                </div>
                                <div className="bg-emerald-50/80 px-3 py-1 rounded text-[11px] font-bold text-emerald-600 font-mono border border-emerald-100/50">
                                    Generated
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Next Interview */}
                    <div className="lg:col-span-1 border border-slate-200 rounded-[1rem] p-8 bg-white shadow-[0_2px_4px_rgba(0,0,0,0.02)] font-sans flex flex-col gap-6 relative">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="font-bold flex items-center text-sm font-mono text-slate-800">
                                Next Interview
                            </h2>
                            <button className="text-emerald-600 text-xs font-mono font-medium flex items-center gap-1 hover:text-emerald-700 transition-colors">
                                View all <span>→</span>
                            </button>
                        </div>

                        <div className="flex gap-4 items-center mt-2">
                            <div className="w-14 h-14 bg-slate-950 rounded-[0.7rem] flex items-center justify-center text-white font-bold text-2xl shrink-0">
                                L
                            </div>
                            <div className="leading-snug min-w-0">
                                <div className="font-bold text-slate-900 text-[15px] truncate">
                                    Linear
                                </div>
                                <div className="text-[13px] text-slate-600 mt-0.5 truncate">
                                    Full Stack Engineer
                                </div>
                                <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-mono text-slate-500 mt-2">
                                    <div className="flex gap-1.5 items-center">
                                        <Calendar size={12} /> May 30, 2024
                                    </div>
                                    <div className="flex gap-1.5 items-center">
                                        <span className="text-sm">◷</span> 2:00
                                        PM PT
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto pt-4">
                            <div className="p-5 bg-emerald-50/50 border border-emerald-100/50 rounded-xl flex flex-col gap-3">
                                <div className="text-emerald-700 text-xs font-mono font-bold">
                                    Prep ready
                                </div>
                                <div className="text-slate-600 text-xs font-mono leading-relaxed">
                                    We analyzed the role and your resume.
                                </div>
                                <button className="bg-white border border-emerald-200/60 text-emerald-700 px-4 py-2 mt-1 rounded-lg text-xs font-mono flex items-center justify-between gap-1.5 hover:bg-emerald-50 transition-colors shadow-sm shadow-emerald-900/5 font-medium group">
                                    View Prep Kit
                                    <span className="text-emerald-700 ml-0.5 group-hover:translate-x-0.5 transition-transform">
                                        →
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                    <div className="border border-slate-200 rounded-[1rem] p-8 bg-white shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-center items-center h-64 text-slate-400 font-mono text-sm">
                        Pipeline Component Scaffold
                    </div>
                    <div className="border border-slate-200 rounded-[1rem] p-8 bg-slate-950 shadow-[0_4px_12px_rgba(0,0,0,0.1)] flex flex-col justify-center items-center h-64 text-slate-500 font-mono text-sm">
                        Pro Tip Component Scaffold
                    </div>
                </div>
            </main>
        </div>
    );
}
