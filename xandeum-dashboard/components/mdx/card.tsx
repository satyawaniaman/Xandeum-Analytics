import Link from "next/link";
import { cn } from "@/lib/utils";

export function Cards({ children }: { children: React.ReactNode }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
            {children}
        </div>
    );
}

export function Card({
    title,
    description,
    href,
}: {
    title: string;
    description: string;
    href: string;
}) {
    return (
        <Link
            href={href}
            className={cn(
                "block p-6 rounded-lg border border-border bg-card text-card-foreground shadow-sm transition-all hover:bg-accent hover:text-accent-foreground",
                "no-underline"
            )}
        >
            <h3 className="font-semibold text-lg mb-2 mt-0">{title}</h3>
            <p className="text-muted-foreground text-sm m-0 leading-relaxed">
                {description}
            </p>
        </Link>
    );
}
