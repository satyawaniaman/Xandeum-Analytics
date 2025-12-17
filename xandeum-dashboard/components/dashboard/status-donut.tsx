"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { PNodesSummary } from "@/lib/types";

interface StatusDonutProps {
    summary: PNodesSummary;
    className?: string;
}

const COLORS = {
    online_public: "#10b981",  // Emerald - Public RPC accessible
    online_private: "#3b82f6", // Blue - Private (not negative)
    offline: "#71717a",        // Zinc (neutral) - Not recently seen
    unknown: "#a1a1aa",        // Lighter zinc
};

const LABELS = {
    online_public: "Public RPC",
    online_private: "Private",
    offline: "Not Recently Seen",
    unknown: "Unknown",
};

export function StatusDonut({ summary, className }: StatusDonutProps) {
    const data = [
        { name: LABELS.online_public, value: summary.online_public, key: "online_public" },
        { name: LABELS.online_private, value: summary.online_private, key: "online_private" },
        { name: LABELS.offline, value: summary.offline, key: "offline" },
        { name: LABELS.unknown, value: summary.unknown, key: "unknown" },
    ].filter(item => item.value > 0);

    return (
        <Card className={`rounded-xl border border-border bg-card ${className}`}>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    Status Distribution
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-6">
                    <div className="h-40 w-40">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={45}
                                    outerRadius={65}
                                    paddingAngle={2}
                                    dataKey="value"
                                >
                                    {data.map((entry) => (
                                        <Cell
                                            key={entry.key}
                                            fill={COLORS[entry.key as keyof typeof COLORS]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#18181b",
                                        border: "1px solid #3f3f46",
                                        borderRadius: "8px",
                                    }}
                                    labelStyle={{ color: "#a1a1aa" }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex flex-col gap-2">
                        {data.map((item) => (
                            <div key={item.key} className="flex items-center gap-2">
                                <span
                                    className="h-3 w-3 rounded-full"
                                    style={{ backgroundColor: COLORS[item.key as keyof typeof COLORS] }}
                                />
                                <span className="text-sm text-muted-foreground">{item.name}</span>
                                <span className="ml-auto text-sm font-medium text-foreground">
                                    {item.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
