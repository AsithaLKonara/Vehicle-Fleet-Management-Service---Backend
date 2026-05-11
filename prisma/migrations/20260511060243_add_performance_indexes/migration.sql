-- CreateIndex
CREATE INDEX "Assignment_vehicleId_idx" ON "Assignment"("vehicleId");

-- CreateIndex
CREATE INDEX "Assignment_driverId_idx" ON "Assignment"("driverId");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");
