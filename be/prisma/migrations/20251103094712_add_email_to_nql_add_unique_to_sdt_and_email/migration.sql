/*
  Warnings:

  - You are about to alter the column `SODIENTHOAI` on the `NGUOIQUANLY` table. The data in that column could be lost. The data in that column will be cast from `VarChar(15)` to `VarChar(10)`.
  - A unique constraint covering the columns `[SODIENTHOAI]` on the table `NGUOIQUANLY` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[EMAIL]` on the table `NGUOIQUANLY` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "NGUOIQUANLY" ADD COLUMN     "EMAIL" VARCHAR(50),
ALTER COLUMN "SODIENTHOAI" SET DATA TYPE VARCHAR(10);

-- CreateIndex
CREATE UNIQUE INDEX "NGUOIQUANLY_SODIENTHOAI_key" ON "NGUOIQUANLY"("SODIENTHOAI");

-- CreateIndex
CREATE UNIQUE INDEX "NGUOIQUANLY_EMAIL_key" ON "NGUOIQUANLY"("EMAIL");
