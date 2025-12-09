import "dotenv/config";
import axios from "axios";
import logger from "../lib/loggin-client";

const SEED_PRPC = process.env.PRPC_URL;

async function main() {
  if (!SEED_PRPC) {
    logger.error("PRPC_URL environment variable is not set");
    process.exit(1);
  }

  logger.info(`Calling get-stats on: ${SEED_PRPC}`);

  try {
    const { data } = await axios.post(SEED_PRPC, {
      jsonrpc: "2.0",
      id: 1,
      method: "get-stats",
      params: [],
    });

    console.log("\n=== get-stats Response ===");
    console.dir(data, { depth: null, colors: true });
    console.log("\n=========================\n");

    if (data.error) {
      logger.error({ error: data.error }, "get-stats returned an error");
      process.exit(1);
    }

    if (data.result) {
      logger.info("Successfully received stats data");

      // Log structure for easy reference
      if (data.result.metadata) {
        logger.info(
          "Available metadata fields:",
          Object.keys(data.result.metadata),
        );
      }
      if (data.result.stats) {
        logger.info("Available stats fields:", Object.keys(data.result.stats));
      }
    }
  } catch (err) {
    logger.error({ err }, "Failed to call get-stats");
    if (axios.isAxiosError(err)) {
      logger.error(`Status: ${err.response?.status}`);
      logger.error(`Response: ${JSON.stringify(err.response?.data)}`);
    }
    process.exit(1);
  }
}

main().catch((err) => {
  logger.error({ err }, "Unhandled error in main");
  process.exit(1);
});
