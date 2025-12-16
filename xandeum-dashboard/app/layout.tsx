import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { WalletProvider } from "@/components/providers/wallet-provider";

const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Xandeum Dashboard",
  description: "pNode Analytics Dashboard",
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
