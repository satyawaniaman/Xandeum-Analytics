"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

// Mock data structure, will accept real data props
export interface CountryStats {
    country: string;
    count: number;
    percentage: number;
}

interface CountryDistributionChartProps {
    data: CountryStats[];
    className?: string; // Allow custom styling/layout
}

const chartConfig = {
    count: {
        label: "Nodes",
        color: "hsl(var(--primary))",
    },
} satisfies ChartConfig;

export function CountryDistributionChart({ data, className }: CountryDistributionChartProps) {
    // Sort by count desc and take top 10
    const sortedData = [...data].sort((a, b) => b.count - a.count).slice(0, 10);

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>Node Distribution by Country</CardTitle>
                <CardDescription>Top locations hosting nodes</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <BarChart
                        data={sortedData}
                        layout="vertical"
                        margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    >
                        <CartesianGrid horizontal={false} strokeDasharray="3 3" strokeOpacity={0.2} />
                        <YAxis
                            dataKey="country"
                            type="category"
                            tickLine={false}
                            axisLine={false}
                            width={100}
                            tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                        />
                        <XAxis type="number" hide />
                        <ChartTooltip content={<ChartTooltipContent />} cursor={{ fill: "transparent" }} />
                        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                            {sortedData.map((entry, index) => {
                                // Gradient from primary (top) to muted (bottom)
                                const colors = ["#EF4444", "#F97316", "#EAB308", "#22C55E", "#06B6D4", "#8B5CF6", "#EC4899", "#6366F1", "#14B8A6", "#F59E0B"];
                                return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                            })}
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
