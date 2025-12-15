"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { NumberTicker } from "@/components/ui/number-ticker";

interface StatCardProps {
    title: string;
    value: number;
    subtitle?: string;
    icon?: React.ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    variant?: "default" | "success" | "warning" | "danger";
    className?: string;
}

const variantStyles = {
    default: "border-zinc-800 bg-zinc-900/50",
    success: "border-emerald-800/50 bg-emerald-950/30",
    warning: "border-amber-800/50 bg-amber-950/30",
    danger: "border-red-800/50 bg-red-950/30",
};

const valueStyles = {
    default: "text-zinc-100",
    success: "text-emerald-400",
    warning: "text-amber-400",
    danger: "text-red-400",
};

export function StatCard({
    title,
    value,
    subtitle,
    icon,
    trend,
    variant = "default",
    className,
}: StatCardProps) {
    return (
        <Card className={cn("rounded-xl border", variantStyles[variant], className)}>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-zinc-400">{title}</p>
                    {icon && <div className="text-zinc-500">{icon}</div>}
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                    <span className={cn("text-3xl font-bold", valueStyles[variant])}>
                        <NumberTicker value={value} />
                    </span>
                    {trend && (
                        <span
                            className={cn(
                                "text-sm font-medium",
                                trend.isPositive ? "text-emerald-500" : "text-red-500"
                            )}
                        >
                            {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
                        </span>
                    )}
                </div>
                {subtitle && (
                    <p className="mt-1 text-xs text-zinc-500">{subtitle}</p>
                )}
            </CardContent>
        </Card>
    );
}
