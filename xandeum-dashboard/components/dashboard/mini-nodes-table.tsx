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
}

function formatTimeAgo(seconds: number | null): string {
    if (seconds === null) return "—";
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}

export function MiniNodesTable({ nodes, className }: MiniNodesTableProps) {
    // Show top 5 nodes sorted by status (online first) then by last seen
    const topNodes = [...nodes]
        .sort((a, b) => {
            // Online nodes first
            if (a.isOnline && !b.isOnline) return -1;
            if (!a.isOnline && b.isOnline) return 1;
            // Then by last seen (most recent first)
            return (a.lastSeenAgoSeconds || Infinity) - (b.lastSeenAgoSeconds || Infinity);
        })
        .slice(0, 5);

    return (
        <Card className={`rounded-xl border border-zinc-800 bg-zinc-900/50 ${className}`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400">
                    Top pNodes
                </CardTitle>
                <Button variant="ghost" size="sm" asChild className="text-zinc-500 hover:text-zinc-300">
                    <Link href="/dashboard/nodes">View All →</Link>
                </Button>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow className="border-zinc-800 hover:bg-transparent">
                            <TableHead className="text-zinc-500">Status</TableHead>
                            <TableHead className="text-zinc-500">Address</TableHead>
                            <TableHead className="text-zinc-500 text-right">Storage</TableHead>
                            <TableHead className="text-zinc-500 text-right">CPU</TableHead>
                            <TableHead className="text-zinc-500 text-right">Last Seen</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {topNodes.map((node) => (
                            <TableRow
                                key={node.id}
                                className="border-zinc-800 hover:bg-zinc-800/50 cursor-pointer"
                            >
                                <TableCell>
                                    <StatusBadge status={node.status} showLabel={false} size="sm" />
                                </TableCell>
                                <TableCell className="font-mono text-sm text-zinc-300">
                                    <Link
                                        href={`/dashboard/nodes/${encodeURIComponent(node.address)}`}
                                        className="hover:text-zinc-100 hover:underline"
                                    >
                                        {node.ip}
                                    </Link>
                                </TableCell>
                                <TableCell className="text-right text-zinc-400">
                                    {node.storageUtilizationPercent !== null
                                        ? `${node.storageUtilizationPercent.toFixed(0)}%`
                                        : "—"}
                                </TableCell>
                                <TableCell className="text-right text-zinc-400">
                                    {node.cpuPercent !== null
                                        ? `${node.cpuPercent.toFixed(0)}%`
                                        : "—"}
                                </TableCell>
                                <TableCell className="text-right text-zinc-500 text-sm">
                                    {formatTimeAgo(node.lastSeenAgoSeconds)}
                                </TableCell>
                            </TableRow>
                        ))}
                        {topNodes.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-zinc-500 py-8">
                                    No nodes available
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
