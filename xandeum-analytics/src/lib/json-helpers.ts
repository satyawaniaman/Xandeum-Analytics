/**
 * Helper functions for JSON serialization with BigInt support
 */

/**
 * Custom JSON replacer that converts BigInt to string
 */
export function bigIntReplacer(_key: string, value: unknown): unknown {
  if (typeof value === "bigint") {
    return value.toString();
  }
  return value;
}

/**
 * Safely stringify objects that may contain BigInt values
 */
export function safeStringify(obj: unknown): string {
  return JSON.stringify(obj, bigIntReplacer);
}

/**
 * Transform an object to convert all BigInt values to strings
 * This is useful for preparing database results for JSON serialization
 */
export function serializeBigInts<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === "bigint") {
    return String(obj) as T;
  }

  // Handle Date objects - preserve them as ISO strings
  if (obj instanceof Date) {
    return obj.toISOString() as T;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => serializeBigInts(item)) as T;
  }

  if (typeof obj === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = serializeBigInts(value);
    }
    return result as T;
  }

  return obj;
}
