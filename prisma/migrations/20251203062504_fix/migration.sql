-- CreateEnum
CREATE TYPE "QueueJobType" AS ENUM ('sales_nav_extraction');

-- CreateEnum
CREATE TYPE "QueueJobStatus" AS ENUM ('todo', 'processing', 'completed', 'cancelled');

-- CreateTable
CREATE TABLE "ExtensionPayload" (
    "id" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "payload" JSONB,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExtensionPayload_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QueueJob" (
    "id" TEXT NOT NULL,
    "status" "QueueJobStatus" NOT NULL DEFAULT 'todo',
    "type" "QueueJobType" NOT NULL,
    "input" JSONB NOT NULL,
    "lastMessage" TEXT,
    "logs" TEXT[],
    "isFailed" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QueueJob_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExtensionPayload_hash_key" ON "ExtensionPayload"("hash");

-- CreateIndex
CREATE INDEX "ExtensionPayload_userId_hash_idx" ON "ExtensionPayload"("userId", "hash");

-- CreateIndex
CREATE INDEX "QueueJob_userId_status_idx" ON "QueueJob"("userId", "status");

-- CreateIndex
CREATE INDEX "QueueJob_userId_idx" ON "QueueJob"("userId");

-- AddForeignKey
ALTER TABLE "ExtensionPayload" ADD CONSTRAINT "ExtensionPayload_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueueJob" ADD CONSTRAINT "QueueJob_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
