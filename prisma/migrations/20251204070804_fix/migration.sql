-- CreateEnum
CREATE TYPE "LeadSource" AS ENUM ('sales_nav', 'linkedin_search', 'manual_entry');

-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "source" "LeadSource" NOT NULL DEFAULT 'sales_nav';
