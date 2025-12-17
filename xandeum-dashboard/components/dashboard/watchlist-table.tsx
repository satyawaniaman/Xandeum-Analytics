"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useWatchlist, WatchlistNode } from "@/hooks/use-watchlist";
import { Star, Pencil, Trash2, Check, X, ExternalLink } from "lucide-react";

export function WatchlistTable() {
    const { watchlist, renameWatchlistNode, removeFromWatchlist } = useWatchlist();
    const [editingAddress, setEditingAddress] = useState<string | null>(null);
    const [editName, setEditName] = useState("");

    const startEditing = (node: WatchlistNode) => {
        setEditingAddress(node.address);
        setEditName(node.customName || "");
    };

    const cancelEditing = () => {
        setEditingAddress(null);
        setEditName("");
    };

    const saveEdit = (address: string) => {
        renameWatchlistNode(address, editName.trim());
        setEditingAddress(null);
        setEditName("");
    };

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        } catch {
            return "—";
        }
    };

    if (watchlist.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-muted/50 p-4 rounded-full mb-4">
                    <Star className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                    No nodes in watchlist
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mb-4">
                    Add nodes to your watchlist from the node details page to quickly access them here.
                </p>
                <Button variant="outline" asChild>
                    <Link href="/dashboard/nodes">Browse Nodes</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="rounded-lg border border-border overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50">
                        <TableHead className="w-[200px]">Name</TableHead>
                        <TableHead>Node Address</TableHead>
                        <TableHead className="w-[120px]">Added</TableHead>
                        <TableHead className="w-[100px] text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {watchlist.map((node) => (
                        <TableRow key={node.address} className="group">
                            <TableCell>
                                {editingAddress === node.address ? (
                                    <div className="flex items-center gap-2">
                                        <Input
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            placeholder="Enter custom name..."
                                            className="h-8 text-sm"
                                            autoFocus
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    saveEdit(node.address);
                                                } else if (e.key === "Escape") {
                                                    cancelEditing();
                                                }
                                            }}
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 text-green-500 hover:text-green-600"
                                            onClick={() => saveEdit(node.address)}
                                        >
                                            <Check size={14} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                            onClick={cancelEditing}
                                        >
                                            <X size={14} />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Star size={14} className="text-yellow-500 fill-yellow-500" />
                                        <span className="font-medium">
                                            {node.customName || (
                                                <span className="text-muted-foreground italic">
                                                    Unnamed
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                )}
                            </TableCell>
                            <TableCell>
                                <Link
                                    href={`/dashboard/nodes/${encodeURIComponent(node.address)}`}
                                    className="font-mono text-sm text-primary hover:underline flex items-center gap-1"
                                >
                                    {node.address}
                                    <ExternalLink size={12} className="opacity-50" />
                                </Link>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                                {formatDate(node.addedAt)}
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                        onClick={() => startEditing(node)}
                                        disabled={editingAddress === node.address}
                                    >
                                        <Pencil size={14} />
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-muted-foreground hover:text-red-500"
                                            >
                                                <Trash2 size={14} />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Remove from watchlist?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This will remove{" "}
                                                    <span className="font-mono font-medium">
                                                        {node.customName || node.address}
                                                    </span>{" "}
                                                    from your watchlist. You can always add it back later.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => removeFromWatchlist(node.address)}
                                                    className="bg-red-500 hover:bg-red-600"
                                                >
                                                    Remove
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
