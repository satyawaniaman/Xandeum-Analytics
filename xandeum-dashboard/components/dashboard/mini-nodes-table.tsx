"use client";

import Link from "next/link";
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
        <Card className={`rounded-xl border border-zinc-800 bg-zinc-900/50 ${className}`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400">
                    {showAll ? "All pNodes" : "Top pNodes"}
                </CardTitle>
                {!showAll && (
                    <Button variant="ghost" size="sm" asChild className="text-zinc-500 hover:text-zinc-300">
                        <Link href="/dashboard/nodes">View All →</Link>
                    </Button>
                )}
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-zinc-800 hover:bg-transparent">
                                <TableHead className="text-zinc-500 min-w-[120px]">Status</TableHead>
                                <TableHead className="text-zinc-500 min-w-[140px]">Address</TableHead>
                                <TableHead className="text-zinc-500">Version</TableHead>
                                <TableHead className="text-zinc-500 text-right">CPU</TableHead>
                                <TableHead className="text-zinc-500 text-right">RAM</TableHead>
                                <TableHead className="text-zinc-500 text-right">Storage</TableHead>
                                <TableHead className="text-zinc-500 text-right">Uptime</TableHead>
                                <TableHead className="text-zinc-500 text-right min-w-[90px]">Last Seen</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {displayNodes.map((node) => (
                                <TableRow
                                    key={node.id}
                                    className="border-zinc-800 hover:bg-zinc-800/50 cursor-pointer"
                                >
                                    <TableCell>
                                        <StatusBadge status={node.status} showLabel={true} size="sm" />
                                    </TableCell>
                                    <TableCell className="font-mono text-sm text-zinc-300">
                                        <Link
                                            href={`/dashboard/nodes/${encodeURIComponent(node.address)}`}
                                            className="hover:text-zinc-100 hover:underline"
                                        >
                                            {node.ip}
                                            {node.port && <span className="text-zinc-600">:{node.port}</span>}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-zinc-400 text-sm">
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
                                            <span className="text-zinc-600">—</span>
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
                                            <span className="text-zinc-600">—</span>
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
                                            <span className="text-zinc-600">—</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right text-zinc-400 text-sm">
                                        {formatUptime(node.uptimeHuman)}
                                    </TableCell>
                                    <TableCell className="text-right text-zinc-500 text-sm">
                                        {formatTimeAgo(node.lastSeenAgoSeconds)}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {displayNodes.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center text-zinc-500 py-8">
                                        No nodes available
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                {!showAll && nodes.length > 10 && (
                    <div className="flex justify-center py-3 border-t border-zinc-800">
                        <span className="text-xs text-zinc-500">
                            Showing 10 of {nodes.length} nodes
                        </span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
