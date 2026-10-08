-- AlterTable
ALTER TABLE "listings" ALTER COLUMN "price" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "image" TEXT;

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");
