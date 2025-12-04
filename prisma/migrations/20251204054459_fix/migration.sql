/*
  Warnings:

  - A unique constraint covering the columns `[inputHash]` on the table `QueueJob` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `inputHash` to the `QueueJob` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "QueueJob" ADD COLUMN     "inputHash" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "QueueJob_inputHash_key" ON "QueueJob"("inputHash");
