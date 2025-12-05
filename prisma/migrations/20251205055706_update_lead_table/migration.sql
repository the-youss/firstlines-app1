/*
  Warnings:

  - Added the required column `connection` to the `Lead` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "birthDate" TEXT,
ADD COLUMN     "connection" INTEGER NOT NULL,
ADD COLUMN     "headline" TEXT,
ADD COLUMN     "openToWork" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Education" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "degree" TEXT,
    "schoolName" TEXT,
    "fieldsOfStudy" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Education_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Education" ADD CONSTRAINT "Education_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
