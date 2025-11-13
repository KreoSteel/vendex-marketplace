/*
  Warnings:

  - You are about to drop the column `avatar` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[listingId,order]` on the table `listing_images` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "listings_location_idx";

-- DropIndex
DROP INDEX "listings_price_idx";

-- AlterTable
ALTER TABLE "listings" ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "avatar",
DROP COLUMN "image",
ADD COLUMN     "avatarImg" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- DropEnum
DROP TYPE "ReviewRating";

-- CreateIndex
CREATE UNIQUE INDEX "listing_images_listingId_order_key" ON "listing_images"("listingId", "order");

-- CreateIndex
CREATE INDEX "listings_status_createdAt_idx" ON "listings"("status", "createdAt");

-- CreateIndex
CREATE INDEX "listings_categoryId_status_price_idx" ON "listings"("categoryId", "status", "price");

-- CreateIndex
CREATE INDEX "listings_status_location_idx" ON "listings"("status", "location");

-- CreateIndex
CREATE INDEX "listings_featured_status_createdAt_idx" ON "listings"("featured", "status", "createdAt");

-- CreateIndex
CREATE INDEX "messages_senderId_receiverId_createdAt_idx" ON "messages"("senderId", "receiverId", "createdAt");

-- CreateIndex
CREATE INDEX "messages_receiverId_senderId_createdAt_idx" ON "messages"("receiverId", "senderId", "createdAt");

-- CreateIndex
CREATE INDEX "users_isActive_idx" ON "users"("isActive");
