import { NextResponse } from "next/server";

const POD_CREDITS_API = "https://podcredits.xandeum.network/api/pods-credits";

// Cache the response for 30 seconds to reduce API calls
let cachedData: {
    data: unknown;
    timestamp: number;
} | null = null;

const CACHE_TTL = 30000; // 30 seconds

export async function GET() {
    try {
        // Return cached data if still valid
        if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
            return NextResponse.json(cachedData.data);
        }

        // Fetch from external API
        const response = await fetch(POD_CREDITS_API, {
            headers: {
                "Accept": "application/json",
            },
            next: { revalidate: 30 }, // ISR revalidation
        });

        if (!response.ok) {
            throw new Error(`API responded with status ${response.status}`);
        }

        const data = await response.json();

        // Update cache
        cachedData = {
            data,
            timestamp: Date.now(),
        };

        return NextResponse.json(data);
    } catch (error) {
        console.error("Failed to fetch pod credits:", error);
        return NextResponse.json(
            { error: "Failed to fetch pod credits", status: "error" },
            { status: 500 }
        );
    }
}
