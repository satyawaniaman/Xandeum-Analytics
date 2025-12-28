import axios from "axios";

export interface NodeSummary {
    total: number;
    online_public: number;
    online_private: number;
    offline: number;
    unknown: number;
}

export interface PNodesResponse {
    summary: NodeSummary;
    nodes: NodeDetail[];
    timestamp: string;
}

export interface NodeDetail {
    id: number;
    address: string;
    ip: string;
    pubkey: string | null;
    version: string | null;
    status: "online_public" | "online_private" | "offline" | "unknown";
    hasPublicRpc: boolean;
    isOnline: boolean;
    lastSeenAt: string | null;
    lastSeenAgoSeconds: number | null;
    cpuPercent: number | null;
    uptimeHuman: string | null;
    ramUsagePercent: number | null;
    ramUsedGB: number | null;
    ramTotalGB: number | null;
    fileSizeGB: number | null;
    country: string | null;
    city: string | null;
}

export interface StatsResponse {
    total: number;
    online: number;
    with_public_rpc: number;
    timestamp: string;
}

export class XandeumAPI {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl.replace(/\/$/, ""); // Remove trailing slash
    }

    async getPNodes(): Promise<PNodesResponse> {
        const response = await axios.get<PNodesResponse>(`${this.baseUrl}/pnodes`);
        return response.data;
    }

    async getStats(): Promise<StatsResponse> {
        const response = await axios.get<StatsResponse>(`${this.baseUrl}/pnodes/stats`);
        return response.data;
    }

    async getNode(ip: string): Promise<NodeDetail | null> {
        try {
            const response = await axios.get<NodeDetail>(`${this.baseUrl}/pnodes/${encodeURIComponent(ip)}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                return null;
            }
            throw error;
        }
    }
}
