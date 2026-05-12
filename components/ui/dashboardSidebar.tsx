/* eslint-disable react/jsx-no-comment-textnodes */
"use client";

import {
    Home,
    Search,
    Code,
    Bookmark,
    Send,
    FileText,
    ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const navLinks = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "Search", path: "/search", icon: Search },
    { name: "Custom Job Gen", path: "/generate", icon: Code },
    { name: "Bookmarked", path: "/bookmarked", icon: Bookmark },
    { name: "Applied", path: "/applied", icon: Send },
    { name: "Resume", path: "/resumes", icon: FileText },
];

export function DashboardSidebar({ userEmail }: { userEmail?: string }) {
    const pathname = usePathname();
    const router = useRouter();
    const menuRef = useRef<HTMLDivElement | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [extensionKey, setExtensionKey] = useState<string | null>(null);
    const [copyStatus, setCopyStatus] = useState("idle");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        function handleClick(event: MouseEvent) {
            if (!menuRef.current) return;
            if (!menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        }

        function handleKey(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setIsMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClick);
        document.addEventListener("keydown", handleKey);

        return () => {
            document.removeEventListener("mousedown", handleClick);
            document.removeEventListener("keydown", handleKey);
        };
    }, []);

    async function onGenerateExtensionKey() {
        setIsGenerating(true);
        setExtensionKey(null);
        setCopyStatus("idle");
        setErrorMessage(null);

        try {
            const response = await fetch("/api/extension-key", {
                method: "POST",
            });

            if (!response.ok) {
                const body = await response.json().catch(() => null);
                setErrorMessage(body?.error ?? "Failed to generate key");
                return;
            }

            const data = await response.json();
            setExtensionKey(data?.token ?? null);
        } catch {
            setErrorMessage("Failed to generate key");
        } finally {
            setIsGenerating(false);
        }
    }

    async function onCopyKey() {
        if (!extensionKey) return;

        try {
            await navigator.clipboard.writeText(extensionKey);
            setCopyStatus("copied");
            setTimeout(() => setCopyStatus("idle"), 2000);
        } catch {
            setErrorMessage("Failed to copy key");
        }
    }

    function onSignOut() {
        setIsMenuOpen(false);
        router.push("/auth/signout");
    }

    return (
        <aside className="hidden md:flex flex-col w-64 bg-[#0b1120] border-r border-slate-800/60 font-mono text-slate-300 h-screen sticky top-0 shrink-0">
            <div className="p-6 pt-8">
                <div className="font-bold text-xl tracking-tight text-white mb-1 flex items-center gap-2">
                    <span className="text-emerald-400">{">_"}</span>
                    <span>
                        Resume<span className="text-emerald-400">AI</span>
                    </span>
                </div>
                <div className="text-emerald-500/70 text-xs tracking-wide">
                    // for developers
                </div>
            </div>

            <nav className="flex-1 py-4 flex flex-col gap-1 overflow-y-auto">
                {navLinks.map((link) => {
                    const isActive =
                        pathname === link.path ||
                        (link.path === "/dashboard" &&
                            pathname === "/dashboard");
                    const Icon = link.icon;
                    return (
                        <Link
                            key={link.path}
                            href={link.path}
                            className={`relative flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all group ${
                                isActive
                                    ? "bg-emerald-900/20 text-emerald-400"
                                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
                            }`}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />
                            )}
                            <Icon
                                size={18}
                                className={
                                    isActive
                                        ? "text-emerald-400"
                                        : "text-slate-500 group-hover:text-slate-300"
                                }
                            />
                            {link.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="px-6 mt-auto w-full flex flex-col gap-6">
                <div className="border border-slate-800 bg-[#0f172a] rounded-xl p-4 flex flex-col gap-3">
                    <div className="text-[10px] font-bold text-emerald-400 tracking-wider">
                        PRO PLAN
                    </div>
                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-[11px] text-slate-400">
                                Resumes generated
                            </span>
                        </div>
                        <div className="text-sm text-white font-bold mb-2">
                            12{" "}
                            <span className="text-slate-500 font-normal">
                                / 100
                            </span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5 mb-4">
                            <div
                                className="bg-emerald-500 h-1.5 rounded-full"
                                style={{ width: "12%" }}
                            ></div>
                        </div>
                        <button className="w-full py-2 border border-slate-700 rounded-md text-xs text-white hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                            Upgrade Plan{" "}
                            <span className="text-slate-400">→</span>
                        </button>
                    </div>
                </div>

                <div ref={menuRef} className="relative">
                    <button
                        type="button"
                        onClick={() => setIsMenuOpen((open) => !open)}
                        className="flex items-center justify-between cursor-pointer group py-2 w-full"
                    >
                        <div className="flex items-center gap-3 w-full">
                            <div className="w-8 h-8 rounded-full bg-[#4a8a65] flex items-center justify-center text-white font-bold text-sm shrink-0">
                                {">_"}
                            </div>
                            <div className="flex-1 min-w-0 pr-2">
                                <div className="text-[13px] font-bold text-white truncate font-mono">
                                    colin.s
                                </div>
                                <div className="text-[11px] text-slate-300 truncate mt-1 font-mono leading-none">
                                    {userEmail || "colin.s@email.com"}
                                </div>
                            </div>
                            <ChevronDown
                                size={16}
                                className="text-white shrink-0"
                                strokeWidth={2.5}
                            />
                        </div>
                    </button>

                    {isMenuOpen && (
                        <div className="absolute left-0 right-0 bottom-12 z-20 rounded-lg border border-slate-800 bg-[#0b1324] p-3 shadow-xl">
                            <div className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold">
                                Extension
                            </div>
                            <p className="text-[11px] text-slate-400 mt-1">
                                Generate a key for your browser extension.
                            </p>

                            <button
                                type="button"
                                onClick={onGenerateExtensionKey}
                                disabled={isGenerating}
                                className="mt-3 w-full rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 transition-colors disabled:opacity-60"
                            >
                                {isGenerating
                                    ? "Generating..."
                                    : "Generate Extension Key"}
                            </button>

                            {extensionKey && (
                                <div className="mt-3">
                                    <div className="text-[10px] uppercase tracking-wider text-slate-400">
                                        Key
                                    </div>
                                    <div className="mt-2 rounded-md border border-slate-800 bg-slate-900/60 px-2 py-2 text-[11px] text-emerald-200 break-all">
                                        {extensionKey}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={onCopyKey}
                                        className="mt-2 text-[11px] text-slate-300 hover:text-white"
                                    >
                                        {copyStatus === "copied"
                                            ? "Copied"
                                            : "Copy"}
                                    </button>
                                </div>
                            )}

                            {errorMessage && (
                                <p className="mt-2 text-[11px] text-red-400">
                                    {errorMessage}
                                </p>
                            )}

                            <div className="mt-3 border-t border-slate-800 pt-3">
                                <button
                                    type="button"
                                    onClick={onSignOut}
                                    className="w-full rounded-md border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800/70 transition-colors"
                                >
                                    Sign out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom dot decorative detail */}
            <div className="w-full flex justify-center mt-6">
                <div className="w-full flex flex-col gap-3 px-1 pb-3 pt-2">
                    <div className="flex justify-around w-full">
                        {[...Array(15)].map((_, i) => (
                            <div
                                key={`d1-${i}`}
                                className="w-1 h-1 rounded-full bg-emerald-500/30"
                            />
                        ))}
                    </div>
                    <div className="flex justify-around w-full">
                        {[...Array(15)].map((_, i) => (
                            <div
                                key={`d2-${i}`}
                                className="w-1 h-1 rounded-full bg-emerald-500/30"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </aside>
    );
}
