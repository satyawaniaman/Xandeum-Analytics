import { PNode, NodeStatus } from "./types";

const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || "https://analytics.xandeum.network";

/**
 * Get an emoji representation of a node status
 */
export function getStatusEmoji(status: NodeStatus): string {
    switch (status) {
        case "online_public":
            return "🟢";
        case "online_private":
            return "🟡";
        case "offline":
            return "🔴";
        default:
            return "⚪";
    }
}

/**
 * Get a human-readable status label
 */
export function getStatusLabel(status: NodeStatus): string {
    switch (status) {
        case "online_public":
            return "ONLINE (PUBLIC)";
        case "online_private":
            return "ONLINE (PRIVATE)";
        case "offline":
            return "OFFLINE";
        default:
            return "UNKNOWN";
    }
}

/**
 * Format bytes to human readable string
 */
function formatBytes(bytes: number | null): string {
    if (bytes === null) return "—";
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Generate a formatted Pulse Report for a node
 */
export function generatePulseReport(node: PNode): string {
    const statusEmoji = getStatusEmoji(node.status);
    const statusLabel = getStatusLabel(node.status);
    const storage = `${formatBytes(node.totalBytes)} / ${formatBytes(node.fileSizeBytes)}`;
    const location = [node.city, node.country].filter(Boolean).join(", ") || "Unknown";

    const report = [
        "🌐 XANDEUM PULSE REPORT",
        "━━━━━━━━━━━━━━━━━━━━━━━",
        `📍 Node: ${node.address}`,
        `${statusEmoji} Status: ${statusLabel}`,
        `💾 Storage: ${storage}`,
        `⏱️ Uptime: ${node.uptimeHuman || "—"}`,
        `📦 Version: ${node.version || "Unknown"}`,
        `🌍 Location: ${location}`,
        `📊 CPU: ${node.cpuPercent?.toFixed(1) || "—"}%`,
        `🧠 RAM: ${node.ramUsagePercent?.toFixed(0) || "—"}%`,
        "━━━━━━━━━━━━━━━━━━━━━━━",
        `Monitor at: ${FRONTEND_URL}`,
    ];

    return report.join("\n");
}

/**
 * Generate a Twitter/X share URL with pre-filled text
 */
export function generateTwitterShareUrl(node: PNode): string {
    const statusEmoji = getStatusEmoji(node.status);
    const statusLabel = getStatusLabel(node.status);
    const storage = `${formatBytes(node.totalBytes)} / ${formatBytes(node.fileSizeBytes)}`;
    const location = [node.city, node.country].filter(Boolean).join(", ") || "Unknown";

    // Shorter format for Twitter's character limit
    const tweet = [
        "🌐 XANDEUM PULSE REPORT",
        "",
        `📍 Node: ${node.address}`,
        `${statusEmoji} Status: ${statusLabel}`,
        `💾 Storage: ${storage}`,
        `⏱️ Uptime: ${node.uptimeHuman || "—"}`,
        `📦 Version: ${node.version || "Unknown"}`,
        `🌍 Location: ${location}`,
        "",
        `Monitor at: ${FRONTEND_URL}`,
        "",
        "#Xandeum #Web3 #Blockchain"
    ].join("\n");

    const encodedText = encodeURIComponent(tweet);
    return `https://twitter.com/intent/tweet?text=${encodedText}`;
}
