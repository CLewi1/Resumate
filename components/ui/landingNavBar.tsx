import { Terminal, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface LandingNavBarProps {
    onOpenLogin: () => void;
}

export default function LandingNavBar({ onOpenLogin }: LandingNavBarProps) {
    return (
        <header className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
            <div className="flex items-center gap-2 font-bold text-xl">
                <Terminal className="text-orange-700" />
                <span>ResumeAI</span>
                <span className="text-orange-600 font-mono text-sm font-normal ml-2 hidden sm:inline">
                    {"// for developers"}
                </span>
            </div>
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
                <Link
                    href="/how-it-works"
                    className="hover:text-orange-700 transition-colors"
                >
                    How it works
                </Link>
                <Link
                    href="/pricing"
                    className="hover:text-orange-700 transition-colors"
                >
                    Pricing
                </Link>
                <Link
                    href="/faq"
                    className="hover:text-orange-700 transition-colors"
                >
                    FAQ
                </Link>
                <Link
                    href="/roadmap"
                    className="hover:text-orange-700 transition-colors"
                >
                    Roadmap
                </Link>
            </nav>
            <div className="flex items-center gap-4">
                <Button
                    onClick={onOpenLogin}
                    className="bg-orange-700 hover:bg-orange-800 text-white rounded-md flex items-center gap-2"
                >
                    Join Beta <ArrowRight className="w-4 h-4" />
                </Button>
            </div>
        </header>
    );
}
