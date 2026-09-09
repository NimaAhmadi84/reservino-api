-- DropIndex
DROP INDEX "business_reviews_userId_businessId_key";

-- CreateIndex
CREATE INDEX "business_reviews_userId_businessId_idx" ON "business_reviews"("userId", "businessId");
