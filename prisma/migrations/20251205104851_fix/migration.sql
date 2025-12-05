/*
  Warnings:

  - A unique constraint covering the columns `[linkedinHash,listId]` on the table `Lead` will be added. If there are existing duplicate values, this will fail.
  - Made the column `linkedinHash` on table `Lead` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Lead" ALTER COLUMN "linkedinHash" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Lead_linkedinHash_listId_key" ON "Lead"("linkedinHash", "listId");
