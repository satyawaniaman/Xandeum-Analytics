/**
 * ============================================================================
 * XANDEUM ANALYTICS API - Frontend Types & Examples
 * ============================================================================
 * 
 * This file contains TypeScript types and example responses for all API routes.
 * Base URL: https://your-analytics-api.com (or http://localhost:3000 for dev)
 * 
 * Generated: 2025-12-15
 */

// =============================================================================
// COMMON TYPES
// =============================================================================

/** Node status classification */
export type NodeStatus = "online_public" | "online_private" | "offline" | "unknown";

// =============================================================================
// GET /pnodes
// =============================================================================

/** Individual pNode data returned in the list */
export interface PNodeDto {
    // Identity
    id: string;                // UUID (e.g., "cmiurj9260001goxi8xgc4l07")
    address: string;           // Full address like "192.168.1.1:9001"
    ip: string;                // Just the IP: "192.168.1.1"
    port: string | null;       // Just the port: "9001"
    pubkey: string | null;     // Node's public key
    version: string | null;    // Software version

    // Status classification
    status: NodeStatus;
    hasPublicRpc: boolean;     // true if port 6000 is accessible
    isOnline: boolean;         // true if seen in last 5 minutes

    // Liveness
    lastSeenTimestamp: number | null;      // Unix timestamp (seconds)
    lastSeenAt: string | null;             // ISO 8601 datetime string
    lastSeenAgoSeconds: number | null;     // Seconds since last seen

    // System metrics
    cpuPercent: number | null;             // 0-100
    uptimeSeconds: number | null;          // Total uptime in seconds
    uptimeHuman: string | null;            // Formatted: "5d 12h 30m"

    // Memory metrics
    ramUsedBytes: number | null;
    ramTotalBytes: number | null;
    ramUsedGB: number | null;              // Derived: ramUsedBytes / 1e9
    ramTotalGB: number | null;             // Derived: ramTotalBytes / 1e9
    ramUsagePercent: number | null;        // Derived: (used/total) * 100

    // Storage metrics
    totalBytes: number | null;             // Data stored
    totalBytesMB: number | null;           // Derived: totalBytes / 1e6
    fileSizeBytes: number | null;          // Total storage capacity
    fileSizeGB: number | null;             // Derived: fileSizeBytes / 1e9
    totalPages: number | null;
    storageUtilizationPercent: number | null; // Derived: (totalBytes/fileSizeBytes) * 100

    // Network metrics
    packetsReceived: number | null;
    packetsSent: number | null;
    activeStreams: number | null;

    // Timestamps
    lastUpdatedTs: number | null;          // Last stats update timestamp
    createdAt: string | null;              // ISO 8601 datetime
    updatedAt: string | null;              // ISO 8601 datetime
}

/** Summary statistics for all nodes */
export interface PNodesSummary {
    total: number;
    online_public: number;     // Nodes with accessible RPC (port 6000)
    online_private: number;    // Online but RPC not accessible
    offline: number;
    unknown: number;
}

/** Response from GET /pnodes */
export interface GetPNodesResponse {
    summary: PNodesSummary;
    nodes: PNodeDto[];
    timestamp: string;         // ISO 8601 datetime of response generation
}

/** Example response for GET /pnodes */
export const GET_PNODES_EXAMPLE: GetPNodesResponse = {
    summary: {
        total: 25,
        online_public: 12,
        online_private: 8,
        offline: 4,
        unknown: 1,
    },
    nodes: [
        {
            id: "cmiurj9260001goxi8xgc4l07",
            address: "192.190.136.37:9001",
            ip: "192.190.136.37",
            port: "9001",
            pubkey: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
            version: "1.2.3",

            status: "online_public",
            hasPublicRpc: true,
            isOnline: true,

            lastSeenTimestamp: 1702648800,
            lastSeenAt: "2025-12-15T12:00:00.000Z",
            lastSeenAgoSeconds: 45,

            cpuPercent: 23.5,
            uptimeSeconds: 432000,
            uptimeHuman: "5d 0h 0m",

            ramUsedBytes: 4294967296,
            ramTotalBytes: 17179869184,
            ramUsedGB: 4.29,
            ramTotalGB: 17.18,
            ramUsagePercent: 25.0,

            totalBytes: 1073741824,
            totalBytesMB: 1073.74,
            fileSizeBytes: 10737418240,
            fileSizeGB: 10.74,
            totalPages: 1024,
            storageUtilizationPercent: 10.0,

            packetsReceived: 123456,
            packetsSent: 98765,
            activeStreams: 5,

            lastUpdatedTs: 1702648800,
            createdAt: "2025-12-01T00:00:00.000Z",
            updatedAt: "2025-12-15T12:00:00.000Z",
        },
        {
            id: "cmiurj9260002goxi9abc5def",
            address: "10.0.0.5:9001",
            ip: "10.0.0.5",
            port: "9001",
            pubkey: "3xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgXYZ",
            version: "1.2.3",

            status: "online_private",
            hasPublicRpc: false,
            isOnline: true,

            lastSeenTimestamp: 1702648750,
            lastSeenAt: "2025-12-15T11:59:10.000Z",
            lastSeenAgoSeconds: 95,

            // No detailed stats because port 6000 is not accessible
            cpuPercent: null,
            uptimeSeconds: null,
            uptimeHuman: null,

            ramUsedBytes: null,
            ramTotalBytes: null,
            ramUsedGB: null,
            ramTotalGB: null,
            ramUsagePercent: null,

            totalBytes: null,
            totalBytesMB: null,
            fileSizeBytes: null,
            fileSizeGB: null,
            totalPages: null,
            storageUtilizationPercent: null,

            packetsReceived: null,
            packetsSent: null,
            activeStreams: null,

            lastUpdatedTs: null,
            createdAt: "2025-12-05T00:00:00.000Z",
            updatedAt: "2025-12-15T11:59:10.000Z",
        },
    ],
    timestamp: "2025-12-15T12:00:45.123Z",
};


// =============================================================================
// GET /pnodes/stats
// =============================================================================

/** Response from GET /pnodes/stats */
export interface GetPNodesStatsResponse {
    total: number;             // Total number of known nodes
    online: number;            // Nodes seen in last 5 minutes
    with_public_rpc: number;   // Nodes with accessible port 6000
    timestamp: string;         // ISO 8601 datetime
}

/** Example response for GET /pnodes/stats */
export const GET_PNODES_STATS_EXAMPLE: GetPNodesStatsResponse = {
    total: 25,
    online: 20,
    with_public_rpc: 12,
    timestamp: "2025-12-15T12:00:45.123Z",
};


// =============================================================================
// GET /pnodes/:address
// =============================================================================

/** Response from GET /pnodes/:address - Same as PNodeDto */
export type GetPNodeDetailResponse = PNodeDto;

/** Example response for GET /pnodes/:address */
export const GET_PNODE_DETAIL_EXAMPLE: GetPNodeDetailResponse = {
    id: "cmiurj9260001goxi8xgc4l07",
    address: "192.190.136.37:9001",
    ip: "192.190.136.37",
    port: "9001",
    pubkey: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    version: "1.2.3",

    status: "online_public",
    hasPublicRpc: true,
    isOnline: true,

    lastSeenTimestamp: 1702648800,
    lastSeenAt: "2025-12-15T12:00:00.000Z",
    lastSeenAgoSeconds: 45,

    cpuPercent: 23.5,
    uptimeSeconds: 432000,
    uptimeHuman: "5d 0h 0m",

    ramUsedBytes: 4294967296,
    ramTotalBytes: 17179869184,
    ramUsedGB: 4.29,
    ramTotalGB: 17.18,
    ramUsagePercent: 25.0,

    totalBytes: 1073741824,
    totalBytesMB: 1073.74,
    fileSizeBytes: 10737418240,
    fileSizeGB: 10.74,
    totalPages: 1024,
    storageUtilizationPercent: 10.0,

    packetsReceived: 123456,
    packetsSent: 98765,
    activeStreams: 5,

    lastUpdatedTs: 1702648800,
    createdAt: "2025-12-01T00:00:00.000Z",
    updatedAt: "2025-12-15T12:00:00.000Z",
};


// =============================================================================
// POST /pnodes/sync
// =============================================================================

/** Response from POST /pnodes/sync (success) */
export interface PostSyncResponse {
    ok: boolean;
    timestamp: string;
    message: string;
}

/** Response from POST /pnodes/sync (error) */
export interface PostSyncErrorResponse {
    error: string;
    message: string;
}

/** Example success response for POST /pnodes/sync */
export const POST_SYNC_SUCCESS_EXAMPLE: PostSyncResponse = {
    ok: true,
    timestamp: "2025-12-15T12:00:45.123Z",
    message: "Sync completed successfully",
};

/** Example error response for POST /pnodes/sync */
export const POST_SYNC_ERROR_EXAMPLE: PostSyncErrorResponse = {
    error: "Sync failed",
    message: "Connection to pRPC node timed out",
};


// =============================================================================
// GET /health
// =============================================================================

/** Service status in health check */
export interface HealthServices {
    database: "ok" | "error";
    redis: "ok" | "error";
    prpc: "configured" | "not_configured";
}

/** Response from GET /health (healthy) */
export interface GetHealthResponse {
    status: "healthy" | "unhealthy";
    timestamp: string;
    services: HealthServices;
    uptime: number;            // Server uptime in seconds
    version: string;
}

/** Response from GET /health (unhealthy) */
export interface GetHealthUnhealthyResponse {
    status: "unhealthy";
    timestamp: string;
    error: string;
}

/** Example healthy response for GET /health */
export const GET_HEALTH_HEALTHY_EXAMPLE: GetHealthResponse = {
    status: "healthy",
    timestamp: "2025-12-15T12:00:45.123Z",
    services: {
        database: "ok",
        redis: "ok",
        prpc: "configured",
    },
    uptime: 86400,
    version: "1.0.0",
};

/** Example unhealthy response for GET /health */
export const GET_HEALTH_UNHEALTHY_EXAMPLE: GetHealthUnhealthyResponse = {
    status: "unhealthy",
    timestamp: "2025-12-15T12:00:45.123Z",
    error: "Database connection failed",
};


// =============================================================================
// ERROR RESPONSES (Common across all endpoints)
// =============================================================================

/** Generic API error response */
export interface ApiErrorResponse {
    error: string;
}

/** Development-only detailed error response */
export interface ApiErrorDetailedResponse {
    error: string;
    stack?: string;
    path: string;
}

/** 404 Not Found response */
export const NOT_FOUND_EXAMPLE: ApiErrorResponse = {
    error: "Node not found",
};

/** 401 Unauthorized response (for /pnodes/sync) */
export const UNAUTHORIZED_EXAMPLE: ApiErrorResponse = {
    error: "Unauthorized",
};

/** 500 Internal Server Error response */
export const SERVER_ERROR_EXAMPLE: ApiErrorResponse = {
    error: "Internal Server Error",
};


// =============================================================================
// API ENDPOINTS SUMMARY
// =============================================================================

/**
 * API Routes Reference:
 * 
 * | Method | Endpoint           | Description                        | Response Type            |
 * |--------|--------------------|------------------------------------|--------------------------|
 * | GET    | /health            | Health check                       | GetHealthResponse        |
 * | GET    | /pnodes            | List all nodes with metrics        | GetPNodesResponse        |
 * | GET    | /pnodes/stats      | Summary statistics only            | GetPNodesStatsResponse   |
 * | GET    | /pnodes/:address   | Single node details                | GetPNodeDetailResponse   |
 * | POST   | /pnodes/sync       | Trigger manual sync (auth required)| PostSyncResponse         |
 * | GET    | /openapi           | OpenAPI 3.0 specification          | OpenAPI JSON             |
 * 
 * Notes:
 * - All responses are cached in Redis for 30 seconds
 * - :address parameter should be URL-encoded (e.g., 192.168.1.1%3A9001)
 * - POST /pnodes/sync requires Bearer token if SYNC_TOKEN env is set
 */
