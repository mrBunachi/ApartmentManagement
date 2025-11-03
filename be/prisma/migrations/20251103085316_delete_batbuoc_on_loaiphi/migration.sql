/*
  Warnings:

  - You are about to drop the column `BATBUOC` on the `LOAIPHI` table. All the data in the column will be lost.
  - You are about to drop the column `SOTIENTRENNGUOITRENTHANG` on the `LOAIPHI` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "LOAIPHI" DROP COLUMN "BATBUOC",
DROP COLUMN "SOTIENTRENNGUOITRENTHANG";
