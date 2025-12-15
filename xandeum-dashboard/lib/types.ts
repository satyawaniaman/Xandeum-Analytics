/**
 * Xandeum Analytics API Types
 * Based on frontend-api-types.ts from backend
 */

// =============================================================================
// COMMON TYPES
// =============================================================================

/** Node status classification */
export type NodeStatus = "online_public" | "online_private" | "offline" | "unknown";

// =============================================================================
// PNODE TYPES
// =============================================================================

/** Individual pNode data */
export interface PNode {
    // Identity
    id: number;
    address: string;
    ip: string;
    port: string | null;
    pubkey: string | null;
    version: string | null;

    // Status
    status: NodeStatus;
    hasPublicRpc: boolean;
    isOnline: boolean;

    // Liveness
    lastSeenTimestamp: number | null;
    lastSeenAt: string | null;
    lastSeenAgoSeconds: number | null;

    // System metrics
    cpuPercent: number | null;
    uptimeSeconds: number | null;
    uptimeHuman: string | null;

    // Memory
    ramUsedBytes: number | null;
    ramTotalBytes: number | null;
    ramUsedGB: number | null;
    ramTotalGB: number | null;
    ramUsagePercent: number | null;

    // Storage
    totalBytes: number | null;
    totalBytesMB: number | null;
    fileSizeBytes: number | null;
    fileSizeGB: number | null;
    totalPages: number | null;
    storageUtilizationPercent: number | null;

    // Network
    packetsReceived: number | null;
    packetsSent: number | null;
    activeStreams: number | null;

    // Geolocation
    latitude: number | null;
    longitude: number | null;
    country: string | null;
    city: string | null;

    // Timestamps
    lastUpdatedTs: number | null;
    createdAt: string | null;
    updatedAt: string | null;
}

/** Summary statistics for all nodes */
export interface PNodesSummary {
    total: number;
    online_public: number;
    online_private: number;
    offline: number;
    unknown: number;
}

/** Response from GET /pnodes */
export interface GetPNodesResponse {
    summary: PNodesSummary;
    nodes: PNode[];
    timestamp: string;
}

/** Response from GET /pnodes/stats */
export interface GetPNodesStatsResponse {
    total: number;
    online: number;
    with_public_rpc: number;
    timestamp: string;
}

// =============================================================================
// HEALTH TYPES
// =============================================================================

export interface HealthServices {
    database: "ok" | "error";
    redis: "ok" | "error";
    prpc: "configured" | "not_configured";
}

export interface GetHealthResponse {
    status: "healthy" | "unhealthy";
    timestamp: string;
    services: HealthServices;
    uptime: number;
    version: string;
}

// =============================================================================
// API ERROR TYPES
// =============================================================================

export interface ApiError {
    error: string;
    message?: string;
}
