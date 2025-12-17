"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
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
import { Star, Settings2, Monitor, Moon, Sun, Palette, Check } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Custom Settings State
    const [rpcEndpoint, setRpcEndpoint] = useState("");
    const [refreshInterval, setRefreshInterval] = useState("30");
    const [isXandeumTheme, setIsXandeumTheme] = useState(false);

    // Initialize state from local storage on mount
    useEffect(() => {
        setMounted(true);
        const storedRpc = localStorage.getItem("xandeum-rpc-endpoint") || "";
        const storedRefresh = localStorage.getItem("xandeum-refresh-interval") || "30";
        const storedThemePref = localStorage.getItem("xandeum-theme-preference");

        setRpcEndpoint(storedRpc);
        setRefreshInterval(storedRefresh);
        setIsXandeumTheme(storedThemePref === "xandeum");

        // Apply Xandeum theme if preferred
        if (storedThemePref === "xandeum") {
            document.documentElement.classList.add("theme-xandeum");
        } else {
            document.documentElement.classList.remove("theme-xandeum");
        }
    }, []);

    // Handle Xandeum Theme Toggle
    const toggleXandeumTheme = (checked: boolean) => {
        setIsXandeumTheme(checked);
        if (checked) {
            document.documentElement.classList.add("theme-xandeum");
            localStorage.setItem("xandeum-theme-preference", "xandeum");
            // Force dark mode for Xandeum theme to ensure contrast
            setTheme("dark");
        } else {
            document.documentElement.classList.remove("theme-xandeum");
            localStorage.removeItem("xandeum-theme-preference");
        }
        window.dispatchEvent(new CustomEvent("xandeum-theme-change", { detail: { active: checked } }));
    };

    const saveSettings = () => {
        localStorage.setItem("xandeum-rpc-endpoint", rpcEndpoint);
        localStorage.setItem("xandeum-refresh-interval", refreshInterval);
        toast.success("Settings saved successfully");
    };

    if (!mounted) {
        return null;
    }

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

            <div className="mt-6 space-y-6 max-w-4xl mx-auto">
                {/* Visual Options */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Palette className="h-5 w-5 text-primary" />
                            <CardTitle>Visual Options</CardTitle>
                        </div>
                        <CardDescription>Customize the appearance of your dashboard</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">Xandeum Theme</Label>
                                <p className="text-sm text-muted-foreground">
                                    Use the official Xandeum brand colors (Teal & Navy)
                                </p>
                            </div>
                            <Switch
                                checked={isXandeumTheme}
                                onCheckedChange={toggleXandeumTheme}
                            />
                        </div>

                        {!isXandeumTheme && (
                            <div className="space-y-2">
                                <Label>Theme Mode</Label>
                                <div className="grid grid-cols-3 gap-2">
                                    <Button
                                        variant={theme === "light" ? "default" : "outline"}
                                        className="justify-start gap-2"
                                        onClick={() => setTheme("light")}
                                    >
                                        <Sun className="h-4 w-4" /> Light
                                    </Button>
                                    <Button
                                        variant={theme === "dark" ? "default" : "outline"}
                                        className="justify-start gap-2"
                                        onClick={() => setTheme("dark")}
                                    >
                                        <Moon className="h-4 w-4" /> Dark
                                    </Button>
                                    <Button
                                        variant={theme === "system" ? "default" : "outline"}
                                        className="justify-start gap-2"
                                        onClick={() => setTheme("system")}
                                    >
                                        <Monitor className="h-4 w-4" /> System
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Dashboard Settings */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Settings2 className="h-5 w-5 text-primary" />
                            <CardTitle>Dashboard Configuration</CardTitle>
                        </div>
                        <CardDescription>Manage network connections and data preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="rpc">Custom RPC Endpoint</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="rpc"
                                    placeholder="https://api.mainnet-beta.solana.com"
                                    value={rpcEndpoint}
                                    onChange={(e) => setRpcEndpoint(e.target.value)}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Leave empty to use the default Xandeum RPC aggregator.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label>Auto-Refresh Interval</Label>
                            <Select value={refreshInterval} onValueChange={setRefreshInterval}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select interval" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="off">Off (Manual)</SelectItem>
                                    <SelectItem value="10">10 Seconds</SelectItem>
                                    <SelectItem value="30">30 Seconds</SelectItem>
                                    <SelectItem value="60">1 Minute</SelectItem>
                                    <SelectItem value="300">5 Minutes</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex justify-end">
                            <Button onClick={saveSettings}>
                                <Check className="w-4 h-4 mr-2" />
                                Save Preferences
                            </Button>
                        </div>
                    </CardContent>
                </Card>

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
            </div>
        </ContentLayout>
    );
}
