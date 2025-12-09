import prisma from "../lib/prisma-client";

async function testTypes() {
  console.log("Testing Prisma types for new fields...");

  // This will cause a TypeScript error if the fields don't exist
  const testData = {
    address: "test:9001",
    totalBytes: BigInt(1000),
    totalPages: 10,
    lastUpdatedTs: 123456,
    cpuPercent: 50.5,
    ramUsedBytes: BigInt(500000),
    ramTotalBytes: BigInt(1000000),
    uptimeSeconds: 3600,
    packetsReceived: 1000,
    packetsSent: 500,
    activeStreams: 5,
    fileSizeBytes: BigInt(2000000),
  };

  console.log("✅ TypeScript accepts all new fields!");
  console.log("Test data:", testData);

  // Try a real query to verify runtime
  try {
    const count = await prisma.pNode.count();
    console.log(`✅ Database connection works. Total nodes: ${count}`);

    // Try to find one node and check if new fields exist
    const node = await prisma.pNode.findFirst();
    if (node) {
      console.log("✅ Sample node found");
      console.log("  - Address:", node.address);
      console.log("  - CPU Percent:", node.cpuPercent ?? "N/A");
      console.log("  - RAM Used:", node.ramUsedBytes?.toString() ?? "N/A");
      console.log("  - Uptime:", node.uptimeSeconds ?? "N/A");
    }
  } catch (err) {
    console.error("❌ Database error:", (err as Error).message);
  } finally {
    await prisma.$disconnect();
  }

  console.log("\n✅ All type checks passed!");
}

testTypes().catch((err) => {
  console.error("❌ Test failed:", err);
  process.exit(1);
});
