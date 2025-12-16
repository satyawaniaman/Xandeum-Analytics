"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDown, ArrowUp } from "lucide-react";

interface TokenData {
    priceUsd: string;
    marketCap: number;
    fdv: number;
    liquidity: {
        usd: number;
    };
    volume: {
        h24: number;
    };
    priceChange: {
        h24: number;
    };
}

const formatNumber = (num: number) => {
    if (num >= 1000000000) return (num / 1000000000).toFixed(2) + "B";
    if (num >= 1000000) return (num / 1000000).toFixed(2) + "M";
    if (num >= 1000) return (num / 1000).toFixed(2) + "K";
    return num.toFixed(2);
};

const formatCurrency = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(num);
};

export function MarketStatsCard() {
    const [data, setData] = useState<TokenData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("https://api.dexscreener.com/latest/dex/tokens/XANDuUoVoUqniKkpcKhrxmvYJybpJvUxJLr21Gaj3Hx");
                const json = await response.json();

                if (json.pairs && json.pairs.length > 0) {
                    // Find the most liquid pair or just take the first one
                    const pair = json.pairs[0];
                    setData({
                        priceUsd: pair.priceUsd,
                        marketCap: pair.marketCap,
                        fdv: pair.fdv,
                        liquidity: pair.liquidity,
                        volume: pair.volume,
                        priceChange: pair.priceChange
                    });
                }
            } catch (error) {
                console.error("Error fetching market data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        // Refresh every 30 seconds
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    // Static supply data as requested
    const MAX_SUPPLY = 4010000000;
    const CIRCL_SUPPLY = 1340000000;

    if (loading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 animate-pulse">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-24 bg-muted rounded-xl border border-border" />
                ))}
            </div>
        );
    }

    if (!data) return null;

    const stats = [
        {
            label: "Market Cap",
            value: data.marketCap ? formatCurrency(data.marketCap) : "$10.75M", // Fallback to user provided if API missing
        },
        {
            label: "Volume 24h",
            value: formatCurrency(data.volume.h24),
            subValue: `${data.priceChange.h24 > 0 ? "+" : ""}${data.priceChange.h24}%`,
            isPositive: data.priceChange.h24 >= 0
        },
        {
            label: "FDV",
            value: formatCurrency(data.fdv),
        },
        {
            label: "Liquidity",
            value: formatCurrency(data.liquidity.usd),
        },
        {
            label: "Max Supply",
            value: formatNumber(MAX_SUPPLY),
        },
        {
            label: "Circulating Supply",
            value: formatNumber(CIRCL_SUPPLY),
        }
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {stats.map((stat, i) => (
                <Card key={i} className="bg-card border-border">
                    <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                        <div className="mt-2 flex items-baseline gap-2">
                            <p className="text-lg font-semibold text-foreground">
                                {stat.value}
                            </p>
                            {stat.subValue && (
                                <span className={`text-xs flex items-center ${stat.isPositive ? "text-green-500" : "text-red-500"}`}>
                                    {stat.isPositive ? <ArrowUp className="w-3 h-3 mr-0.5" /> : <ArrowDown className="w-3 h-3 mr-0.5" />}
                                    {stat.subValue.replace("-", "")}
                                </span>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
