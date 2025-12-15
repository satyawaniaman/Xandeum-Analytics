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
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                    <h3 className="text-base font-semibold text-zinc-100 mb-2">Dashboard Settings</h3>
                    <p className="text-sm text-zinc-500 mb-6">Configure your dashboard preferences</p>
                    <div className="text-zinc-500">Settings options will be added here.</div>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                    <h3 className="text-base font-semibold text-zinc-100 mb-2">API Configuration</h3>
                    <p className="text-sm text-zinc-500 mb-6">Configure backend API settings</p>
                    <div className="text-zinc-500">API configuration options will be added here.</div>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                    <h3 className="text-base font-semibold text-zinc-100 mb-2">Refresh Settings</h3>
                    <p className="text-sm text-zinc-500 mb-6">Configure auto-refresh interval</p>
                    <div className="text-zinc-500">Refresh settings will be added here.</div>
                </div>
            </div>
        </ContentLayout>
    );
}
