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

export default function DashboardPage() {
    return (
        <ContentLayout title="Overview">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/">Home</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Overview</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* pNode Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
                    <h3 className="text-sm font-medium text-zinc-400">Total Nodes</h3>
                    <p className="text-3xl font-bold mt-2 text-zinc-100">--</p>
                </div>
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
                    <h3 className="text-sm font-medium text-zinc-400">Online (Public)</h3>
                    <p className="text-3xl font-bold mt-2 text-emerald-400">--</p>
                </div>
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
                    <h3 className="text-sm font-medium text-zinc-400">Online (Private)</h3>
                    <p className="text-3xl font-bold mt-2 text-amber-400">--</p>
                </div>
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
                    <h3 className="text-sm font-medium text-zinc-400">Offline</h3>
                    <p className="text-3xl font-bold mt-2 text-red-400">--</p>
                </div>
            </div>

            {/* Charts Section */}
            <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                <h3 className="text-base font-semibold text-zinc-100 mb-2">Nodes Over Time</h3>
                <p className="text-sm text-zinc-500 mb-8">Network activity over the last 30 days</p>
                <div className="h-[200px] flex items-center justify-center text-zinc-500">
                    Chart will be added here
                </div>
            </div>

            {/* Node List */}
            <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                <h3 className="text-base font-semibold text-zinc-100 mb-4">Recent Nodes</h3>
                <p className="text-zinc-500">Node table component will be added here.</p>
            </div>
        </ContentLayout>
    );
}