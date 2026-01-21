import { NavBar } from "@/components/ui/dashNavBar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <header>
                <NavBar />
            </header>
            <main className="flex-1 overflow-y-auto">
                { children }
            </main>
        </>
    );
}