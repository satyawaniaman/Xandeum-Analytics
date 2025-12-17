import Link from "next/link";
import { GeistSans } from "geist/font/sans";

export default function TermsPage() {
    return (
        <div className={`min-h-screen bg-background text-foreground ${GeistSans.className}`}>
            <div className="max-w-3xl mx-auto py-16 px-6">
                <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
                <p className="text-muted-foreground mb-8">Last updated: December 2025</p>

                <div className="space-y-6 text-foreground/90">
                    <section>
                        <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
                        <p>
                            By accessing and using Xandeum Analytics, you agree to be bound by these Terms of Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2">2. Use of Service</h2>
                        <p>
                            This dashboard provides analytics and monitoring for Xandeum pNodes.
                            The service is provided &quot;as is&quot; without warranties of any kind.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2">3. Data & Privacy</h2>
                        <p>
                            We collect minimal data necessary for the operation of this dashboard.
                            See our <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link> for details.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2">4. Disclaimer</h2>
                        <p>
                            This is a community-built analytics dashboard and is not affiliated with Xandeum Labs.
                            Use at your own risk.
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
