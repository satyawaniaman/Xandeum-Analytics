"use client";

import { usePNodes } from "@/hooks/use-pnodes";
import { useXandeumToken } from "@/hooks/use-xandeum-token";
import { TokenPriceChart } from "@/components/dashboard/nodes/charts/token-price-chart";
import { TokenLiquidityChart } from "@/components/dashboard/nodes/charts/token-liquidity-chart";
import { VersionDistributionChart, VersionStats } from "@/components/dashboard/network/charts/version-distribution-chart";
import { CountryDistributionChart, CountryStats } from "@/components/dashboard/network/charts/country-distribution-chart";

import { XandeumPerformanceChart } from "@/components/dashboard/network/charts/performance-chart";
import { MiniNodesTable } from "@/components/dashboard/mini-nodes-table";
import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Users, Hash, Coins, TrendingUp, TrendingDown, Zap } from "lucide-react";
import { useMemo } from "react";

export default function NetworkPage() {
    const { data, isLoading } = usePNodes();
    const nodes = data?.nodes;
    const { data: tokenData, isLoading: tokenLoading } = useXandeumToken();

    // -- Calculate Network Stats --
    const networkStats = useMemo(() => {
        if (!nodes) return { total: 0, online: 0, countryData: [], versionData: [], networkTraffic: 0, activeStreams: 0 };

        const total = nodes.length;
        const online = nodes.filter(n => n.status === "online_public" || n.status === "online_private").length;
        const networkTraffic = nodes.reduce((sum, n) => sum + (n.packetsReceived || 0) + (n.packetsSent || 0), 0);
        const activeStreams = nodes.reduce((sum, n) => sum + (n.activeStreams || 0), 0);

        // Country Distribution
        const countryMap: Record<string, number> = {};
        nodes.forEach(n => {
            const c = n.country || "Unknown";
            countryMap[c] = (countryMap[c] || 0) + 1;
        });
        const countryData: CountryStats[] = Object.entries(countryMap).map(([country, count]) => ({
            country,
            count,
            percentage: (count / total) * 100
        }));

        // Version Distribution
        const versionMap: Record<string, number> = {};
        nodes.forEach(n => {
            const v = n.version || "Unknown";
            versionMap[v] = (versionMap[v] || 0) + 1;
        });
        const versionColors = ["#EF4444", "#F97316", "#EAB308", "#22C55E", "#06B6D4"];
        const versionData: VersionStats[] = Object.entries(versionMap)
            .sort((a, b) => b[1] - a[1])
            .map(([version, count], index) => ({
                version,
                count,
                fill: versionColors[index % versionColors.length]
            }));

        return { total, online, countryData, versionData, networkTraffic, activeStreams };
    }, [nodes]);

    // Loading skeleton
    if (isLoading || tokenLoading) {
        return (
            <ContentLayout title="Network">
                <div className="flex flex-1 flex-col gap-6">
                    <div className="flex flex-col gap-4">
                        <div>
                            <Skeleton className="h-8 w-48 mb-2" />
                            <Skeleton className="h-4 w-72" />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            {[...Array(4)].map((_, i) => (
                                <Skeleton key={i} className="h-24 rounded-xl" />
                            ))}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <Skeleton className="h-64 rounded-xl" />
                            <Skeleton className="h-64 rounded-xl" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Skeleton className="h-64 rounded-xl" />
                            <Skeleton className="h-64 rounded-xl" />
                        </div>
                    </div>
                    <Skeleton className="h-80 rounded-xl" />
                </div>
            </ContentLayout>
        );
    }

    return (
        <ContentLayout title="Network">
            <div className="flex flex-1 flex-col gap-6">
                {/* Header with Tabs */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">Network Overview</h2>
                            <p className="text-muted-foreground">
                                Real-time network statistics and performance metrics.
                            </p>
                        </div>
                    </div>

                    <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="bg-muted/50">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="performance">Performance</TabsTrigger>
                        </TabsList>

                        {/* OVERVIEW TAB */}
                        <TabsContent value="overview" className="space-y-6 mt-6">
                            {/* Key Metrics Row */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Card className="bg-card border-border">
                                    <CardHeader className="pb-2">
                                        <CardDescription className="flex items-center gap-2">
                                            <Users className="h-4 w-4" /> Active Nodes
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            <NumberTicker value={networkStats.online} />
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            of {networkStats.total} total
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-card border-border">
                                    <CardHeader className="pb-2">
                                        <CardDescription className="flex items-center gap-2">
                                            <Zap className="h-4 w-4" /> Network Traffic
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            <NumberTicker value={networkStats.networkTraffic} />
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            packets/sec
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-card border-border">
                                    <CardHeader className="pb-2">
                                        <CardDescription className="flex items-center gap-2">
                                            <Hash className="h-4 w-4" /> Active Streams
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            <NumberTicker value={networkStats.activeStreams} />
                                        </div>
                                        <p className="text-xs text-muted-foreground">across network</p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-card border-border">
                                    <CardHeader className="pb-2">
                                        <CardDescription className="flex items-center gap-2">
                                            <Coins className="h-4 w-4" /> XAND Price
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            $<NumberTicker value={tokenData?.price || 0} decimalPlaces={4} />
                                        </div>
                                        <p className={`text-xs flex items-center gap-1 ${(tokenData?.stats?.day24?.priceChange || 0) >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                                            {(tokenData?.stats?.day24?.priceChange || 0) >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                            {Math.abs(tokenData?.stats?.day24?.priceChange || 0).toFixed(2)}%
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Charts Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <TokenPriceChart
                                    data={tokenData?.priceHistory || []}
                                    currentPrice={tokenData?.price || 0}
                                    priceChange24h={tokenData?.stats?.day24?.priceChange || 0}
                                />
                                <TokenLiquidityChart
                                    data={tokenData?.liquidityHistory || []}
                                    currentLiquidity={tokenData?.liquidity || 0}
                                    change24h={tokenData?.stats?.day24?.liquidityChange || 0}
                                />
                            </div>

                            {/* Distribution Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <VersionDistributionChart data={networkStats.versionData} />
                                <CountryDistributionChart data={networkStats.countryData} />
                            </div>
                        </TabsContent>


                        {/* PERFORMANCE TAB */}
                        <TabsContent value="performance" className="space-y-6 mt-6">
                            <div className="grid grid-cols-1 gap-4">
                                <XandeumPerformanceChart />
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Active Nodes Table */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Top Active Nodes</h3>
                    <MiniNodesTable nodes={nodes || []} className="border rounded-xl" showAll={false} />
                </div>
            </div>
        </ContentLayout>
    );
}
