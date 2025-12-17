"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Bar, BarChart, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { usePNodes } from "@/hooks/use-pnodes";
import { Loader2, Cpu, HardDrive, Network, Activity } from "lucide-react";
import { PNode } from "@/lib/types";

// Chart configs
const cpuChartConfig = {
    value: { label: "CPU %", color: "#8B5CF6" },
} satisfies ChartConfig;

const ramChartConfig = {
    value: { label: "RAM %", color: "#22C55E" },
} satisfies ChartConfig;

const trafficChartConfig = {
    incoming: { label: "Incoming", color: "#3B82F6" },
    outgoing: { label: "Outgoing", color: "#EF4444" },
} satisfies ChartConfig;

const streamsChartConfig = {
    value: { label: "Streams", color: "#F59E0B" },
} satisfies ChartConfig;

// Process nodes into chart data (sorted by some metric)
// Process nodes into chart data - filter nulls and sort by value
function processNodesForChart(nodes: PNode[], metric: 'cpu' | 'ram' | 'traffic' | 'streams') {
    const onlineNodes = nodes.filter(n => n.isOnline);

    // Filter nodes that have actual data for this metric
    const filteredNodes = onlineNodes.filter(node => {
        switch (metric) {
            case 'cpu': return node.cpuPercent !== null && node.cpuPercent !== undefined;
            case 'ram': return node.ramUsagePercent !== null && node.ramUsagePercent !== undefined;
            case 'traffic': return (node.packetsReceived !== null || node.packetsSent !== null);
            case 'streams': return node.activeStreams !== null && node.activeStreams !== undefined;
            default: return true;
        }
    });

    return filteredNodes
        .map((node, index) => {
            // Use short node identifier: last 2 octets of IP or "N1, N2..."
            const ipParts = node.ip?.split('.') || [];
            const shortId = ipParts.length >= 2
                ? `${ipParts[ipParts.length - 2]}.${ipParts[ipParts.length - 1]}`
                : `N${index + 1}`;

            switch (metric) {
                case 'cpu':
                    return { label: shortId, value: node.cpuPercent || 0 };
                case 'ram':
                    return { label: shortId, value: node.ramUsagePercent || 0 };
                case 'traffic':
                    return {
                        label: shortId,
                        incoming: node.packetsReceived || 0,
                        outgoing: node.packetsSent || 0,
                    };
                case 'streams':
                    return { label: shortId, value: node.activeStreams || 0 };
                default:
                    return { label: shortId, value: 0 };
            }
        })
        .sort((a, b) => {
            // Sort by value descending
            const aVal = 'value' in a ? (a.value ?? 0) : ((a.incoming ?? 0) + (a.outgoing ?? 0));
            const bVal = 'value' in b ? (b.value ?? 0) : ((b.incoming ?? 0) + (b.outgoing ?? 0));
            return bVal - aVal;
        })
        .slice(0, 15); // Top 15 nodes with data
}

// Calculate aggregate stats
function calculateStats(nodes: PNode[]) {
    const onlineNodes = nodes.filter(n => n.isOnline);

    const cpuValues = onlineNodes.filter(n => n.cpuPercent !== null).map(n => n.cpuPercent!);
    const ramValues = onlineNodes.filter(n => n.ramUsagePercent !== null).map(n => n.ramUsagePercent!);

    const avgCpu = cpuValues.length > 0 ? cpuValues.reduce((a, b) => a + b, 0) / cpuValues.length : 0;
    const avgRam = ramValues.length > 0 ? ramValues.reduce((a, b) => a + b, 0) / ramValues.length : 0;

    const totalTraffic = onlineNodes.reduce((sum, n) => sum + (n.packetsReceived || 0) + (n.packetsSent || 0), 0);
    const totalStreams = onlineNodes.reduce((sum, n) => sum + (n.activeStreams || 0), 0);

    return {
        avgCpu: Math.round(avgCpu * 10) / 10,
        avgRam: Math.round(avgRam * 10) / 10,
        totalTraffic,
        totalStreams,
        onlineCount: onlineNodes.length,
    };
}

interface PerformanceCardProps {
    title: string;
    description: string;
    currentValue: string;
    icon: React.ReactNode;
    color: string;
    data: { label: string; value?: number; incoming?: number; outgoing?: number }[];
    chartConfig: ChartConfig;
    dataKey?: string;
    isLoading?: boolean;
    showDualBars?: boolean;
}

function PerformanceCard({
    title,
    description,
    currentValue,
    icon,
    color,
    data,
    chartConfig,
    dataKey = "value",
    isLoading = false,
    showDualBars = false,
}: PerformanceCardProps) {
    if (isLoading) {
        return (
            <Card className="bg-card border-border">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">{icon} {title}</CardTitle>
                    <CardDescription>Loading...</CardDescription>
                </CardHeader>
                <CardContent className="h-[280px] flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-card border-border">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-base flex items-center gap-2">
                            {icon} {title}
                        </CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </div>
                    <Badge variant="secondary" className="text-emerald-500">Live</Badge>
                </div>
                <div className="flex items-center gap-3 mt-2">
                    <span className="text-2xl font-bold" style={{ color }}>{currentValue}</span>
                </div>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[200px] w-full">
                    <BarChart data={data} margin={{ left: 0, right: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} vertical={false} />
                        <XAxis
                            dataKey="label"
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
                            interval={0}
                            angle={-45}
                            textAnchor="end"
                            height={50}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        {showDualBars ? (
                            <>
                                <Bar dataKey="incoming" fill="#3B82F6" radius={[2, 2, 0, 0]} />
                                <Bar dataKey="outgoing" fill="#EF4444" radius={[2, 2, 0, 0]} />
                            </>
                        ) : (
                            <Bar dataKey={dataKey} fill={color} radius={[2, 2, 0, 0]} />
                        )}
                    </BarChart>
                </ChartContainer>
                {/* Mini sparkline preview */}
                <div className="mt-2 h-[40px] bg-muted/30 rounded overflow-hidden">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <Area
                                type="monotone"
                                dataKey={showDualBars ? "incoming" : dataKey}
                                fill={color}
                                fillOpacity={0.3}
                                stroke={color}
                                strokeWidth={1}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}

// Main component that shows 4 performance cards
export function XandeumPerformanceChart() {
    const { data, isLoading } = usePNodes();
    const nodes = data?.nodes || [];
    const stats = calculateStats(nodes);

    const cpuData = processNodesForChart(nodes, 'cpu');
    const ramData = processNodesForChart(nodes, 'ram');
    const trafficData = processNodesForChart(nodes, 'traffic');
    const streamsData = processNodesForChart(nodes, 'streams');

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PerformanceCard
                title="CPU Usage"
                description="CPU utilization per node"
                currentValue={`${stats.avgCpu}% avg`}
                icon={<Cpu className="h-4 w-4 text-purple-500" />}
                color="#8B5CF6"
                data={cpuData}
                chartConfig={cpuChartConfig}
                isLoading={isLoading}
            />

            <PerformanceCard
                title="RAM Usage"
                description="Memory utilization per node"
                currentValue={`${stats.avgRam}% avg`}
                icon={<HardDrive className="h-4 w-4 text-emerald-500" />}
                color="#22C55E"
                data={ramData}
                chartConfig={ramChartConfig}
                isLoading={isLoading}
            />

            <PerformanceCard
                title="Network Traffic"
                description="Packets sent/received per node"
                currentValue={`${stats.totalTraffic.toLocaleString()} pkt/s`}
                icon={<Network className="h-4 w-4 text-blue-500" />}
                color="#3B82F6"
                data={trafficData}
                chartConfig={trafficChartConfig}
                isLoading={isLoading}
                showDualBars={true}
            />

            <PerformanceCard
                title="Active Streams"
                description="Data streams per node"
                currentValue={`${stats.totalStreams} total`}
                icon={<Activity className="h-4 w-4 text-amber-500" />}
                color="#F59E0B"
                data={streamsData}
                chartConfig={streamsChartConfig}
                isLoading={isLoading}
            />
        </div>
    );
}
