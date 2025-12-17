import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export function baseOptions(): BaseLayoutProps {
    return {
        nav: {
            title: (
                <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">Xandeum</span>
                    <span className="text-muted-foreground text-sm">Docs</span>
                </div>
            ),
            transparentMode: 'none',
        },
        links: [
            {
                text: 'Dashboard',
                url: '/dashboard',
                active: 'nested-url',
            },
            {
                text: 'Twitter',
                url: 'https://x.com/Xandeum',
                external: true,
            },
            {
                text: 'Discord',
                url: 'https://discord.com/invite/uqRSmmM5m',
                external: true,
            },
            {
                text: 'GitHub',
                url: 'https://github.com/Xandeum-pNode-Analytics/pNode-analytics-platform',
                external: true,
            },
        ],
    };
}
