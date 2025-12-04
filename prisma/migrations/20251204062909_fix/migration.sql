/*
  Warnings:

  - You are about to drop the column `companyLinkedinUrl` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `companyName` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `companySize` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `companyWebsite` on the `Company` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[domain]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `domain` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Company_companyName_companyWebsite_idx";

-- DropIndex
DROP INDEX "Company_companyName_idx";

-- DropIndex
DROP INDEX "Company_companySize_idx";

-- DropIndex
DROP INDEX "Company_companyWebsite_idx";

-- DropIndex
DROP INDEX "Company_companyWebsite_key";

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "companyLinkedinUrl",
DROP COLUMN "companyName",
DROP COLUMN "companySize",
DROP COLUMN "companyWebsite",
ADD COLUMN     "domain" TEXT NOT NULL,
ADD COLUMN     "linkedinUrl" TEXT,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "size" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Company_domain_key" ON "Company"("domain");

-- CreateIndex
CREATE INDEX "Company_name_idx" ON "Company"("name");

-- CreateIndex
CREATE INDEX "Company_domain_idx" ON "Company"("domain");

-- CreateIndex
CREATE INDEX "Company_name_domain_idx" ON "Company"("name", "domain");

-- CreateIndex
CREATE INDEX "Company_size_idx" ON "Company"("size");
