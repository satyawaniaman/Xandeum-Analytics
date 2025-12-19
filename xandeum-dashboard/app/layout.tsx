import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { WalletProvider } from "@/components/providers/wallet-provider";

const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Xandeum Dashboard",
  description: "pNode Analytics Dashboard",
  openGraph: {
    title: "Xandeum Dashboard",
    description: "Real-time analytics and monitoring for Xandeum pNodes.",
    url: "https://xandeumstats.xyz",
    siteName: "Xandeum Analytics",
    images: [
      {
        url: "/hero-img.png",
        width: 1200,
        height: 630,
        alt: "Xandeum Analytics Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Xandeum Dashboard",
    description: "Real-time analytics and monitoring for Xandeum pNodes.",
    images: ["/hero-img.png"],
  },
};

import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jetbrainsMono.variable} font-sans antialiased`}>
        <Providers>
          <WalletProvider>
            {children}
            <Toaster />
          </WalletProvider>
        </Providers>
      </body>
    </html>
  );
}
