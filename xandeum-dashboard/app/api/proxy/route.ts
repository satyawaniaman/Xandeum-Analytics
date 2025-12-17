import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get("path") || "/pnodes";

    try {
        const response = await fetch(`${BACKEND_URL}${path}`, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Proxy error:", error);
        return NextResponse.json({ error: "Failed to fetch from backend" }, { status: 500 });
    }
}
