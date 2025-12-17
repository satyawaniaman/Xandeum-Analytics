"use client";

import Link from "next/link";
import { DiscordIcon } from "@/components/ui/discord";
import { TwitterIcon } from "@/components/ui/twitter";
import { GithubIcon } from "@/components/ui/github";
import { ExternalLink } from "lucide-react";

export function DashboardFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-border bg-background py-6 mt-auto">
            <div className="container mx-auto px-4">
                {/* Social Icons */}
                <div className="flex justify-center gap-4 mb-4">
                    <Link
                        href="https://discord.gg/xandeum"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-muted hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <DiscordIcon size={20} />
                    </Link>
                    <Link
                        href="https://twitter.com/xandeum"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-muted hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <TwitterIcon size={20} />
                    </Link>
                    <Link
                        href="https://github.com/xandeum"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-muted hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <GithubIcon size={20} />
                    </Link>
                </div>

                {/* Copyright and Links */}
                <div className="flex flex-col items-center gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <span>© {currentYear} Xandeum</span>
                        <span className="text-border">|</span>
                        <Link href="/terms" className="hover:text-foreground transition-colors">
                            Terms
                        </Link>
                        <span className="text-border">|</span>
                        <Link href="/privacy" className="hover:text-foreground transition-colors">
                            Privacy Policy
                        </Link>
                    </div>

                    {/* Docs Link */}
                    <Link
                        href="https://docs.xandeum.network/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ExternalLink className="h-3 w-3" />
                        <span>Read the Docs</span>
                    </Link>

                    {/* Community Disclaimer */}
                    <div className="mt-2 text-center text-muted-foreground/60 text-[10px] max-w-md">
                        Community-built analytics dashboard for the Xandeum network.
                        Not affiliated with Xandeum Labs.
                    </div>

                    {/* Powered By */}
                    <div className="mt-1 text-muted-foreground/70">
                        Powered by <span className="text-muted-foreground font-medium">Solana</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
