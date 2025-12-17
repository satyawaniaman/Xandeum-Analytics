import { serve } from "@hono/node-server";
import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { type JwtVariables } from "hono/jwt";
import pnodesRoute from "./routes/pnodes/route";
import logger from "./lib/loggin-client";
import { syncPnodesOnce } from "./lib/pnode-sync";
import prisma from "./lib/prisma-client";
import redis from "./lib/redis-client";

type Variables = JwtVariables;

// Environment variable validation
const requiredEnvVars = [
  "DATABASE_URL",
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

const secret = process.env.JWT_SECRET; // Optional for now
const port = parseInt(process.env.PORT || "3000", 10);

const app = new OpenAPIHono<{ Variables: Variables }>();

// Middlewares
app.openAPIRegistry.registerComponent("securitySchemes", "Bearer", {
  type: "http",
  scheme: "bearer",
});
app.use("*", cors({ origin: process.env.ALLOWED_ORIGINS?.split(",") || [] }));

// Health Check Endpoint
app.get("/health", async (c) => {
  try {
    // Check database connectivity
    await prisma.$queryRaw`SELECT 1`;

    // Check Redis connectivity
    const redisCheck = await redis.get("health:ping");
    await redis.set("health:ping", "pong", { ex: 60 });

    // Check pRPC configuration
    const prpcConfigured = !!process.env.PRPC_URL;

    return c.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      services: {
        database: "ok",
        redis: "ok",
        prpc: prpcConfigured ? "configured" : "not_configured",
      },
      uptime: process.uptime(),
      version: process.env.npm_package_version || "unknown",
    });
  } catch (error) {
    logger.error({ error }, "Health check failed");
    return c.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
      503
    );
  }
});

// Documentation and routes
app.doc("/openapi", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "Xandeum Analytics API",
  },
});
app.route("/pnodes", pnodesRoute);

// Global error handler
app.onError((err, c) => {
  logger.error({ err, path: c.req.path }, "Request error");

  if (process.env.NODE_ENV === "production") {
    return c.json({ error: "Internal Server Error" }, 500);
  }
  return c.json(
    {
      error: err.message,
      stack: err.stack,
      path: c.req.path,
    },
    500
  );
});

// Start server
logger.info(`Server is running on http://0.0.0.0:${port}`);
logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);
logger.info(`Health check available at http://0.0.0.0:${port}/health`);
logger.info(`API docs available at http://0.0.0.0:${port}/openapi`);

const server = serve({ fetch: app.fetch, port, hostname: "0.0.0.0" });

// Automated sync functionality
let syncIntervalId: NodeJS.Timeout | null = null;
const SYNC_INTERVAL_MS = 30 * 1000; // 30 seconds

async function startAutomatedSync() {
  logger.info("Starting automated sync service...");

  // Initial sync after 5 seconds
  setTimeout(async () => {
    try {
      logger.info("Running initial sync...");
      await syncPnodesOnce();
      logger.info("Initial sync completed successfully");
    } catch (err) {
      logger.error({ err }, "Initial sync failed");
    }
  }, 5000);

  // Set up periodic sync every 30 seconds
  syncIntervalId = setInterval(async () => {
    try {
      logger.info("Running scheduled sync...");
      await syncPnodesOnce();
    } catch (err) {
      logger.error({ err }, "Scheduled sync failed");
    }
  }, SYNC_INTERVAL_MS);

  logger.info(
    `Automated sync enabled: running every ${SYNC_INTERVAL_MS / 1000} seconds`
  );
}

// Start automated sync
startAutomatedSync();

// Graceful shutdown handler
async function gracefulShutdown(signal: string) {
  logger.info(`${signal} received, shutting down gracefully...`);

  // Stop the sync interval
  if (syncIntervalId) {
    clearInterval(syncIntervalId);
    logger.info("Stopped automated sync service");
  }

  // Close database connection
  try {
    await prisma.$disconnect();
    logger.info("Database connection closed");
  } catch (err) {
    logger.error({ err }, "Error closing database connection");
  }

  logger.info("Shutdown complete");
  process.exit(0);
}

// Register shutdown handlers
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Handle uncaught errors
process.on("unhandledRejection", (reason, promise) => {
  logger.error({ reason, promise }, "Unhandled Promise Rejection");
});

process.on("uncaughtException", (error) => {
  logger.error({ error }, "Uncaught Exception");
  gracefulShutdown("UNCAUGHT_EXCEPTION");
});
