"use client";

import { useState, useEffect } from "react";
import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, Copy, Check } from "lucide-react";
import Image from "next/image";

// URLs
const XANDSOL_STAKE_URL = "https://xandsol.xandeum.network";
const REALMS_DAO_URL = "https://app.realms.today/dao/XAND";

// XANDsol Token Info
const XANDSOL_TOKEN = {
    name: "XANDsol",
    symbol: "XANDsol",
    mintAddress: "XAnDeUmMcqFyCdef9jzpNgtZPjTj3xUMj9eXKn2reFN",
    description: "XANDsol is Xandeum's liquid staking token. Stake your SOL and receive XANDsol to earn staking rewards while maintaining full liquidity. Your staked assets remain usable across DeFi.",
    features: [
        "Liquid staking - use your staked SOL in DeFi",
        "Automatic reward compounding",
        "No lock-up period required",
        "Instant unstaking available",
    ],
    links: {
        stake: "https://xandsol.xandeum.network",
        dao: "https://app.realms.today/dao/XAND",
        docs: "https://docs.xandeum.network",
    }
};

// Timeframe options for calculator
type TimeframePeriod = "1M" | "6M" | "1Y" | "5Y";

const TIMEFRAME_MULTIPLIERS: Record<TimeframePeriod, number> = {
    "1M": 1 / 12,
    "6M": 0.5,
    "1Y": 1,
    "5Y": 5,
};

// Staking Calculator Component
function StakingCalculator({ solPrice }: { solPrice: number }) {
    const [amount, setAmount] = useState<number>(10);
    const [timeframe, setTimeframe] = useState<TimeframePeriod>("1Y");

    // XANDsol uses rebasing - 1 SOL ≈ 0.9175 XANDsol (XANDsol appreciates over time)
    const exchangeRate = 0.9175; // From official XANDsol site
    const apy = 16; // Official APY
    const timeMultiplier = TIMEFRAME_MULTIPLIERS[timeframe];

    // Initial XANDsol received
    const xandsolReceived = amount * exchangeRate;

    // XANDsol value grows at APY rate
    const futureXandsolValue = xandsolReceived * Math.pow(1 + apy / 100, timeMultiplier);

    // Earnings in SOL terms (XANDsol value minus initial SOL)
    const earningsInSol = (futureXandsolValue / exchangeRate) - amount;
    const earningsUsd = earningsInSol * solPrice;

    return (
        <Card className="border-border bg-card h-full">
            <CardHeader>
                <CardTitle>Staking Calculator</CardTitle>
                <CardDescription>Estimate your staking rewards</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Amount Input */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-medium">Amount</label>
                        <span className="text-xs text-muted-foreground">{amount} SOL</span>
                    </div>
                    <div className="flex gap-2">
                        <Input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                            className="text-lg"
                            min={0}
                        />
                        <div className="flex items-center gap-2 bg-secondary px-3 rounded-md min-w-[80px]">
                            <Image
                                src="/crypto-logos/solana-logo.svg"
                                alt="SOL"
                                width={20}
                                height={20}
                                className="rounded-full"
                            />
                            <span className="text-sm font-medium">SOL</span>
                        </div>
                    </div>
                    <Slider
                        value={[amount]}
                        onValueChange={(v) => setAmount(v[0])}
                        max={100}
                        step={1}
                    />
                </div>

                {/* Timeframe */}
                <div className="space-y-3">
                    <label className="text-sm font-medium">Timeframe</label>
                    <Tabs value={timeframe} onValueChange={(v) => setTimeframe(v as TimeframePeriod)}>
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="1M">1M</TabsTrigger>
                            <TabsTrigger value="6M">6M</TabsTrigger>
                            <TabsTrigger value="1Y">1Y</TabsTrigger>
                            <TabsTrigger value="5Y">5Y</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {/* Results */}
                <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">You&apos;ll Receive</span>
                        <span className="font-semibold">{xandsolReceived.toFixed(4)} XANDsol</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Value After {timeframe}</span>
                        <span className="font-semibold">{futureXandsolValue.toFixed(4)} XANDsol</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Earnings</span>
                        <span className="font-semibold text-green-500">
                            +{earningsInSol.toFixed(4)} SOL
                            {solPrice > 0 && ` ($${earningsUsd.toFixed(2)})`}
                        </span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-t border-border pt-2 mt-2">
                        <span className="text-muted-foreground">APY</span>
                        <Badge variant="secondary">{apy}%</Badge>
                    </div>
                </div>

                <Button
                    className="w-full"
                    onClick={() => window.open(XANDSOL_STAKE_URL, "_blank")}
                >
                    Stake on XANDsol
                    <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
            </CardContent>
        </Card>
    );
}

// Stats Cards
function StatsCards({ solPrice, xandsolPrice, tvl }: { solPrice: number; xandsolPrice: number; tvl: number }) {
    // Format TVL for display
    const formatTvl = (value: number) => {
        if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
        if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
        return `$${value.toFixed(0)}`;
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-card">
                <CardContent className="pt-4 pb-4">
                    <p className="text-xs text-muted-foreground mb-1">Staking APY</p>
                    <p className="text-2xl font-bold text-green-500">16%</p>
                </CardContent>
            </Card>
            <Card className="bg-card">
                <CardContent className="pt-4 pb-4">
                    <p className="text-xs text-muted-foreground mb-1">XANDsol Price</p>
                    <p className="text-2xl font-bold">{xandsolPrice > 0 ? `$${xandsolPrice.toFixed(2)}` : "..."}</p>
                </CardContent>
            </Card>
            <Card className="bg-card">
                <CardContent className="pt-4 pb-4">
                    <p className="text-xs text-muted-foreground mb-1">SOL Price</p>
                    <p className="text-2xl font-bold">{solPrice > 0 ? `$${solPrice.toFixed(2)}` : "..."}</p>
                </CardContent>
            </Card>
            <Card className="bg-card">
                <CardContent className="pt-4 pb-4">
                    <p className="text-xs text-muted-foreground mb-1">Total Value Locked</p>
                    <p className="text-2xl font-bold">{tvl > 0 ? formatTvl(tvl) : "..."}</p>
                </CardContent>
            </Card>
        </div>
    );
}

// Token Info Card (matches trade page TokenInfoCard style)
function TokenInfoCard() {
    const [copied, setCopied] = useState(false);

    const copyAddress = () => {
        navigator.clipboard.writeText(XANDSOL_TOKEN.mintAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Card className="border-border bg-card">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Image
                        src="/crypto-logos/xandeum-logo.png"
                        alt="XANDsol"
                        width={48}
                        height={48}
                        className="rounded-full"
                    />
                    <div>
                        <CardTitle className="text-xl flex items-center gap-2">
                            {XANDSOL_TOKEN.name}
                            <Badge variant="secondary">{XANDSOL_TOKEN.symbol}</Badge>
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 text-xs mt-1">
                            <span className="font-mono truncate max-w-[200px]">
                                {XANDSOL_TOKEN.mintAddress.slice(0, 8)}...{XANDSOL_TOKEN.mintAddress.slice(-8)}
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
                    {XANDSOL_TOKEN.description}
                </p>

                {/* Key Features */}
                <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">Benefits</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {XANDSOL_TOKEN.features.map((feature, i) => (
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
                        onClick={() => window.open(XANDSOL_TOKEN.links.stake, '_blank')}
                    >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        XANDsol App
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => window.open(XANDSOL_TOKEN.links.dao, '_blank')}
                    >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Realms DAO
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => window.open(XANDSOL_TOKEN.links.docs, '_blank')}
                    >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Documentation
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

// XAND Staking Card
function XANDStakingCard() {
    return (
        <Card className="border-border bg-card">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    XAND Token Staking
                    <Badge variant="secondary">16% APY</Badge>
                </CardTitle>
                <CardDescription>Lock XAND tokens for governance and rewards</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                    Lock your XAND tokens for 30+ days to earn 16% APY and boost your DAO voting power on Realms.
                </p>
                <Button
                    variant="outline"
                    onClick={() => window.open(REALMS_DAO_URL, "_blank")}
                >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Stake on Realms DAO
                </Button>
            </CardContent>
        </Card>
    );
}

export default function StakePage() {
    const [solPrice, setSolPrice] = useState<number>(0);
    const [xandsolPrice, setXandsolPrice] = useState<number>(0);
    const [tvl, setTvl] = useState<number>(0);

    useEffect(() => {
        const JUP_API_KEY = process.env.NEXT_PUBLIC_JUP_SWAP_V1_API_KEY || "";

        const fetchPrices = async () => {
            try {
                // Fetch SOL price from Jupiter Ultra API
                const solRes = await fetch(
                    "https://api.jup.ag/ultra/v1/search?query=So11111111111111111111111111111111111111112",
                    {
                        headers: {
                            "x-api-key": JUP_API_KEY,
                            "Accept": "application/json",
                        },
                    }
                );
                const solData = await solRes.json();
                if (solData?.[0]?.usdPrice) setSolPrice(solData[0].usdPrice);

                // Fetch XANDsol data from Jupiter Ultra API
                const xandsolRes = await fetch(
                    "https://api.jup.ag/ultra/v1/search?query=XAnDeUmMcqFyCdef9jzpNgtZPjTj3xUMj9eXKn2reFN",
                    {
                        headers: {
                            "x-api-key": JUP_API_KEY,
                            "Accept": "application/json",
                        },
                    }
                );
                const xandsolData = await xandsolRes.json();
                if (xandsolData?.[0]?.usdPrice) setXandsolPrice(xandsolData[0].usdPrice);
                if (xandsolData?.[0]?.liquidity) setTvl(xandsolData[0].liquidity);
            } catch (error) {
                console.error("Error fetching prices:", error);
            }
        };

        fetchPrices();
        const interval = setInterval(fetchPrices, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <ContentLayout title="Stake SOL">
            <div className="space-y-6">
                {/* Stats Row */}
                <StatsCards solPrice={solPrice} xandsolPrice={xandsolPrice} tvl={tvl} />

                {/* Main Content */}
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Calculator */}
                    <div className="w-full lg:w-[400px]">
                        <StakingCalculator solPrice={solPrice} />
                    </div>

                    {/* Info Cards */}
                    <div className="flex-1 space-y-6">
                        <TokenInfoCard />
                        <XANDStakingCard />
                    </div>
                </div>
            </div>
        </ContentLayout>
    );
}

