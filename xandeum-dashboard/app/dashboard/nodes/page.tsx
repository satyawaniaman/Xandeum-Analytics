"use client";

import Link from "next/link";
import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { usePNodes } from "@/hooks/use-pnodes";
import { DataTable } from "@/components/dashboard/nodes/data-table";
import { StatCard } from "@/components/dashboard/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { MonitorCheckIcon } from "lucide-react"; // Using lucide directly as MonitorCheckIcon component might be custom wrapper
import { exportNodes } from "@/lib/export-utils";

export default function NodesPage() {
    const { data, isLoading, error, refetch } = usePNodes();

    const handleRefresh = () => {
        refetch();
    };

    const handleExport = (format: "json" | "csv") => {
        if (data?.nodes) {
            exportNodes(data.nodes, format);
        }
    };

    if (error) {
        return (
            <ContentLayout title="All Nodes">
                <div className="flex flex-col items-center justify-center h-96 text-center">
                    <div className="text-red-400 mb-4">
                        <MonitorCheckIcon size={48} />
                    </div>
                    <h2 className="text-xl font-semibold text-foreground mb-2">
                        Failed to load nodes data
                    </h2>
                    <p className="text-muted-foreground max-w-md">
                        {error.message || "Unable to connect to the API."}
                    </p>
                </div>
            </ContentLayout>
        );
    }

    if (isLoading || !data) {
        // Skull placeholder while loading
        return (
            <ContentLayout title="All Nodes">
                <div className="space-y-6">
                    <div className="h-10 w-48 bg-muted rounded-md mb-6 animate-pulse" />
                    {/* Stats Grid Skeleton */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} className="h-32 w-full rounded-xl" />
                        ))}
                    </div>
                    {/* Table Skeleton */}
                    <div className="mt-6 rounded-xl border border-border bg-card p-6 h-[500px] animate-pulse" />
                </div>
            </ContentLayout>
        );
    }

    const { summary, nodes } = data;

    // Calculate avg uptime safely
    const avgUptimeSeconds = nodes.reduce((acc, node) => acc + (node.uptimeSeconds || 0), 0) / nodes.length;
    const avgUptimeDays = Math.floor(avgUptimeSeconds / 86400);

    return (
        <ContentLayout title="All Nodes" onRefresh={handleRefresh} onExport={handleExport}>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/">Home</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>All Nodes</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Node Stats Summary */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
                <StatCard
                    title="Total Nodes"
                    value={summary.total}
                    subtitle="Registered pNodes"
                />
                <StatCard
                    title="Online"
                    value={summary.online_public + summary.online_private}
                    subtitle="Currently active"
                // variant="success" // Assuming variant support exists or defaults
                />
                <StatCard
                    title="Offline"
                    value={summary.offline}
                    subtitle="No recent heartbeat"
                // variant={summary.offline > 0 ? "danger" : "default"}
                />
                <div className="rounded-xl border border-border bg-card p-5 flex flex-col justify-between shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground">Avg Network Uptime</h3>
                    <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-3xl font-bold text-foreground tracking-tight">
                            {isNaN(avgUptimeDays) ? "—" : `${avgUptimeDays}d`}
                        </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Across {nodes.length} nodes
                    </p>
                </div>
            </div>

            {/* Nodes Table */}
            <div className="mt-6">
                <DataTable nodes={nodes} />
            </div>
        </ContentLayout>
    );
}
