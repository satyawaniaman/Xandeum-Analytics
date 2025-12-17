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

import { NumberTicker } from "@/components/ui/number-ticker";



export function MarketStatsCard() {
    const [data, setData] = useState<TokenData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("https://api.dexscreener.com/latest/dex/tokens/XANDuUoVoUqniKkpcKhrxmvYJybpJvUxJLr21Gaj3Hx");
                const json = await response.json();

                if (json.pairs && json.pairs.length > 0) {
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
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

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

    // Helper to prepare ticker data
    const getTickerData = (num: number, isCurrency = false) => {
        let value = num;
        let suffix = "";
        const prefix = isCurrency ? "$" : "";

        if (num >= 1000000000) {
            value = num / 1000000000;
            suffix = "B";
        } else if (num >= 1000000) {
            value = num / 1000000;
            suffix = "M";
        } else if (num >= 1000) {
            value = num / 1000;
            suffix = "K";
        }

        return { value, prefix, suffix, decimals: 2 };
    };

    const stats = [
        {
            label: "Market Cap",
            ...getTickerData(data.marketCap || 10750000, true),
        },
        {
            label: "Volume 24h",
            ...getTickerData(data.volume.h24, true),
            subValue: `${data.priceChange.h24 > 0 ? "+" : ""}${data.priceChange.h24}%`,
            isPositive: data.priceChange.h24 >= 0
        },
        {
            label: "FDV",
            ...getTickerData(data.fdv, true),
        },
        {
            label: "Liquidity",
            ...getTickerData(data.liquidity.usd, true),
        },
        {
            label: "Max Supply",
            ...getTickerData(MAX_SUPPLY),
        },
        {
            label: "Circulating Supply",
            ...getTickerData(CIRCL_SUPPLY),
        }
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {stats.map((stat, i) => (
                <Card key={i} className="bg-card border-border">
                    <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                        <div className="mt-2 flex items-baseline gap-1">
                            {stat.prefix && <span className="text-lg font-semibold text-foreground">{stat.prefix}</span>}
                            <span className="text-lg font-semibold text-foreground">
                                <NumberTicker value={stat.value} decimalPlaces={stat.decimals} />
                            </span>
                            {stat.suffix && <span className="text-lg font-semibold text-foreground">{stat.suffix}</span>}

                            {"subValue" in stat && stat.subValue && (
                                <span className={`text-xs ml-1 flex items-center ${"isPositive" in stat && stat.isPositive ? "text-green-500" : "text-red-500"}`}>
                                    {"isPositive" in stat && stat.isPositive ? <ArrowUp className="w-3 h-3 mr-0.5" /> : <ArrowDown className="w-3 h-3 mr-0.5" />}
                                    {String(stat.subValue).replace("-", "")}
                                </span>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
