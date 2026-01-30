/*
  Warnings:

  - You are about to alter the column `originalPrice` on the `Meal` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.

*/
-- AlterTable
ALTER TABLE "Meal" ALTER COLUMN "originalPrice" SET DEFAULT 0,
ALTER COLUMN "originalPrice" SET DATA TYPE DECIMAL(65,30);
