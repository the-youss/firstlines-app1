/*
  Warnings:

  - A unique constraint covering the columns `[date,userId]` on the table `LinkedinAPICall` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "LinkedinAPICall_date_userId_key" ON "LinkedinAPICall"("date", "userId");
