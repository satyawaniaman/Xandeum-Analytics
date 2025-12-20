"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, TrendingUp, Coins } from "lucide-react";
import { cn } from "@/lib/utils";

interface StakingCalculatorProps {
    className?: string;
    currentApy?: number; // Dynamic APY from parent
}

type TimeframePeriod = "1M" | "6M" | "1Y" | "5Y";

const TIMEFRAME_MULTIPLIERS: Record<TimeframePeriod, number> = {
    "1M": 1 / 12,
    "6M": 0.5,
    "1Y": 1,
    "5Y": 5,
};

const TIMEFRAME_LABELS: Record<TimeframePeriod, string> = {
    "1M": "1 Month",
    "6M": "6 Months",
    "1Y": "1 Year",
    "5Y": "5 Years",
};

export function StakingCalculator({ className, currentApy = 8.5 }: StakingCalculatorProps) {
    const [amount, setAmount] = useState<number>(1);
    const [timeframe, setTimeframe] = useState<TimeframePeriod>("1Y");
    const [solPrice, setSolPrice] = useState<number>(0);
    const [isLoadingPrice, setIsLoadingPrice] = useState(true);

    // Fetch SOL price from CoinGecko (no auth required)
    useEffect(() => {
        const fetchSolPrice = async () => {
            try {
                setIsLoadingPrice(true);
                const res = await fetch(
                    "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
                );
                const data = await res.json();
                const price = data?.solana?.usd;
                if (price) {
                    setSolPrice(parseFloat(price));
                }
            } catch (error) {
                console.error("Error fetching SOL price:", error);
                setSolPrice(0);
            } finally {
                setIsLoadingPrice(false);
            }
        };

        fetchSolPrice();
        // Refresh every 60 seconds
        const interval = setInterval(fetchSolPrice, 60000);
        return () => clearInterval(interval);
    }, []);

    // Calculate returns
    const timeMultiplier = TIMEFRAME_MULTIPLIERS[timeframe];
    const apyDecimal = currentApy / 100;

    // Compound interest formula: A = P(1 + r/n)^(nt)
    // Simplified for annual compounding: A = P(1 + r)^t
    const expectedXANDsol = amount * Math.pow(1 + apyDecimal, timeMultiplier);
    const earnings = expectedXANDsol - amount;
    const earningsUsd = earnings * solPrice;
    const totalValueUsd = expectedXANDsol * solPrice;

    const handleAmountChange = (value: string) => {
        const parsed = parseFloat(value);
        if (!isNaN(parsed) && parsed >= 0) {
            setAmount(parsed);
        } else if (value === "") {
            setAmount(0);
        }
    };

    const handleSliderChange = (values: number[]) => {
        setAmount(values[0]);
    };

    return (
        <Card className={cn("w-full", className)}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Staking Calculator
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Amount Input */}
                <div className="space-y-3">
                    <label className="text-sm font-medium">Amount of SOL</label>
                    <div className="flex items-center gap-3">
                        <Input
                            type="number"
                            value={amount || ""}
                            onChange={(e) => handleAmountChange(e.target.value)}
                            placeholder="0.0"
                            className="text-lg"
                            min={0}
                            step={0.1}
                        />
                        <div className="flex items-center gap-2 min-w-[80px] bg-secondary/50 px-3 py-2 rounded-md">
                            <Image
                                src="/crypto-logos/solana-logo.svg"
                                alt="SOL"
                                width={20}
                                height={20}
                                className="rounded-full"
                            />
                            <span className="font-medium">SOL</span>
                        </div>
                    </div>
                    <Slider
                        value={[amount]}
                        onValueChange={handleSliderChange}
                        max={100}
                        step={0.1}
                        className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0 SOL</span>
                        <span>100 SOL</span>
                    </div>
                </div>

                {/* Timeframe Selection */}
                <div className="space-y-3">
                    <label className="text-sm font-medium">Timeframe</label>
                    <Tabs value={timeframe} onValueChange={(v) => setTimeframe(v as TimeframePeriod)}>
                        <TabsList className="grid w-full grid-cols-4">
                            {(Object.keys(TIMEFRAME_MULTIPLIERS) as TimeframePeriod[]).map((period) => (
                                <TabsTrigger key={period} value={period}>
                                    {period}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </div>

                {/* Results */}
                <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                            <Coins className="h-4 w-4" />
                            Expected XANDsol
                        </span>
                        <span className="font-semibold text-lg">
                            {expectedXANDsol.toFixed(4)}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">USD Value</span>
                        <span className="font-medium">
                            {isLoadingPrice ? "..." : `$${totalValueUsd.toFixed(2)}`}
                        </span>
                    </div>

                    <div className="border-t border-border pt-3 mt-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-green-500" />
                                Earnings ({TIMEFRAME_LABELS[timeframe]})
                            </span>
                            <span className="font-semibold text-green-500">
                                +{earnings.toFixed(4)} SOL
                            </span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                            <span className="text-sm text-muted-foreground">In USD</span>
                            <span className="font-medium text-green-500">
                                {isLoadingPrice ? "..." : `+$${earningsUsd.toFixed(2)}`}
                            </span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                        <span className="text-sm text-muted-foreground">Current APY</span>
                        <span className="font-semibold text-primary">{currentApy}%</span>
                    </div>
                </div>

                {/* Disclaimer */}
                <p className="text-xs text-muted-foreground text-center">
                    * Estimates based on current APY. Actual returns may vary.
                </p>
            </CardContent>
        </Card>
    );
}

export default StakingCalculator;
