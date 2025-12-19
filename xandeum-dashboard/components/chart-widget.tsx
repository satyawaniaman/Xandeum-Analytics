"use client";

import React, { useEffect, useRef, useState, memo } from 'react';
import { useTheme } from 'next-themes';

function TradingViewWidget() {
    const container = useRef<HTMLDivElement>(null);
    const { resolvedTheme, theme } = useTheme();
    const [isXandeumTheme, setIsXandeumTheme] = useState(false);

    // Determine if dark mode - handle SSR by defaulting to dark
    const isDark = resolvedTheme === 'dark' || theme === 'dark' || typeof window === 'undefined';

    // Detect Xandeum theme
    useEffect(() => {
        const checkTheme = () => {
            const isXandeum = document.documentElement.classList.contains("theme-xandeum") ||
                localStorage.getItem("xandeum-theme-preference") === "xandeum";
            setIsXandeumTheme(isXandeum);
        };

        checkTheme();

        // Listen for theme changes
        const handleThemeChange = (e: Event) => {
            const customEvent = e as CustomEvent;
            setIsXandeumTheme(customEvent.detail.active);
        };

        window.addEventListener("xandeum-theme-change", handleThemeChange);
        return () => window.removeEventListener("xandeum-theme-change", handleThemeChange);
    }, []);

    useEffect(() => {
        if (!container.current) return;

        // Clear the container completely
        const widgetContainer = container.current.querySelector('.tradingview-widget-container__widget');
        if (widgetContainer) {
            widgetContainer.innerHTML = '';
        }

        // Remove any existing scripts
        const existingScripts = container.current.querySelectorAll('script');
        existingScripts.forEach(s => s.remove());

        // Compute colors directly in effect
        const backgroundColor = isXandeumTheme ? "#08113B" : (isDark ? "#171717" : "#ffffff");
        const gridColor = isXandeumTheme
            ? "rgba(25, 132, 118, 0.15)"
            : (isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.06)");

        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = JSON.stringify({
            "allow_symbol_change": true,
            "calendar": false,
            "details": false,
            "hide_side_toolbar": true,
            "hide_top_toolbar": false,
            "hide_legend": false,
            "hide_volume": false,
            "hotlist": false,
            "interval": "D",
            "locale": "en",
            "save_image": true,
            "style": "1",
            "symbol": "RAYDIUMCPMM:XANDSOL_C9ZJUG",
            "theme": (isDark || isXandeumTheme) ? "dark" : "light",
            "timezone": "Etc/UTC",
            "backgroundColor": backgroundColor,
            "gridColor": gridColor,
            "watchlist": [],
            "withdateranges": false,
            "compareSymbols": [],
            "studies": [],
            "autosize": true
        });

        container.current.appendChild(script);

        return () => {
            if (container.current) {
                const scripts = container.current.querySelectorAll('script');
                scripts.forEach(s => s.remove());
            }
        };
    }, [isDark, isXandeumTheme]);

    return (
        <div
            className="tradingview-widget-container bg-card rounded-lg overflow-hidden border border-border"
            ref={container}
            style={{ height: "100%", width: "100%" }}
        >
            <div
                className="tradingview-widget-container__widget"
                style={{ height: "calc(100% - 32px)", width: "100%" }}
            />
            <div className="tradingview-widget-copyright text-xs text-muted-foreground px-2 py-1 bg-card">
                <a
                    href="https://www.tradingview.com/symbols/XANDSOL_C9ZJUG/?exchange=RAYDIUMCPMM"
                    rel="noopener nofollow"
                    target="_blank"
                    className="text-primary hover:underline"
                >
                    XAND_SOL price
                </a>
                <span> by TradingView</span>
            </div>
        </div>
    );
}

export default memo(TradingViewWidget);