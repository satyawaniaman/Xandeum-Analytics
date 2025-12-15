"use client";

import { usePNodes } from "@/hooks/use-pnodes";
import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusDonut } from "@/components/dashboard/status-donut";
import { StorageOverview } from "@/components/dashboard/storage-overview";
import { MiniNodesTable } from "@/components/dashboard/mini-nodes-table";
import { NetworkHealthGauge } from "@/components/dashboard/network-health-gauge";
import { NodeMap } from "@/components/dashboard/node-map";
import { Skeleton } from "@/components/ui/skeleton";
import { MonitorCheckIcon } from "@/components/ui/monitor-check";

export default function DashboardPage() {
    const { data, isLoading, error, refetch, isFetching } = usePNodes();

    // Determine network status for navbar indicator
    const getNetworkStatus = (): "online" | "offline" | "degraded" | "maintenance" => {
        if (error) return "offline";
        if (isLoading || isFetching) return "maintenance";
        if (data && data.summary.offline > data.summary.total * 0.2) return "degraded";
        return "online";
    };

    const handleRefresh = () => {
        refetch();
    };

    if (isLoading) {
        return (
            <ContentLayout title="Dashboard" onRefresh={handleRefresh} networkStatus="maintenance">
                <div className="space-y-6">
                    {/* KPI Cards Skeleton */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-28 rounded-xl bg-zinc-800/50" />
                        ))}
                    </div>
                    {/* Map Skeleton */}
                    <Skeleton className="h-72 rounded-xl bg-zinc-800/50" />
                    {/* Charts Skeleton */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <Skeleton className="h-64 rounded-xl bg-zinc-800/50" />
                        <Skeleton className="h-64 rounded-xl bg-zinc-800/50" />
                        <Skeleton className="h-64 rounded-xl bg-zinc-800/50" />
                    </div>
                    {/* Table Skeleton */}
                    <Skeleton className="h-80 rounded-xl bg-zinc-800/50" />
                </div>
            </ContentLayout>
        );
    }

    if (error) {
        return (
            <ContentLayout title="Dashboard" onRefresh={handleRefresh} networkStatus="offline">
                <div className="flex flex-col items-center justify-center h-96 text-center">
                    <div className="text-red-400 mb-4">
                        <MonitorCheckIcon size={48} />
                    </div>
                    <h2 className="text-xl font-semibold text-zinc-200 mb-2">
                        Failed to load dashboard data
                    </h2>
                    <p className="text-zinc-500 max-w-md">
                        {error.message || "Unable to connect to the API. Please check your connection and try again."}
                    </p>
                </div>
            </ContentLayout>
        );
    }

    const { summary, nodes } = data!;
    const onlineCount = summary.online_public + summary.online_private;

    return (
        <ContentLayout title="Dashboard" onRefresh={handleRefresh} networkStatus={getNetworkStatus()}>
            <div className="space-y-6">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    <StatCard
                        title="Total pNodes"
                        value={summary.total}
                        subtitle="Discovered via gossip"
                    />
                    <StatCard
                        title="Online Nodes"
                        value={onlineCount}
                        subtitle={`${((onlineCount / summary.total) * 100).toFixed(0)}% of network`}
                        variant="success"
                    />
                    <StatCard
                        title="Public RPC"
                        value={summary.online_public}
                        subtitle="Port 6000 accessible"
                        variant="success"
                    />
                    <StatCard
                        title="Private Nodes"
                        value={summary.online_private}
                        subtitle="Online but RPC private"
                        variant="warning"
                    />
                    <StatCard
                        title="Offline"
                        value={summary.offline}
                        subtitle={summary.offline > 0 ? "Needs attention" : "All nodes healthy"}
                        variant={summary.offline > 0 ? "danger" : "default"}
                    />
                </div>

                {/* Global Node Map */}
                <NodeMap nodes={nodes} />

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <StatusDonut summary={summary} />
                    <StorageOverview nodes={nodes} />
                    <NetworkHealthGauge
                        onlineCount={onlineCount}
                        totalCount={summary.total}
                        publicRpcCount={summary.online_public}
                    />
                </div>

                {/* Top Nodes Table */}
                <MiniNodesTable nodes={nodes} />
            </div>
        </ContentLayout>
    );
}