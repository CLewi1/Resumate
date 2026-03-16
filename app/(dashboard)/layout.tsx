import { NavBar } from "@/components/ui/dashNavBar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <header>
                <NavBar />
            </header>
            <main className="container mx-auto px-6 py-8">{children}</main>
        </>
    );
}
