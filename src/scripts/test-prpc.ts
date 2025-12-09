import "dotenv/config";
import { getPods } from "../lib/prpc-client";

(async () => {
  try {
    const prpcUrl = process.env.PRPC_URL;
    if (!prpcUrl) {
      console.error("Error: PRPC_URL environment variable is not set");
      console.error(
        "Please set it in your .env file or with: export PRPC_URL=<your-prpc-url>",
      );
      process.exit(1);
    }

    console.log(`Fetching pods from: ${prpcUrl}\n`);
    const pods = await getPods();
    console.log("Success! Pods retrieved:");
    console.log(JSON.stringify(pods, null, 2));
  } catch (error) {
    console.error("Error fetching pods:");
    if (error instanceof Error) {
      console.error(`Message: ${error.message}`);
      if (error.cause) {
        console.error(`Cause: ${error.cause}`);
      }
    } else {
      console.error(error);
    }
    process.exit(1);
  }
})();
