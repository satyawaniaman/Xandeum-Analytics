"use client";
import Link from "next/link";
import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { WatchlistTable } from "@/components/dashboard/watchlist-table";
import { Star, Settings2, RefreshCw } from "lucide-react";

export default function SettingsPage() {
    return (
        <ContentLayout title="Settings">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/">Home</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Settings</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Settings Sections */}
            <div className="mt-6 space-y-6">
                {/* Watchlist Section */}
                <div className="rounded-xl border border-border bg-card p-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Star className="h-5 w-5 text-yellow-500" />
                        <h3 className="text-base font-semibold text-foreground">Watchlist</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-6">
                        Manage your watched nodes. Click on a node address to view its details.
                    </p>
                    <WatchlistTable />
                </div>

                <div className="rounded-xl border border-border bg-card p-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Settings2 className="h-5 w-5 text-primary" />
                        <h3 className="text-base font-semibold text-foreground">Dashboard Settings</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-6">Configure your dashboard preferences</p>
                    <div className="text-muted-foreground">Settings options will be added here.</div>
                </div>

                <div className="rounded-xl border border-border bg-card p-6">
                    <div className="flex items-center gap-2 mb-2">
                        <RefreshCw className="h-5 w-5 text-primary" />
                        <h3 className="text-base font-semibold text-foreground">Refresh Settings</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-6">Configure auto-refresh interval</p>
                    <div className="text-muted-foreground">Refresh settings will be added here.</div>
                </div>
            </div>
        </ContentLayout>
    );
}

