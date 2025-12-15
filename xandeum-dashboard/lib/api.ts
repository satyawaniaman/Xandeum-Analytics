import { GetPNodesResponse, GetPNodesStatsResponse, GetHealthResponse, PNode } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

/**
 * Fetch all pNodes with summary
 */
export async function fetchPNodes(): Promise<GetPNodesResponse> {
    const response = await fetch(`${API_BASE_URL}/pnodes`, {
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch pNodes: ${response.statusText}`);
    }

    return response.json();
}

/**
 * Fetch pNodes stats summary only
 */
export async function fetchPNodesStats(): Promise<GetPNodesStatsResponse> {
    const response = await fetch(`${API_BASE_URL}/pnodes/stats`, {
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch pNodes stats: ${response.statusText}`);
    }

    return response.json();
}

/**
 * Fetch single pNode by address
 */
export async function fetchPNodeByAddress(address: string): Promise<PNode> {
    const encodedAddress = encodeURIComponent(address);
    const response = await fetch(`${API_BASE_URL}/pnodes/${encodedAddress}`, {
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch pNode: ${response.statusText}`);
    }

    return response.json();
}

/**
 * Fetch API health status
 */
export async function fetchHealth(): Promise<GetHealthResponse> {
    const response = await fetch(`${API_BASE_URL}/health`, {
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch health: ${response.statusText}`);
    }

    return response.json();
}

/**
 * Trigger manual sync (requires auth token)
 */
export async function triggerSync(token?: string): Promise<{ ok: boolean; message: string }> {
    const headers: HeadersInit = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/pnodes/sync`, {
        method: "POST",
        headers,
    });

    if (!response.ok) {
        throw new Error(`Sync failed: ${response.statusText}`);
    }

    return response.json();
}
