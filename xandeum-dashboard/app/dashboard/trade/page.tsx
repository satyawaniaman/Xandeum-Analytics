"use client";

import dynamic from "next/dynamic";
import { ContentLayout } from "@/components/dashboard-panel/content-layout";

// Dynamic import with SSR disabled for chart widget (uses window/document)
const PriceChartWidget = dynamic(
    () => import("@/components/chart-widget").then((mod) => mod.PriceChartWidget),
    {
        ssr: false,
        loading: () => (
            <div className="flex items-center justify-center h-full text-zinc-500">
                Loading price chart...
            </div>
        )
    }
);

export default function TradePage() {
    return (
        <ContentLayout title="Trade XAND">
            <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)] min-h-[600px]">
                {/* Price Chart - Takes 70% on desktop */}
                <div className="flex-1 lg:w-[70%] min-h-[400px] lg:min-h-0 h-full">
                    <div className="h-full rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-zinc-800">
                            <h2 className="text-lg font-semibold text-zinc-100">XAND Price Chart</h2>
                            <p className="text-sm text-zinc-500">Live price data powered by Moralis</p>
                        </div>
                        <div className="flex-1 relative min-h-0">
                            <PriceChartWidget />
                        </div>
                    </div>
                </div>

                {/* Swap Widget - Empty container for custom implementation */}
                <div className="w-full lg:w-[30%] lg:max-w-[400px] min-h-[500px] lg:min-h-0">
                    <div className="h-full rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-zinc-800 flex-shrink-0">
                            <h2 className="text-lg font-semibold text-zinc-100">Swap Tokens</h2>
                            <p className="text-sm text-zinc-500">Powered by Jupiter</p>
                        </div>
                        <div className="flex-1 flex items-center justify-center p-4">
                            {/* Add your swap implementation here */}
                            <p className="text-zinc-500">Swap widget placeholder</p>
                        </div>
                    </div>
                </div>
            </div>
        </ContentLayout>
    );
}
