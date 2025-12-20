import { NextRequest, NextResponse } from "next/server";

// This route is not currently used since we swap directly via Jupiter client-side
// But keeping it for potential server-side staking features in the future

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { account, amount } = body;

        if (!account || !amount || amount <= 0) {
            return NextResponse.json(
                { error: "Invalid parameters" },
                { status: 400 }
            );
        }

        // For now, return an error since staking is handled client-side via Jupiter
        return NextResponse.json(
            {
                error: "Server-side staking not implemented. Use client-side Jupiter swap instead.",
                suggestion: "Navigate to /dashboard/stake and use the stake form."
            },
            { status: 501 }
        );

    } catch (error) {
        console.error("Staking error:", error);
        return NextResponse.json(
            { error: "Failed to process staking request" },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        message: "Staking API",
        info: "POST to this endpoint with { account, amount } to stake SOL",
        note: "Currently staking is handled client-side via Jupiter swap"
    });
}