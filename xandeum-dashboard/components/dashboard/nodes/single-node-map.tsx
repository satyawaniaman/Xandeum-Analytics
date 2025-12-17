"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ComposableMap,
    Geographies,
    Geography,
    Marker,
    ZoomableGroup,
} from "react-simple-maps";
import type { PNode } from "@/lib/types";

interface SingleNodeMapProps {
    node: PNode;
    className?: string;
}

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Generate fallback coordinates based on node ID
function getFallbackCoordinates(nodeId: number | undefined): { lat: number; lng: number } {
    const regions = [
        { lat: 37.7749, lng: -122.4194 }, // San Francisco
        { lat: 40.7128, lng: -74.006 },   // New York
        { lat: 51.5074, lng: -0.1278 },   // London
        { lat: 35.6762, lng: 139.6503 },  // Tokyo
        { lat: 1.3521, lng: 103.8198 },   // Singapore
        { lat: -33.8688, lng: 151.2093 }, // Sydney
        { lat: 52.52, lng: 13.405 },      // Berlin
        { lat: 48.8566, lng: 2.3522 },    // Paris
    ];
    const safeId = typeof nodeId === 'number' ? nodeId : 0;
    const index = Math.abs(safeId % regions.length);
    return regions[index];
}

export function SingleNodeMap({ node, className }: SingleNodeMapProps) {
    // Determine coordinates
    const coordinates = useMemo(() => {
        if (node.latitude !== null && node.longitude !== null) {
            return { lat: node.latitude, lng: node.longitude };
        }
        return getFallbackCoordinates(node.id);
    }, [node]);

    // Determine marker color based on status
    const fillColor = node.status === "online_public" ? "#10b981" :
        node.isOnline ? "#f59e0b" : "#ef4444";

    return (
        <Card className={`rounded-xl border border-border bg-card ${className}`}>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    Node Location
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="relative h-[280px] w-full overflow-hidden rounded-lg bg-muted">
                    <ComposableMap
                        projection="geoMercator"
                        projectionConfig={{ scale: 200, center: [coordinates.lng, coordinates.lat] }}
                        style={{ width: "100%", height: "100%" }}
                    >
                        <ZoomableGroup center={[coordinates.lng, coordinates.lat]} zoom={2}>
                            <Geographies geography={GEO_URL}>
                                {({ geographies }: { geographies: Array<{ rsmKey: string }> }) =>
                                    geographies.map((geo: { rsmKey: string }) => (
                                        <Geography
                                            key={geo.rsmKey}
                                            geography={geo}
                                            className="fill-zinc-300 stroke-zinc-400 dark:fill-zinc-700 dark:stroke-zinc-600"
                                            strokeWidth={0.3}
                                            style={{
                                                default: { outline: "none" },
                                                hover: { outline: "none" },
                                                pressed: { outline: "none" },
                                            }}
                                        />
                                    ))
                                }
                            </Geographies>

                            {/* Single Node Marker */}
                            <Marker coordinates={[coordinates.lng, coordinates.lat]}>
                                {/* Pulsing ring */}
                                <circle
                                    r={12}
                                    fill="none"
                                    stroke={fillColor}
                                    strokeWidth={2}
                                    opacity={0.3}
                                />
                                {/* Main marker */}
                                <circle
                                    r={6}
                                    fill={fillColor}
                                    className="stroke-background dark:stroke-zinc-900"
                                    strokeWidth={2}
                                />
                            </Marker>
                        </ZoomableGroup>
                    </ComposableMap>

                    {/* Location label overlay */}
                    <div className="absolute bottom-2 left-2 px-2 py-1 rounded-md bg-popover/90 border border-border text-xs">
                        <span className="text-muted-foreground">
                            {node.city && node.country
                                ? `${node.city}, ${node.country}`
                                : node.country || "Unknown Location"}
                        </span>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex gap-4 mt-3 text-xs justify-center">
                    <div className="flex items-center gap-1.5">
                        <span
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: fillColor }}
                        />
                        <span className="text-muted-foreground capitalize">
                            {node.status.replace('_', ' ')}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
