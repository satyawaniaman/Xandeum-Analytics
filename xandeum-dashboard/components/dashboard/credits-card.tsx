"use client";

import { usePodCredits } from "@/hooks/use-pod-credits";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, TrendingUp, Award } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface CreditsCardProps {
    pubkey: string | null;
}

export function CreditsCard({ pubkey }: CreditsCardProps) {
    const { data, isLoading, error } = usePodCredits(pubkey);

    if (isLoading) {
        return (
            <Card className="rounded-xl border border-border">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-primary" /> Credit Score
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-2">
                    <Skeleton className="h-16 w-full" />
                    <div className="grid grid-cols-2 gap-4">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error || !data) {
        return (
            <Card className="rounded-xl border border-border">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-primary" /> Credit Score
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                    <div className="text-center py-6 text-muted-foreground">
                        <Trophy className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">
                            {error ? "Failed to load credits" : "No credit data available for this node"}
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Determine badge color based on percentile
    const getBadgeStyle = (percentile: number) => {
        if (percentile >= 90) return "bg-yellow-500/20 text-yellow-500 border-yellow-500/50"; // Gold
        if (percentile >= 70) return "bg-slate-300/20 text-slate-400 border-slate-400/50"; // Silver
        if (percentile >= 50) return "bg-orange-600/20 text-orange-500 border-orange-500/50"; // Bronze
        return "bg-muted text-muted-foreground border-border";
    };

    const getRankLabel = (rank: number, total: number) => {
        const percentile = ((total - rank) / total) * 100;
        if (percentile >= 90) return "Top 10%";
        if (percentile >= 75) return "Top 25%";
        if (percentile >= 50) return "Top 50%";
        return `#${rank}`;
    };

    return (
        <Card className="rounded-xl border border-border">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-primary" /> Credit Score
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
                {/* Main Credit Score */}
                <div className="text-center py-4 bg-muted/30 rounded-lg border border-border">
                    <div className="text-4xl font-bold text-foreground">
                        {data.credits.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        Lifetime Credits Earned
                    </div>
                </div>

                {/* Rank and Percentile */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/50 p-3 rounded-lg text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                            <Award className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground text-xs">Network Rank</span>
                        </div>
                        <div className={`text-lg font-bold px-2 py-0.5 rounded-full border inline-block ${getBadgeStyle(data.percentile)}`}>
                            #{data.rank}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                            of {data.totalPods} nodes
                        </div>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-lg text-center">
                        <div className="text-muted-foreground text-xs mb-1">Performance Tier</div>
                        <div className={`text-lg font-bold px-3 py-0.5 rounded-full border inline-block ${getBadgeStyle(data.percentile)}`}>
                            {getRankLabel(data.rank, data.totalPods)}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                            {data.percentile}th percentile
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
