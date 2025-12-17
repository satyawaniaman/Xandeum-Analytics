"use client";

import useSWR from "swr";

const JUP_API_KEY = process.env.NEXT_PUBLIC_JUP_SWAP_V1_API_KEY;
const XAND_MINT = "XANDuUoVoUqniKkpcKhrxmvYJybpJvUxJLr21Gaj3Hx";

interface JupiterTokenStats {
    priceChange: number;
    liquidityChange: number;
    volumeChange: number;
    buyVolume: number;
    sellVolume: number;
}

export interface JupiterTokenData {
    id: string;
    symbol: string;
    name: string;
    price: number;
    volume24h: number;
    liquidity: number;
    stats: {
        min5: JupiterTokenStats;
        hour1: JupiterTokenStats;
        hour6: JupiterTokenStats;
        day24: JupiterTokenStats;
    };
    priceHistory: { time: string; value: number }[];
    liquidityHistory: { time: string; value: number }[];
}

const fetcher = async (url: string) => {
    const res = await fetch(url, {
        headers: {
            "x-api-key": JUP_API_KEY || "",
        },
    });
    if (!res.ok) throw new Error("Failed to fetch token data");
    return res.json();
};

export function useXandeumToken() {
    const { data, error, isLoading } = useSWR(
        `https://api.jup.ag/ultra/v1/search?query=${XAND_MINT}`,
        fetcher,
        { refreshInterval: 60000 }
    );

    let tokenData: JupiterTokenData | null = null;

    if (data && data[0]) {
        const t = data[0];
        const currentPrice = t.usdPrice; // Need to verify if 'usdPrice' is in response. User curl shows 'usdPrice'.
        const currentLiq = t.liquidity;

        const getPrev = (curr: number, change: number) => curr / (1 + (change || 0) / 100);

        // Price History
        const priceHistory = [
            { time: "24h ago", value: getPrev(currentPrice, t.stats24h?.priceChange) },
            { time: "6h ago", value: getPrev(currentPrice, t.stats6h?.priceChange) },
            { time: "1h ago", value: getPrev(currentPrice, t.stats1h?.priceChange) },
            { time: "5m ago", value: getPrev(currentPrice, t.stats5m?.priceChange) },
            { time: "Now", value: currentPrice },
        ];

        // Liquidity History
        const liqHistory = [
            { time: "24h ago", value: getPrev(currentLiq, t.stats24h?.liquidityChange) },
            { time: "6h ago", value: getPrev(currentLiq, t.stats6h?.liquidityChange) },
            { time: "1h ago", value: getPrev(currentLiq, t.stats1h?.liquidityChange) },
            { time: "5m ago", value: getPrev(currentLiq, t.stats5m?.liquidityChange) },
            { time: "Now", value: currentLiq },
        ];

        tokenData = {
            id: t.id,
            symbol: t.symbol,
            name: t.name,
            price: currentPrice,
            volume24h: t.stats24h?.buyVolume + t.stats24h?.sellVolume || 0,
            liquidity: currentLiq,
            stats: {
                min5: t.stats5m,
                hour1: t.stats1h,
                hour6: t.stats6h,
                day24: t.stats24h,
            },
            priceHistory,
            liquidityHistory: liqHistory,
        };
    }

    return {
        data: tokenData,
        isLoading,
        error,
    };
}
