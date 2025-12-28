"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    MessageCircle,
    Search,
    Bot,
    Zap,
    Users,
    Brain,
    Bell,
    ExternalLink,
    Copy,
    Check,
    Terminal,
    Sparkles
} from "lucide-react";

// Bot commands with full descriptions
const botCommands = [
    {
        command: "/start",
        description: "Welcome message and quick overview of available features",
        category: "general",
        example: "Just type /start to begin"
    },
    {
        command: "/help",
        description: "Show all available commands with descriptions",
        category: "general",
        example: "/help"
    },
    {
        command: "/nodes",
        description: "Network overview showing total, online, and public node counts",
        category: "network",
        example: "/nodes"
    },
    {
        command: "/node <address>",
        description: "Detailed information for a specific node by IP or pubkey",
        category: "network",
        example: "/node 192.168.1.1"
    },
    {
        command: "/stats",
        description: "Live network statistics including uptime and response times",
        category: "network",
        example: "/stats"
    },
    // {
    //     command: "/alerts",
    //     description: "Manage your notification preferences and alert thresholds",
    //     category: "alerts",
    //     example: "/alerts on"
    // },
    // {
    //     command: "/watchlist",
    //     description: "View and manage your watched nodes for monitoring",
    //     category: "alerts",
    //     example: "/watchlist add <pubkey>"
    // }
];

// Feature highlights
const features = [
    {
        icon: Zap,
        title: "Real-time Updates",
        description: "Get instant notifications when your nodes go offline or network conditions change."
    },
    {
        icon: Brain,
        title: "AI-Powered Insights",
        description: "Intelligent analysis of network trends with predictive health monitoring."
    },
    {
        icon: Users,
        title: "Always Accessible",
        description: "Monitor your network from anywhere - just open Telegram and start chatting."
    },
    {
        icon: Bell,
        title: "Smart Alerts",
        description: "Customizable notifications for downtime, performance changes, and milestones."
    },
];

// Getting started steps
const gettingStartedSteps = [
    {
        step: 1,
        title: "Open Telegram",
        description: "Launch Telegram on your device and search for @XandAssistantbot",
        icon: MessageCircle
    },
    {
        step: 2,
        title: "Start the Bot",
        description: "Click 'Start' or send /start to begin your conversation",
        icon: Bot
    },
    {
        step: 3,
        title: "Explore Commands",
        description: "Use /help to see all available commands and features",
        icon: Terminal
    },
    // {
    //     step: 4,
    //     title: "Set Up Alerts",
    //     description: "Configure watchlist and notifications for your pNodes",
    //     icon: Bell
    // },
];

// Command category colors
const categoryColors: Record<string, string> = {
    general: "bg-blue-500/10 text-blue-500 border-blue-500/30",
    network: "bg-green-500/10 text-green-500 border-green-500/30",
    alerts: "bg-orange-500/10 text-orange-500 border-orange-500/30",
    ai: "bg-purple-500/10 text-purple-500 border-purple-500/30",
};

// Copy button component
function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className="p-1.5 rounded-md hover:bg-muted transition-colors"
            title="Copy command"
        >
            {copied ? (
                <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
                <Copy className="h-3.5 w-3.5 text-muted-foreground" />
            )}
        </button>
    );
}

export default function AssistantPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");

    // Filter commands based on search and category
    const filteredCommands = useMemo(() => {
        return botCommands.filter((cmd) => {
            const matchesSearch =
                cmd.command.toLowerCase().includes(searchQuery.toLowerCase()) ||
                cmd.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = categoryFilter === "all" || cmd.category === categoryFilter;
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, categoryFilter]);

    const categories = ["all", "general", "network"];//"alerts", "ai"

    return (
        <ContentLayout title="Xandbot Assistant">
            <div className="space-y-8">
                {/* Hero Section */}
                <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-8">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10 max-w-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="relative">
                                <div className="absolute inset-0  rounded-full" />
                                <Image src="/xandbot-img.jpg" alt="Xandbot Assistant" className="rounded-full" width={50} height={50} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold flex items-center gap-2">
                                    Xandbot Assistant
                                </h1>
                                <p className="text-muted-foreground text-sm">
                                    Your  assistant for Xandeum network analytics
                                </p>
                            </div>
                        </div>
                        <p className="text-muted-foreground mb-6 leading-relaxed">
                            Monitor your pNodes, and get insights about
                            the Xandeum network - all from the convenience of Telegram.
                        </p>
                        <Button asChild className="gap-2">
                            <a
                                href="https://t.me/XandAssistantbot"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <MessageCircle className="h-4 w-4" />
                                Start Chatting on Telegram
                                <ExternalLink className="h-3 w-3" />
                            </a>
                        </Button>
                    </div>
                </div>

                {/* Features Grid */}
                {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {features.map((feature, index) => (
                        <Card key={index} className="rounded-xl border border-border">
                            <CardContent className="pt-6">
                                <div className="bg-primary/10 p-2.5 rounded-lg w-fit mb-3">
                                    <feature.icon className="h-5 w-5 text-primary" />
                                </div>
                                <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    {feature.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div> */}

                {/* Command Reference */}
                <Card id="commands" className="rounded-xl border border-border">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Terminal className="h-5 w-5 text-primary" />
                            Command Reference
                        </CardTitle>
                        <CardDescription>
                            Search and explore all available bot commands
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Search and Filter */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search commands..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <div className="flex gap-1.5 flex-wrap">
                                {categories.map((cat) => (
                                    <Button
                                        key={cat}
                                        variant={categoryFilter === cat ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setCategoryFilter(cat)}
                                        className="text-xs capitalize"
                                    >
                                        {cat}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Commands List */}
                        <div className="space-y-2">
                            {filteredCommands.map((cmd, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <code className="font-mono text-sm font-semibold text-foreground bg-muted px-2 py-0.5 rounded">
                                                {cmd.command}
                                            </code>
                                            <Badge
                                                variant="outline"
                                                className={`text-[10px] capitalize ${categoryColors[cmd.category]}`}
                                            >
                                                {cmd.category}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {cmd.description}
                                        </p>
                                        <p className="text-xs text-muted-foreground/70 mt-1 font-mono">
                                            Example: {cmd.example}
                                        </p>
                                    </div>
                                    <CopyButton text={cmd.command.split(" ")[0]} />
                                </div>
                            ))}
                            {filteredCommands.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">No commands found matching your search</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Getting Started */}
                <Card className="rounded-xl border border-border">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-primary" />
                            Getting Started
                        </CardTitle>
                        <CardDescription>
                            Set up Xandbot in just a few simple steps
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {gettingStartedSteps.map((step) => (
                                <div
                                    key={step.step}
                                    className="relative p-4 rounded-lg bg-muted/30 border border-border"
                                >
                                    <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                                        {step.step}
                                    </div>
                                    <div className="bg-primary/10 p-2 rounded-lg w-fit mb-3 mt-1">
                                        <step.icon className="h-4 w-4 text-primary" />
                                    </div>
                                    <h4 className="font-semibold text-sm mb-1">{step.title}</h4>
                                    <p className="text-xs text-muted-foreground">
                                        {step.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </ContentLayout>
    );
}
