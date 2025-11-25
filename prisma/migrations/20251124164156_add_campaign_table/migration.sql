-- CreateEnum
CREATE TYPE "StepType" AS ENUM ('connection', 'wait', 'message');

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'America/New_York',
    "excludeActive" BOOLEAN NOT NULL DEFAULT true,
    "dailyLimit" INTEGER NOT NULL DEFAULT 25,
    "listId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SequenceStep" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "type" "StepType" NOT NULL,
    "content" TEXT,
    "days" INTEGER,
    "campaignId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SequenceStep_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Campaign_listId_key" ON "Campaign"("listId");

-- CreateIndex
CREATE INDEX "Campaign_timezone_idx" ON "Campaign"("timezone");

-- CreateIndex
CREATE INDEX "Campaign_excludeActive_idx" ON "Campaign"("excludeActive");

-- CreateIndex
CREATE INDEX "Campaign_dailyLimit_idx" ON "Campaign"("dailyLimit");

-- CreateIndex
CREATE INDEX "Campaign_listId_timezone_idx" ON "Campaign"("listId", "timezone");

-- CreateIndex
CREATE INDEX "SequenceStep_order_idx" ON "SequenceStep"("order");

-- CreateIndex
CREATE INDEX "SequenceStep_campaignId_idx" ON "SequenceStep"("campaignId");

-- CreateIndex
CREATE INDEX "SequenceStep_campaignId_type_idx" ON "SequenceStep"("campaignId", "type");

-- CreateIndex
CREATE INDEX "SequenceStep_type_days_idx" ON "SequenceStep"("type", "days");

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SequenceStep" ADD CONSTRAINT "SequenceStep_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;
