"use client";

import {
    Terminal,
    User,
    CodeXml,
    CheckCircle2,
    XCircle,
    ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import LoginModal from "@/components/ui/loginModal";
import LandingNavBar from "@/components/ui/landingNavBar";
import { useState } from "react";

type OAuthProvider = "github" | "google";

export default function LandingPage() {
    const [isLoginOpen, setIsLoginOpen] = useState(false);

    function onLogin(provider: OAuthProvider) {
        setIsLoginOpen(false);
        window.location.href = `/auth/login?provider=${provider}`;
    }

    return (
        <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans selection:bg-emerald-200">
            <LoginModal
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
                onLogin={onLogin}
            />

            {/* Navbar */}
            <LandingNavBar onOpenLogin={() => setIsLoginOpen(true)} />

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-6 pt-20 pb-32">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Left Column - Copy & CTA */}
                    <div className="flex flex-col items-start gap-6 max-w-xl">
                        <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-[4.2rem] font-mono font-bold tracking-tight text-slate-900 leading-[1.1]">
                            Stop getting <br className="hidden md:block" />
                            auto-rejected. <br />
                            <span className="text-emerald-700">Get seen.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-700 max-w-md leading-relaxed mt-4">
                            Find tech jobs. Tailor your resume. <br />
                            Beat ATS. Get interviews.
                        </p>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mt-8">
                            <Button
                                size="lg"
                                onClick={() => setIsLoginOpen(true)}
                                className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-md text-lg px-8 py-7 flex items-center gap-3 shadow-lg shadow-emerald-900/20"
                            >
                                <span className="font-mono text-emerald-300 font-bold">
                                    {">_"}
                                </span>{" "}
                                Join the Beta
                            </Button>
                            <Button
                                variant="link"
                                className="text-emerald-700 font-bold font-mono flex items-center gap-2 group-hover:underline"
                            >
                                See how it works &rarr;
                            </Button>
                        </div>
                    </div>

                    {/* Right Column - Resume Comparison Visual */}
                    <div className="relative w-full h-[500px] md:h-[600px] mt-12 md:mt-0 font-mono">
                        {/* Bad Resume (Background left) */}
                        <div className="absolute left-0 md:left-2 lg:left-4 top-16 md:top-20 w-[240px] lg:w-[260px] bg-slate-50 rounded-xl shadow-lg border border-slate-200 p-5 z-0 transform transition-transform hover:-translate-y-1">
                            <div className="text-xs text-slate-500 mb-6 border-b border-slate-200 pb-4">
                                Your resume.pdf
                            </div>
                            <div className="flex items-center gap-2 text-red-500 mb-2">
                                <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center border border-red-200">
                                    <XCircle className="w-3 h-3" />
                                </div>
                                <span className="font-bold text-xs tracking-wide">
                                    Match Score
                                </span>
                            </div>
                            <div className="text-5xl font-bold text-red-500 mb-4">
                                12%
                            </div>
                            <div className="text-xs font-bold text-slate-700 mb-3">
                                Rejected by ATS
                            </div>
                            <ul className="space-y-2.5 text-xs text-slate-600">
                                <li className="flex items-center gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>{" "}
                                    Missing keywords
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>{" "}
                                    Weak impact
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>{" "}
                                    Unclear tech
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>{" "}
                                    Poor formatting
                                </li>
                            </ul>
                            {/* Fake visual bars for rejected resume */}
                            <div className="mt-8 flex gap-1 h-6 opacity-40">
                                {Array.from({ length: 15 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className={`w-2 rounded-t-sm h-full mt-auto ${i < 3 ? "bg-red-400" : "bg-slate-300"}`}
                                    ></div>
                                ))}
                            </div>
                        </div>

                        {/* Good Resume (Foreground right) */}
                        <div className="absolute left-[160px] md:left-[180px] lg:left-[210px] xl:left-[240px] top-6 md:top-8 w-[280px] lg:w-[320px] bg-white rounded-xl shadow-2xl border border-slate-200 p-6 z-10 transform px-8 transition-transform hover:-translate-y-2">
                            <div className="text-xs text-slate-500 mb-6 border-b border-slate-100 pb-4">
                                ResumeAI optimized.pdf
                            </div>
                            <div className="flex items-center gap-2 text-emerald-700 mb-2">
                                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center border border-emerald-200">
                                    <CheckCircle2 className="w-3 h-3" />
                                </div>
                                <span className="font-bold text-xs tracking-wide">
                                    Match Score
                                </span>
                            </div>
                            <div className="text-6xl font-bold text-emerald-600 mb-4">
                                92%
                            </div>
                            <div className="text-xs font-bold text-slate-700 mb-3">
                                ATS friendly
                            </div>
                            <ul className="space-y-2.5 text-xs text-slate-600">
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />{" "}
                                    Right keywords
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />{" "}
                                    Strong impact
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />{" "}
                                    Clear skills
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />{" "}
                                    Clean formatting
                                </li>
                            </ul>
                            {/* Fake visual bars for accepted resume */}
                            <div className="mt-8 flex gap-1 h-8">
                                {Array.from({ length: 20 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className={`w-2 md:w-2.5 rounded-t-sm h-full mt-auto ${i < 17 ? "bg-emerald-600" : "bg-slate-200"}`}
                                    ></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Stats Section */}
            <section className="border-y border-slate-200 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
                        {/* Stat 1: Reality */}
                        <div className="py-12 lg:pr-12 flex flex-col justify-center">
                            <div className="text-emerald-700 font-mono text-sm mb-3">
                                {"// the reality"}
                            </div>
                            <p className="text-slate-600 leading-relaxed font-mono text-sm max-w-[200px]">
                                Most resumes never reach a human.
                            </p>
                        </div>

                        {/* Stat 2: 75% ATS */}
                        <div className="py-12 sm:px-8 lg:px-12 flex items-center gap-6">
                            <div className="relative w-16 h-16 flex-shrink-0">
                                {/* SVG Donut Chart representing 75% */}
                                <svg
                                    className="w-full h-full -rotate-270"
                                    viewBox="0 0 36 36"
                                >
                                    <path
                                        className="text-slate-100"
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="text-emerald-700"
                                        strokeDasharray="75, 100"
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                </svg>
                            </div>
                            <div>
                                <div className="text-emerald-700 text-2xl font-bold font-mono mb-1">
                                    ~75%
                                </div>
                                <p className="text-slate-600 text-sm font-mono max-w-[140px] leading-tight">
                                    of resumes are rejected by ATS
                                </p>
                            </div>
                        </div>

                        {/* Stat 3: Seconds */}
                        <div className="py-12 sm:px-8 lg:px-12 flex items-center gap-6">
                            <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center text-slate-800">
                                <CodeXml className="w-12 h-12 stroke-[1.5]" />
                            </div>
                            <div>
                                <div className="text-emerald-700 text-xl font-bold font-mono mb-1">
                                    Seconds
                                </div>
                                <p className="text-slate-600 text-sm font-mono max-w-[140px] leading-tight">
                                    spent scanning your resume
                                </p>
                            </div>
                        </div>

                        {/* Stat 4: 0 Humans */}
                        <div className="py-12 lg:pl-12 flex items-center gap-6">
                            <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center text-slate-800">
                                <User className="w-10 h-10 stroke-[1.5]" />
                            </div>
                            <div>
                                <div className="text-emerald-700 text-2xl font-bold font-mono mb-1">
                                    0
                                </div>
                                <p className="text-slate-600 text-sm font-mono max-w-[140px] leading-tight">
                                    humans (usually) see it
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Developer Features Section */}
            <section className="bg-slate-950 text-slate-200 py-32 relative overflow-hidden font-mono">
                {/* Subtle Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20"></div>

                <div className="max-w-screen-2xl mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-[1fr_1.5fr_1.5fr] gap-12 lg:gap-16 items-center">
                        {/* Left Column - Copy */}
                        <div className="flex flex-col items-start">
                            <div className="text-emerald-500 text-sm mb-6">
                                {"// how it works"}
                            </div>
                            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-white mb-8 leading-[1.1]">
                                You code.{" "}
                                <span className="text-emerald-500">
                                    We tailor.
                                </span>
                            </h2>
                            <p className="text-slate-300 text-lg leading-relaxed max-w-sm font-sans">
                                ResumeAI does the boring matching so you can get
                                back to shipping.
                            </p>
                        </div>

                        {/* Middle Column - Steps */}
                        <div className="py-4 lg:px-8">
                            <div className="space-y-10 relative z-10">
                                {/* Connecting Line */}
                                <div className="absolute left-[calc(1.5rem-1px)] top-4 bottom-4 w-[2px] border-l-2 border-dashed border-emerald-600/30 -z-10"></div>

                                {/* Step 1 */}
                                <div className="flex items-start gap-6 group">
                                    <div className="w-12 h-12 rounded-full border-2 border-emerald-500 bg-slate-950 flex items-center justify-center text-slate-300 font-bold text-lg shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.15)] group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-shadow">
                                        1
                                    </div>
                                    <div className="pt-2">
                                        <h3 className="font-bold text-white mb-2 text-lg">
                                            We find relevant tech jobs
                                        </h3>
                                        <p className="text-slate-400 text-sm font-sans">
                                            Roles worth applying to. No LinkedIn
                                            noise.
                                        </p>
                                    </div>
                                </div>

                                {/* Step 2 */}
                                <div className="flex items-start gap-6 group">
                                    <div className="w-12 h-12 rounded-full border-2 border-emerald-500 bg-slate-950 flex items-center justify-center text-slate-300 font-bold text-lg shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.15)] group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-shadow">
                                        2
                                    </div>
                                    <div className="pt-2">
                                        <h3 className="font-bold text-white mb-2 text-lg">
                                            AI reads the job + your resume
                                        </h3>
                                        <p className="text-slate-400 text-sm font-sans">
                                            Extracts requirements, tech stack,
                                            and intent.
                                        </p>
                                    </div>
                                </div>

                                {/* Step 3 */}
                                <div className="flex items-start gap-6 group">
                                    <div className="w-12 h-12 rounded-full border-2 border-emerald-500 bg-slate-950 flex items-center justify-center text-slate-300 font-bold text-lg shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.15)] group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-shadow">
                                        3
                                    </div>
                                    <div className="pt-2">
                                        <h3 className="font-bold text-white mb-2 text-lg">
                                            We tailor your resume
                                        </h3>
                                        <p className="text-slate-400 text-sm font-sans">
                                            Rewrites, reorders, and optimizes
                                            for ATS.
                                        </p>
                                    </div>
                                </div>

                                {/* Step 4 */}
                                <div className="flex items-start gap-6 group">
                                    <div className="w-12 h-12 rounded-full border-2 border-emerald-500 bg-slate-950 flex items-center justify-center text-slate-300 font-bold text-lg shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.15)] group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-shadow">
                                        4
                                    </div>
                                    <div className="pt-2">
                                        <h3 className="font-bold text-white mb-2 text-lg">
                                            You apply with confidence
                                        </h3>
                                        <p className="text-slate-400 text-sm font-sans">
                                            Higher match score. More interviews.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Code Window */}
                        <div className="rounded-xl overflow-hidden shadow-2xl border border-slate-800 bg-[#0c1222] font-mono text-sm w-full xl:w-[110%] relative -right-0 xl:-right-[10%]">
                            <div className="p-6 md:p-8 flex overflow-x-auto text-[13px] md:text-sm leading-[2] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                {/* Line Numbers */}
                                <div className="flex flex-col text-slate-600/60 text-right pr-6 select-none shrink-0 border-r border-slate-800/50 mr-6">
                                    <span>01</span>
                                    <span>02</span>
                                    <span>03</span>
                                    <span>04</span>
                                    <span>05</span>
                                    <span>06</span>
                                    <span>07</span>
                                    <span>08</span>
                                    <span>09</span>
                                    <span>10</span>
                                    <span>11</span>
                                    <span>12</span>
                                    <span>13</span>
                                    <span>14</span>
                                </div>

                                {/* Code */}
                                <div className="flex flex-col min-w-max whitespace-pre text-slate-300">
                                    <div>
                                        <span className="text-emerald-300">
                                            const
                                        </span>{" "}
                                        <span className="text-slate-200">
                                            you
                                        </span>{" "}
                                        = {"{"}
                                    </div>
                                    <div>
                                        {" "}
                                        <span className="text-pink-400">
                                            skills
                                        </span>
                                        : [
                                        <span className="text-orange-300">
                                            &quot;React&quot;
                                        </span>
                                        ,{" "}
                                        <span className="text-orange-300">
                                            &quot;Node.js&quot;
                                        </span>
                                        ,
                                    </div>
                                    <div>
                                        {" "}
                                        <span className="text-orange-300">
                                            &quot;TypeScript&quot;
                                        </span>
                                        ,{" "}
                                        <span className="text-orange-300">
                                            &quot;AWS&quot;
                                        </span>
                                        ],
                                    </div>
                                    <div>
                                        {" "}
                                        <span className="text-pink-400">
                                            experience
                                        </span>
                                        :{" "}
                                        <span className="text-orange-300">
                                            &quot;3+ years&quot;
                                        </span>
                                        ,
                                    </div>
                                    <div>{"};"}</div>
                                    <div className="h-7"></div>
                                    <div>
                                        <span className="text-emerald-300">
                                            const
                                        </span>{" "}
                                        <span className="text-slate-200">
                                            resume
                                        </span>{" "}
                                        ={" "}
                                        <span className="text-emerald-300">
                                            await
                                        </span>
                                    </div>
                                    <div>
                                        {" "}
                                        <span className="text-slate-200">
                                            resumeAI
                                        </span>
                                        .
                                        <span className="text-cyan-300">
                                            optimize
                                        </span>
                                        ({"{"}
                                    </div>
                                    <div>
                                        {" "}
                                        you,{" "}
                                        <span className="text-emerald-600/50 -rotate-45 inline-block -ml-2 select-none">
                                            ➤
                                        </span>
                                    </div>
                                    <div>
                                        {" "}
                                        <span className="text-pink-400">
                                            jobId
                                        </span>
                                        :{" "}
                                        <span className="text-orange-300">
                                            &quot;48392&quot;
                                        </span>
                                        ,
                                    </div>
                                    <div> {"});"}</div>
                                    <div className="h-7"></div>
                                    <div className="text-emerald-600/80">
                                        {"// More interviews"}
                                    </div>
                                    <div className="text-emerald-600/80">
                                        {"// Less resume tweaking"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Early Access CTA */}
            <section className="py-32 max-w-7xl mx-auto px-6 relative">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#cbd5e1_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-20 -z-10 [mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)]"></div>

                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left CTA Copy */}
                    <div>
                        <div className="inline-block bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-sm text-xs tracking-wider mb-6">
                            BETA
                        </div>
                        <h2 className="text-4xl md:text-5xl font-mono font-bold tracking-tight text-slate-900 leading-[1.1] mb-6">
                            <span className="text-emerald-700">
                                Early access.
                            </span>
                            <br />
                            Real impact.
                        </h2>
                        <p className="text-slate-600 text-lg max-w-md">
                            Help shape ResumeAI and get lifetime beta perks.
                        </p>
                    </div>

                    {/* Right CTA Box */}
                    <div className="relative">
                        <div className="border border-dashed border-emerald-600 rounded-3xl p-8 md:p-12 bg-white/50 backdrop-blur-sm">
                            <div className="w-12 h-12 bg-emerald-700 rounded-lg flex items-center justify-center text-white mb-6 font-mono font-bold text-xl shadow-lg shadow-emerald-900/20">
                                {">_"}
                            </div>
                            <h3 className="text-3xl font-mono font-bold text-slate-900 mb-2">
                                Join the beta
                            </h3>
                            <p className="text-slate-600 font-mono text-sm mb-8">
                                Be part of the build.
                            </p>

                            <Button
                                size="lg"
                                onClick={() => setIsLoginOpen(true)}
                                className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white rounded-md text-lg px-8 py-6 flex items-center gap-3"
                            >
                                <span className="font-mono text-emerald-300 font-bold">
                                    {">_"}
                                </span>{" "}
                                Get Beta Access
                            </Button>
                            <p className="text-slate-400 font-mono text-xs mt-6">
                                It&apos;s free. Seriously.
                            </p>
                        </div>

                        {/* Sticky Note */}
                        <div className="absolute -right-4 md:-right-8 -top-8 rotate-6 bg-[#dcfce7] p-6 shadow-xl w-48 font-mono aspect-square flex flex-col items-center justify-center text-center">
                            <div className="text-emerald-900 font-medium text-lg leading-tight mb-3">
                                Ship code
                                <br />
                                Not resumes
                            </div>
                            <CodeXml className="w-8 h-8 text-emerald-800/80" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-200 bg-[#fefefe] py-8 text-sm text-slate-500">
                <div className="flex flex-col sm:flex-row items-center justify-between px-6 max-w-7xl mx-auto">
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                        <span className="text-emerald-700 font-mono">
                            {">_"}
                        </span>{" "}
                        ResumeAI
                    </div>
                    <p className="italic font-mono mt-4 sm:mt-0">
                        Made by developers who hate ATS
                    </p>
                    <div className="flex gap-6 mt-4 sm:mt-0">
                        <Link href="#" className="hover:text-slate-900">
                            Roadmap
                        </Link>
                        <Link href="#" className="hover:text-slate-900">
                            Changelog
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
