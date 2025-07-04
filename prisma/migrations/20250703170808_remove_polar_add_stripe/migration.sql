/*
  Warnings:

  - You are about to drop the column `polarId` on the `products` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "products_polarId_key";

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "stripeSessionId" TEXT;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "polarId";
