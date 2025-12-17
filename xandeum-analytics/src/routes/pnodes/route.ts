import { Hono } from "hono";
import type { PNode } from "@prisma/client";
import prisma from "../../lib/prisma-client";
import redis from "../../lib/redis-client";
import { syncPnodesOnce } from "../../lib/pnode-sync";
import logger from "../../lib/loggin-client";

const app = new Hono();

/**
 * Format uptime seconds into human-readable string
 */
function formatUptime(seconds?: number | null): string | null {
  if (!seconds || seconds <= 0) return null;

  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);

  const parts: string[] = [];
  if (d) parts.push(`${d}d`);
  if (h) parts.push(`${h}h`);
  if (m) parts.push(`${m}m`);
  return parts.join(" ") || `${seconds}s`;
}

/**
 * Convert BigInt/string/number to number or null
 */
function toNumberMaybe(value?: string | number | bigint | null): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "number") return value;
  if (typeof value === "bigint") return Number(value);
  return Number(value); // string
}

/**
 * Determine node status based on available data
 */
function determineNodeStatus(
  node: PNode,
  lastSeenAgoSeconds: number | null
): {
  status: "online_public" | "online_private" | "offline" | "unknown";
  hasPublicRpc: boolean;
  isOnline: boolean;
} {
  // Check if node has detailed stats (means RPC port 6000 is accessible)
  const hasPublicRpc = node.cpuPercent !== null || node.ramUsedBytes !== null;

  // Determine if node is online (seen in last 5 minutes)
  const isOnline =
    lastSeenAgoSeconds !== null ? lastSeenAgoSeconds < 300 : null;

  let status: "online_public" | "online_private" | "offline" | "unknown";

  if (isOnline === null) {
    status = "unknown";
  } else if (isOnline) {
    status = hasPublicRpc ? "online_public" : "online_private";
  } else {
    status = "offline";
  }

  return {
    status,
    hasPublicRpc,
    isOnline: isOnline ?? false,
  };
}

/**
 * Map database PNode model to frontend-friendly DTO with derived metrics
 */
function mapNodeToDetailDto(node: PNode) {
  const nowSec = Math.floor(Date.now() / 1000);
  const lastSeenTs = node.lastSeenTimestamp
    ? Number(node.lastSeenTimestamp)
    : null;

  const ramUsedBytes = toNumberMaybe(node.ramUsedBytes);
  const ramTotalBytes = toNumberMaybe(node.ramTotalBytes);
  const fileSizeBytes = toNumberMaybe(node.fileSizeBytes);
  const totalBytes = toNumberMaybe(node.totalBytes);

  const ramUsagePercent =
    ramUsedBytes && ramTotalBytes && ramTotalBytes > 0
      ? (ramUsedBytes / ramTotalBytes) * 100
      : null;

  const fileSizeGB = fileSizeBytes ? fileSizeBytes / 1_000_000_000 : null;
  const ramUsedGB = ramUsedBytes ? ramUsedBytes / 1_000_000_000 : null;
  const ramTotalGB = ramTotalBytes ? ramTotalBytes / 1_000_000_000 : null;
  const totalBytesMB = totalBytes ? totalBytes / 1_000_000 : null;

  const storageUtilizationPercent =
    totalBytes && fileSizeBytes && fileSizeBytes > 0
      ? (totalBytes / fileSizeBytes) * 100
      : null;

  const lastSeenAt =
    lastSeenTs && lastSeenTs > 0
      ? new Date(lastSeenTs * 1000).toISOString()
      : node.lastSeen
        ? node.lastSeen.toISOString()
        : null;

  const lastSeenAgoSeconds =
    lastSeenTs && lastSeenTs > 0 ? nowSec - lastSeenTs : null;

  // Determine comprehensive node status
  const { status, hasPublicRpc, isOnline } = determineNodeStatus(
    node,
    lastSeenAgoSeconds
  );

  return {
    // identity
    id: node.id,
    address: node.address,
    ip: node.ip,
    port: node.address.split(":")[1] ?? null,
    pubkey: node.pubkey,
    version: node.version,

    // status classification
    status,
    hasPublicRpc,
    isOnline,

    // liveness
    lastSeenTimestamp: lastSeenTs,
    lastSeenAt,
    lastSeenAgoSeconds,

    // system
    cpuPercent: node.cpuPercent,
    uptimeSeconds: node.uptimeSeconds,
    uptimeHuman: formatUptime(node.uptimeSeconds),

    // memory
    ramUsedBytes,
    ramTotalBytes,
    ramUsedGB,
    ramTotalGB,
    ramUsagePercent,

    // storage
    totalBytes,
    totalBytesMB,
    fileSizeBytes,
    fileSizeGB,
    totalPages: node.totalPages,
    storageUtilizationPercent,

    // network
    packetsReceived: node.packetsReceived,
    packetsSent: node.packetsSent,
    activeStreams: node.activeStreams,

    // geolocation
    latitude: node.latitude,
    longitude: node.longitude,
    country: node.country,
    city: node.city,

    // bookkeeping
    lastUpdatedTs: node.lastUpdatedTs,
    createdAt: node.createdAt?.toISOString?.() ?? null,
    updatedAt: node.updatedAt?.toISOString?.() ?? null,
  };
}

/**
 * GET /pnodes
 * Returns list of pNodes from Postgres (cached in Redis).
 */
app.get("/", async (c) => {
  try {
    const cacheKey = "pnodes:list:v3"; // Bumped version due to schema changes

    const cached = await redis.get(cacheKey);
    if (cached) {
      const parsedCache =
        typeof cached === "string" ? JSON.parse(cached) : cached;
      return c.json(parsedCache);
    }

    const nodes = await prisma.pNode.findMany({
      orderBy: { lastSeenTimestamp: "desc" },
    });

    // Map to DTO with derived metrics
    const dto = nodes.map(mapNodeToDetailDto);

    // Generate summary statistics
    const summary = {
      total: nodes.length,
      online_public: dto.filter((n) => n.status === "online_public").length,
      online_private: dto.filter((n) => n.status === "online_private").length,
      offline: dto.filter((n) => n.status === "offline").length,
      unknown: dto.filter((n) => n.status === "unknown").length,
    };

    const response = {
      summary,
      nodes: dto,
      timestamp: new Date().toISOString(),
    };

    await redis.set(cacheKey, JSON.stringify(response), { ex: 30 });
    return c.json(response);
  } catch (err) {
    logger.error({ err }, "Failed to fetch pnodes list");
    return c.json({ error: "Failed to fetch nodes" }, 500);
  }
});

/**
 * GET /pnodes/stats
 * Returns only summary statistics without full node list
 */
app.get("/stats", async (c) => {
  try {
    const cacheKey = "pnodes:stats:v1";

    const cached = await redis.get(cacheKey);
    if (cached) {
      const parsedCache =
        typeof cached === "string" ? JSON.parse(cached) : cached;
      return c.json(parsedCache);
    }

    const nodes = await prisma.pNode.findMany({
      select: {
        id: true,
        cpuPercent: true,
        ramUsedBytes: true,
        lastSeenTimestamp: true,
      },
    });

    const nowSec = Math.floor(Date.now() / 1000);
    const stats = {
      total: nodes.length,
      online: nodes.filter((n) => {
        const lastSeenTs = n.lastSeenTimestamp
          ? Number(n.lastSeenTimestamp)
          : null;
        const lastSeenAgo = lastSeenTs ? nowSec - lastSeenTs : null;
        return lastSeenAgo !== null && lastSeenAgo < 300;
      }).length,
      with_public_rpc: nodes.filter(
        (n) => n.cpuPercent !== null || n.ramUsedBytes !== null
      ).length,
      timestamp: new Date().toISOString(),
    };

    await redis.set(cacheKey, JSON.stringify(stats), { ex: 30 });
    return c.json(stats);
  } catch (err) {
    logger.error({ err }, "Failed to fetch pnodes stats");
    return c.json({ error: "Failed to fetch stats" }, 500);
  }
});

/**
 * GET /pnodes/:ip
 * Get detailed information for a specific pNode by IP.
 */
app.get("/:ip", async (c) => {
  try {
    const ipParam = c.req.param("ip");
    const decodedIp = decodeURIComponent(ipParam);
    const cacheKey = `pnode:${decodedIp}:v4`;

    // Try cache first
    const cached = await redis.get(cacheKey);
    if (cached) {
      const parsedCache =
        typeof cached === "string" ? JSON.parse(cached) : cached;
      return c.json(parsedCache);
    }

    // Query database by IP
    const node = await prisma.pNode.findUnique({
      where: { ip: decodedIp },
    });

    if (!node) {
      return c.json({ error: "Node not found" }, 404);
    }

    // Map to DTO with derived metrics
    const dto = mapNodeToDetailDto(node);

    // Cache the result
    await redis.set(cacheKey, JSON.stringify(dto), { ex: 30 });
    return c.json(dto);
  } catch (err) {
    logger.error({ err }, "Failed to fetch pnode details");
    return c.json({ error: "Failed to fetch node details" }, 500);
  }
});

/**
 * POST /pnodes/sync
 * Manually trigger a sync from pRPC → DB.
 * Protected with Bearer token authentication.
 */
app.post("/sync", async (c) => {
  try {
    // Check for authentication token
    const authHeader = c.req.header("Authorization");
    const syncToken = process.env.SYNC_TOKEN;

    // If SYNC_TOKEN is set in environment, require authentication
    if (syncToken) {
      if (!authHeader || authHeader !== `Bearer ${syncToken}`) {
        logger.warn("Unauthorized sync attempt");
        return c.json({ error: "Unauthorized" }, 401);
      }
    }

    logger.info("Manual sync triggered");
    await syncPnodesOnce();

    // Invalidate caches
    await redis.del("pnodes:list:v3");
    await redis.del("pnodes:stats:v1");

    return c.json({
      ok: true,
      timestamp: new Date().toISOString(),
      message: "Sync completed successfully",
    });
  } catch (err) {
    logger.error({ err }, "Sync failed");
    return c.json(
      {
        error: "Sync failed",
        message: err instanceof Error ? err.message : "Unknown error",
      },
      500
    );
  }
});

/**
 * POST /pnodes/cleanup
 * Manually cleanup stale nodes from the database.
 * Protected with Bearer token authentication.
 *
 * Query params:
 * - days: number of days to consider a node stale (default: 7)
 * - dryRun: if "true", only report what would be deleted without actually deleting
 */
app.post("/cleanup", async (c) => {
  try {
    // Check for authentication token
    const authHeader = c.req.header("Authorization");
    const syncToken = process.env.SYNC_TOKEN;

    if (syncToken) {
      if (!authHeader || authHeader !== `Bearer ${syncToken}`) {
        logger.warn("Unauthorized cleanup attempt");
        return c.json({ error: "Unauthorized" }, 401);
      }
    }

    const daysParam = c.req.query("days");
    const dryRun = c.req.query("dryRun") === "true";
    const retentionDays = daysParam ? parseInt(daysParam, 10) : 7;

    if (isNaN(retentionDays) || retentionDays < 1) {
      return c.json({ error: "Invalid days parameter" }, 400);
    }

    logger.info({ retentionDays, dryRun }, "Manual cleanup triggered");

    // Find stale nodes
    const staleThreshold = new Date();
    staleThreshold.setDate(staleThreshold.getDate() - retentionDays);

    const staleNodes = await prisma.pNode.findMany({
      where: {
        updatedAt: { lt: staleThreshold },
      },
      select: { address: true, updatedAt: true },
    });

    if (dryRun) {
      return c.json({
        ok: true,
        dryRun: true,
        wouldDelete: staleNodes.length,
        retentionDays,
        staleThreshold: staleThreshold.toISOString(),
        nodes: staleNodes.slice(0, 20).map((n) => ({
          address: n.address,
          updatedAt: n.updatedAt.toISOString(),
        })),
        message: `Would delete ${staleNodes.length} nodes not updated in ${retentionDays} days`,
      });
    }

    // Actually delete
    const deleteResult = await prisma.pNode.deleteMany({
      where: {
        address: { in: staleNodes.map((n) => n.address) },
      },
    });

    // Invalidate caches
    await redis.del("pnodes:list:v3");
    await redis.del("pnodes:stats:v1");

    logger.info({ deleted: deleteResult.count }, "Cleanup completed");

    return c.json({
      ok: true,
      deleted: deleteResult.count,
      retentionDays,
      timestamp: new Date().toISOString(),
      message: `Deleted ${deleteResult.count} stale nodes`,
    });
  } catch (err) {
    logger.error({ err }, "Cleanup failed");
    return c.json(
      {
        error: "Cleanup failed",
        message: err instanceof Error ? err.message : "Unknown error",
      },
      500
    );
  }
});

export default app;
