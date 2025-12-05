/*
  Warnings:

  - You are about to drop the column `source` on the `List` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "LeadSource" AS ENUM ('sales_nav', 'linkedin_search', 'manual_entry');

-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "source" "LeadSource" NOT NULL DEFAULT 'sales_nav';

-- AlterTable
ALTER TABLE "List" DROP COLUMN "source";

-- DropEnum
DROP TYPE "ListSource";
