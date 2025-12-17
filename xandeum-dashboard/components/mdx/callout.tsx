import { cn } from "@/lib/utils";
import { AlertCircle, FileWarning, Info } from "lucide-react";

interface CalloutProps {
    title?: string;
    children?: React.ReactNode;
    type?: "default" | "warn" | "error" | "info";
}

export function Callout({
    title,
    children,
    type = "default",
}: CalloutProps) {
    return (
        <div
            className={cn(
                "my-6 flex flex-col gap-2 rounded-lg border p-4 text-sm",
                type === "default" && "border-border bg-background text-foreground",
                type === "info" && "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200",
                type === "warn" && "border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200",
                type === "error" && "border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-200"
            )}
        >
            {title && (
                <div className="flex items-center gap-2 font-semibold">
                    {type === "info" && <Info className="h-4 w-4" />}
                    {type === "warn" && <AlertCircle className="h-4 w-4" />}
                    {type === "error" && <FileWarning className="h-4 w-4" />}
                    <span>{title}</span>
                </div>
            )}
            <div className="[&>p]:m-0">{children}</div>
        </div>
    );
}
