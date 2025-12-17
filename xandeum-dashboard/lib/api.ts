import { GetPNodesResponse, GetPNodesStatsResponse, GetHealthResponse, PNode } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Use proxy in browser to avoid CORS, direct URL for server-side
function getApiUrl(path: string): string {
    if (typeof window !== "undefined") {
        // Client-side: use proxy
        return `/api/proxy?path=${encodeURIComponent(path)}`;
    }
    // Server-side: direct call
    return `${API_BASE_URL}${path}`;
}

/**
 * Fetch all pNodes with summary
 */
export async function fetchPNodes(): Promise<GetPNodesResponse> {
    const response = await fetch(getApiUrl("/pnodes"), {
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
    const response = await fetch(getApiUrl("/pnodes/stats"), {
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
    // Ensure we only use the IP address (strip port if present)
    // The backend expects just the IP
    const ip = address.includes(":") ? address.split(":")[0] : address;
    const encodedAddress = encodeURIComponent(ip);

    const response = await fetch(getApiUrl(`/pnodes/${encodedAddress}`), {
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
    const response = await fetch(getApiUrl("/health"), {
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

    const response = await fetch(getApiUrl("/pnodes/sync"), {
        method: "POST",
        headers,
    });

    if (!response.ok) {
        throw new Error(`Sync failed: ${response.statusText}`);
    }

    return response.json();
}
