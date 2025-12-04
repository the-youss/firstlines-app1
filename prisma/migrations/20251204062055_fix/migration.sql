/*
  Warnings:

  - A unique constraint covering the columns `[companyWebsite]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - Made the column `companyWebsite` on table `Company` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "companyWebsite" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Company_companyWebsite_key" ON "Company"("companyWebsite");
