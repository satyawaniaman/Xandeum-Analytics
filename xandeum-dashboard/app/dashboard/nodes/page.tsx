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

export default function NodesPage() {
    return (
        <ContentLayout title="All Nodes">
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
                        <BreadcrumbPage>All Nodes</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Node Stats Summary */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
                    <h3 className="text-sm font-medium text-zinc-400">Total Nodes</h3>
                    <p className="text-3xl font-bold mt-2 text-zinc-100">--</p>
                </div>
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
                    <h3 className="text-sm font-medium text-zinc-400">Online</h3>
                    <p className="text-3xl font-bold mt-2 text-emerald-400">--</p>
                </div>
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
                    <h3 className="text-sm font-medium text-zinc-400">Offline</h3>
                    <p className="text-3xl font-bold mt-2 text-red-400">--</p>
                </div>
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
                    <h3 className="text-sm font-medium text-zinc-400">Avg Uptime</h3>
                    <p className="text-3xl font-bold mt-2 text-zinc-100">--</p>
                </div>
            </div>

            {/* Nodes Table */}
            <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                <h3 className="text-base font-semibold text-zinc-100 mb-2">pNode List</h3>
                <p className="text-sm text-zinc-500 mb-6">All registered pNodes in the network</p>
                <div className="text-zinc-500">Node table component will be added here.</div>
            </div>
        </ContentLayout>
    );
}
