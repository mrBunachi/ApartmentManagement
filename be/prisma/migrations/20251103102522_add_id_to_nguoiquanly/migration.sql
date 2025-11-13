/*
  Warnings:

  - The primary key for the `NGUOIQUANLY` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[TENDANGNHAP]` on the table `NGUOIQUANLY` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "NGUOIQUANLY" DROP CONSTRAINT "NGUOIQUANLY_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "NGUOIQUANLY_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "NGUOIQUANLY_TENDANGNHAP_key" ON "NGUOIQUANLY"("TENDANGNHAP");
