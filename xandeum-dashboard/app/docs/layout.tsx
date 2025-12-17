import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { baseOptions } from '@/lib/layout.shared';
import type { ReactNode, CSSProperties } from 'react';
import Link from 'next/link';

function DocsFooter() {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="border-t border-border bg-background py-6 mt-auto">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center gap-4">
                    {/* Links */}
                    <div className="flex gap-6 text-sm text-muted-foreground">
                        <Link href="/dashboard" className="hover:text-foreground transition-colors">
                            Dashboard
                        </Link>
                        <Link href="https://discord.gg/xandeum" target="_blank" className="hover:text-foreground transition-colors">
                            Discord
                        </Link>
                        <Link href="https://twitter.com/xandeum" target="_blank" className="hover:text-foreground transition-colors">
                            Twitter
                        </Link>
                        <Link href="https://github.com/xandeum" target="_blank" className="hover:text-foreground transition-colors">
                            GitHub
                        </Link>
                    </div>

                    {/* Copyright */}
                    <div className="text-center">
                        <p className="text-xs text-muted-foreground">
                            © {currentYear} Xandeum Community. All rights reserved.
                        </p>
                        <p className="mt-1 text-center text-muted-foreground/60 text-[10px] max-w-md">
                            Community-built analytics dashboard for the Xandeum network.
                            Not affiliated with Xandeum Labs.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}



import { GeistSans } from 'geist/font/sans';

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <div className={GeistSans.className} style={{ '--font-sans': GeistSans.style.fontFamily } as CSSProperties}>
            <RootProvider>
                <DocsLayout
                    tree={source.pageTree}
                    {...baseOptions()}
                    sidebar={{
                        defaultOpenLevel: 1,
                    }}
                >
                    {children}
                </DocsLayout>
                <DocsFooter />
            </RootProvider>
        </div>
    );
}
