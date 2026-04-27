import { DashboardSidebar } from "@/components/ui/dashboardSidebar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/");
    }

    return (
        <div className="flex h-screen bg-[#fafafa] overflow-hidden">
            <DashboardSidebar userEmail={user?.email} />
            <main className="flex-1 overflow-y-auto px-4 py-4 lg:px-8 bg-[#fcfdfd]">
                <div className="max-w-[1200px] mx-auto w-full">{children}</div>
            </main>
        </div>
    );
}
