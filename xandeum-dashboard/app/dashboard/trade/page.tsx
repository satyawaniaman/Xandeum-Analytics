"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import { SwapForm } from "@/components/ui/murphy/swap-token-form";
import { MarketStatsCard } from "@/components/ui/murphy/market-stats-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Copy, Check } from "lucide-react";
import { useState } from "react";

// Dynamic import with SSR disabled for chart widget (uses window/document)
const PriceChartWidget = dynamic(
    () => import("@/components/chart-widget"),
    {
        ssr: false,
        loading: () => (
            <div className="flex items-center justify-center h-full text-muted-foreground">
                Loading price chart...
            </div>
        )
    }
);

// XAND Token Info
const XAND_TOKEN = {
    name: "Xandeum",
    symbol: "XAND",
    mintAddress: "XANDuUoVoUqniKkpcKhrxmvYJybpJvUxJLr21Gaj3Hx",
    decimals: 9,
    description: "Xandeum is building a scalable, decentralized storage layer for the Solana blockchain. It aims to solve the 'blockchain storage trilemma' by providing a solution that is scalable, smart contract native, and supports random access.",
    features: [
        "Scalable storage (exabytes+) for data-intensive dApps",
        "Smart contract native integration with Solana",
        "Random access for quick data retrieval",
        "Liquid staking pool for SOL holders",
        "First multi-validator pool on Solana"
    ],
    links: {
        website: "https://www.xandeum.network/",
        twitter: "https://x.com/XandeumNetwork",
        discord: "https://discord.com/invite/B88jTAYBhZ",
        telegram: "https://t.me/XandeumLabs",
        solflare: "https://www.solflare.com/prices/xandeum/XANDuUoVoUqniKkpcKhrxmvYJybpJvUxJLr21Gaj3Hx/"
    }
};

function TokenInfoCard() {
    const [copied, setCopied] = useState(false);

    const copyAddress = () => {
        navigator.clipboard.writeText(XAND_TOKEN.mintAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Card className="border-border bg-card">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Image
                        src="/crypto-logos/xandeum-logo.png"
                        alt="XAND Token"
                        width={48}
                        height={48}
                        className="rounded-full"
                    />
                    <div>
                        <CardTitle className="text-xl flex items-center gap-2">
                            {XAND_TOKEN.name}
                            <Badge variant="secondary">{XAND_TOKEN.symbol}</Badge>
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 text-xs mt-1">
                            <span className="font-mono truncate max-w-[200px]">
                                {XAND_TOKEN.mintAddress.slice(0, 8)}...{XAND_TOKEN.mintAddress.slice(-8)}
                            </span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5"
                                onClick={copyAddress}
                            >
                                {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                            </Button>
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                    {XAND_TOKEN.description}
                </p>

                {/* Key Features */}
                <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">Key Features</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {XAND_TOKEN.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                                <span className="text-primary mt-0.5">•</span>
                                {feature}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Links */}
                <div className="flex flex-wrap gap-2 pt-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => window.open(XAND_TOKEN.links.website, '_blank')}
                    >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Website
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => window.open(XAND_TOKEN.links.twitter, '_blank')}
                    >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Twitter
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => window.open(XAND_TOKEN.links.discord, '_blank')}
                    >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Discord
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => window.open(XAND_TOKEN.links.telegram, '_blank')}
                    >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Telegram
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => window.open(XAND_TOKEN.links.solflare, '_blank')}
                    >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View on Solflare
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export default function TradePage() {
    return (
        <ContentLayout title="Trade XAND">
            <div className="space-y-6">
                {/* Chart and Swap Section */}
                <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-280px)] min-h-[500px]">
                    {/* Price Chart - Takes 70% on desktop */}
                    <div className="flex-1 lg:w-[70%] min-h-[350px] lg:min-h-0 h-full">
                        <div className="h-full rounded-xl border border-border bg-card overflow-hidden flex flex-col">
                            <div className="p-4 border-b border-border">
                                <h2 className="text-lg font-semibold text-foreground">XAND Price Chart</h2>
                                <p className="text-sm text-muted-foreground">Live price data powered by Moralis</p>
                            </div>
                            <div className="flex-1 relative min-h-0">
                                <PriceChartWidget />
                            </div>
                        </div>
                    </div>

                    {/* Swap Widget */}
                    <div className="w-full lg:w-[30%] lg:max-w-[450px] min-h-[450px] lg:min-h-0">
                        <SwapForm
                            className="h-full border-border bg-card"
                            showTokenBalance={true}
                        />
                    </div>
                </div>

                {/* Market Stats Section */}
                <MarketStatsCard />

                {/* Token Info Section */}
                <TokenInfoCard />
            </div>
        </ContentLayout>
    );
}
