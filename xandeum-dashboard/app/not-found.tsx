import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { HomeIcon } from "@/components/ui/home";

export default function NotFound() {
    return (
        <div
            className={cn(
                "relative min-h-screen w-full overflow-hidden bg-zinc-950 flex items-center justify-center px-6"
            )}
        >
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <div className="h-16 w-16 text-muted-foreground flex items-center justify-center">
                            <span className="text-6xl">👻</span>
                        </div>
                    </EmptyMedia>

                    <EmptyTitle className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-blue-500 bg-clip-text text-transparent">
                        404
                    </EmptyTitle>

                    <EmptyDescription className="text-lg">
                        The page you&apos;re looking for doesn&apos;t exist. It may have been moved or deleted.
                    </EmptyDescription>
                </EmptyHeader>

                <EmptyContent>
                    <div className="flex flex-col items-center gap-3 sm:flex-row">
                        <Button asChild className="group">
                            <Link href="/">
                                <HomeIcon size={16} className="mr-1" />
                                Go Home
                            </Link>
                        </Button>

                        <Button asChild variant="outline" className="group">
                            <Link href="/dashboard">
                                Go to Dashboard
                            </Link>
                        </Button>
                    </div>
                </EmptyContent>
            </Empty>
        </div>
    );
}
