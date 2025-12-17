import axios from "axios";
import pLimit from "p-limit";
import logger from "./loggin-client";

interface GeoLocation {
  latitude: number;
  longitude: number;
  country: string;
  city: string;
}

interface IpApiResponse {
  status: string;
  query?: string;
  country?: string;
  city?: string;
  lat?: number;
  lon?: number;
}

// In-memory cache to avoid re-fetching same IPs
const geoCache = new Map<string, GeoLocation | null>();

/**
 * Get geolocation for a single IP using ip-api.com (free, no API key needed)
 * Rate limit: 45 requests/minute for free tier
 */
export async function getGeoLocation(ip: string): Promise<GeoLocation | null> {
  // Check cache first
  if (geoCache.has(ip)) {
    return geoCache.get(ip) || null;
  }

  // Skip private/local IPs
  if (isPrivateIP(ip)) {
    geoCache.set(ip, null);
    return null;
  }

  try {
    const response = await axios.get<IpApiResponse>(
      `http://ip-api.com/json/${ip}?fields=status,country,city,lat,lon`,
      { timeout: 5000 }
    );

    if (
      response.data.status === "success" &&
      response.data.lat &&
      response.data.lon
    ) {
      const geo: GeoLocation = {
        latitude: response.data.lat,
        longitude: response.data.lon,
        country: response.data.country || "Unknown",
        city: response.data.city || "Unknown",
      };
      geoCache.set(ip, geo);
      return geo;
    }

    geoCache.set(ip, null);
    return null;
  } catch (error) {
    logger.debug({ ip, error }, "Failed to get geolocation");
    geoCache.set(ip, null);
    return null;
  }
}

/**
 * Batch get geolocation for multiple IPs with rate limiting
 */
export async function batchGetGeoLocation(
  ips: string[],
  concurrency: number = 5
): Promise<Map<string, GeoLocation | null>> {
  const limit = pLimit(concurrency);
  const results = new Map<string, GeoLocation | null>();

  // Filter out duplicates and already cached IPs
  const uniqueIps = [...new Set(ips)].filter((ip) => !geoCache.has(ip));

  // Batch request to ip-api.com (supports batch of 100)
  const batches: string[][] = [];
  for (let i = 0; i < uniqueIps.length; i += 100) {
    batches.push(uniqueIps.slice(i, i + 100));
  }

  for (const batch of batches) {
    try {
      // ip-api.com batch endpoint
      const response = await axios.post<IpApiResponse[]>(
        "http://ip-api.com/batch?fields=status,query,country,city,lat,lon",
        batch.map((ip) => ({ query: ip })),
        { timeout: 10000 }
      );

      for (const item of response.data) {
        const ip = item.query;
        if (!ip) continue;
        if (item.status === "success" && item.lat && item.lon) {
          const geo: GeoLocation = {
            latitude: item.lat,
            longitude: item.lon,
            country: item.country || "Unknown",
            city: item.city || "Unknown",
          };
          geoCache.set(ip, geo);
          results.set(ip, geo);
        } else {
          geoCache.set(ip, null);
          results.set(ip, null);
        }
      }

      // Small delay between batches to respect rate limits
      if (batches.length > 1) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    } catch (error) {
      logger.warn({ batch, error }, "Batch geolocation request failed");
      // Fall back to individual requests with rate limiting
      const individualPromises = batch.map((ip) =>
        limit(async () => {
          const geo = await getGeoLocation(ip);
          results.set(ip, geo);
        })
      );
      await Promise.all(individualPromises);
    }
  }

  // Add cached results
  for (const ip of ips) {
    if (!results.has(ip) && geoCache.has(ip)) {
      results.set(ip, geoCache.get(ip) || null);
    }
  }

  return results;
}

/**
 * Check if IP is private/local
 */
function isPrivateIP(ip: string): boolean {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4) return true;

  // 10.0.0.0/8
  if (parts[0] === 10) return true;
  // 172.16.0.0/12
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
  // 192.168.0.0/16
  if (parts[0] === 192 && parts[1] === 168) return true;
  // 127.0.0.0/8 (loopback)
  if (parts[0] === 127) return true;
  // 0.0.0.0
  if (parts.every((p) => p === 0)) return true;

  return false;
}

export function clearGeoCache(): void {
  geoCache.clear();
}
