"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DottedMap } from "@/components/ui/dotted-map";
import { Button } from "@/components/ui/button";
import type { PNode } from "@/lib/types";

interface NodeMapProps {
    nodes: PNode[];
    className?: string;
}

interface NodeMarker {
    lat: number;
    lng: number;
    size: number;
    node: PNode;
    x?: number;
    y?: number;
}

// Simple function to estimate lat/lng from IP (demo purposes)
function getRandomCoordinates(nodeId: number | undefined): { lat: number; lng: number } {
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
    ];

    const safeId = nodeId ?? 0;
    const index = Math.abs(safeId % regions.length);
    const region = regions[index] ?? regions[0];
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
    return { x, y };
}

function formatTimeAgo(seconds: number | null): string {
    if (seconds === null) return "Unknown";
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
}

export function NodeMap({ nodes, className }: NodeMapProps) {
    const [zoom, setZoom] = useState(1);
    const [hoveredNode, setHoveredNode] = useState<NodeMarker | null>(null);
    const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    const MAP_WIDTH = 200;
    const MAP_HEIGHT = 100;

    // Convert nodes to map markers with SVG coordinates
    const markers: NodeMarker[] = nodes.slice(0, 50).map((node) => {
        const coords = getRandomCoordinates(node.id);
        const svgCoords = latLngToSvg(coords.lat, coords.lng, MAP_WIDTH, MAP_HEIGHT);
        return {
            lat: coords.lat,
            lng: coords.lng,
            size: node.isOnline ? 1.5 : 1,
            node,
            x: svgCoords.x,
            y: svgCoords.y,
        };
    });

    const onlineCount = nodes.filter(n => n.isOnline).length;
    const publicCount = nodes.filter(n => n.status === "online_public").length;

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.5, 3));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.5, 1));
    const handleReset = () => setZoom(1);

    const handleMouseMove = (e: React.MouseEvent, marker: NodeMarker) => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setHoverPosition({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
        }
        setHoveredNode(marker);
    };

    const handleMouseLeave = () => {
        setHoveredNode(null);
    };

    return (
        <Card className={`rounded-xl border border-zinc-800 bg-zinc-900/50 ${className}`}>
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
                        disabled={zoom >= 3}
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
                    className="relative h-56 w-full overflow-auto rounded-lg bg-zinc-800/30"
                    style={{ cursor: zoom > 1 ? 'grab' : 'default' }}
                >
                    <div
                        className="relative transition-transform duration-200 ease-out"
                        style={{
                            transform: `scale(${zoom})`,
                            transformOrigin: 'center center',
                            width: '100%',
                            height: '100%',
                            minHeight: '100%',
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
                            className="absolute inset-0 w-full h-full pointer-events-none"
                            style={{ zIndex: 10 }}
                        >
                            {markers.map((marker, index) => (
                                <g key={index}>
                                    {/* Pulse animation for online nodes */}
                                    {marker.node.isOnline && (
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
                                            marker.node.status === "online_public"
                                                ? "#10b981"
                                                : marker.node.status === "online_private"
                                                    ? "#f59e0b"
                                                    : marker.node.status === "offline"
                                                        ? "#ef4444"
                                                        : "#71717a"
                                        }
                                        className="pointer-events-auto cursor-pointer transition-transform hover:scale-150"
                                        onMouseMove={(e) => handleMouseMove(e, marker)}
                                        onMouseLeave={handleMouseLeave}
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
                                left: hoverPosition.x + 12,
                                top: hoverPosition.y - 80,
                                transform: hoverPosition.x > 250 ? 'translateX(-100%)' : 'none',
                            }}
                        >
                            <div className="bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl p-3 min-w-48">
                                <div className="flex items-center gap-2 mb-2">
                                    <span
                                        className="h-2 w-2 rounded-full"
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
                                    <div className="flex justify-between">
                                        <span className="text-zinc-500">Status</span>
                                        <span className="text-zinc-300 capitalize">
                                            {hoveredNode.node.status.replace('_', ' ')}
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
                                    {hoveredNode.node.storageUtilizationPercent !== null && (
                                        <div className="flex justify-between">
                                            <span className="text-zinc-500">Storage</span>
                                            <span className="text-zinc-300">
                                                {hoveredNode.node.storageUtilizationPercent.toFixed(1)}%
                                            </span>
                                        </div>
                                    )}
                                    {hoveredNode.node.version && (
                                        <div className="flex justify-between">
                                            <span className="text-zinc-500">Version</span>
                                            <span className="text-zinc-300">
                                                {hoveredNode.node.version}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Legend */}
                <div className="flex justify-between mt-4 pt-4 border-t border-zinc-800 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="text-zinc-400">Online</span>
                        <span className="text-zinc-200 font-medium">{onlineCount}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-amber-500" />
                        <span className="text-zinc-400">Public RPC</span>
                        <span className="text-zinc-200 font-medium">{publicCount}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-zinc-500" />
                        <span className="text-zinc-400">Total</span>
                        <span className="text-zinc-200 font-medium">{nodes.length}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
