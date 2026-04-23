import { NavBar } from "@/components/ui/dashNavBar";
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
        <>
            <header>
                <NavBar userEmail={user.email} />
            </header>
            <main className="container mx-auto px-6 py-8">{children}</main>
        </>
    );
}
