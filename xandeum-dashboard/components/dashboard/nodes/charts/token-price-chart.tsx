"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, TrendingUp } from "lucide-react";
import React from "react";

const animationConfig = {
    glowWidth: 300,
};

const chartConfig = {
    price: {
        label: "Price (USD)",
        color: "#0EA5E9",
    },
} satisfies ChartConfig;

interface TokenPriceChartProps {
    data: { time: string; value: number }[];
    currentPrice: number;
    priceChange24h: number;
}

export function TokenPriceChart({ data, currentPrice, priceChange24h }: TokenPriceChartProps) {
    const [xAxis, setXAxis] = React.useState<number | null>(null);

    // Calculate min/max for Y-axis domain to make chart look dynamic
    const minVal = Math.min(...data.map(d => d.value)) * 0.99;
    const maxVal = Math.max(...data.map(d => d.value)) * 1.01;

    const isPositive = priceChange24h >= 0;

    return (
        <Card className="rounded-xl border border-border bg-card">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    ${currentPrice.toFixed(4)}
                    <Badge
                        variant="outline"
                        className={`border-none ml-2 ${isPositive ? "text-emerald-500 bg-emerald-500/10" : "text-red-500 bg-red-500/10"}`}
                    >
                        {isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                        {Math.abs(priceChange24h).toFixed(2)}%
                    </Badge>
                </CardTitle>
                <CardDescription>
                    XAND Price (Last 24h)
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[200px] w-full">
                    <AreaChart
                        accessibilityLayer
                        data={data}
                        onMouseMove={(e) => setXAxis(e.chartX as number)}
                        onMouseLeave={() => setXAxis(null)}
                    >
                        <CartesianGrid vertical={false} strokeDasharray="3 3" strokeOpacity={0.2} />
                        <XAxis
                            dataKey="time"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        {/* YAxis hidden but sets domain */}
                        <YAxis domain={[minVal, maxVal]} hide />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <defs>
                            <linearGradient
                                id="price-mask-grad"
                                x1="0"
                                y1="0"
                                x2="1"
                                y2="0"
                            >
                                <stop offset="0%" stopColor="transparent" />
                                <stop offset="50%" stopColor="white" />
                                <stop offset="100%" stopColor="transparent" />
                            </linearGradient>
                            <linearGradient
                                id="price-area-grad"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-price)"
                                    stopOpacity={0.4}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-price)"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                            {xAxis && (
                                <mask id="price-mask">
                                    <rect
                                        x={xAxis - animationConfig.glowWidth / 2}
                                        y={0}
                                        width={animationConfig.glowWidth}
                                        height="100%"
                                        fill="url(#price-mask-grad)"
                                    />
                                </mask>
                            )}
                        </defs>
                        <Area
                            dataKey="value"
                            type="monotone"
                            fill={"url(#price-area-grad)"}
                            fillOpacity={0.4}
                            stroke="var(--color-price)"
                            strokeWidth={2}
                            mask="url(#price-mask)"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
