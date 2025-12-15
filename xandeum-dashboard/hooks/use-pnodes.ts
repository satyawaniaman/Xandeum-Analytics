"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchPNodes, fetchPNodesStats, fetchPNodeByAddress, fetchHealth } from "@/lib/api";

/**
 * Hook to fetch all pNodes with summary
 * Stale time: 30 seconds (matches Redis cache TTL)
 */
export function usePNodes() {
    return useQuery({
        queryKey: ["pnodes"],
        queryFn: fetchPNodes,
        staleTime: 30 * 1000, // 30 seconds
        refetchInterval: 30 * 1000, // Auto-refresh every 30 seconds
    });
}

/**
 * Hook to fetch pNodes stats only (lighter request)
 */
export function usePNodesStats() {
    return useQuery({
        queryKey: ["pnodes", "stats"],
        queryFn: fetchPNodesStats,
        staleTime: 30 * 1000,
        refetchInterval: 30 * 1000,
    });
}

/**
 * Hook to fetch single pNode by address
 */
export function usePNodeDetail(address: string) {
    return useQuery({
        queryKey: ["pnodes", address],
        queryFn: () => fetchPNodeByAddress(address),
        staleTime: 30 * 1000,
        enabled: !!address,
    });
}

/**
 * Hook to fetch API health status
 */
export function useHealth() {
    return useQuery({
        queryKey: ["health"],
        queryFn: fetchHealth,
        staleTime: 30 * 1000,
        refetchInterval: 60 * 1000, // Refresh every minute
    });
}
