"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "./status-badge";
import type { PNode } from "@/lib/types";

interface MiniNodesTableProps {
    nodes: PNode[];
    className?: string;
    showAll?: boolean;
}

function formatTimeAgo(seconds: number | null): string {
    if (seconds === null) return "—";
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}

function formatUptime(uptimeHuman: string | null): string {
    if (!uptimeHuman) return "—";
    // Shorten "5d 12h 30m" to "5d 12h"
    const parts = uptimeHuman.split(" ");
    return parts.slice(0, 2).join(" ");
}

export function MiniNodesTable({ nodes, className, showAll = false }: MiniNodesTableProps) {
    const router = useRouter();
    // Show top nodes sorted by status (online first) then by last seen
    const sortedNodes = [...nodes].sort((a, b) => {
        // Online nodes first
        if (a.isOnline && !b.isOnline) return -1;
        if (!a.isOnline && b.isOnline) return 1;
        // Public RPC nodes before private
        if (a.hasPublicRpc && !b.hasPublicRpc) return -1;
        if (!a.hasPublicRpc && b.hasPublicRpc) return 1;
        // Then by last seen (most recent first)
        return (a.lastSeenAgoSeconds || Infinity) - (b.lastSeenAgoSeconds || Infinity);
    });

    const displayNodes = showAll ? sortedNodes : sortedNodes.slice(0, 10);

    return (
        <Card className={`rounded-xl border border-border bg-card ${className}`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {showAll ? "All pNodes" : "Top pNodes"}
                </CardTitle>
                {!showAll && (
                    <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
                        <Link href="/dashboard/nodes">View All →</Link>
                    </Button>
                )}
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-border hover:bg-transparent">
                                <TableHead className="text-muted-foreground min-w-[120px]">Status</TableHead>
                                <TableHead className="text-muted-foreground min-w-[140px]">Address</TableHead>
                                <TableHead className="text-muted-foreground">Version</TableHead>
                                <TableHead className="text-muted-foreground text-right">CPU</TableHead>
                                <TableHead className="text-muted-foreground text-right">RAM</TableHead>
                                <TableHead className="text-muted-foreground text-right">Storage</TableHead>
                                <TableHead className="text-muted-foreground text-right">Uptime</TableHead>
                                <TableHead className="text-muted-foreground text-right min-w-[90px]">Last Seen</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {displayNodes.map((node) => (
                                <TableRow
                                    key={node.id}
                                    className="border-border hover:bg-muted cursor-pointer"
                                    onClick={() => router.push(`/dashboard/nodes/${encodeURIComponent(node.ip)}`)}
                                >
                                    <TableCell>
                                        <StatusBadge status={node.status} showLabel={true} size="sm" />
                                    </TableCell>
                                    <TableCell className="font-mono text-sm text-foreground">
                                        <Link
                                            href={`/dashboard/nodes/${encodeURIComponent(node.ip)}`}
                                            className="hover:text-foreground hover:underline"
                                        >
                                            {node.ip}
                                            {node.port && <span className="text-muted-foreground/50">:{node.port}</span>}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {node.version || "—"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {node.cpuPercent !== null ? (
                                            <span className={
                                                node.cpuPercent > 80 ? "text-red-400" :
                                                    node.cpuPercent > 50 ? "text-amber-400" :
                                                        "text-emerald-400"
                                            }>
                                                {node.cpuPercent < 1
                                                    ? `${node.cpuPercent.toFixed(1)}%`
                                                    : `${node.cpuPercent.toFixed(0)}%`
                                                }
                                            </span>
                                        ) : (
                                            <span className="text-muted-foreground">—</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {node.ramUsagePercent !== null ? (
                                            <span className={
                                                node.ramUsagePercent > 80 ? "text-red-400" :
                                                    node.ramUsagePercent > 50 ? "text-amber-400" :
                                                        "text-emerald-400"
                                            }>
                                                {node.ramUsagePercent.toFixed(0)}%
                                            </span>
                                        ) : (
                                            <span className="text-muted-foreground">—</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {node.storageUtilizationPercent !== null ? (
                                            node.storageUtilizationPercent < 1 ? (
                                                // Show MB used for very low utilization
                                                <span className="text-emerald-400">
                                                    {node.totalBytesMB !== null
                                                        ? `${node.totalBytesMB.toFixed(1)} MB`
                                                        : "<1%"}
                                                </span>
                                            ) : (
                                                <span className={
                                                    node.storageUtilizationPercent > 80 ? "text-red-400" :
                                                        node.storageUtilizationPercent > 50 ? "text-amber-400" :
                                                            "text-emerald-400"
                                                }>
                                                    {node.storageUtilizationPercent.toFixed(0)}%
                                                </span>
                                            )
                                        ) : (
                                            <span className="text-muted-foreground">—</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right text-muted-foreground text-sm">
                                        {formatUptime(node.uptimeHuman)}
                                    </TableCell>
                                    <TableCell className="text-right text-muted-foreground text-sm">
                                        {formatTimeAgo(node.lastSeenAgoSeconds)}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {displayNodes.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                                        No nodes available
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                {!showAll && nodes.length > 10 && (
                    <div className="flex justify-center py-3 border-t border-border">
                        <span className="text-xs text-muted-foreground">
                            Showing 10 of {nodes.length} nodes
                        </span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
