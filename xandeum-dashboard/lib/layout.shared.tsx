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
        },
        githubUrl: 'https://github.com/xandeum',
    };
}
