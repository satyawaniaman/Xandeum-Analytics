import DashboardPanelLayout from "@/components/dashboard-panel/dashboard-panel-layout";
import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import { GeistSans } from "geist/font/sans";
import { cn } from "@/lib/utils";

export default function DocsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <DashboardPanelLayout>
            <ContentLayout title="Documentation">
                <div className={cn(
                    "prose dark:prose-invert max-w-3xl mx-auto py-8",
                    "prose-headings:font-semibold prose-h1:text-4xl prose-h2:text-2xl prose-h3:text-xl",
                    "prose-p:leading-7 prose-p:text-muted-foreground",
                    "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
                    GeistSans.className
                )}>
                    {children}
                </div>
            </ContentLayout>
        </DashboardPanelLayout>
    );
}
