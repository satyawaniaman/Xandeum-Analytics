import "dotenv/config";
import { syncPnodesOnce } from "../lib/pnode-sync";

(async () => {
  try {
    await syncPnodesOnce();
    console.log("Done.");
  } catch (err) {
    console.error("Sync failed:");
    console.error(err);
  } finally {
    process.exit(0);
  }
})();
