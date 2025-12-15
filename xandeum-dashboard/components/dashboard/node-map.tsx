"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DottedMap } from "@/components/ui/dotted-map";
import { Button } from "@/components/ui/button";
import type { PNode, PNodesSummary } from "@/lib/types";

interface NodeMapProps {
    nodes: PNode[];
    summary: PNodesSummary;
    className?: string;
}

interface NodeMarker {
    lat: number;
    lng: number;
    size: number;
    node: PNode;
    x: number;
    y: number;
}

// Generate deterministic coordinates based on node ID
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

// Convert lat/lng to SVG coordinates
function latLngToSvg(lat: number, lng: number, width: number, height: number): { x: number; y: number } {
    const x = ((lng + 180) / 360) * width;
    const y = ((90 - lat) / 180) * height;
    return {
        x: isNaN(x) ? 0 : x,
        y: isNaN(y) ? 0 : y
    };
}

function formatTimeAgo(seconds: number | null): string {
    if (seconds === null) return "Unknown";
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
}

export function NodeMap({ nodes, summary, className }: NodeMapProps) {
    const [zoom, setZoom] = useState(1);
    const [hoveredNode, setHoveredNode] = useState<NodeMarker | null>(null);
    const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    const MAP_WIDTH = 200;
    const MAP_HEIGHT = 100;

    // Convert nodes to map markers with validated SVG coordinates
    // Use real lat/lng from API if available, otherwise fallback to generated
    const markers: NodeMarker[] = nodes.slice(0, 100).map((node) => {
        let lat: number, lng: number;

        if (node.latitude !== null && node.longitude !== null) {
            // Use real coordinates from IP geolocation
            lat = node.latitude;
            lng = node.longitude;
        } else {
            // Fallback to generated coordinates for nodes without geolocation
            const coords = getCoordinates(node.id);
            lat = coords.lat;
            lng = coords.lng;
        }

        const svgCoords = latLngToSvg(lat, lng, MAP_WIDTH, MAP_HEIGHT);
        return {
            lat,
            lng,
            size: node.isOnline ? 1.5 : 1,
            node,
            x: svgCoords.x,
            y: svgCoords.y,
        };
    });

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.5, 4));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.5, 1));
    const handleReset = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (zoom > 1) {
            setIsDragging(true);
            setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging) {
            setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
        }
    };

    const handleMouseUp = () => setIsDragging(false);

    const handleMarkerHover = (e: React.MouseEvent, marker: NodeMarker) => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setHoverPosition({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
        }
        setHoveredNode(marker);
    };

    const handleMarkerLeave = () => setHoveredNode(null);

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
                            disabled={zoom >= 4}
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
                    <div
                        ref={containerRef}
                        className="relative h-64 w-full overflow-hidden rounded-lg bg-zinc-800/30 select-none"
                        style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={() => { handleMouseUp(); handleMarkerLeave(); }}
                    >
                        <div
                            className="relative transition-transform duration-100"
                            style={{
                                transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                                transformOrigin: 'center center',
                                width: '100%',
                                height: '100%',
                            }}
                        >
                            {/* Base Map */}
                            <DottedMap
                                width={MAP_WIDTH}
                                height={MAP_HEIGHT}
                                mapSamples={8000}
                                markers={[]}
                                dotRadius={0.3}
                                className="text-zinc-700"
                            />

                            {/* Interactive Markers Overlay */}
                            <svg
                                viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
                                className="absolute inset-0 w-full h-full"
                                style={{ zIndex: 10 }}
                            >
                                {markers.map((marker, index) => (
                                    <g key={index}>
                                        {/* Pulse animation for online nodes */}
                                        {marker.node.isOnline && marker.x > 0 && marker.y > 0 && (
                                            <circle
                                                cx={marker.x}
                                                cy={marker.y}
                                                r={marker.size * 2}
                                                fill={marker.node.status === "online_public" ? "#10b981" : "#f59e0b"}
                                                opacity={0.3}
                                                className="animate-ping"
                                            />
                                        )}
                                        {/* Main marker */}
                                        <circle
                                            cx={marker.x}
                                            cy={marker.y}
                                            r={marker.size}
                                            fill={
                                                marker.node.status === "online_public" ? "#10b981" :
                                                    marker.node.status === "online_private" ? "#f59e0b" :
                                                        marker.node.status === "offline" ? "#ef4444" : "#71717a"
                                            }
                                            className="cursor-pointer transition-transform hover:scale-150"
                                            style={{ pointerEvents: 'all' }}
                                            onMouseEnter={(e) => handleMarkerHover(e, marker)}
                                            onMouseLeave={handleMarkerLeave}
                                        />
                                    </g>
                                ))}
                            </svg>
                        </div>

                        {/* Hover Card */}
                        {hoveredNode && (
                            <div
                                className="absolute z-50 pointer-events-none"
                                style={{
                                    left: Math.min(hoverPosition.x + 12, 400),
                                    top: Math.max(hoverPosition.y - 100, 10),
                                }}
                            >
                                <div className="bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl p-3 min-w-48">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span
                                            className="h-2 w-2 rounded-full animate-pulse"
                                            style={{
                                                backgroundColor:
                                                    hoveredNode.node.status === "online_public" ? "#10b981" :
                                                        hoveredNode.node.status === "online_private" ? "#f59e0b" :
                                                            hoveredNode.node.status === "offline" ? "#ef4444" : "#71717a"
                                            }}
                                        />
                                        <span className="text-sm font-medium text-zinc-200">
                                            {hoveredNode.node.ip}
                                        </span>
                                    </div>
                                    <div className="space-y-1 text-xs">
                                        {(hoveredNode.node.city || hoveredNode.node.country) && (
                                            <div className="flex justify-between">
                                                <span className="text-zinc-500">Location</span>
                                                <span className="text-zinc-300">
                                                    {[hoveredNode.node.city, hoveredNode.node.country].filter(Boolean).join(", ")}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex justify-between">
                                            <span className="text-zinc-500">Status</span>
                                            <span className="text-zinc-300 capitalize">
                                                {hoveredNode.node.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-zinc-500">Version</span>
                                            <span className="text-zinc-300">
                                                {hoveredNode.node.version || "—"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-zinc-500">Last Seen</span>
                                            <span className="text-zinc-300">
                                                {formatTimeAgo(hoveredNode.node.lastSeenAgoSeconds)}
                                            </span>
                                        </div>
                                        {hoveredNode.node.cpuPercent !== null && (
                                            <div className="flex justify-between">
                                                <span className="text-zinc-500">CPU</span>
                                                <span className="text-zinc-300">
                                                    {hoveredNode.node.cpuPercent.toFixed(1)}%
                                                </span>
                                            </div>
                                        )}
                                        {hoveredNode.node.uptimeHuman && (
                                            <div className="flex justify-between">
                                                <span className="text-zinc-500">Uptime</span>
                                                <span className="text-zinc-300">
                                                    {hoveredNode.node.uptimeHuman}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
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

            {/* Stats Panel - 1/3 width */}
            <Card className="rounded-xl border border-zinc-800 bg-zinc-900/50">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-400">
                        Network Overview
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Total Nodes */}
                    <div className="flex items-center justify-between">
                        <span className="text-zinc-500 text-sm">Total Nodes</span>
                        <span className="text-2xl font-bold text-zinc-100">{summary.total}</span>
                    </div>

                    <div className="h-px bg-zinc-800" />

                    {/* Status Breakdown */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-zinc-400 text-sm">Online (Public)</span>
                            </div>
                            <span className="font-medium text-emerald-400">{summary.online_public}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                                <span className="text-zinc-400 text-sm">Online (Private)</span>
                            </div>
                            <span className="font-medium text-amber-400">{summary.online_private}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-red-500" />
                                <span className="text-zinc-400 text-sm">Offline</span>
                            </div>
                            <span className="font-medium text-red-400">{summary.offline}</span>
                        </div>
                        {summary.unknown > 0 && (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-zinc-500" />
                                    <span className="text-zinc-400 text-sm">Unknown</span>
                                </div>
                                <span className="font-medium text-zinc-400">{summary.unknown}</span>
                            </div>
                        )}
                    </div>

                    <div className="h-px bg-zinc-800" />

                    {/* Health Metrics */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-zinc-500">Online Rate</span>
                            <span className="text-zinc-200 font-medium">
                                {((summary.online_public + summary.online_private) / summary.total * 100).toFixed(1)}%
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-zinc-500">Public RPC Rate</span>
                            <span className="text-zinc-200 font-medium">
                                {(summary.online_public / summary.total * 100).toFixed(1)}%
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-zinc-500">Displayed</span>
                            <span className="text-zinc-400">
                                {Math.min(100, nodes.length)} of {nodes.length}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
