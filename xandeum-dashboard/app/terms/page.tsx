import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import Link from "next/link";

export default function TermsPage() {
    return (
        <ContentLayout title="Terms of Service">
            <div className="prose prose-invert max-w-3xl mx-auto py-8 font-sans">
                <h1>Terms of Service</h1>
                <p className="text-muted-foreground">Last updated: December 2024</p>

                <h2>1. Acceptance of Terms</h2>
                <p>
                    By accessing and using Xandeum Analytics, you agree to be bound by these Terms of Service.
                </p>

                <h2>2. Use of Service</h2>
                <p>
                    This dashboard provides analytics and monitoring for Xandeum pNodes.
                    The service is provided &quot;as is&quot; without warranties of any kind.
                </p>

                <h2>3. Data & Privacy</h2>
                <p>
                    We collect minimal data necessary for the operation of this dashboard.
                    See our <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link> for details.
                </p>

                <h2>4. Disclaimer</h2>
                <p>
                    This is a community-built analytics dashboard and is not affiliated with Xandeum Labs.
                    Use at your own risk.
                </p>
            </div>
        </ContentLayout>
    );
}
