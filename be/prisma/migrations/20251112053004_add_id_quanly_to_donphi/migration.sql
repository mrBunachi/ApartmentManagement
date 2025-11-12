/*
  Warnings:

  - Added the required column `NGUOIQUANLYId` to the `DOTTHUPHI` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DOTTHUPHI" ADD COLUMN     "NGUOIQUANLYId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "DOTTHUPHI" ADD CONSTRAINT "DOTTHUPHI_NGUOIQUANLYId_fkey" FOREIGN KEY ("NGUOIQUANLYId") REFERENCES "NGUOIQUANLY"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
