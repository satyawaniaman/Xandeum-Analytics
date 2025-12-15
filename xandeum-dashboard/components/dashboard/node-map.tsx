"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    ComposableMap,
    Geographies,
    Geography,
    Marker,
    ZoomableGroup,
} from "react-simple-maps";
import type { PNode, PNodesSummary } from "@/lib/types";

interface NodeMapProps {
    nodes: PNode[];
    summary: PNodesSummary;
    className?: string;
}

interface LocationGroup {
    lat: number;
    lng: number;
    count: number;
    nodes: PNode[];
}

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Generate deterministic coordinates based on node ID (fallback)
function getCoordinates(nodeId: number | undefined): { lat: number; lng: number } {
    const regions = [
        { lat: 37.7749, lng: -122.4194 }, // San Francisco
        { lat: 40.7128, lng: -74.006 },   // New York
        { lat: 51.5074, lng: -0.1278 },   // London
        { lat: 35.6762, lng: 139.6503 },  // Tokyo
        { lat: 1.3521, lng: 103.8198 },   // Singapore
        { lat: -33.8688, lng: 151.2093 }, // Sydney
        { lat: 52.52, lng: 13.405 },      // Berlin
        { lat: 48.8566, lng: 2.3522 },    // Paris
        { lat: 55.7558, lng: 37.6173 },   // Moscow
        { lat: 19.076, lng: 72.8777 },    // Mumbai
        { lat: 22.3193, lng: 114.1694 },  // Hong Kong
        { lat: -23.5505, lng: -46.6333 }, // São Paulo
    ];

    const safeId = typeof nodeId === 'number' ? nodeId : 0;
    const index = Math.abs(safeId % regions.length);
    const region = regions[index];
    const scatter = ((safeId * 7) % 20) - 10;

    return {
        lat: region.lat + scatter * 0.5,
        lng: region.lng + scatter * 0.5,
    };
}

function formatTimeAgo(seconds: number | null): string {
    if (seconds === null) return "Unknown";
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
}

export function NodeMap({ nodes, summary, className }: NodeMapProps) {
    const [zoom, setZoom] = useState(1.9);
    const [center, setCenter] = useState<[number, number]>([10, 25]);
    const [hoveredGroup, setHoveredGroup] = useState<LocationGroup | null>(null);

    // Group nodes by location (rounded to 1 decimal for clustering)
    const locationGroups = useMemo(() => {
        const groups = new Map<string, LocationGroup>();

        for (const node of nodes.slice(0, 200)) {
            let lat: number, lng: number;

            if (node.latitude !== null && node.longitude !== null) {
                lat = node.latitude;
                lng = node.longitude;
            } else {
                const coords = getCoordinates(node.id);
                lat = coords.lat;
                lng = coords.lng;
            }

            // Round for clustering
            const key = `${lat.toFixed(1)},${lng.toFixed(1)}`;
            const existing = groups.get(key);

            if (existing) {
                existing.count++;
                existing.nodes.push(node);
            } else {
                groups.set(key, { lat, lng, count: 1, nodes: [node] });
            }
        }

        return Array.from(groups.values());
    }, [nodes]);

    const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.5, 8));
    const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.5, 1));
    const handleReset = () => { setZoom(1); setCenter([0, 20]); };

    return (
        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-4 ${className}`}>
            {/* Map - 2/3 width */}
            <Card className="lg:col-span-2 rounded-xl border border-zinc-800 bg-zinc-900/50">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-medium text-zinc-400">
                        Global Node Distribution
                    </CardTitle>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleZoomOut}
                            disabled={zoom <= 1}
                            className="h-7 w-7 p-0 text-zinc-500 hover:text-zinc-300"
                        >
                            −
                        </Button>
                        <span className="text-xs text-zinc-500 w-12 text-center">
                            {(zoom * 100).toFixed(0)}%
                        </span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleZoomIn}
                            disabled={zoom >= 8}
                            className="h-7 w-7 p-0 text-zinc-500 hover:text-zinc-300"
                        >
                            +
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleReset}
                            className="h-7 px-2 text-xs text-zinc-500 hover:text-zinc-300"
                        >
                            Reset
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="relative h-[420px] w-full overflow-hidden rounded-lg bg-zinc-800/50">
                        <ComposableMap
                            projection="geoMercator"
                            projectionConfig={{ scale: 120, center: [0, 20] }}
                            style={{ width: "100%", height: "100%" }}
                        >
                            <ZoomableGroup
                                zoom={zoom}
                                center={center}
                                onMoveEnd={(event: { coordinates: [number, number]; zoom: number }) => {
                                    setCenter(event.coordinates);
                                    setZoom(event.zoom);
                                }}
                            >
                                <Geographies geography={GEO_URL}>
                                    {({ geographies }: { geographies: Array<{ rsmKey: string }> }) =>
                                        geographies.map((geo: { rsmKey: string }) => (
                                            <Geography
                                                key={geo.rsmKey}
                                                geography={geo}
                                                fill="#3f3f46"
                                                stroke="#52525b"
                                                strokeWidth={0.3}
                                                style={{
                                                    default: { outline: "none" },
                                                    hover: { outline: "none", fill: "#52525b" },
                                                    pressed: { outline: "none" },
                                                }}
                                            />
                                        ))
                                    }
                                </Geographies>

                                {locationGroups.map((group) => {
                                    const hasOnline = group.nodes.some(n => n.isOnline);
                                    const hasPublicRpc = group.nodes.some(n => n.status === "online_public");
                                    const markerSize = 4; // Uniform size for all markers
                                    const isHovered = hoveredGroup === group;

                                    // Determine color based on node statuses in group
                                    const fillColor = hasPublicRpc ? "#10b981" :
                                        hasOnline ? "#f59e0b" : "#ef4444";

                                    return (
                                        <Marker
                                            key={`${group.lat}-${group.lng}`}
                                            coordinates={[group.lng, group.lat]}
                                            onMouseEnter={() => setHoveredGroup(group)}
                                            onMouseLeave={() => setHoveredGroup(null)}
                                        >
                                            {/* Hover ring */}
                                            {isHovered && (
                                                <circle
                                                    r={markerSize + 4}
                                                    fill="none"
                                                    stroke={fillColor}
                                                    strokeWidth={1.5}
                                                    opacity={0.5}
                                                />
                                            )}
                                            {/* Main marker - uniform size */}
                                            <circle
                                                r={isHovered ? markerSize + 1 : markerSize}
                                                fill={fillColor}
                                                stroke="#18181b"
                                                strokeWidth={1}
                                                className="cursor-pointer"
                                                style={{
                                                    transition: "all 0.15s ease-out",
                                                    opacity: hasOnline ? 1 : 0.6,
                                                }}
                                            />
                                        </Marker>
                                    );
                                })}
                            </ZoomableGroup>
                        </ComposableMap>

                        {/* Hover Tooltip */}
                        {hoveredGroup && hoveredGroup.nodes[0] && (
                            <div className="absolute bottom-3 left-3 z-50">
                                <div className="bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl p-3 min-w-52">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span
                                            className="h-2 w-2 rounded-full"
                                            style={{
                                                backgroundColor: hoveredGroup.nodes.some(n => n.status === "online_public")
                                                    ? "#10b981"
                                                    : hoveredGroup.nodes.some(n => n.isOnline)
                                                        ? "#f59e0b"
                                                        : "#ef4444"
                                            }}
                                        />
                                        <span className="text-sm font-medium text-zinc-200">
                                            {[hoveredGroup.nodes[0].city, hoveredGroup.nodes[0].country].filter(Boolean).join(", ") || "Unknown Location"}
                                        </span>
                                    </div>
                                    <div className="space-y-1 text-xs">
                                        {/* Always show first node details */}
                                        <div className="flex justify-between gap-4">
                                            <span className="text-zinc-500">IP</span>
                                            <span className="text-zinc-300 font-mono text-right">
                                                {hoveredGroup.nodes[0].ip}
                                            </span>
                                        </div>
                                        <div className="flex justify-between gap-4">
                                            <span className="text-zinc-500">Status</span>
                                            <span className="text-zinc-300 capitalize">
                                                {hoveredGroup.nodes[0].status.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <div className="flex justify-between gap-4">
                                            <span className="text-zinc-500">Version</span>
                                            <span className="text-zinc-300">
                                                {hoveredGroup.nodes[0].version || "—"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between gap-4">
                                            <span className="text-zinc-500">Last Seen</span>
                                            <span className="text-zinc-300">
                                                {formatTimeAgo(hoveredGroup.nodes[0].lastSeenAgoSeconds)}
                                            </span>
                                        </div>
                                        {/* Cluster info if multiple nodes */}
                                        {hoveredGroup.count > 1 && (
                                            <>
                                                <div className="h-px bg-zinc-700 my-1.5" />
                                                <div className="flex justify-between gap-4">
                                                    <span className="text-zinc-500">Total at Location</span>
                                                    <span className="text-zinc-300 font-medium">
                                                        {hoveredGroup.count} nodes
                                                    </span>
                                                </div>
                                                <div className="flex justify-between gap-4">
                                                    <span className="text-zinc-500">Online / Offline</span>
                                                    <span>
                                                        <span className="text-emerald-400">{hoveredGroup.nodes.filter(n => n.isOnline).length}</span>
                                                        <span className="text-zinc-500"> / </span>
                                                        <span className="text-red-400">{hoveredGroup.nodes.filter(n => !n.isOnline).length}</span>
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Location count badge */}
                        <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-zinc-900/90 border border-zinc-700 text-xs">
                            <span className="text-zinc-500">Locations </span>
                            <span className="font-medium text-zinc-200">{locationGroups.length}</span>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="flex gap-4 mt-3 text-xs">
                        <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            <span className="text-zinc-500">Public RPC</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-amber-500" />
                            <span className="text-zinc-500">Private</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-red-500" />
                            <span className="text-zinc-500">Offline</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Geographic Insights Panel - 1/3 width */}
            <Card className="rounded-xl border border-zinc-800 bg-zinc-900/50">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-400">
                        Geographic Insights
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Coverage Stats */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-2 rounded-lg bg-zinc-800/50">
                            <div className="text-lg font-bold text-zinc-100">{locationGroups.length}</div>
                            <div className="text-xs text-zinc-500">Locations</div>
                        </div>
                        <div className="p-2 rounded-lg bg-zinc-800/50">
                            <div className="text-lg font-bold text-zinc-100">
                                {(() => {
                                    const countries = new Set(nodes.slice(0, 200).map(n => n.country).filter(Boolean));
                                    return countries.size;
                                })()}
                            </div>
                            <div className="text-xs text-zinc-500">Countries</div>
                        </div>
                    </div>

                    <div className="h-px bg-zinc-800" />

                    {/* Top Countries */}
                    <div>
                        <div className="text-xs text-zinc-500 mb-2">Top Countries</div>
                        <div className="space-y-1.5">
                            {(() => {
                                const countryCounts = new Map<string, number>();
                                nodes.slice(0, 200).forEach(n => {
                                    if (n.country) {
                                        countryCounts.set(n.country, (countryCounts.get(n.country) || 0) + 1);
                                    }
                                });
                                return Array.from(countryCounts.entries())
                                    .sort((a, b) => b[1] - a[1])
                                    .slice(0, 5)
                                    .map(([country, count]) => (
                                        <div key={country} className="flex items-center justify-between text-sm">
                                            <span className="text-zinc-300 truncate">{country}</span>
                                            <span className="text-zinc-500 tabular-nums">{count}</span>
                                        </div>
                                    ));
                            })()}
                        </div>
                    </div>

                    <div className="h-px bg-zinc-800" />

                    {/* Version Distribution */}
                    <div>
                        <div className="text-xs text-zinc-500 mb-2">Version Distribution</div>
                        <div className="space-y-1.5">
                            {(() => {
                                const versionCounts = new Map<string, number>();
                                nodes.slice(0, 200).forEach(n => {
                                    const ver = n.version || "Unknown";
                                    versionCounts.set(ver, (versionCounts.get(ver) || 0) + 1);
                                });
                                return Array.from(versionCounts.entries())
                                    .sort((a, b) => b[1] - a[1])
                                    .slice(0, 4)
                                    .map(([version, count]) => (
                                        <div key={version} className="flex items-center justify-between text-sm">
                                            <span className="text-zinc-300 font-mono text-xs">{version}</span>
                                            <span className="text-zinc-500 tabular-nums">{count}</span>
                                        </div>
                                    ));
                            })()}
                        </div>
                    </div>

                    <div className="h-px bg-zinc-800" />

                    {/* Top Cities */}
                    <div>
                        <div className="text-xs text-zinc-500 mb-2">Top Cities</div>
                        <div className="space-y-1.5">
                            {(() => {
                                const cityCounts = new Map<string, number>();
                                nodes.slice(0, 200).forEach(n => {
                                    if (n.city) {
                                        cityCounts.set(n.city, (cityCounts.get(n.city) || 0) + 1);
                                    }
                                });
                                return Array.from(cityCounts.entries())
                                    .sort((a, b) => b[1] - a[1])
                                    .slice(0, 4)
                                    .map(([city, count]) => (
                                        <div key={city} className="flex items-center justify-between text-sm">
                                            <span className="text-zinc-300 truncate">{city}</span>
                                            <span className="text-zinc-500 tabular-nums">{count}</span>
                                        </div>
                                    ));
                            })()}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

