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
    default: "border-border bg-card",
    success: "border-emerald-500/30 bg-emerald-500/10 dark:border-emerald-800/50 dark:bg-emerald-950/30",
    warning: "border-amber-500/30 bg-amber-500/10 dark:border-amber-800/50 dark:bg-amber-950/30",
    danger: "border-red-500/30 bg-red-500/10 dark:border-red-800/50 dark:bg-red-950/30",
};

const valueStyles = {
    default: "text-foreground",
    success: "text-emerald-600 dark:text-emerald-400",
    warning: "text-amber-600 dark:text-amber-400",
    danger: "text-red-600 dark:text-red-400",
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
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    {icon && <div className="text-muted-foreground">{icon}</div>}
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
                    <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
                )}
            </CardContent>
        </Card>
    );
}
