"use client";

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent
} from "@/components/ui/chart"

export interface VersionStats {
    version: string;
    count: number;
    fill: string; // Color
}

interface VersionDistributionChartProps {
    data: VersionStats[];
    className?: string;
}

export function VersionDistributionChart({ data, className }: VersionDistributionChartProps) {
    const totalNodes = React.useMemo(() => {
        return data.reduce((acc, curr) => acc + curr.count, 0);
    }, [data]);

    // Construct chart config dynamically
    const chartConfig = React.useMemo(() => {
        const config: ChartConfig = {
            count: { label: "Nodes" },
        };
        data.forEach((item) => {
            config[item.version] = {
                label: item.version,
                color: item.fill,
            };
        });
        return config;
    }, [data]);

    if (data.length === 0) {
        return (
            <Card className={`flex flex-col ${className}`}>
                <CardHeader className="pb-2">
                    <CardTitle>Node Versions</CardTitle>
                    <CardDescription>Software version distribution</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex items-center justify-center text-muted-foreground">
                    No version data available
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={`flex flex-col ${className}`}>
            <CardHeader className="pb-2">
                <CardTitle>Node Versions</CardTitle>
                <CardDescription>Software version distribution</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[200px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={data}
                            dataKey="count"
                            nameKey="version"
                            innerRadius={50}
                            outerRadius={80}
                            strokeWidth={2}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-2xl font-bold"
                                                >
                                                    {totalNodes}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 18}
                                                    className="fill-muted-foreground text-xs"
                                                >
                                                    Nodes
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
                {/* Legend below chart */}
                <div className="flex flex-wrap justify-center gap-3 mt-4">
                    {data.slice(0, 5).map((item) => (
                        <div key={item.version} className="flex items-center gap-1.5 text-xs">
                            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                            <span className="text-muted-foreground">{item.version}</span>
                            <span className="font-medium">{item.count}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
