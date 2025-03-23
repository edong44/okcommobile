-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "costPrice" INTEGER,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "importDate" TIMESTAMP(3),
ADD COLUMN     "salePrice" INTEGER,
ADD COLUMN     "source" TEXT;
