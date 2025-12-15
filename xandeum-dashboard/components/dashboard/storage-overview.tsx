"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { PNode } from "@/lib/types";

interface StorageOverviewProps {
    nodes: PNode[];
    className?: string;
}

function formatBytes(bytes: number): string {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function StorageOverview({ nodes, className }: StorageOverviewProps) {
    // Calculate aggregate storage metrics
    const nodesWithStorage = nodes.filter(
        (n) => n.totalBytes !== null && n.fileSizeBytes !== null
    );

    const totalUsed = nodesWithStorage.reduce(
        (acc, n) => acc + (n.totalBytes || 0),
        0
    );
    const totalCapacity = nodesWithStorage.reduce(
        (acc, n) => acc + (n.fileSizeBytes || 0),
        0
    );
    const avgUtilization =
        nodesWithStorage.length > 0
            ? nodesWithStorage.reduce(
                (acc, n) => acc + (n.storageUtilizationPercent || 0),
                0
            ) / nodesWithStorage.length
            : 0;

    const overallUtilization =
        totalCapacity > 0 ? (totalUsed / totalCapacity) * 100 : 0;

    return (
        <Card className={`rounded-xl border border-zinc-800 bg-zinc-900/50 ${className}`}>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400">
                    Storage Overview
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Total Capacity</span>
                        <span className="font-medium text-zinc-200">
                            {formatBytes(totalCapacity)}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Used Storage</span>
                        <span className="font-medium text-zinc-200">
                            {formatBytes(totalUsed)}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Available</span>
                        <span className="font-medium text-emerald-400">
                            {formatBytes(totalCapacity - totalUsed)}
                        </span>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Network Utilization</span>
                        <span className="font-medium text-zinc-200">
                            {overallUtilization.toFixed(1)}%
                        </span>
                    </div>
                    <Progress
                        value={overallUtilization}
                        className="h-2 bg-zinc-800"
                    />
                </div>

                <div className="pt-2 border-t border-zinc-800">
                    <div className="flex justify-between text-sm">
                        <span className="text-zinc-500">Nodes with storage data</span>
                        <span className="text-zinc-400">
                            {nodesWithStorage.length} of {nodes.length}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                        <span className="text-zinc-500">Avg. utilization per node</span>
                        <span className="text-zinc-400">
                            {avgUtilization.toFixed(1)}%
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
