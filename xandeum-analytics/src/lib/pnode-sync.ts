import prisma from "./prisma-client";
import { getPods } from "./prpc-client";
import logger from "./loggin-client";
import { batchGetStats, extractIpFromAddress } from "./pnode-stats-client";

export async function syncPnodesOnce() {
  const startTime = Date.now();
  const pods = await getPods();
  const now = new Date();

  if (!pods.length) {
    logger.warn("No pods returned from get-pods");
    return;
  }

  logger.info(`Syncing ${pods.length} pods base info...`);

  // 1) Upsert base info from get-pods
  await prisma.$transaction(
    pods.map((pod) =>
      prisma.pNode.upsert({
        where: { address: pod.address },
        update: {
          pubkey: pod.pubkey ?? undefined,
          version: pod.version ?? undefined,
          lastSeenTimestamp: pod.last_seen_timestamp ?? undefined,
          lastSeen: pod.last_seen ? new Date(pod.last_seen) : undefined,
          updatedAt: now,
        },
        create: {
          address: pod.address,
          pubkey: pod.pubkey ?? undefined,
          version: pod.version ?? undefined,
          lastSeenTimestamp: pod.last_seen_timestamp ?? undefined,
          lastSeen: pod.last_seen ? new Date(pod.last_seen) : undefined,
          createdAt: now,
          updatedAt: now,
        },
      }),
    ),
  );

  logger.info("Base pod info synced. Fetching detailed stats in parallel...");

  // 2) Fetch stats for all pods in parallel with concurrency limit
  const addresses = pods.map((pod) => pod.address);
  const statsMap = await batchGetStats(addresses, 15); // 15 concurrent requests

  // 3) Update database with stats results
  let successCount = 0;
  let failCount = 0;

  const updatePromises = Array.from(statsMap.entries()).map(
    async ([address, stats]) => {
      if (!stats) {
        failCount++;
        return;
      }

      try {
        await prisma.pNode.update({
          where: { address },
          data: {
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
        logger.warn({ address, err }, "Failed to update stats for node");
        failCount++;
      }
    },
  );

  await Promise.all(updatePromises);

  const duration = Date.now() - startTime;
  const successRate = ((successCount / pods.length) * 100).toFixed(1);

  logger.info(
    {
      total: pods.length,
      success: successCount,
      failed: failCount,
      successRate: `${successRate}%`,
      durationMs: duration,
    },
    `Sync complete in ${(duration / 1000).toFixed(2)}s`,
  );
}
