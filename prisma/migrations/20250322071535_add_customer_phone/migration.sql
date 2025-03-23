/*
  Warnings:

  - Added the required column `phone` to the `Repair` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Repair" ADD COLUMN     "phone" TEXT NOT NULL;
