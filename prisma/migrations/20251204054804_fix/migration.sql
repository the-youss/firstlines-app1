/*
  Warnings:

  - You are about to drop the column `inputHash` on the `QueueJob` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "QueueJob_inputHash_key";

-- DropIndex
DROP INDEX "QueueJob_userId_status_inputHash_idx";

-- AlterTable
ALTER TABLE "QueueJob" DROP COLUMN "inputHash";
