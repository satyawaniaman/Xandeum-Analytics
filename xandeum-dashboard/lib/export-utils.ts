import { PNode } from "./types";

/**
 * Convert an array of objects to CSV string
 */
export function convertToCSV<T extends object>(data: T[]): string {
    if (data.length === 0) return "";

    // Get headers from first object
    const headers = Object.keys(data[0]);

    // Create CSV header row
    const headerRow = headers.join(",");

    // Create data rows
    const dataRows = data.map((item) => {
        return headers.map((header) => {
            const value = (item as Record<string, unknown>)[header];

            // Handle null/undefined
            if (value === null || value === undefined) {
                return "";
            }

            // Handle strings with special characters
            if (typeof value === "string") {
                // Escape quotes and wrap in quotes if contains comma, newline, or quote
                if (value.includes(",") || value.includes("\n") || value.includes('"')) {
                    return `"${value.replace(/"/g, '""')}"`;
                }
                return value;
            }

            // Handle other types
            return String(value);
        }).join(",");
    });

    return [headerRow, ...dataRows].join("\n");
}

/**
 * Download data as JSON file
 */
export function downloadJSON<T>(data: T[], filename: string): void {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    downloadBlob(blob, filename);
}

/**
 * Download data as CSV file
 */
export function downloadCSV<T extends object>(data: T[], filename: string): void {
    const csvString = convertToCSV(data);
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    downloadBlob(blob, filename);
}

/**
 * Helper to trigger file download from a Blob
 */
function downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Generate a timestamp string for filenames
 */
export function getTimestampString(): string {
    const now = new Date();
    return now.toISOString().split("T")[0]; // YYYY-MM-DD format
}

/**
 * Export nodes with a descriptive filename
 */
export function exportNodes(nodes: PNode[], format: "json" | "csv"): void {
    const timestamp = getTimestampString();
    const filename = `xandeum-nodes-report-${timestamp}.${format}`;

    if (format === "json") {
        downloadJSON(nodes, filename);
    } else {
        // For CSV, we'll flatten the data and select relevant columns
        const flattenedNodes = nodes.map((node) => ({
            address: node.address,
            ip: node.ip,
            port: node.port,
            pubkey: node.pubkey,
            version: node.version,
            status: node.status,
            isOnline: node.isOnline,
            hasPublicRpc: node.hasPublicRpc,
            uptime: node.uptimeHuman,
            cpuPercent: node.cpuPercent,
            ramUsagePercent: node.ramUsagePercent,
            totalStorageBytes: node.totalBytes,
            fileSizeBytes: node.fileSizeBytes,
            storageUtilizationPercent: node.storageUtilizationPercent,
            country: node.country,
            city: node.city,
            latitude: node.latitude,
            longitude: node.longitude,
            lastSeenAt: node.lastSeenAt,
            packetsReceived: node.packetsReceived,
            packetsSent: node.packetsSent,
            activeStreams: node.activeStreams,
        }));
        downloadCSV(flattenedNodes, filename);
    }
}
