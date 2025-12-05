/*
  Warnings:

  - You are about to drop the `Education` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Education" DROP CONSTRAINT "Education_leadId_fkey";

-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "educations" JSONB[];

-- DropTable
DROP TABLE "Education";
