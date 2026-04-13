/*
  Warnings:

  - A unique constraint covering the columns `[iabakoNumber]` on the table `products` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "products" ADD COLUMN     "iabakoNumber" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "products_iabakoNumber_key" ON "products"("iabakoNumber");
