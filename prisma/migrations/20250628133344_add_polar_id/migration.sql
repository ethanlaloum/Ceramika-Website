/*
  Warnings:

  - A unique constraint covering the columns `[polarId]` on the table `products` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "products" ADD COLUMN     "polarId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "products_polarId_key" ON "products"("polarId");
