import { cookies } from "next/headers";
import { DashboardSidebar } from "@/components/ui/dashboardSidebar";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const defaultCollapsed =
        cookieStore.get("sidebar-collapsed")?.value === "true";

    return (
        <div className="flex h-screen bg-[#fafafa] overflow-hidden">
            <DashboardSidebar defaultCollapsed={defaultCollapsed} />
            <main className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 lg:px-8 bg-[#fcfdfd]">
                <div className="max-w-[1200px] mx-auto w-full">{children}</div>
            </main>
        </div>
    );
}
