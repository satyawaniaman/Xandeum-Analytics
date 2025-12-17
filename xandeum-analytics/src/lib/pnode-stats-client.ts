import axios from "axios";
import { z } from "zod";
import logger from "./loggin-client";

const StatsResultSchema = z.object({
  // All fields at root level based on actual API response
  total_bytes: z.number().optional(),
  total_pages: z.number().optional(),
  last_updated: z.number().optional(),
  cpu_percent: z.number().optional(),
  ram_used: z.number().optional(),
  ram_total: z.number().optional(),
  uptime: z.number().optional(),
  packets_received: z.number().optional(),
  packets_sent: z.number().optional(),
  active_streams: z.number().optional(),
  file_size: z.number().optional(),
  current_index: z.number().optional(),
});

export type StatsResult = z.infer<typeof StatsResultSchema>;

/**
 * Extract IP from address string like "192.190.136.37:9001"
 */
export function extractIpFromAddress(address: string): string {
  return address.split(":")[0];
}

/**
 * Sleep for specified milliseconds
 */
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Call get-stats on a specific pNode IP with retry logic.
 * NOTE: we derive http://<ip>:6000/rpc from the gossip address.
 */
export async function getStatsForIp(
  ip: string,
  maxRetries: number = 2
): Promise<StatsResult | null> {
  const url = `http://${ip}:6000/rpc`;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const { data } = await axios.post(
        url,
        {
          jsonrpc: "2.0",
          id: 1,
          method: "get-stats",
          params: [],
        },
        {
          timeout: 3000, // 3 second timeout (reduced from 5s for faster parallel processing)
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (data.error) {
        logger.debug(
          { ip, error: data.error, attempt },
          `get-stats error for ${ip}`
        );
        if (attempt < maxRetries) {
          await sleep(500 * attempt); // Exponential backoff: 500ms, 1000ms
          continue;
        }
        return null;
      }

      const parsed = StatsResultSchema.safeParse(data.result);
      if (!parsed.success) {
        logger.debug(
          { ip, error: parsed.error.format(), attempt },
          `get-stats parse error for ${ip}`
        );
        return null;
      }

      // Success!
      logger.debug({ ip, attempt }, `Successfully fetched stats for ${ip}`);
      return parsed.data;
    } catch (err) {
      const error = err as Error;

      // Don't retry on certain errors
      if (
        error.message.includes("ECONNREFUSED") ||
        error.message.includes("ETIMEDOUT") ||
        error.message.includes("ENOTFOUND")
      ) {
        logger.debug(
          { ip, error: error.message, attempt },
          `Node ${ip} unreachable (port likely closed)`
        );
        return null; // Exit early, no point retrying
      }

      // For other errors, retry
      if (attempt < maxRetries) {
        logger.debug(
          { ip, error: error.message, attempt },
          `Retrying get-stats for ${ip}`
        );
        await sleep(500 * attempt);
        continue;
      }

      logger.debug(
        { ip, error: error.message, attempt },
        `get-stats failed for ${ip} after ${maxRetries} attempts`
      );
      return null;
    }
  }

  return null;
}

/**
 * Batch fetch stats for multiple IPs in parallel with concurrency control
 */
export async function batchGetStats(
  addresses: string[],
  concurrency: number = 10
): Promise<Map<string, StatsResult | null>> {
  const results = new Map<string, StatsResult | null>();
  const pLimit = (await import("p-limit")).default;
  const limit = pLimit(concurrency);

  const promises = addresses.map((address) =>
    limit(async () => {
      const ip = extractIpFromAddress(address);
      const stats = await getStatsForIp(ip, 2); // 2 retries
      results.set(address, stats);
      return { address, stats };
    })
  );

  await Promise.all(promises);

  return results;
}
