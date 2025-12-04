-- DropForeignKey
ALTER TABLE "Campaign" DROP CONSTRAINT "Campaign_listId_fkey";

-- AlterTable
ALTER TABLE "Campaign" ADD COLUMN     "leadIds" TEXT[];
