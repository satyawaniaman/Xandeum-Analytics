"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    ComposableMap,
    Geographies,
    Geography,
    Marker,
    ZoomableGroup,
} from "react-simple-maps";
import type { PNode, PNodesSummary } from "@/lib/types";

// Country name to abbreviation mapping
const COUNTRY_ABBREV: Record<string, string> = {
    "United States": "US",
    "United Kingdom": "UK",
    "Germany": "DE",
    "France": "FR",
    "Netherlands": "NL",
    "Canada": "CA",
    "Australia": "AU",
    "Japan": "JP",
    "Singapore": "SG",
    "India": "IN",
    "Brazil": "BR",
    "South Korea": "KR",
    "Finland": "FI",
    "Poland": "PL",
    "Italy": "IT",
    "Spain": "ES",
    "Sweden": "SE",
    "Norway": "NO",
    "Denmark": "DK",
    "Switzerland": "CH",
    "Austria": "AT",
    "Belgium": "BE",
    "Ireland": "IE",
    "Portugal": "PT",
    "Czech Republic": "CZ",
    "Romania": "RO",
    "Ukraine": "UA",
    "Russia": "RU",
    "China": "CN",
    "Hong Kong": "HK",
    "Taiwan": "TW",
    "Thailand": "TH",
    "Vietnam": "VN",
    "Indonesia": "ID",
    "Malaysia": "MY",
    "Philippines": "PH",
    "New Zealand": "NZ",
    "South Africa": "ZA",
    "Mexico": "MX",
    "Argentina": "AR",
    "Chile": "CL",
    "Colombia": "CO",
    "Turkey": "TR",
    "Israel": "IL",
    "UAE": "AE",
};

// Get abbreviation for a country (first 2 chars uppercase if not in map)
function getCountryAbbrev(country: string): string {
    return COUNTRY_ABBREV[country] || country.slice(0, 2).toUpperCase();
}

// Get abbreviation for a city (first 3 chars)
function getCityAbbrev(city: string): string {
    return city.length > 4 ? city.slice(0, 3).toUpperCase() : city;
}

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

export function NodeMap({ nodes, className }: NodeMapProps) {
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
            <Card className="lg:col-span-2 rounded-xl border border-border bg-card">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Global Node Distribution
                    </CardTitle>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleZoomOut}
                            disabled={zoom <= 1}
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                        >
                            −
                        </Button>
                        <span className="text-xs text-muted-foreground w-12 text-center">
                            {(zoom * 100).toFixed(0)}%
                        </span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleZoomIn}
                            disabled={zoom >= 8}
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                        >
                            +
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleReset}
                            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                        >
                            Reset
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="relative md:h-[420px] h-[320px] lg:h-[520px] w-full overflow-hidden rounded-lg bg-muted">
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
                                                className="fill-zinc-300 stroke-zinc-400 dark:fill-zinc-400 dark:stroke-zinc-600 hover:fill-zinc-400 dark:hover:fill-zinc-500 transition-colors cursor-pointer"
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
                                                className="cursor-pointer stroke-background dark:stroke-zinc-900"
                                                strokeWidth={1}
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
                                <div className="bg-popover border border-border rounded-lg shadow-xl p-3 min-w-52">
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
                                        <span className="text-sm font-medium text-foreground">
                                            {[hoveredGroup.nodes[0].city, hoveredGroup.nodes[0].country].filter(Boolean).join(", ") || "Unknown Location"}
                                        </span>
                                    </div>
                                    <div className="space-y-1 text-xs">
                                        {/* Always show first node details */}
                                        <div className="flex justify-between gap-4">
                                            <span className="text-muted-foreground">IP</span>
                                            <span className="text-foreground font-mono text-right">
                                                {hoveredGroup.nodes[0].ip}
                                            </span>
                                        </div>
                                        <div className="flex justify-between gap-4">
                                            <span className="text-muted-foreground">Status</span>
                                            <span className="text-foreground capitalize">
                                                {hoveredGroup.nodes[0].status.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <div className="flex justify-between gap-4">
                                            <span className="text-muted-foreground">Version</span>
                                            <span className="text-foreground">
                                                {hoveredGroup.nodes[0].version || "—"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between gap-4">
                                            <span className="text-muted-foreground">Last Seen</span>
                                            <span className="text-foreground">
                                                {formatTimeAgo(hoveredGroup.nodes[0].lastSeenAgoSeconds)}
                                            </span>
                                        </div>
                                        {/* Cluster info if multiple nodes */}
                                        {hoveredGroup.count > 1 && (
                                            <>
                                                <div className="h-px bg-border my-1.5" />
                                                <div className="flex justify-between gap-4">
                                                    <span className="text-muted-foreground">Total at Location</span>
                                                    <span className="text-foreground font-medium">
                                                        {hoveredGroup.count} nodes
                                                    </span>
                                                </div>
                                                <div className="flex justify-between gap-4">
                                                    <span className="text-muted-foreground">Online / Offline</span>
                                                    <span>
                                                        <span className="text-emerald-400">{hoveredGroup.nodes.filter(n => n.isOnline).length}</span>
                                                        <span className="text-muted-foreground"> / </span>
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
                        <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-popover/90 border border-border text-xs">
                            <span className="text-muted-foreground">Locations </span>
                            <span className="font-medium text-foreground">{locationGroups.length}</span>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="flex gap-4 mt-3 text-xs justify-center">
                        <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            <span className="text-muted-foreground">Public RPC</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-amber-500" />
                            <span className="text-muted-foreground">Private</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-red-500" />
                            <span className="text-muted-foreground">Offline</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Geographic Insights Panel - 1/3 width */}
            <Card className="rounded-xl border border-border bg-card">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Geographic Insights
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Coverage Stats */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-2 rounded-lg bg-muted">
                            <div className="text-lg font-bold text-foreground">{locationGroups.length}</div>
                            <div className="text-xs text-muted-foreground">Locations</div>
                        </div>
                        <div className="p-2 rounded-lg bg-muted">
                            <div className="text-lg font-bold text-foreground">
                                {(() => {
                                    const countries = new Set(nodes.slice(0, 200).map(n => n.country).filter(Boolean));
                                    return countries.size;
                                })()}
                            </div>
                            <div className="text-xs text-muted-foreground">Countries</div>
                        </div>
                    </div>

                    <div className="h-px bg-border" />

                    {/* Version Distribution - moved before countries */}
                    <div>
                        <div className="text-xs text-muted-foreground mb-2">Version Distribution</div>
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
                                            <span className="text-foreground font-mono text-xs">{version}</span>
                                            <span className="text-muted-foreground tabular-nums">{count}</span>
                                        </div>
                                    ));
                            })()}
                        </div>
                    </div>

                    <div className="h-px bg-border" />

                    {/* Top Countries with inline progress bars */}
                    <div>
                        <div className="text-xs text-muted-foreground mb-2">Top Countries</div>
                        <div className="space-y-1.5">
                            {(() => {
                                const countryCounts = new Map<string, number>();
                                nodes.slice(0, 200).forEach(n => {
                                    if (n.country) {
                                        countryCounts.set(n.country, (countryCounts.get(n.country) || 0) + 1);
                                    }
                                });
                                const sorted = Array.from(countryCounts.entries())
                                    .sort((a, b) => b[1] - a[1])
                                    .slice(0, 5);
                                const maxCount = sorted[0]?.[1] || 1;

                                return sorted.map(([country, count]) => (
                                    <div key={country} className="flex items-center gap-2 text-sm">
                                        <TooltipProvider delayDuration={100}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span className="text-foreground w-8 shrink-0 cursor-default font-medium">
                                                        {getCountryAbbrev(country)}
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent side="left" className="text-xs">
                                                    {country}
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                                            <motion.div
                                                className="h-full rounded-full bg-primary/60"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(count / maxCount) * 100}%` }}
                                                transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                                            />
                                        </div>
                                        <span className="text-muted-foreground tabular-nums w-6 text-right shrink-0">{count}</span>
                                    </div>
                                ));
                            })()}
                        </div>
                    </div>

                    <div className="h-px bg-border" />

                    {/* Top Cities with inline progress bars */}
                    <div>
                        <div className="text-xs text-muted-foreground mb-2">Top Cities</div>
                        <div className="space-y-1.5">
                            {(() => {
                                const cityCounts = new Map<string, number>();
                                nodes.slice(0, 200).forEach(n => {
                                    if (n.city) {
                                        cityCounts.set(n.city, (cityCounts.get(n.city) || 0) + 1);
                                    }
                                });
                                const sorted = Array.from(cityCounts.entries())
                                    .sort((a, b) => b[1] - a[1])
                                    .slice(0, 4);
                                const maxCount = sorted[0]?.[1] || 1;

                                return sorted.map(([city, count]) => (
                                    <div key={city} className="flex items-center gap-2 text-sm">
                                        <TooltipProvider delayDuration={100}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span className="text-foreground w-10 shrink-0 cursor-default font-medium">
                                                        {getCityAbbrev(city)}
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent side="left" className="text-xs">
                                                    {city}
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                                            <motion.div
                                                className="h-full rounded-full bg-primary/60"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(count / maxCount) * 100}%` }}
                                                transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
                                            />
                                        </div>
                                        <span className="text-muted-foreground tabular-nums w-6 text-right shrink-0">{count}</span>
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

