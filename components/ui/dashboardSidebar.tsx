/* eslint-disable react/jsx-no-comment-textnodes */
"use client";

import {
    Home,
    Briefcase,
    FileText,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const navLinks = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "Jobs", path: "/jobs", icon: Briefcase },
    { name: "Resumes", path: "/resumes", icon: FileText },
];

const STORAGE_KEY = "sidebar-collapsed";

export function DashboardSidebar({ userEmail }: { userEmail?: string }) {
    const pathname = usePathname();
    const menuRef = useRef<HTMLDivElement | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const didReadRef = useRef(false);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (saved !== null) setIsCollapsed(saved === "true");
        didReadRef.current = true;
    }, []);

    useEffect(() => {
        if (!didReadRef.current) return;
        localStorage.setItem(STORAGE_KEY, String(isCollapsed));
    }, [isCollapsed]);

    useEffect(() => {
        function handleClick(event: MouseEvent) {
            if (!menuRef.current) return;
            if (!menuRef.current.contains(event.target as Node))
                setIsMenuOpen(false);
        }
        function handleKey(event: KeyboardEvent) {
            if (event.key === "Escape") setIsMenuOpen(false);
        }
        document.addEventListener("mousedown", handleClick);
        document.addEventListener("keydown", handleKey);
        return () => {
            document.removeEventListener("mousedown", handleClick);
            document.removeEventListener("keydown", handleKey);
        };
    }, []);

    return (
        <aside
            className={`hidden md:flex flex-col bg-[#0b1120] border-r border-slate-800/60 font-mono text-slate-300 h-screen sticky top-0 shrink-0 overflow-hidden transition-[width] duration-200 ${
                isCollapsed ? "w-16" : "w-64"
            }`}
        >
            {/* Header */}
            <div className="h-[88px] shrink-0 pt-8 px-[19px]">
                <div className="flex items-center gap-3 h-7">
                    <button
                        type="button"
                        onClick={() => setIsCollapsed((c) => !c)}
                        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                        className="group relative flex items-center justify-center shrink-0"
                    >
                        <span className={`text-orange-400 font-bold text-xl leading-none transition-opacity duration-150 ${isCollapsed ? "group-hover:opacity-0" : ""}`}>
                            {">_"}
                        </span>
                        {isCollapsed && (
                            <ChevronRight
                                size={16}
                                className="absolute text-orange-400 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                            />
                        )}
                    </button>
                    {!isCollapsed && (
                        <>
                            <span className="font-bold text-xl tracking-tight text-white whitespace-nowrap leading-none">
                                Resume<span className="text-orange-400">AI</span>
                            </span>
                            <button
                                type="button"
                                onClick={() => setIsCollapsed(true)}
                                aria-label="Collapse sidebar"
                                className="ml-auto shrink-0 flex items-center justify-center w-7 h-7 rounded-md text-slate-500 hover:text-orange-400 hover:bg-slate-800/50 transition-colors"
                            >
                                <ChevronLeft size={14} />
                            </button>
                        </>
                    )}
                </div>
                {!isCollapsed && (
                    <div className="text-orange-500/70 text-xs tracking-wide whitespace-nowrap mt-1">
                        // for developers
                    </div>
                )}
            </div>

            {/* Nav */}
            <nav className="flex-1 py-4 flex flex-col gap-1 overflow-y-auto overflow-x-hidden">
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
                            title={isCollapsed ? link.name : undefined}
                            className={`relative flex items-center gap-3 py-3 px-[19px] text-sm font-medium transition-colors group ${
                                isActive
                                    ? "bg-orange-900/20 text-orange-400"
                                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
                            }`}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500" />
                            )}
                            <Icon
                                size={18}
                                className={`shrink-0 ${
                                    isActive
                                        ? "text-orange-400"
                                        : "text-slate-500 group-hover:text-slate-300"
                                }`}
                            />
                            {!isCollapsed && (
                                <span className="whitespace-nowrap leading-none">
                                    {link.name}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User section */}
            <div className="mt-auto px-[19px] py-3 flex items-center gap-3">
                <div
                    className="w-8 h-8 rounded-full bg-[#4a8a65] flex items-center justify-center text-white font-bold text-sm shrink-0"
                >
                    {">_"}
                </div>
                {!isCollapsed && (
                    <div ref={menuRef} className="relative flex-1 min-w-0">
                        <button
                            type="button"
                            onClick={() => setIsMenuOpen((open) => !open)}
                            className="flex items-center gap-3 w-full"
                        >
                            <div className="flex-1 min-w-0">
                                <div className="text-[13px] font-bold text-white truncate font-mono leading-none">
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
                        </button>
                        {isMenuOpen && (
                            <div className="absolute left-0 right-0 bottom-12 z-20 rounded-lg border border-slate-800 bg-[#0b1324] p-3 shadow-xl">
                                <div className="text-[11px] text-slate-400">
                                    Local instance — no sign-in required.
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Bottom dot decorative detail */}
            <div className="w-full flex flex-col gap-3 px-[19px] pb-4 pt-1">
                {[0, 1].map((row) => (
                    <div key={row} className="flex gap-[11px]">
                        {[...Array(15)].map((_, i) => (
                            <div
                                key={i}
                                className="w-1 h-1 rounded-full bg-orange-500/30 shrink-0"
                            />
                        ))}
                    </div>
                ))}
            </div>
        </aside>
    );
}
