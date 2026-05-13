import { DashboardSidebar } from "@/components/ui/dashboardSidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-[#fafafa] overflow-hidden">
            <DashboardSidebar />
            <main className="flex-1 overflow-y-auto px-4 py-4 lg:px-8 bg-[#fcfdfd]">
                <div className="max-w-[1200px] mx-auto w-full">{children}</div>
            </main>
        </div>
    );
}
