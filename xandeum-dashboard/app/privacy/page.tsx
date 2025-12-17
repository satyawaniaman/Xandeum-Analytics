import Link from "next/link";
import { GeistSans } from "geist/font/sans";

export default function PrivacyPage() {
    return (
        <div className={`min-h-screen bg-background text-foreground ${GeistSans.className}`}>
            <div className="max-w-3xl mx-auto py-16 px-6">
                <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
                <p className="text-muted-foreground mb-8">Last updated: December 2025</p>

                <div className="space-y-6 text-foreground/90">
                    <section>
                        <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
                        <p className="mb-2">Xandeum Analytics collects minimal information necessary for operation:</p>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            <li>Publicly available blockchain data from Xandeum pNodes</li>
                            <li>Local storage preferences (theme, settings)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2">2. How We Use Information</h2>
                        <p>
                            Data is used solely to display pNode analytics and network statistics.
                            We do not sell or share your data with third parties.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2">3. Cookies & Local Storage</h2>
                        <p>
                            We use browser local storage to save your preferences (theme settings, watchlist).
                            No tracking cookies are used.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2">4. Third-Party Services</h2>
                        <p>
                            This dashboard may use third-party APIs (e.g., Jupiter, CoinGecko) for pricing data.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2">5. Contact</h2>
                        <p>
                            For privacy concerns, please reach out via our{" "}
                            <Link href="https://discord.gg/xandeum" className="text-primary hover:underline" target="_blank">Discord</Link>.
                        </p>
                    </section>

                    <div className="pt-8 border-t border-border">
                        <Link href="/dashboard" className="text-primary hover:underline">← Back to Dashboard</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
