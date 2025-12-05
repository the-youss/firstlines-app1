/*
  Warnings:

  - You are about to drop the `LinkedinAPICall` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "LinkedinAPICall" DROP CONSTRAINT "LinkedinAPICall_userId_fkey";

-- DropTable
DROP TABLE "LinkedinAPICall";

-- CreateTable
CREATE TABLE "LinkedinAPILogs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "time" TIME NOT NULL,
    "url" TEXT NOT NULL,
    "response" JSONB,
    "error" JSONB,

    CONSTRAINT "LinkedinAPILogs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LinkedinAPILogs_userId_key" ON "LinkedinAPILogs"("userId");

-- AddForeignKey
ALTER TABLE "LinkedinAPILogs" ADD CONSTRAINT "LinkedinAPILogs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
