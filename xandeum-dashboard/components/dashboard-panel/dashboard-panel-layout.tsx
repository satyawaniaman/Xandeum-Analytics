"use client";

import { Sidebar } from "@/components/dashboard-panel/sidebar";
import { DashboardFooter } from "@/components/dashboard/footer";
import { useSidebar } from "@/hooks/use-sidebar";
import { useStore } from "@/hooks/use-store";
import { cn } from "@/lib/utils";

export default function AdminPanelLayout({
    children
}: {
    children: React.ReactNode;
}) {
    const sidebar = useStore(useSidebar, (x) => x);
    if (!sidebar) return null;
    const { getOpenState, settings } = sidebar;
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Sidebar />
            <main
                className={cn(
                    "flex-1 flex flex-col transition-[margin-left] ease-in-out duration-300",
                    !settings.disabled && (!getOpenState() ? "lg:ml-[106px]" : "lg:ml-[272px]")
                )}
            >
                {children}
                <DashboardFooter />
            </main>
        </div>
    );
}