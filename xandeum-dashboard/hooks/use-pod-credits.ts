"use client";

import useSWR from "swr";

interface PodCredit {
    credits: number;
    pod_id: string;
}

interface PodCreditsResponse {
    pods_credits: PodCredit[];
    status: string;
}

interface PodCreditData {
    credits: number;
    rank: number;
    totalPods: number;
    percentile: number;
}

// Use local API proxy to avoid CORS issues
const POD_CREDITS_API = "/api/pod-credits";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

/**
 * Hook to fetch all pod credits data
 */
export function useAllPodCredits() {
    const { data, error, isLoading } = useSWR<PodCreditsResponse>(
        POD_CREDITS_API,
        fetcher,
        {
            refreshInterval: 60000, // Refresh every minute
            revalidateOnFocus: false,
        }
    );

    return {
        credits: data?.pods_credits || [],
        isLoading,
        error,
    };
}

/**
 * Hook to fetch credit data for a specific pod by its ID (pubkey)
 */
export function usePodCredits(podId: string | null): {
    data: PodCreditData | null;
    isLoading: boolean;
    error: Error | null;
} {
    const { data, error, isLoading } = useSWR<PodCreditsResponse>(
        podId ? POD_CREDITS_API : null,
        fetcher,
        {
            refreshInterval: 60000,
            revalidateOnFocus: false,
        }
    );

    if (!data || !podId) {
        return { data: null, isLoading, error };
    }

    const allCredits = data.pods_credits || [];

    // Sort by credits descending to calculate rank
    const sorted = [...allCredits].sort((a, b) => b.credits - a.credits);

    // Find this pod's credit info
    const podCredit = allCredits.find((p) => p.pod_id === podId);

    if (!podCredit) {
        return { data: null, isLoading: false, error: null };
    }

    // Calculate rank (1-indexed)
    const rank = sorted.findIndex((p) => p.pod_id === podId) + 1;
    const totalPods = sorted.length;
    const percentile = Math.round(((totalPods - rank) / totalPods) * 100);

    return {
        data: {
            credits: podCredit.credits,
            rank,
            totalPods,
            percentile,
        },
        isLoading,
        error,
    };
}

/**
 * Get the top N pods by credits
 */
export function useTopPodCredits(limit: number = 10) {
    const { credits, isLoading, error } = useAllPodCredits();

    const topPods = [...credits]
        .sort((a, b) => b.credits - a.credits)
        .slice(0, limit);

    return {
        topPods,
        isLoading,
        error,
    };
}
