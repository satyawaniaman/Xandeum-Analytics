/*
  Warnings:

  - A unique constraint covering the columns `[ip]` on the table `PNode` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ip` to the `PNode` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "PNode_address_key";

-- AlterTable
ALTER TABLE "PNode" ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "ip" TEXT NOT NULL,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION;

-- CreateIndex
CREATE UNIQUE INDEX "PNode_ip_key" ON "PNode"("ip");

-- CreateIndex
CREATE INDEX "PNode_address_idx" ON "PNode"("address");
