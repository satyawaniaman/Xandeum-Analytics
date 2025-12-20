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
                    // Table styling
                    "prose-table:w-full prose-table:border-collapse prose-table:border prose-table:border-border",
                    "prose-thead:bg-muted/50",
                    "prose-th:border prose-th:border-border prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:font-semibold",
                    "prose-td:border prose-td:border-border prose-td:px-4 prose-td:py-2",
                    "prose-tr:border-b prose-tr:border-border",
                    GeistSans.className
                )}>
                    {children}
                </div>
            </ContentLayout>
        </DashboardPanelLayout>
    );
}
