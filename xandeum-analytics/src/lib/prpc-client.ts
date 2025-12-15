import axios from "axios";
import { z } from "zod";
import logger from "./loggin-client";

const PRPC_URL = process.env.PRPC_URL || "";
if (!PRPC_URL) {
  throw new Error("PRPC_URL is not set");
}

const PodSchema = z.object({
  address: z.string(),
  last_seen_timestamp: z.number().optional(),
  last_seen: z.string().optional(),
  pubkey: z.string().nullable().optional(),
  version: z.string().optional(),
});

const GetPodsResultSchema = z.object({
  pods: PodSchema.array(),
  total_count: z.number(),
});

type JsonRpcResponse<T> = {
  jsonrpc: "2.0";
  id: number | string;
  result?: T;
  error?: { code: number; message: string; data?: unknown } | null;
};

export type Pod = z.infer<typeof PodSchema>;

async function callPrpc<T>(method: string, params: unknown[] = []): Promise<T> {
  const body = {
    jsonrpc: "2.0",
    id: 1,
    method,
    params,
  };

  const response = await axios.post<JsonRpcResponse<unknown>>(PRPC_URL, body, {
    headers: { "content-type": "application/json" },
  });

  const json = response.data;

  if (json.error) {
    throw new Error(`pRPC error ${json.error.code}: ${json.error.message}`);
  }

  return json.result as T;
}

export async function getPods(): Promise<Pod[]> {
  const result = await callPrpc<unknown>("get-pods");
  const parsed = GetPodsResultSchema.safeParse(result);

  if (!parsed.success) {
    logger.error(
      { error: parsed.error.format() },
      "get-pods result validation failed",
    );
    throw new Error("get-pods result validation failed");
  }

  return parsed.data.pods;
}
