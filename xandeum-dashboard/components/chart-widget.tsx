import React, { useEffect, useRef } from 'react';

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

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const loadWidget = () => {
            if (typeof window.createMyWidget === 'function') {
                window.createMyWidget(PRICE_CHART_ID, {
                    autoSize: true,
                    chainId: '0x1',
                    pairAddress: '0x56534741cd8b152df6d48adf7ac51f75169a83b2',
                    showHoldersChart: true,
                    defaultInterval: '1D',
                    timeZone:
                        Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'Etc/UTC',
                    theme: 'moralis',
                    locale: 'en',
                    showCurrencyToggle: true,
                    backgroundColor: '#09090b',
                    candleUpColor: '#00bd7d',
                    candleDownColor: '#fb2c37',
                    gridColor: '#1c1c1f',
                    textColor: '#9f9fa9',
                    hideLeftToolbar: true,
                    hideTopToolbar: false,
                    hideBottomToolbar: false,
                });
            }
        };

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
    }, []);

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
