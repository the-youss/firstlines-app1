-- CreateIndex
CREATE INDEX "QueueJob_userId_status_inputHash_idx" ON "QueueJob"("userId", "status", "inputHash");
