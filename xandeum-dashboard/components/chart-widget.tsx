import React, { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

declare global {
    interface Window {
        createMyWidget?: (
            containerId: string,
            config: Record<string, unknown>
        ) => void;
    }
}


const PRICE_CHART_ID = 'price-chart-widget-container';

export const PriceChartWidget = () => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Theme-aware colors
        const isDark = resolvedTheme === 'dark';
        const backgroundColor = isDark ? '#101013' : '#ffffff';
        const gridColor = isDark ? '#1c1c1f' : '#e5e7eb';
        const textColor = isDark ? '#9f9fa9' : '#374151';

        const loadWidget = () => {
            if (typeof window.createMyWidget === 'function') {
                window.createMyWidget(PRICE_CHART_ID, {
                    autoSize: true,
                    chainId: 'solana',
                    tokenAddress: 'XANDuUoVoUqniKkpcKhrxmvYJybpJvUxJLr21Gaj3Hx',
                    showHoldersChart: true,
                    defaultInterval: '1D',
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'Etc/UTC',
                    theme: 'moralis',
                    locale: 'en',
                    showCurrencyToggle: true,
                    backgroundColor,
                    candleUpColor: '#00bd7d',
                    candleDownColor: '#fb2c37',
                    gridColor,
                    textColor,
                    hideLeftToolbar: true,
                    hideTopToolbar: false,
                    hideBottomToolbar: false,
                });
            }
        };

        // Clear existing widget content before reloading
        const container = document.getElementById(PRICE_CHART_ID);
        if (container) {
            container.innerHTML = '';
        }

        if (!document.getElementById('moralis-chart-widget')) {
            const script = document.createElement('script');
            script.id = 'moralis-chart-widget';
            script.src = 'https://moralis.com/static/embed/chart.js';
            script.async = true;
            script.onload = loadWidget;
            document.body.appendChild(script);
        } else {
            loadWidget();
        }
    }, [resolvedTheme]);

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <div
                id={PRICE_CHART_ID}
                ref={containerRef}
                style={{ width: '100%', height: '100%' }}
            />
        </div>
    );
};
