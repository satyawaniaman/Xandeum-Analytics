"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from "@/components/ui/pagination";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { ArrowUpDown, Search } from "lucide-react";
import type { PNode } from "@/lib/types";
import { Card } from "@/components/ui/card";

interface DataTableProps {
    nodes: PNode[];
    initialSearch?: string;
}

type SortKey = "lastSeenAgoSeconds" | "uptimeSeconds" | "cpuPercent" | "ramUsagePercent" | "storageUtilizationPercent";
type SortDirection = "asc" | "desc";

export function DataTable({ nodes, initialSearch = "" }: DataTableProps) {
    const [searchTerm, setSearchTerm] = React.useState(initialSearch);
    const [statusFilter, setStatusFilter] = React.useState<string>("all");
    const [versionFilter, setVersionFilter] = React.useState<string>("all");
    const [currentPage, setCurrentPage] = React.useState(1);
    const [sortConfig, setSortConfig] = React.useState<{ key: SortKey; direction: SortDirection }>({
        key: "lastSeenAgoSeconds",
        direction: "asc",
    });
    const router = useRouter();

    const itemsPerPage = 10;

    // Sync with URL param if it changes
    React.useEffect(() => {
        setSearchTerm(initialSearch);
    }, [initialSearch]);

    // reset pagination when filters change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter, versionFilter]);

    // Derived: unique versions for filter
    const uniqueVersions = React.useMemo(() => {
        const versions = new Set(nodes.map(n => n.version).filter(Boolean));
        return Array.from(versions).sort() as string[];
    }, [nodes]);

    // Filter logic
    const filteredNodes = React.useMemo(() => {
        return nodes.filter(node => {
            // Search
            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();
                const ipMatch = node.ip.toLowerCase().includes(searchLower);
                const pubkeyMatch = node.pubkey?.toLowerCase().includes(searchLower);
                // address usually includes ip, but good to check
                const addressMatch = node.address.toLowerCase().includes(searchLower);
                if (!ipMatch && !pubkeyMatch && !addressMatch) return false;
            }

            // Status Filter
            if (statusFilter !== "all" && node.status !== statusFilter) {
                return false;
            }

            // Version Filter
            if (versionFilter !== "all" && node.version !== versionFilter) {
                return false;
            }

            return true;
        });
    }, [nodes, searchTerm, statusFilter, versionFilter]);

    // Sorting logic
    const sortedNodes = React.useMemo(() => {
        return [...filteredNodes].sort((a, b) => {
            // Priority: Online > Offline, Public RPC > Private (like MiniNodesTable) is implicit in default?
            // User requested sorting buttons for main columns, but list style matching MiniNodesTable.
            // MiniNodesTable sorts by status/rpc/lastSeen by default.
            // Here we respect sortConfig for the columns that have it.

            let aValue: string | number | null = a[sortConfig.key];
            let bValue: string | number | null = b[sortConfig.key];

            // Handle nulls
            if (aValue === null) aValue = sortConfig.key === "lastSeenAgoSeconds" ? Infinity : 0;
            if (bValue === null) bValue = sortConfig.key === "lastSeenAgoSeconds" ? Infinity : 0;

            if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
        });
    }, [filteredNodes, sortConfig]);

    // Pagination logic
    const totalPages = Math.ceil(sortedNodes.length / itemsPerPage);
    const paginatedNodes = sortedNodes.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSort = (key: SortKey) => {
        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === "asc" ? "desc" : "asc",
        }));
    };

    const formatUptime = (seconds: number | null) => {
        if (!seconds) return "—";
        const d = Math.floor(seconds / (3600 * 24));
        const h = Math.floor((seconds % (3600 * 24)) / 3600);
        return `${d}d ${h}h`;
    };

    const formatLastSeen = (seconds: number | null) => {
        if (seconds === null) return "—";
        if (seconds < 60) return `${seconds}s ago`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between bg-card p-4 rounded-xl border border-border">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search IP, Pubkey..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="online_public">Public RPC</SelectItem>
                            <SelectItem value="online_private">Private</SelectItem>
                            <SelectItem value="offline">Not Recently Seen</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={versionFilter} onValueChange={setVersionFilter}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Version" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Versions</SelectItem>
                            {uniqueVersions.map(v => (
                                <SelectItem key={v} value={v}>{v}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Table */}
            <Card className="rounded-xl border border-border bg-card overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                            <TableHead className="w-[100px] text-muted-foreground">Status</TableHead>
                            <TableHead className="text-muted-foreground">Address</TableHead>
                            <TableHead className="text-muted-foreground">Version</TableHead>
                            {/* Stats Columns from MiniNodesTable */}
                            <TableHead className="text-right">
                                <Button variant="ghost" onClick={() => handleSort("cpuPercent")} className="-mr-4 h-8 text-xs hover:bg-transparent font-medium text-muted-foreground">
                                    CPU
                                    <ArrowUpDown className="ml-2 h-3 w-3" />
                                </Button>
                            </TableHead>
                            <TableHead className="text-right">
                                <Button variant="ghost" onClick={() => handleSort("ramUsagePercent")} className="-mr-4 h-8 text-xs hover:bg-transparent font-medium text-muted-foreground">
                                    RAM
                                    <ArrowUpDown className="ml-2 h-3 w-3" />
                                </Button>
                            </TableHead>
                            <TableHead className="text-right">
                                <Button variant="ghost" onClick={() => handleSort("storageUtilizationPercent")} className="-mr-4 h-8 text-xs hover:bg-transparent font-medium text-muted-foreground">
                                    Storage
                                    <ArrowUpDown className="ml-2 h-3 w-3" />
                                </Button>
                            </TableHead>

                            <TableHead className="text-right text-muted-foreground">
                                <Button variant="ghost" onClick={() => handleSort("uptimeSeconds")} className="-mr-4 h-8 text-xs hover:bg-transparent font-medium text-muted-foreground">
                                    Uptime
                                    <ArrowUpDown className="ml-2 h-3 w-3" />
                                </Button>
                            </TableHead>
                            <TableHead className="text-right text-muted-foreground">
                                <Button variant="ghost" onClick={() => handleSort("lastSeenAgoSeconds")} className="-mr-4 h-8 text-xs hover:bg-transparent font-medium text-muted-foreground">
                                    Last Seen
                                    <ArrowUpDown className="ml-2 h-3 w-3" />
                                </Button>
                            </TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedNodes.length > 0 ? (
                            paginatedNodes.map((node) => (
                                <TableRow
                                    key={node.id}
                                    className="group cursor-pointer hover:bg-muted/50 border-border"
                                    onClick={() => router.push(`/dashboard/nodes/${encodeURIComponent(node.ip)}`)}
                                >
                                    <TableCell>
                                        <StatusBadge status={node.status} size="sm" showLabel={true} />
                                    </TableCell>
                                    <TableCell className="font-mono text-sm font-medium">
                                        <Link href={`/dashboard/nodes/${encodeURIComponent(node.ip)}`} className="text-foreground hover:underline decoration-primary underline-offset-4">
                                            {node.ip}
                                            {node.port && <span className="text-muted-foreground font-normal ml-0.5 opacity-70">:{node.port}</span>}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        {node.version ? (
                                            <span className="text-muted-foreground">
                                                {node.version}
                                            </span>
                                        ) : (
                                            <span className="text-muted-foreground">—</span>
                                        )}
                                    </TableCell>

                                    {/* CPU */}
                                    <TableCell className="text-right">
                                        {node.cpuPercent !== null ? (
                                            <span className={
                                                node.cpuPercent > 80 ? "text-red-400" :
                                                    node.cpuPercent > 50 ? "text-amber-400" :
                                                        "text-emerald-400"
                                            }>
                                                {node.cpuPercent < 1
                                                    ? `${node.cpuPercent.toFixed(1)}%`
                                                    : `${node.cpuPercent.toFixed(0)}%`
                                                }
                                            </span>
                                        ) : (
                                            <span className="text-muted-foreground">—</span>
                                        )}
                                    </TableCell>

                                    {/* RAM */}
                                    <TableCell className="text-right">
                                        {node.ramUsagePercent !== null ? (
                                            <span className={
                                                node.ramUsagePercent > 80 ? "text-red-400" :
                                                    node.ramUsagePercent > 50 ? "text-amber-400" :
                                                        "text-emerald-400"
                                            }>
                                                {node.ramUsagePercent.toFixed(0)}%
                                            </span>
                                        ) : (
                                            <span className="text-muted-foreground">—</span>
                                        )}
                                    </TableCell>

                                    {/* Storage */}
                                    <TableCell className="text-right">
                                        {node.storageUtilizationPercent !== null ? (
                                            node.storageUtilizationPercent < 1 ? (
                                                <span className="text-emerald-400">
                                                    {node.totalBytesMB !== null && node.totalBytesMB !== undefined
                                                        ? `${node.totalBytesMB.toFixed(1)} MB`
                                                        : "<1%"}
                                                </span>
                                            ) : (
                                                <span className={
                                                    node.storageUtilizationPercent > 80 ? "text-red-400" :
                                                        node.storageUtilizationPercent > 50 ? "text-amber-400" :
                                                            "text-emerald-400"
                                                }>
                                                    {node.storageUtilizationPercent.toFixed(0)}%
                                                </span>
                                            )
                                        ) : (
                                            <span className="text-muted-foreground">—</span>
                                        )}
                                    </TableCell>

                                    <TableCell className="text-right text-sm font-mono text-muted-foreground">
                                        {formatUptime(node.uptimeSeconds)}
                                    </TableCell>
                                    <TableCell className="text-right text-sm text-muted-foreground">
                                        {formatLastSeen(node.lastSeenAgoSeconds)}
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="icon" asChild className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link href={`/dashboard/nodes/${encodeURIComponent(node.ip)}`}>
                                                <span className="sr-only">View Details</span>
                                                <Search className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={9} className="h-24 text-center">
                                    No results found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (() => {
                // Generate smart page numbers with ellipsis
                const getPageNumbers = () => {
                    const pages: (number | 'ellipsis-start' | 'ellipsis-end')[] = [];
                    const siblingsCount = 1;

                    // Always show first page
                    pages.push(1);

                    // Calculate range around current page
                    const leftSibling = Math.max(currentPage - siblingsCount, 2);
                    const rightSibling = Math.min(currentPage + siblingsCount, totalPages - 1);

                    // Show left ellipsis if needed
                    if (leftSibling > 2) {
                        pages.push('ellipsis-start');
                    } else if (leftSibling === 2) {
                        pages.push(2);
                    }

                    // Show pages around current
                    for (let i = leftSibling; i <= rightSibling; i++) {
                        if (i !== 1 && i !== totalPages && !pages.includes(i)) {
                            pages.push(i);
                        }
                    }

                    // Show right ellipsis if needed
                    if (rightSibling < totalPages - 1) {
                        pages.push('ellipsis-end');
                    } else if (rightSibling === totalPages - 1) {
                        pages.push(totalPages - 1);
                    }

                    // Always show last page
                    if (totalPages > 1 && !pages.includes(totalPages)) {
                        pages.push(totalPages);
                    }

                    return pages;
                };

                return (
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (currentPage > 1) setCurrentPage(p => p - 1);
                                    }}
                                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                            </PaginationItem>
                            {getPageNumbers().map((page, idx) => (
                                <PaginationItem key={idx}>
                                    {typeof page === 'number' ? (
                                        <PaginationLink
                                            href="#"
                                            isActive={currentPage === page}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setCurrentPage(page);
                                            }}
                                        >
                                            {page}
                                        </PaginationLink>
                                    ) : (
                                        <PaginationEllipsis />
                                    )}
                                </PaginationItem>
                            ))}
                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (currentPage < totalPages) setCurrentPage(p => p + 1);
                                    }}
                                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                );
            })()}
        </div>
    );
}
