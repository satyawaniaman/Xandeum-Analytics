"use client";

import { cn } from "@/lib/utils";
import type { NodeStatus } from "@/lib/types";

interface StatusBadgeProps {
    status: NodeStatus;
    showLabel?: boolean;
    size?: "sm" | "md" | "lg";
    className?: string;
}

const statusConfig = {
    online_public: {
        color: "bg-emerald-500",
        label: "Online (Public)",
        dotColor: "bg-emerald-400",
    },
    online_private: {
        color: "bg-amber-500",
        label: "Online (Private)",
        dotColor: "bg-amber-400",
    },
    offline: {
        color: "bg-red-500",
        label: "Offline",
        dotColor: "bg-red-400",
    },
    unknown: {
        color: "bg-zinc-500",
        label: "Unknown",
        dotColor: "bg-zinc-400",
    },
};

const sizeConfig = {
    sm: {
        dot: "h-2 w-2",
        text: "text-xs",
        padding: "px-2 py-0.5",
    },
    md: {
        dot: "h-2.5 w-2.5",
        text: "text-sm",
        padding: "px-2.5 py-1",
    },
    lg: {
        dot: "h-3 w-3",
        text: "text-base",
        padding: "px-3 py-1.5",
    },
};

export function StatusBadge({
    status,
    showLabel = true,
    size = "md",
    className,
}: StatusBadgeProps) {
    const config = statusConfig[status];
    const sizes = sizeConfig[size];

    return (
        <div
            className={cn(
                "inline-flex items-center gap-2 rounded-full",
                showLabel && "bg-zinc-800/50",
                showLabel && sizes.padding,
                className
            )}
        >
            <span className={cn("rounded-full animate-pulse", config.dotColor, sizes.dot)} />
            {showLabel && (
                <span className={cn("font-medium text-zinc-300", sizes.text)}>
                    {config.label}
                </span>
            )}
        </div>
    );
}
