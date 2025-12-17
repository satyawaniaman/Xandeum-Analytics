"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, TrendingUp } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useSpring, useMotionValueEvent } from "motion/react";

const chartConfig = {
    liquidity: {
        label: "Liquidity",
        color: "#FCA070",
    },
} satisfies ChartConfig;

interface TokenLiquidityChartProps {
    data: { time: string; value: number }[];
    currentLiquidity: number;
    change24h: number;
}

export function TokenLiquidityChart({ data, currentLiquidity, change24h }: TokenLiquidityChartProps) {
    const chartRef = useRef<HTMLDivElement>(null);
    const [axis, setAxis] = useState(0);
    const [chartWidth, setChartWidth] = useState(0);

    // motion values - declared before useEffect that uses them
    const springX = useSpring(0, {
        damping: 30,
        stiffness: 100,
    });
    const springY = useSpring(0, {
        damping: 30,
        stiffness: 100,
    });

    useEffect(() => {
        if (chartRef.current) {
            const width = chartRef.current.getBoundingClientRect().width;
            setChartWidth(width);
            setAxis(width); // Initialize to full width so chart shows filled
            springX.jump(width);
        }
    }, [springX]);

    useMotionValueEvent(springX, "change", (latest) => {
        setAxis(latest);
    });

    const isPositive = change24h >= 0;

    return (
        <Card className="rounded-xl border border-border bg-card">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    ${(springY.get() || currentLiquidity).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    <Badge variant="secondary" className={`ml-2 ${isPositive ? "text-emerald-500 bg-emerald-500/10" : "text-red-500 bg-red-500/10"}`}>
                        {isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                        {Math.abs(change24h).toFixed(2)}%
                    </Badge>
                </CardTitle>
                <CardDescription>Total Liquidity (Last 24h)</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    ref={chartRef}
                    className="h-[200px] w-full"
                    config={chartConfig}
                >
                    <AreaChart
                        className="overflow-visible"
                        accessibilityLayer
                        data={data}
                        onMouseMove={(state) => {
                            const x = state.activeCoordinate?.x;
                            const dataValue = state.activePayload?.[0]?.value;
                            if (x && dataValue !== undefined) {
                                springX.set(x);
                                springY.set(dataValue);
                            }
                        }}
                        onMouseLeave={() => {
                            springX.set(chartWidth);
                            springY.jump(data[data.length - 1]?.value || 0);
                        }}
                        margin={{
                            right: 0,
                            left: 0,
                        }}
                    >
                        <CartesianGrid
                            vertical={false}
                            strokeDasharray="3 3"
                            horizontalCoordinatesGenerator={(props) => {
                                const { height } = props;
                                return [0, height - 30];
                            }}
                        />
                        <XAxis
                            dataKey="time"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        {/* Base area - always visible */}
                        <Area
                            dataKey="value"
                            type="monotone"
                            fill="url(#gradient-cliped-area-liq)"
                            fillOpacity={0.2}
                            stroke="var(--color-liquidity)"
                            strokeOpacity={0.3}
                        />
                        {/* Clipped area - reveals on hover */}
                        <Area
                            dataKey="value"
                            type="monotone"
                            fill="url(#gradient-cliped-area-liq)"
                            fillOpacity={0.4}
                            stroke="var(--color-liquidity)"
                            clipPath={`inset(0 ${Math.max(0, chartWidth - axis)} 0 0)`}
                        />
                        <line
                            x1={axis}
                            y1={0}
                            x2={axis}
                            y2={"100%"}
                            stroke="var(--color-liquidity)"
                            strokeDasharray="3 3"
                            strokeLinecap="round"
                            strokeOpacity={0.2}
                        />
                        <rect
                            x={axis - 50}
                            y={0}
                            width={50}
                            height={18}
                            fill="var(--color-liquidity)"
                            rx={4}
                        />
                        <text
                            x={axis - 25}
                            fontWeight={600}
                            y={13}
                            textAnchor="middle"
                            fill="var(--primary-foreground)"
                            fontSize={10}
                        >
                            ${springY.get().toLocaleString(undefined, { maximumFractionDigits: 0, notation: "compact" })}
                        </text>
                        {/* ghost line */}
                        <Area
                            dataKey="value"
                            type="monotone"
                            fill="none"
                            stroke="var(--color-liquidity)"
                            strokeOpacity={0.1}
                        />
                        <defs>
                            <linearGradient
                                id="gradient-cliped-area-liq"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-liquidity)"
                                    stopOpacity={0.2}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-liquidity)"
                                    stopOpacity={0}
                                />
                                <mask id="mask-cliped-area-chart-liq">
                                    <rect
                                        x={0}
                                        y={0}
                                        width={"100%"}
                                        height={"100%"}
                                        fill="white"
                                    />
                                </mask>
                            </linearGradient>
                        </defs>
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
