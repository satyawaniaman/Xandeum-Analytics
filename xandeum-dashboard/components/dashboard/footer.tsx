"use client";

import Link from "next/link";
import { DiscordIcon } from "@/components/ui/discord";
import { TwitterIcon } from "@/components/ui/twitter";
import { GithubIcon } from "@/components/ui/github";
import { ExternalLink } from "lucide-react";

export function DashboardFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-zinc-800 bg-zinc-950 py-6 mt-auto">
            <div className="container mx-auto px-4">
                {/* Social Icons */}
                <div className="flex justify-center gap-4 mb-4">
                    <Link
                        href="https://discord.gg/xandeum"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                    >
                        <DiscordIcon size={20} />
                    </Link>
                    <Link
                        href="https://twitter.com/xandeum"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                    >
                        <TwitterIcon size={20} />
                    </Link>
                    <Link
                        href="https://github.com/xandeum"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                    >
                        <GithubIcon size={20} />
                    </Link>
                </div>

                {/* Copyright and Links */}
                <div className="flex flex-col items-center gap-2 text-xs text-zinc-500">
                    <div className="flex items-center gap-2">
                        <span>© {currentYear} Xandeum</span>
                        <span className="text-zinc-700">|</span>
                        <Link href="/terms" className="hover:text-zinc-300 transition-colors">
                            Terms
                        </Link>
                        <span className="text-zinc-700">|</span>
                        <Link href="/privacy" className="hover:text-zinc-300 transition-colors">
                            Privacy Policy
                        </Link>
                    </div>

                    {/* Docs Link */}
                    <Link
                        href="https://docs.xandeum.network/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                        <ExternalLink className="h-3 w-3" />
                        <span>Read the Docs</span>
                    </Link>

                    {/* Powered By */}
                    <div className="mt-1 text-zinc-600">
                        Powered by <span className="text-zinc-400 font-medium">Solana</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
