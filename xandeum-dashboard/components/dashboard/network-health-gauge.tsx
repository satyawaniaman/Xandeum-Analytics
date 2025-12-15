"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Gauge from "@/components/gauge";

interface NetworkHealthGaugeProps {
    onlineCount: number;
    totalCount: number;
    publicRpcCount: number;
    className?: string;
}

export function NetworkHealthGauge({
    onlineCount,
    totalCount,
    publicRpcCount,
    className,
}: NetworkHealthGaugeProps) {
    // Calculate health score based on:
    // - 50% weight: percentage of online nodes
    // - 30% weight: percentage of public RPC nodes
    // - 20% weight: ratio of public to online (connectivity quality)
    const onlinePercent = totalCount > 0 ? (onlineCount / totalCount) * 100 : 0;
    const publicPercent = totalCount > 0 ? (publicRpcCount / totalCount) * 100 : 0;
    const connectivityQuality = onlineCount > 0 ? (publicRpcCount / onlineCount) * 100 : 0;

    const healthScore = Math.round(
        onlinePercent * 0.5 + publicPercent * 0.3 + connectivityQuality * 0.2
    );

    const getHealthLabel = (score: number): string => {
        if (score >= 80) return "Excellent";
        if (score >= 60) return "Good";
        if (score >= 40) return "Fair";
        if (score >= 20) return "Poor";
        return "Critical";
    };

    const getHealthColor = (score: number): string => {
        if (score >= 80) return "bg-emerald-500";
        if (score >= 60) return "bg-emerald-400";
        if (score >= 40) return "bg-amber-400";
        if (score >= 20) return "bg-orange-500";
        return "bg-red-500";
    };

    return (
        <Card className={`rounded-xl border border-zinc-800 bg-zinc-900/50 ${className}`}>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400">
                    Network Health
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center pt-4">
                <Gauge
                    value={healthScore}
                    min={0}
                    max={100}
                    size={200}
                    gap={4}
                    thickness={8}
                    activeColor={getHealthColor(healthScore)}
                    inactiveColor="bg-zinc-800"
                    showValue={true}
                    label={getHealthLabel(healthScore)}
                />
                <div className="flex justify-between w-full mt-4 pt-4 border-t border-zinc-800 text-sm">
                    <div className="text-center">
                        <p className="text-zinc-500">Online</p>
                        <p className="text-zinc-200 font-medium">{onlinePercent.toFixed(0)}%</p>
                    </div>
                    <div className="text-center">
                        <p className="text-zinc-500">Public RPC</p>
                        <p className="text-zinc-200 font-medium">{publicPercent.toFixed(0)}%</p>
                    </div>
                    <div className="text-center">
                        <p className="text-zinc-500">Quality</p>
                        <p className="text-zinc-200 font-medium">{connectivityQuality.toFixed(0)}%</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
