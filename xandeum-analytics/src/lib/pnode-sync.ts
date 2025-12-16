import prisma from "./prisma-client";
import { getPods } from "./prpc-client";
import logger from "./loggin-client";
import { batchGetStats, extractIpFromAddress } from "./pnode-stats-client";
import { batchGetGeoLocation } from "./geo-client";

// How long to keep nodes that are no longer returned by pRPC (in days)
const STALE_NODE_RETENTION_DAYS = 7;

export async function syncPnodesOnce() {
  const startTime = Date.now();
  const pods = await getPods();
  const now = new Date();

  if (!pods.length) {
    logger.warn("No pods returned from get-pods");
    return;
  }

  logger.info(`Syncing ${pods.length} pods from pRPC...`);

  // Deduplicate pods by IP - keep the one with the most recent last_seen_timestamp
  const podsByIp = new Map<string, (typeof pods)[0]>();
  for (const pod of pods) {
    const ip = extractIpFromAddress(pod.address);
    const existing = podsByIp.get(ip);

    if (!existing) {
      podsByIp.set(ip, pod);
    } else {
      // Keep the pod with the more recent timestamp
      const existingTs = existing.last_seen_timestamp ?? 0;
      const newTs = pod.last_seen_timestamp ?? 0;
      if (newTs > existingTs) {
        podsByIp.set(ip, pod);
      }
    }
  }

  const uniquePods = Array.from(podsByIp.values());
  logger.info(`Deduplicated to ${uniquePods.length} unique IPs (from ${pods.length} addresses)`);

  // Track current IPs for cleanup later
  const currentIps = new Set(uniquePods.map((pod) => extractIpFromAddress(pod.address)));

  // 1) Upsert base info from get-pods - keyed by IP
  await prisma.$transaction(
    uniquePods.map((pod) => {
      const ip = extractIpFromAddress(pod.address);
      return prisma.pNode.upsert({
        where: { ip },
        update: {
          address: pod.address,  // Update to latest address (IP:port)
          pubkey: pod.pubkey ?? undefined,
          version: pod.version ?? undefined,
          lastSeenTimestamp: pod.last_seen_timestamp ?? undefined,
          lastSeen: pod.last_seen ? new Date(pod.last_seen) : undefined,
        },
        create: {
          ip,
          address: pod.address,
          pubkey: pod.pubkey ?? undefined,
          version: pod.version ?? undefined,
          lastSeenTimestamp: pod.last_seen_timestamp ?? undefined,
          lastSeen: pod.last_seen ? new Date(pod.last_seen) : undefined,
        },
      });
    }),
  );

  logger.info("Base pod info synced. Fetching detailed stats in parallel...");

  // 2) Fetch stats for all pods in parallel with concurrency limit
  // Use the addresses from uniquePods (one per IP)
  const addresses = uniquePods.map((pod) => pod.address);
  const statsMap = await batchGetStats(addresses, 15); // 15 concurrent requests

  // 3) Fetch geolocation for IPs that don't have it yet
  const nodesWithoutGeo = await prisma.pNode.findMany({
    where: { latitude: null },
    select: { ip: true },
  });

  if (nodesWithoutGeo.length > 0) {
    logger.info(`Fetching geolocation for ${nodesWithoutGeo.length} nodes...`);
    const ipsToGeolocate = nodesWithoutGeo.map((n) => n.ip);
    const geoMap = await batchGetGeoLocation(ipsToGeolocate, 5);

    // Update nodes with geolocation data
    for (const node of nodesWithoutGeo) {
      const geo = geoMap.get(node.ip);
      if (geo) {
        await prisma.pNode.update({
          where: { ip: node.ip },
          data: {
            latitude: geo.latitude,
            longitude: geo.longitude,
            country: geo.country,
            city: geo.city,
          },
        });
      }
    }
    logger.info(`Geolocation updated for ${geoMap.size} nodes`);
  }

  // 4) Update database with stats results
  let successCount = 0;
  let failCount = 0;

  const nowTimestamp = Math.floor(Date.now() / 1000);

  const updatePromises = Array.from(statsMap.entries()).map(
    async ([address, stats]) => {
      if (!stats) {
        failCount++;
        return;
      }

      const ip = extractIpFromAddress(address);

      try {
        // If we successfully fetched stats, the node is definitely online
        // Update lastSeenTimestamp to current time (not relying on stale pRPC data)
        await prisma.pNode.update({
          where: { ip },
          data: {
            address,  // Update to the address we successfully contacted
            // Mark as seen NOW since we successfully reached the node's RPC
            lastSeenTimestamp: BigInt(nowTimestamp),
            lastSeen: now,

            totalBytes: stats.total_bytes
              ? BigInt(stats.total_bytes)
              : undefined,
            totalPages: stats.total_pages ?? undefined,
            lastUpdatedTs: stats.last_updated ?? undefined,

            cpuPercent: stats.cpu_percent ?? undefined,
            ramUsedBytes: stats.ram_used ? BigInt(stats.ram_used) : undefined,
            ramTotalBytes: stats.ram_total
              ? BigInt(stats.ram_total)
              : undefined,
            uptimeSeconds: stats.uptime ?? undefined,
            packetsReceived: stats.packets_received ?? undefined,
            packetsSent: stats.packets_sent ?? undefined,
            activeStreams: stats.active_streams ?? undefined,

            fileSizeBytes: stats.file_size
              ? BigInt(stats.file_size)
              : undefined,
          },
        });
        successCount++;
      } catch (err) {
        logger.warn({ ip, address, err }, "Failed to update stats for node");
        failCount++;
      }
    },
  );

  await Promise.all(updatePromises);

  // 5) Cleanup stale nodes that are no longer in pRPC response
  //    and haven't been updated in STALE_NODE_RETENTION_DAYS
  const staleThreshold = new Date();
  staleThreshold.setDate(staleThreshold.getDate() - STALE_NODE_RETENTION_DAYS);

  const staleNodes = await prisma.pNode.findMany({
    where: {
      ip: { notIn: Array.from(currentIps) },
      updatedAt: { lt: staleThreshold },
    },
    select: { ip: true },
  });

  if (staleNodes.length > 0) {
    logger.info(`Removing ${staleNodes.length} stale nodes not seen in ${STALE_NODE_RETENTION_DAYS} days...`);

    const deleteResult = await prisma.pNode.deleteMany({
      where: {
        ip: { in: staleNodes.map((n) => n.ip) },
      },
    });

    logger.info(`Deleted ${deleteResult.count} stale nodes`);
  }

  const duration = Date.now() - startTime;
  const successRate = ((successCount / uniquePods.length) * 100).toFixed(1);

  logger.info(
    {
      totalFromPrpc: pods.length,
      uniqueIps: uniquePods.length,
      success: successCount,
      failed: failCount,
      staleRemoved: staleNodes.length,
      successRate: `${successRate}%`,
      durationMs: duration,
    },
    `Sync complete in ${(duration / 1000).toFixed(2)}s`,
  );
}

