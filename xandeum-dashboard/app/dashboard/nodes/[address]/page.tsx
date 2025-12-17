"use client";

import { use, useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { usePNodeDetail } from "@/hooks/use-pnodes";
import { StatusBadge } from "@/components/dashboard/status-badge";
import {
    Activity,
    Cpu,
    Database,
    Globe,
    HardDrive,
    Network,
    Server,
    Share2,
    Terminal,
    Copy,
    Check,
    ExternalLink
} from "lucide-react";
import { SingleNodeMap } from "@/components/dashboard/nodes/single-node-map";

export default function NodeDetailPage({ params }: { params: Promise<{ address: string }> }) {
    // Unwrap params using use() hook for Next.js 15+ (if applicable) or standard await in component if async
    // Since this is a client component, we use React.use() to unwrap the promise if params is a promise
    // But params is usually passed as object in Page props in older Next, or Promise in newer.
    // Given Next.js 15+, params is async.
    const resolvedParams = use(params);
    const decodedAddress = decodeURIComponent(resolvedParams.address);

    const { data: node, isLoading, error, refetch } = usePNodeDetail(decodedAddress);
    const [isCopied, setIsCopied] = useState(false);

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    const formatBytes = (bytes: number | null) => {
        if (bytes === null) return "—";
        if (bytes === 0) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB", "TB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    if (error) {
        return (
            <ContentLayout title="Node Details">
                <div className="flex flex-col items-center justify-center h-96 text-center">
                    <div className="text-red-400 mb-4">
                        <Activity size={48} />
                    </div>
                    <h2 className="text-xl font-semibold text-foreground mb-2">
                        Node not found
                    </h2>
                    <p className="text-muted-foreground max-w-md">
                        {error.message || `Could not load details for ${decodedAddress}`}
                    </p>
                    <Button variant="outline" className="mt-4" asChild>
                        <Link href="/dashboard/nodes">Back to List</Link>
                    </Button>
                </div>
            </ContentLayout>
        );
    }

    if (isLoading || !node) {
        return (
            <ContentLayout title="Node Details">
                <div className="space-y-6">
                    <div className="h-8 w-64 bg-muted rounded animate-pulse" />
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="h-64 bg-muted rounded-xl animate-pulse" />
                        <div className="h-64 bg-muted rounded-xl animate-pulse" />
                    </div>
                </div>
            </ContentLayout>
        );
    }

    return (
        <ContentLayout title={`Node: ${node.ip}`} onRefresh={() => refetch()}>
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
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard/nodes">Nodes</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{node.ip}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="mt-6 space-y-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-6 rounded-xl border border-border">
                    <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-full text-primary">
                            <Server size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold font-mono tracking-tight">{node.address}</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <StatusBadge status={node.status} size="sm" showLabel={true} />
                                <span className="text-muted-foreground text-sm flex items-center gap-1">
                                    <Terminal size={12} /> v{node.version || "Unknown"}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        {/* Action buttons could go here */}
                    </div>
                </div>

                {/* Row 1: Map + System Performance */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Map (Left - Half Width) */}
                    <SingleNodeMap node={node} />

                    {/* System Performance (Right - Half Width) */}
                    <Card className="rounded-xl border border-border">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-medium flex items-center gap-2">
                                <Activity className="h-4 w-4 text-primary" /> System Performance
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-4">
                            {/* CPU */}
                            <div>
                                <div className="flex justify-between mb-2">
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        <Cpu className="h-4 w-4 text-muted-foreground" /> CPU Usage
                                    </div>
                                    <span className="text-sm font-bold">{node.cpuPercent?.toFixed(1)}%</span>
                                </div>
                                <Progress value={node.cpuPercent || 0} className="h-2" />
                            </div>

                            {/* RAM */}
                            <div>
                                <div className="flex justify-between mb-2">
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        <HardDrive className="h-4 w-4 text-muted-foreground" /> Memory
                                    </div>
                                    <span className="text-sm font-bold">
                                        {formatBytes(node.ramUsedBytes)} / {formatBytes(node.ramTotalBytes)}
                                    </span>
                                </div>
                                <Progress value={node.ramUsagePercent || 0} className="h-2" />
                                <div className="text-xs text-muted-foreground mt-1">
                                    {node.ramUsagePercent?.toFixed(0)}% Used
                                </div>
                            </div>

                            {/* Storage */}
                            <div>
                                <div className="flex justify-between mb-2">
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        <Database className="h-4 w-4 text-muted-foreground" /> Storage
                                    </div>
                                    <span className="text-sm font-bold">
                                        {formatBytes(node.totalBytes)} / {formatBytes(node.fileSizeBytes)}
                                    </span>
                                </div>
                                <Progress value={node.storageUtilizationPercent || 0} className="h-2" />
                                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                    <span>{node.storageUtilizationPercent?.toFixed(1)}% Used</span>
                                    <span>{node.totalPages?.toLocaleString()} Pages</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Row 2: Location & Identity + Network Traffic */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Location & Identity */}
                    <Card className="rounded-xl border border-border">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-medium flex items-center gap-2">
                                <Globe className="h-4 w-4 text-primary" /> Location & Identity
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-2">
                            <div>
                                <div className="text-muted-foreground text-xs mb-1">Public Key</div>
                                <div className="flex items-center gap-2 bg-muted p-2 rounded border border-border">
                                    <span className="font-mono text-xs break-all flex-1">
                                        {node.pubkey || "—"}
                                    </span>
                                    {node.pubkey && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 shrink-0 hover:bg-muted-foreground/20"
                                            onClick={() => copyToClipboard(node.pubkey!)}
                                            title="Copy Public Key"
                                        >
                                            {isCopied ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-muted-foreground" />}
                                            <span className="sr-only">Copy Public Key</span>
                                        </Button>
                                    )}
                                    {node.pubkey && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 shrink-0 hover:bg-muted-foreground/20"
                                            asChild
                                            title="View on Solana Explorer"
                                        >
                                            <Link href={`https://explorer.solana.com/address/${node.pubkey}`} target="_blank" rel="noopener noreferrer">
                                                <ExternalLink size={14} className="text-muted-foreground" />
                                                <span className="sr-only">View on Solana Explorer</span>
                                            </Link>
                                        </Button>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-muted-foreground text-xs mb-1">Country</div>
                                    <div className="font-medium">{node.country || "—"}</div>
                                </div>
                                <div>
                                    <div className="text-muted-foreground text-xs mb-1">City</div>
                                    <div className="font-medium">{node.city || "—"}</div>
                                </div>
                            </div>
                            <Separator />
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-muted-foreground text-xs mb-1">Last Seen</div>
                                    <div className="text-sm">{node.lastSeenAgoSeconds !== null ? `${node.lastSeenAgoSeconds}s ago` : "—"}</div>
                                </div>
                                <div>
                                    <div className="text-muted-foreground text-xs mb-1">Uptime</div>
                                    <div className="text-sm">{node.uptimeHuman || "—"}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Network Traffic */}
                    <Card className="rounded-xl border border-border">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-medium flex items-center gap-2">
                                <Network className="h-4 w-4 text-primary" /> Network Traffic
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-2">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-muted/50 p-3 rounded-lg">
                                    <div className="text-muted-foreground text-xs">Packets Received</div>
                                    <div className="text-lg font-bold mt-1">{node.packetsReceived?.toLocaleString() || "0"}</div>
                                </div>
                                <div className="bg-muted/50 p-3 rounded-lg">
                                    <div className="text-muted-foreground text-xs">Packets Sent</div>
                                    <div className="text-lg font-bold mt-1">{node.packetsSent?.toLocaleString() || "0"}</div>
                                </div>
                            </div>
                            <div>
                                <div className="text-muted-foreground text-xs mb-1">Active Streams</div>
                                <div className="flex items-center gap-2">
                                    <Share2 className="h-4 w-4 text-emerald-400" />
                                    <span className="text-lg font-bold">{node.activeStreams || 0}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </ContentLayout>
    );
}
