-- AlterTable
ALTER TABLE "PNode" ADD COLUMN     "activeStreams" INTEGER,
ADD COLUMN     "cpuPercent" DOUBLE PRECISION,
ADD COLUMN     "fileSizeBytes" BIGINT,
ADD COLUMN     "lastUpdatedTs" INTEGER,
ADD COLUMN     "packetsReceived" INTEGER,
ADD COLUMN     "packetsSent" INTEGER,
ADD COLUMN     "ramTotalBytes" BIGINT,
ADD COLUMN     "ramUsedBytes" BIGINT,
ADD COLUMN     "totalBytes" BIGINT,
ADD COLUMN     "totalPages" INTEGER,
ADD COLUMN     "uptimeSeconds" INTEGER;
