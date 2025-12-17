"use client";

import { useState, useEffect, useCallback } from "react";

const WATCHLIST_STORAGE_KEY = "xandeum-watchlist";

export interface WatchlistNode {
    address: string;
    customName?: string;
    addedAt: string;
}

/**
 * Get initial watchlist from localStorage
 */
function getInitialWatchlist(): WatchlistNode[] {
    if (typeof window === "undefined") return [];
    try {
        const stored = localStorage.getItem(WATCHLIST_STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
                return parsed;
            }
        }
    } catch (error) {
        console.error("Failed to load watchlist from localStorage:", error);
    }
    return [];
}

/**
 * Hook for managing a watchlist of nodes with localStorage persistence
 */
export function useWatchlist() {
    const [watchlist, setWatchlist] = useState<WatchlistNode[]>(getInitialWatchlist);

    // Save to localStorage whenever watchlist changes
    useEffect(() => {
        try {
            localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(watchlist));
        } catch (error) {
            console.error("Failed to save watchlist to localStorage:", error);
        }
    }, [watchlist]);

    /**
     * Add a node to the watchlist
     */
    const addToWatchlist = useCallback((address: string, customName?: string) => {
        setWatchlist((prev) => {
            // Don't add if already exists
            if (prev.some((node) => node.address === address)) {
                return prev;
            }
            return [
                ...prev,
                {
                    address,
                    customName,
                    addedAt: new Date().toISOString(),
                },
            ];
        });
    }, []);

    /**
     * Remove a node from the watchlist
     */
    const removeFromWatchlist = useCallback((address: string) => {
        setWatchlist((prev) => prev.filter((node) => node.address !== address));
    }, []);

    /**
     * Rename a node in the watchlist
     */
    const renameWatchlistNode = useCallback((address: string, newName: string) => {
        setWatchlist((prev) =>
            prev.map((node) =>
                node.address === address
                    ? { ...node, customName: newName || undefined }
                    : node
            )
        );
    }, []);

    /**
     * Toggle a node in the watchlist
     */
    const toggleWatchlist = useCallback((address: string, customName?: string) => {
        setWatchlist((prev) => {
            const exists = prev.some((node) => node.address === address);
            if (exists) {
                return prev.filter((node) => node.address !== address);
            }
            return [
                ...prev,
                {
                    address,
                    customName,
                    addedAt: new Date().toISOString(),
                },
            ];
        });
    }, []);

    /**
     * Check if a node is in the watchlist
     */
    const isWatched = useCallback(
        (address: string): boolean => {
            return watchlist.some((node) => node.address === address);
        },
        [watchlist]
    );

    /**
     * Get a watchlist node by address
     */
    const getWatchlistNode = useCallback(
        (address: string): WatchlistNode | undefined => {
            return watchlist.find((node) => node.address === address);
        },
        [watchlist]
    );

    return {
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        renameWatchlistNode,
        toggleWatchlist,
        isWatched,
        getWatchlistNode,
    };
}
