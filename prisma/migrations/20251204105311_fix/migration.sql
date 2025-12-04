/*
  Warnings:

  - You are about to drop the column `source` on the `Lead` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ListSource" AS ENUM ('sales_nav', 'linkedin_search', 'manual_entry');

-- AlterTable
ALTER TABLE "Lead" DROP COLUMN "source";

-- AlterTable
ALTER TABLE "List" ADD COLUMN     "source" "ListSource" NOT NULL DEFAULT 'linkedin_search';

-- DropEnum
DROP TYPE "LeadSource";
