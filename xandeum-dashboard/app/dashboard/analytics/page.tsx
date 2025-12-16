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

export default function AnalyticsPage() {
    return (
        <ContentLayout title="Analytics">
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
                        <BreadcrumbPage>Analytics</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Analytics Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
                <div className="rounded-xl border border-border bg-card p-5">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Storage</h3>
                    <p className="text-3xl font-bold mt-2 text-foreground">--</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-5">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Pages</h3>
                    <p className="text-3xl font-bold mt-2 text-foreground">--</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-5">
                    <h3 className="text-sm font-medium text-muted-foreground">Avg CPU</h3>
                    <p className="text-3xl font-bold mt-2 text-foreground">--</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-5">
                    <h3 className="text-sm font-medium text-muted-foreground">Active Streams</h3>
                    <p className="text-3xl font-bold mt-2 text-foreground">--</p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid gap-4 md:grid-cols-2 mt-6">
                <div className="mt-6 rounded-xl border border-border bg-card p-6">
                    <h3 className="text-base font-semibold text-foreground mb-2">Network Health</h3>
                    <p className="text-sm text-muted-foreground mb-6">Node availability over time</p>
                    <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                        Chart will be added here
                    </div>
                </div>
                <div className="mt-6 rounded-xl border border-border bg-card p-6">
                    <h3 className="text-base font-semibold text-foreground mb-2">Node Activity</h3>
                    <p className="text-sm text-muted-foreground mb-6">Packets sent/received</p>
                    <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                        Chart will be added here
                    </div>
                </div>
            </div>

            {/* Historical Data */}
            <div className="mt-6 rounded-xl border border-border bg-card p-6">
                <h3 className="text-base font-semibold text-foreground mb-2">Historical Data</h3>
                <p className="text-sm text-muted-foreground mb-6">Network statistics over the last 30 days</p>
                <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                    Timeline chart will be added here
                </div>
            </div>
        </ContentLayout>
    );
}
