"use client";

import LandingNavBar from "@/components/ui/landingNavBar";
import { AlertCircle, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import LoginModal from "@/components/ui/loginModal";
import { useRouter } from "next/navigation";
import { useState } from "react";



export default function Home() {

    const [ isLoginOpen, setIsLoginOpen] = useState(false);
    const router = useRouter();

    function onOpenLogin() {
        setIsLoginOpen(true);
    }

    function Login() {
        console.log("Login function called");
        router.push("/dashboard");
    }


    return (
        <>
            <header>
                <LandingNavBar onOpenLogin={onOpenLogin} />
            </header>
            <main className="flex-1 overflow-y-auto pt-32 pb-20 px-6 relative overflow-hidden">

                <LoginModal 
                    isOpen={isLoginOpen} 
                    onClose={() => setIsLoginOpen(false)} 
                    onLogin={() => Login()}
                />
                
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-200 h-150 bg-violet-600/20 rounded-[100%] blur-[100px] -z-10 animate-pulse-slow"></div>
                
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                            <Sparkles size={12} />
                            AI-Powered ATS Bypass
                        </div>

                        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight leading-[1.1]">
                            Don&apos;t let robots <br/>
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-fuchsia-400">reject your talent.</span>
                        </h1>

                        <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
                            ResuM8 scans job descriptions and intelligently rewrites your resume keywords to match ATS algorithms in real-time. Get interviewed, not filtered.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button 
                                onClick={onOpenLogin}
                                className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-violet-600/25"
                            >
                                Optimize My Resume <ArrowRight size={18} />
                            </button>
                            <button className="px-8 py-4 rounded-xl font-semibold text-slate-300 border border-slate-700 hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center">
                                <div className="w-0 h-0 border-t-4 border-t-transparent border-l-6 border-l-white border-b-4 border-b-transparent ml-0.5"></div>
                                </div>
                                Watch Demo
                            </button>
                        </div>

                        <div className="pt-8 flex items-center gap-4 text-sm text-slate-500">
                            <div className="flex -space-x-2">
                                {[1,2,3,4].map(i => (
                                <div key={i} className={`w-8 h-8 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center text-[10px] text-white`}>
                                    U{i}
                                </div>
                                ))}
                            </div>
                            <p>Trusted by 10,000+ developers</p>
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden transform rotate-2 group-hover:rotate-0 transition-all duration-500 ease-out">
                            <div className="bg-slate-950 border-b border-slate-800 p-4 flex items-center gap-2">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-emerald-500/50"></div>
                                </div>
                                <div className="bg-slate-800 rounded-md px-3 py-1 text-xs text-slate-400 flex-1 text-center font-mono">
                                resume_final_v2.pdf
                                </div>
                            </div>
                            <div className="p-6 grid grid-cols-2 gap-6 h-100 bg-slate-900/50">
                                <div className="space-y-4 opacity-50 blur-[0.5px]">
                                    <div className="h-8 w-3/4 bg-slate-800 rounded"></div>
                                    <div className="h-4 w-1/2 bg-slate-800 rounded"></div>
                                    <div className="space-y-2 pt-4">
                                        <div className="h-3 w-full bg-slate-800 rounded"></div>
                                        <div className="h-3 w-full bg-slate-800 rounded"></div>
                                        <div className="h-3 w-2/3 bg-slate-800 rounded"></div>
                                    </div>
                                </div>
                                <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-400 uppercase">Analysis</span>
                                        <span className="text-xs bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded">Active</span>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-1">
                                                <CheckCircle2 size={12} /> Optimization Found
                                            </div>
                                            <p className="text-[10px] text-emerald-200/70">Replaced &quot;Managed&quot; with &quot;Orchestrated&quot; for 15% impact increase.</p>
                                        </div>
                                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                                            <div className="flex items-center gap-2 text-red-400 text-xs font-bold mb-1">
                                                <AlertCircle size={12} /> Critical Missing Skill
                                            </div>
                                            <p className="text-[10px] text-red-200/70">Job requires &quot;AWS Lambda&quot; but it appears 0 times.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                
                </div>
            </main>
            <footer className="border-t border-white/5 bg-slate-950 py-12">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-8">Optimized for top ATS platforms</p>
                    <div className="flex flex-wrap justify-center gap-12 grayscale opacity-40">
                        {/* Simple text logos for demo */}
                        <span className="text-xl font-bold text-white">Workday</span>
                        <span className="text-xl font-bold text-white">Greenhouse</span>
                        <span className="text-xl font-bold text-white">Lever</span>
                        <span className="text-xl font-bold text-white">iCIMS</span>
                        <span className="text-xl font-bold text-white">Taleo</span>
                    </div>
                </div>
            </footer>

        </>
    );
}
