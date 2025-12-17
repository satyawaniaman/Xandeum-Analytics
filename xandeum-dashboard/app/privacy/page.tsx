import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import Link from "next/link";

export default function PrivacyPage() {
    return (
        <ContentLayout title="Privacy Policy">
            <div className="prose prose-invert max-w-3xl mx-auto py-8 font-sans">
                <h1>Privacy Policy</h1>
                <p className="text-muted-foreground">Last updated: December 2024</p>

                <h2>1. Information We Collect</h2>
                <p>
                    Xandeum Analytics collects minimal information necessary for operation:
                </p>
                <ul>
                    <li>Publicly available blockchain data from Xandeum pNodes</li>
                    <li>Local storage preferences (theme, settings)</li>
                </ul>

                <h2>2. How We Use Information</h2>
                <p>
                    Data is used solely to display pNode analytics and network statistics.
                    We do not sell or share your data with third parties.
                </p>

                <h2>3. Cookies & Local Storage</h2>
                <p>
                    We use browser local storage to save your preferences (theme settings, watchlist).
                    No tracking cookies are used.
                </p>

                <h2>4. Third-Party Services</h2>
                <p>
                    This dashboard may use third-party APIs (e.g., Jupiter, CoinGecko) for pricing data.
                </p>

                <h2>5. Contact</h2>
                <p>
                    For privacy concerns, please reach out via our <Link href="https://discord.gg/xandeum" className="text-primary hover:underline" target="_blank">Discord</Link>.
                </p>
            </div>
        </ContentLayout>
    );
}
