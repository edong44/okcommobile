/*
  Warnings:

  - You are about to drop the column `price` on the `Sale` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `Sale` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Sale` table. All the data in the column will be lost.
  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Sale" DROP CONSTRAINT "Sale_productId_fkey";

-- DropIndex
DROP INDEX "ProductType_name_key";

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "costPrice" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "salePrice" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Repair" ALTER COLUMN "actualPrice" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "estimatedPrice" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "receivedAt" DROP NOT NULL,
ALTER COLUMN "receivedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Sale" DROP COLUMN "price",
DROP COLUMN "productId",
DROP COLUMN "quantity",
ADD COLUMN     "customer" TEXT,
ADD COLUMN     "note" TEXT,
ADD COLUMN     "seller" TEXT;

-- DropTable
DROP TABLE "Admin";

-- CreateTable
CREATE TABLE "SaleItem" (
    "id" SERIAL NOT NULL,
    "saleId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "SaleItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SaleItem" ADD CONSTRAINT "SaleItem_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleItem" ADD CONSTRAINT "SaleItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
