// types-for-frontend.ts
// Copy this file to your Next.js frontend project

/**
 * Node Status Types
 */
export type NodeStatus =
  | "online_public"
  | "online_private"
  | "offline"
  | "unknown";

/**
 * Individual pNode Data Transfer Object
 * Returned from GET /pnodes (in nodes array) and GET /pnodes/:address
 */
export interface PNodeDTO {
  // Identity
  id: string;
  address: string;
  ip: string;
  port: string | null;
  pubkey: string | null;
  version: string | null;

  // Status Classification
  status: NodeStatus;
  hasPublicRpc: boolean;
  isOnline: boolean;

  // Liveness
  lastSeenTimestamp: number | null;
  lastSeenAt: string | null;
  lastSeenAgoSeconds: number | null;

  // System Metrics
  cpuPercent: number | null;
  uptimeSeconds: number | null;
  uptimeHuman: string | null;

  // Memory Metrics
  ramUsedBytes: number | null;
  ramTotalBytes: number | null;
  ramUsedGB: number | null;
  ramTotalGB: number | null;
  ramUsagePercent: number | null;

  // Storage Metrics
  totalBytes: number | null;
  totalBytesMB: number | null;
  fileSizeBytes: number | null;
  fileSizeGB: number | null;
  totalPages: number | null;
  storageUtilizationPercent: number | null;

  // Network Metrics
  packetsReceived: number | null;
  packetsSent: number | null;
  activeStreams: number | null;

  // Metadata
  lastUpdatedTs: number | null;
  createdAt: string | null;
  updatedAt: string | null;
}

/**
 * Summary Statistics
 */
export interface NodeSummary {
  total: number;
  online_public: number;
  online_private: number;
  offline: number;
  unknown: number;
}

/**
 * Response from GET /pnodes
 * Full list of nodes with summary statistics
 */
export interface GetPNodesResponse {
  summary: NodeSummary;
  nodes: PNodeDTO[];
  timestamp: string;
}

/**
 * Response from GET /pnodes/stats
 * Quick statistics without full node list
 */
export interface GetStatsResponse {
  total: number;
  online: number;
  with_public_rpc: number;
  timestamp: string;
}

/**
 * Response from GET /pnodes/:address
 * Single node details
 */
export type GetNodeDetailsResponse = PNodeDTO;

/**
 * Response from POST /pnodes/sync
 * Manual sync trigger response
 */
export interface SyncResponse {
  ok: boolean;
  timestamp: string;
  message: string;
}

/**
 * Response from GET /health
 * Health check endpoint
 */
export interface HealthCheckResponse {
  status: "healthy" | "unhealthy";
  timestamp: string;
  services: {
    database: string;
    redis: string;
    prpc: string;
  };
  uptime: number;
  version?: string;
  error?: string;
}

/**
 * Error Response
 * Generic error structure from API
 */
export interface ErrorResponse {
  error: string;
  message?: string;
}

/**
 * API Client Type-safe Functions
 * Use these in your frontend to call the API
 */
export interface XandeumAPIClient {
  /**
   * Get all nodes with summary statistics
   * GET /pnodes
   */
  getNodes(): Promise<GetPNodesResponse>;

  /**
   * Get quick statistics only
   * GET /pnodes/stats
   */
  getStats(): Promise<GetStatsResponse>;

  /**
   * Get details for a specific node
   * GET /pnodes/:address
   * @param address - Node address (will be URL-encoded automatically)
   */
  getNodeDetails(address: string): Promise<GetNodeDetailsResponse>;

  /**
   * Trigger manual sync (requires SYNC_TOKEN)
   * POST /pnodes/sync
   * @param token - SYNC_TOKEN for authentication
   */
  triggerSync(token: string): Promise<SyncResponse>;

  /**
   * Check API health
   * GET /health
   */
  healthCheck(): Promise<HealthCheckResponse>;
}

// ==============================================================================
// EXAMPLE IMPLEMENTATION
// ==============================================================================

/**
 * Example API Client Implementation
 * Copy this to your frontend project and adjust as needed
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const createAPIClient = (): XandeumAPIClient => {
  const handleResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
      const error: ErrorResponse = await response.json().catch(() => ({
        error: "Request failed",
        message: response.statusText,
      }));
      throw new Error(error.message || error.error);
    }
    return response.json();
  };

  return {
    async getNodes() {
      const response = await fetch(`${API_BASE_URL}/pnodes`);
      return handleResponse<GetPNodesResponse>(response);
    },

    async getStats() {
      const response = await fetch(`${API_BASE_URL}/pnodes/stats`);
      return handleResponse<GetStatsResponse>(response);
    },

    async getNodeDetails(address: string) {
      const encoded = encodeURIComponent(address);
      const response = await fetch(`${API_BASE_URL}/pnodes/${encoded}`);
      return handleResponse<GetNodeDetailsResponse>(response);
    },

    async triggerSync(token: string) {
      const response = await fetch(`${API_BASE_URL}/pnodes/sync`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return handleResponse<SyncResponse>(response);
    },

    async healthCheck() {
      const response = await fetch(`${API_BASE_URL}/health`);
      return handleResponse<HealthCheckResponse>(response);
    },
  };
};

// ==============================================================================
// REACT QUERY HOOKS (OPTIONAL)
// ==============================================================================

/**
 * Example React Query hooks for easy data fetching
 * Requires: @tanstack/react-query
 */

/*
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const useNodes = () => {
  return useQuery({
    queryKey: ['pnodes'],
    queryFn: () => createAPIClient().getNodes(),
    refetchInterval: 30000, // Refresh every 30s (matches backend sync)
    staleTime: 25000, // Consider fresh for 25s
  });
};

export const useStats = () => {
  return useQuery({
    queryKey: ['pnodes', 'stats'],
    queryFn: () => createAPIClient().getStats(),
    refetchInterval: 30000,
    staleTime: 25000,
  });
};

export const useNodeDetails = (address: string) => {
  return useQuery({
    queryKey: ['pnode', address],
    queryFn: () => createAPIClient().getNodeDetails(address),
    enabled: !!address,
    refetchInterval: 30000,
    staleTime: 25000,
  });
};

export const useHealthCheck = () => {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => createAPIClient().healthCheck(),
    refetchInterval: 60000, // Check every minute
  });
};

export const useTriggerSync = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (token: string) => createAPIClient().triggerSync(token),
    onSuccess: () => {
      // Invalidate all pnode queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ['pnodes'] });
      queryClient.invalidateQueries({ queryKey: ['pnode'] });
    },
  });
};
*/

// ==============================================================================
// USAGE EXAMPLES
// ==============================================================================

/*
// Example 1: Basic usage with fetch
async function loadNodes() {
  const api = createAPIClient();
  const data = await api.getNodes();

  console.log('Total nodes:', data.summary.total);
  console.log('Online (public):', data.summary.online_public);
  console.log('Online (private):', data.summary.online_private);
  console.log('First node:', data.nodes[0]);
}

// Example 2: With React Query
function Dashboard() {
  const { data, isLoading, error } = useNodes();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Total Nodes: {data.summary.total}</h1>
      <ul>
        {data.nodes.map(node => (
          <li key={node.id}>
            {node.address} - {node.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Example 3: Node Details Modal
function NodeDetailsModal({ address }: { address: string }) {
  const { data, isLoading } = useNodeDetails(address);

  if (isLoading) return <div>Loading details...</div>;
  if (!data) return null;

  return (
    <div>
      <h2>{data.address}</h2>
      <p>Status: {data.status}</p>
      <p>Version: {data.version}</p>
      {data.cpuPercent && <p>CPU: {data.cpuPercent.toFixed(1)}%</p>}
      {data.ramUsagePercent && <p>RAM: {data.ramUsagePercent.toFixed(1)}%</p>}
      <p>Last seen: {data.lastSeenAt}</p>
    </div>
  );
}

// Example 4: Manual Sync Button (Admin only)
function SyncButton({ syncToken }: { syncToken: string }) {
  const syncMutation = useTriggerSync();

  return (
    <button
      onClick={() => syncMutation.mutate(syncToken)}
      disabled={syncMutation.isPending}
    >
      {syncMutation.isPending ? 'Syncing...' : 'Trigger Sync'}
    </button>
  );
}
*/
