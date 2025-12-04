/*
  Warnings:

  - You are about to drop the column `leadIds` on the `Campaign` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Campaign" DROP COLUMN "leadIds";

-- CreateTable
CREATE TABLE "_CampaignToLead" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CampaignToLead_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CampaignToLead_B_index" ON "_CampaignToLead"("B");

-- AddForeignKey
ALTER TABLE "_CampaignToLead" ADD CONSTRAINT "_CampaignToLead_A_fkey" FOREIGN KEY ("A") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CampaignToLead" ADD CONSTRAINT "_CampaignToLead_B_fkey" FOREIGN KEY ("B") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
